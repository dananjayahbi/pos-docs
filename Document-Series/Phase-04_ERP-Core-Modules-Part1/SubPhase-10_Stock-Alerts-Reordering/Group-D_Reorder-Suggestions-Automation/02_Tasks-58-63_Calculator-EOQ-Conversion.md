# Tasks 58-63: Calculator, EOQ & PO Conversion

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** D - Reorder Suggestions & Automation  
> **Document:** 02 of 03  
> **Tasks Covered:** 58, 59, 60, 61, 62, 63

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-57_Suggestion-Model-Velocity.md](01_Tasks-51-57_Suggestion-Model-Velocity.md)
- **→ Next Document:** [03_Tasks-64-68_Auto-Reorder-Forecasting.md](03_Tasks-64-68_Auto-Reorder-Forecasting.md)

---

## Document Overview

This document covers the ReorderCalculator service for optimal order quantities, Economic Order Quantity (EOQ) formula, safety stock calculation, stockout prediction, suggestion generation task, and purchase order conversion.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 58 | Create ReorderCalculator service | High |
| 59 | Implement EOQ calculation | High |
| 60 | Implement safety stock calculation | High |
| 61 | Create days_until_stockout calculation | Medium |
| 62 | Generate reorder suggestions task | High |
| 63 | Add suggestion to PO conversion | High |

---

## Task 58: Create ReorderCalculator Service

### Overview
Create a comprehensive service for calculating optimal reorder quantities, reorder points, and suggestion urgency.

### Dependencies
- Task 57: SalesVelocityService with seasonality
- Group A: Stock configuration models

### Instructions

1. **Create reorder_calculator.py file**
   - Location: apps/inventory/alerts/services/
   - Service class pattern
   - Static and instance methods

2. **Create ReorderCalculator class**
   - calculate_reorder_suggestion() main method
   - Combine velocity, EOQ, safety stock
   - Return complete suggestion data

3. **Add get_reorder_point method**
   - (Lead Time × Daily Velocity) + Safety Stock
   - Configurable per product
   - Warehouse-specific if applicable

4. **Add calculate_suggested_quantity method**
   - Use EOQ if available
   - Fall back to configured quantity
   - Respect supplier MOQ

5. **Add determine_urgency method**
   - Based on days_until_stockout
   - CRITICAL: <5 days or OOS
   - HIGH: 5-15 days
   - MEDIUM: 15-30 days
   - LOW: 30+ days

6. **Add calculate_estimated_cost method**
   - quantity × unit_cost
   - Include currency (LKR)
   - Get latest supplier price

### ReorderCalculator Service Structure
```python
# apps/inventory/alerts/services/reorder_calculator.py

from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
import logging
import math

from apps.inventory.alerts.services.sales_velocity import SalesVelocityService

logger = logging.getLogger(__name__)


class ReorderCalculator:
    """
    Calculate optimal reorder quantities and reorder points.
    
    Combines sales velocity, EOQ, safety stock, and lead time
    to generate reorder suggestions.
    """
    
    @staticmethod
    def calculate_reorder_suggestion(product, warehouse=None):
        """
        Calculate complete reorder suggestion for product.
        
        Args:
            product: Product instance
            warehouse: Optional warehouse
        
        Returns:
            dict with all suggestion data
        """
        # Get product config
        config = product.get_stock_config(warehouse=warehouse)
        
        if not config:
            logger.warning(f"No stock config for {product.name}, using defaults")
            return None
        
        # Check if monitoring is excluded
        if config.is_excluded_from_monitoring():
            logger.info(f"{product.name} excluded from monitoring")
            return None
        
        # Get current stock
        current_stock = product.get_available_quantity(warehouse=warehouse)
        
        # Calculate velocity with seasonality
        velocity_data = SalesVelocityService.calculate_velocity(
            product=product,
            days=30,
            warehouse=warehouse
        )
        velocity_data = SalesVelocityService.apply_seasonality(velocity_data, product)
        
        daily_velocity = velocity_data['daily_velocity']
        
        # Calculate safety stock
        safety_stock = ReorderCalculator.calculate_safety_stock(
            product=product,
            daily_velocity=daily_velocity,
            config=config
        )
        
        # Calculate reorder point
        reorder_point = ReorderCalculator.get_reorder_point(
            daily_velocity=daily_velocity,
            lead_time_days=config.get_lead_time_days(),
            safety_stock=safety_stock,
            config=config
        )
        
        # Check if reorder needed
        if current_stock > reorder_point:
            logger.info(
                f"{product.name}: Stock {current_stock} above reorder point {reorder_point}"
            )
            return None
        
        # Calculate suggested quantity
        suggested_qty = ReorderCalculator.calculate_suggested_quantity(
            product=product,
            daily_velocity=daily_velocity,
            safety_stock=safety_stock,
            config=config
        )
        
        # Calculate days until stockout
        days_until_stockout = ReorderCalculator.calculate_days_until_stockout(
            current_stock=current_stock,
            daily_velocity=daily_velocity
        )
        
        # Determine urgency
        urgency = ReorderCalculator.determine_urgency(
            days_until_stockout=days_until_stockout,
            current_stock=current_stock
        )
        
        # Calculate estimated cost
        estimated_cost, unit_cost = ReorderCalculator.calculate_estimated_cost(
            product=product,
            quantity=suggested_qty,
            config=config
        )
        
        # Build suggestion data
        suggestion_data = {
            'product': product,
            'warehouse': warehouse,
            'suggested_qty': suggested_qty,
            'current_stock': current_stock,
            'reorder_point': reorder_point,
            'safety_stock': safety_stock,
            'daily_velocity': daily_velocity,
            'days_until_stockout': days_until_stockout,
            'urgency': urgency,
            'estimated_cost': estimated_cost,
            'unit_cost': unit_cost,
            'suggested_supplier': config.preferred_supplier,
            'minimum_order_qty': config.minimum_order_quantity,
            'calculation_details': {
                'velocity_data': velocity_data,
                'lead_time_days': config.get_lead_time_days(),
                'eoq': None,  # Will be set in Task 59
            },
        }
        
        logger.info(
            f"Reorder suggestion: {product.name} - "
            f"{suggested_qty} units (urgency: {urgency})"
        )
        
        return suggestion_data
    
    @staticmethod
    def get_reorder_point(daily_velocity, lead_time_days, safety_stock, config):
        """
        Calculate reorder point.
        
        Formula: (Lead Time × Daily Velocity) + Safety Stock
        
        Or use configured reorder_point if set.
        """
        if config.reorder_point:
            # Use configured value
            return config.reorder_point
        
        # Calculate dynamically
        lead_time_demand = daily_velocity * Decimal(str(lead_time_days))
        reorder_point = lead_time_demand + safety_stock
        
        return reorder_point
    
    @staticmethod
    def calculate_suggested_quantity(product, daily_velocity, safety_stock, config):
        """
        Calculate suggested order quantity.
        
        Uses EOQ if available, otherwise uses configured quantity.
        """
        # Try EOQ calculation (Task 59)
        eoq = ReorderCalculator.calculate_eoq(product, daily_velocity, config)
        
        if eoq:
            suggested_qty = eoq
        elif config.reorder_quantity:
            # Use configured quantity
            suggested_qty = config.reorder_quantity
        else:
            # Default: 30 days supply
            suggested_qty = daily_velocity * Decimal('30')
        
        # Respect minimum order quantity
        if config.minimum_order_quantity:
            suggested_qty = max(suggested_qty, config.minimum_order_quantity)
        
        # Round to pack size if configured
        if config.pack_size and config.pack_size > 1:
            packs = math.ceil(float(suggested_qty) / float(config.pack_size))
            suggested_qty = Decimal(str(packs * float(config.pack_size)))
        
        return suggested_qty
    
    @staticmethod
    def determine_urgency(days_until_stockout, current_stock):
        """
        Determine urgency level based on stockout timeline.
        
        Returns:
            str: 'critical', 'high', 'medium', or 'low'
        """
        if current_stock <= 0 or days_until_stockout <= 0:
            return 'critical'
        elif days_until_stockout < 5:
            return 'critical'
        elif days_until_stockout < 15:
            return 'high'
        elif days_until_stockout < 30:
            return 'medium'
        else:
            return 'low'
    
    @staticmethod
    def calculate_estimated_cost(product, quantity, config):
        """
        Calculate estimated cost for order.
        
        Returns:
            tuple: (total_cost, unit_cost) in LKR
        """
        # Get unit cost from supplier or product
        if config.preferred_supplier:
            # Get supplier price
            unit_cost = product.get_supplier_price(config.preferred_supplier)
        else:
            # Use product cost
            unit_cost = product.cost_price or Decimal('0')
        
        if unit_cost == 0:
            logger.warning(f"No cost data for {product.name}")
        
        total_cost = unit_cost * quantity
        
        return total_cost, unit_cost
    
    @staticmethod
    def calculate_eoq(product, daily_velocity, config):
        """
        Placeholder for EOQ calculation (implemented in Task 59).
        """
        return None
    
    @staticmethod
    def calculate_days_until_stockout(current_stock, daily_velocity):
        """
        Placeholder for stockout calculation (implemented in Task 61).
        """
        if daily_velocity <= 0:
            return Decimal('999')  # Effectively infinite
        
        return current_stock / daily_velocity
    
    @staticmethod
    def calculate_safety_stock(product, daily_velocity, config):
        """
        Placeholder for safety stock (implemented in Task 60).
        """
        # Simple default: 7 days supply
        return daily_velocity * Decimal('7')
```

### Reorder Calculation Flow
```
Product + Warehouse
         │
         ▼
Get Stock Config
         │
         ▼
Calculate Sales Velocity (with seasonality)
         │
         ▼
Calculate Safety Stock
         │
         ▼
Calculate Reorder Point
         │
         ▼
Current Stock < Reorder Point?
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Calculate   No Suggestion
Suggested   Needed
Quantity
    │
    ▼
Calculate Days Until Stockout
    │
    ▼
Determine Urgency
    │
    ▼
Calculate Estimated Cost
    │
    ▼
Return Suggestion Data
```

### Expected Outcome
```
apps/inventory/alerts/services/
├── __init__.py
├── config_resolver.py
├── alert_notification.py
├── sales_velocity.py
└── reorder_calculator.py        # New service
```

### Verification Checklist
- [ ] reorder_calculator.py file created
- [ ] ReorderCalculator class defined
- [ ] calculate_reorder_suggestion() works
- [ ] get_reorder_point() calculates
- [ ] calculate_suggested_quantity() works
- [ ] determine_urgency() assigns levels
- [ ] calculate_estimated_cost() works
- [ ] Respects MOQ and pack size
- [ ] Logging implemented

---

## Task 59: Implement EOQ Calculation

### Overview
Implement Economic Order Quantity formula to calculate optimal order size that minimizes total inventory costs.

### Dependencies
- Task 58: ReorderCalculator service

### Instructions

1. **Add calculate_eoq method**
   - Implement EOQ formula
   - √((2 × D × S) / H)
   - Return optimal quantity

2. **Add get_ordering_cost method**
   - Cost per order (LKR)
   - Configurable per tenant
   - Default: LKR 5,000

3. **Add get_holding_cost method**
   - Cost to hold one unit for one year
   - % of unit cost (default: 25%)
   - Configurable

4. **Add calculate_annual_demand method**
   - Daily velocity × 365
   - Use seasonal-adjusted velocity
   - Return units per year

5. **Add validate_eoq_parameters method**
   - Check all inputs > 0
   - Return validation result
   - Log warnings

6. **Add EOQ configuration to GlobalStockSettings**
   - use_eoq_calculation: Boolean
   - ordering_cost_lkr: Decimal
   - holding_cost_percent: Decimal

### EOQ Implementation
```python
class ReorderCalculator:
    # ... existing methods
    
    @staticmethod
    def calculate_eoq(product, daily_velocity, config):
        """
        Calculate Economic Order Quantity (EOQ).
        
        Formula: EOQ = √((2 × D × S) / H)
        
        Where:
        D = Annual demand (units)
        S = Ordering cost per order (LKR)
        H = Holding cost per unit per year (LKR)
        
        Args:
            product: Product instance
            daily_velocity: Units sold per day
            config: ProductStockConfig or GlobalStockSettings
        
        Returns:
            Decimal: optimal order quantity, or None if EOQ not applicable
        """
        from apps.inventory.alerts.models import GlobalStockSettings
        
        settings = GlobalStockSettings.get_settings()
        
        if not settings.use_eoq_calculation:
            return None
        
        # Calculate annual demand
        annual_demand = ReorderCalculator.calculate_annual_demand(daily_velocity)
        
        if annual_demand == 0:
            return None
        
        # Get ordering cost
        ordering_cost = ReorderCalculator.get_ordering_cost(settings)
        
        # Get holding cost
        holding_cost = ReorderCalculator.get_holding_cost(product, settings)
        
        # Validate parameters
        is_valid, message = ReorderCalculator.validate_eoq_parameters(
            annual_demand, ordering_cost, holding_cost
        )
        
        if not is_valid:
            logger.warning(f"EOQ calculation invalid for {product.name}: {message}")
            return None
        
        # Calculate EOQ
        numerator = 2 * float(annual_demand) * float(ordering_cost)
        denominator = float(holding_cost)
        
        eoq = math.sqrt(numerator / denominator)
        
        eoq_decimal = Decimal(str(round(eoq, 3)))
        
        logger.info(
            f"EOQ for {product.name}: {eoq_decimal} units "
            f"(D={annual_demand}, S={ordering_cost}, H={holding_cost})"
        )
        
        return eoq_decimal
    
    @staticmethod
    def calculate_annual_demand(daily_velocity):
        """
        Calculate annual demand from daily velocity.
        
        Args:
            daily_velocity: Units per day
        
        Returns:
            Decimal: units per year
        """
        return daily_velocity * Decimal('365')
    
    @staticmethod
    def get_ordering_cost(settings):
        """
        Get cost per order (LKR).
        
        Includes:
        - Purchase order processing
        - Receiving and inspection
        - Administrative overhead
        
        Returns:
            Decimal: cost in LKR
        """
        return settings.ordering_cost_lkr or Decimal('5000.0')
    
    @staticmethod
    def get_holding_cost(product, settings):
        """
        Calculate holding cost per unit per year (LKR).
        
        Formula: Unit Cost × Holding Cost Percentage
        
        Holding costs include:
        - Storage space
        - Insurance
        - Obsolescence risk
        - Capital cost
        
        Returns:
            Decimal: cost in LKR
        """
        unit_cost = product.cost_price or Decimal('0')
        
        if unit_cost == 0:
            logger.warning(f"No cost price for {product.name}, cannot calculate holding cost")
            return Decimal('0')
        
        holding_percent = settings.holding_cost_percent or Decimal('25.0')
        
        # Convert percent to decimal (25% = 0.25)
        holding_cost = unit_cost * (holding_percent / Decimal('100'))
        
        return holding_cost
    
    @staticmethod
    def validate_eoq_parameters(annual_demand, ordering_cost, holding_cost):
        """
        Validate EOQ calculation parameters.
        
        Returns:
            tuple: (is_valid: bool, message: str)
        """
        if annual_demand <= 0:
            return False, "Annual demand must be > 0"
        
        if ordering_cost <= 0:
            return False, "Ordering cost must be > 0"
        
        if holding_cost <= 0:
            return False, "Holding cost must be > 0"
        
        return True, "Valid"

# Add to GlobalStockSettings model
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    # EOQ Configuration
    use_eoq_calculation = models.BooleanField(
        default=True,
        help_text="Use Economic Order Quantity formula"
    )
    
    ordering_cost_lkr = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('5000.00'),
        help_text="Cost per purchase order in LKR"
    )
    
    holding_cost_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('25.00'),
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('100'))],
        help_text="Annual holding cost as % of unit cost"
    )
```

### EOQ Example Calculation
```
Product: Widget A
Daily Velocity: 10 units/day
Annual Demand (D): 10 × 365 = 3,650 units
Unit Cost: LKR 1,000
Ordering Cost (S): LKR 5,000
Holding Cost (H): LKR 1,000 × 25% = LKR 250/unit/year

EOQ = √((2 × 3,650 × 5,000) / 250)
    = √(36,500,000 / 250)
    = √146,000
    = 382 units

Optimal order size: 382 units
```

### Expected Outcome
- EOQ calculated for products with sufficient data
- Optimal order sizes minimize costs
- Configurable parameters per tenant

### Verification Checklist
- [ ] calculate_eoq() implemented
- [ ] calculate_annual_demand() works
- [ ] get_ordering_cost() returns value
- [ ] get_holding_cost() calculates
- [ ] validate_eoq_parameters() validates
- [ ] EOQ config fields added
- [ ] Formula mathematically correct
- [ ] Edge cases handled

---

## Task 60: Implement Safety Stock Calculation

### Overview
Calculate safety stock to buffer against demand variability and supply delays.

### Dependencies
- Task 58: ReorderCalculator service
- Task 55: Velocity with confidence intervals

### Instructions

1. **Add calculate_safety_stock method**
   - Implement safety stock formula
   - Z × √(LT × σ_d² + D² × σ_LT²)
   - Or simplified version

2. **Add get_service_level_factor method**
   - Z-score for desired service level
   - 95% = 1.65, 99% = 2.33
   - Configurable per tenant

3. **Add calculate_demand_variability method**
   - Standard deviation of daily demand
   - From velocity confidence interval
   - Return σ_d

4. **Add get_lead_time_variability method**
   - Standard deviation of lead time
   - From supplier data
   - Return σ_LT

5. **Add simplified_safety_stock method**
   - When variance data unavailable
   - Safety Stock = Daily Velocity × Safety Days
   - Safety Days from config (default: 7)

### Safety Stock Implementation
```python
class ReorderCalculator:
    # ... existing methods
    
    @staticmethod
    def calculate_safety_stock(product, daily_velocity, config):
        """
        Calculate safety stock level.
        
        Full formula:
        Safety Stock = Z × √(LT × σ_d² + D² × σ_LT²)
        
        Where:
        Z = Service level factor (Z-score)
        LT = Average lead time (days)
        σ_d = Standard deviation of daily demand
        D = Average daily demand
        σ_LT = Standard deviation of lead time
        
        If variance data unavailable, uses simplified formula:
        Safety Stock = Daily Velocity × Safety Days
        
        Args:
            product: Product instance
            daily_velocity: Units per day
            config: ProductStockConfig
        
        Returns:
            Decimal: safety stock quantity
        """
        from apps.inventory.alerts.models import GlobalStockSettings
        
        settings = GlobalStockSettings.get_settings()
        
        # Get lead time
        lead_time_days = config.get_lead_time_days()
        
        # Get service level factor
        z_score = ReorderCalculator.get_service_level_factor(settings)
        
        # Try full calculation first
        velocity_detail = SalesVelocityService.calculate_daily_velocity(
            product=product,
            days=30
        )
        
        if velocity_detail and velocity_detail.get('confidence_interval'):
            # Have variance data, use full formula
            std_dev_demand = velocity_detail['confidence_interval']['std_dev']
            std_dev_lead_time = ReorderCalculator.get_lead_time_variability(
                product, config
            )
            
            safety_stock = ReorderCalculator.calculate_full_safety_stock(
                z_score=z_score,
                lead_time=lead_time_days,
                std_dev_demand=std_dev_demand,
                avg_daily_demand=float(daily_velocity),
                std_dev_lead_time=std_dev_lead_time
            )
        else:
            # Use simplified formula
            safety_stock = ReorderCalculator.simplified_safety_stock(
                daily_velocity=daily_velocity,
                safety_days=settings.safety_stock_days
            )
        
        logger.info(
            f"Safety stock for {product.name}: {safety_stock} units "
            f"(lead time: {lead_time_days} days)"
        )
        
        return safety_stock
    
    @staticmethod
    def calculate_full_safety_stock(z_score, lead_time, std_dev_demand, 
                                    avg_daily_demand, std_dev_lead_time):
        """
        Calculate safety stock using full formula.
        
        Formula: Z × √(LT × σ_d² + D² × σ_LT²)
        """
        # Demand variability component
        demand_variance = lead_time * (std_dev_demand ** 2)
        
        # Lead time variability component
        lead_time_variance = (avg_daily_demand ** 2) * (std_dev_lead_time ** 2)
        
        # Total variance
        total_variance = demand_variance + lead_time_variance
        
        # Safety stock
        safety_stock = z_score * math.sqrt(total_variance)
        
        return Decimal(str(round(safety_stock, 3)))
    
    @staticmethod
    def simplified_safety_stock(daily_velocity, safety_days=7):
        """
        Simplified safety stock calculation.
        
        Formula: Daily Velocity × Safety Days
        
        Args:
            daily_velocity: Units per day
            safety_days: Buffer period (default 7)
        
        Returns:
            Decimal: safety stock quantity
        """
        return daily_velocity * Decimal(str(safety_days))
    
    @staticmethod
    def get_service_level_factor(settings):
        """
        Get Z-score for desired service level.
        
        Common service levels:
        - 90%: Z = 1.28
        - 95%: Z = 1.65
        - 99%: Z = 2.33
        
        Returns:
            float: Z-score
        """
        service_level = settings.target_service_level or Decimal('95.0')
        
        z_scores = {
            Decimal('90.0'): 1.28,
            Decimal('95.0'): 1.65,
            Decimal('99.0'): 2.33,
        }
        
        return z_scores.get(service_level, 1.65)
    
    @staticmethod
    def get_lead_time_variability(product, config):
        """
        Get standard deviation of lead time.
        
        If tracked, calculate from historical data.
        Otherwise, estimate as 20% of average lead time.
        
        Returns:
            float: standard deviation in days
        """
        # Try to get from supplier performance data
        # (Would be implemented in Phase-05)
        
        # For now, estimate
        avg_lead_time = config.get_lead_time_days()
        estimated_std_dev = avg_lead_time * 0.2  # 20% variance
        
        return estimated_std_dev

# Add to GlobalStockSettings
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    # Safety Stock Configuration
    target_service_level = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('95.00'),
        validators=[MinValueValidator(Decimal('50')), MaxValueValidator(Decimal('99.99'))],
        help_text="Target in-stock probability (%)"
    )
    
    safety_stock_days = models.PositiveIntegerField(
        default=7,
        help_text="Safety stock buffer (days) for simplified calculation"
    )
```

### Safety Stock Example
```
Product: Widget A
Daily Velocity: 10 units/day
Std Dev Demand: 3 units/day
Lead Time: 14 days
Std Dev Lead Time: 2.8 days (20% of 14)
Service Level: 95% (Z = 1.65)

Safety Stock = 1.65 × √(14 × 3² + 10² × 2.8²)
             = 1.65 × √(14 × 9 + 100 × 7.84)
             = 1.65 × √(126 + 784)
             = 1.65 × √910
             = 1.65 × 30.17
             = 49.8 units

Round to 50 units safety stock
```

### Expected Outcome
- Safety stock calculated for each product
- Buffers against variability
- Configurable service levels

### Verification Checklist
- [ ] calculate_safety_stock() implemented
- [ ] calculate_full_safety_stock() works
- [ ] simplified_safety_stock() calculates
- [ ] get_service_level_factor() returns Z-score
- [ ] get_lead_time_variability() estimates
- [ ] Safety stock config fields added
- [ ] Formula mathematically correct
- [ ] Falls back gracefully when data missing

---

## Task 61: Create Days Until Stockout Calculation

### Overview
Calculate how many days until product will run out of stock based on current inventory and sales velocity.

### Dependencies
- Task 55: Daily velocity calculation

### Instructions

1. **Update calculate_days_until_stockout method**
   - Replace placeholder from Task 58
   - current_stock / daily_velocity
   - Handle edge cases

2. **Add adjust_for_incoming_stock method**
   - Consider pending POs
   - Add incoming quantity
   - Adjust ETA

3. **Add get_stockout_date method**
   - Calculate exact date
   - today + days_until_stockout
   - Return datetime

4. **Add handle_zero_velocity case**
   - If daily_velocity = 0
   - Return infinity or large number
   - Don't create suggestion

5. **Add handle_negative_stock case**
   - If current_stock < 0 (oversold)
   - Return 0 days (already OOS)
   - CRITICAL urgency

### Days Until Stockout Implementation
```python
class ReorderCalculator:
    # ... existing methods
    
    @staticmethod
    def calculate_days_until_stockout(current_stock, daily_velocity, 
                                      include_pending_pos=True, product=None, warehouse=None):
        """
        Calculate days until product will run out.
        
        Formula: (Current Stock + Pending Incoming) / Daily Velocity
        
        Args:
            current_stock: Available quantity now
            daily_velocity: Units sold per day
            include_pending_pos: Add incoming stock
            product: Product instance (for pending POs)
            warehouse: Warehouse (for pending POs)
        
        Returns:
            Decimal: days until stockout (0 = already OOS, 999 = effectively infinite)
        """
        # Handle already out of stock
        if current_stock <= 0:
            return Decimal('0')
        
        # Handle zero velocity (not selling)
        if daily_velocity <= 0:
            logger.info("Zero velocity, product not selling")
            return Decimal('999')  # Effectively infinite
        
        # Adjust for incoming stock if requested
        effective_stock = current_stock
        
        if include_pending_pos and product:
            incoming_qty = ReorderCalculator.get_incoming_stock(product, warehouse)
            effective_stock += incoming_qty
            
            if incoming_qty > 0:
                logger.info(
                    f"{product.name}: Including {incoming_qty} units from pending POs"
                )
        
        # Calculate days
        days = effective_stock / daily_velocity
        
        # Round to 2 decimal places
        days = days.quantize(Decimal('0.01'))
        
        return days
    
    @staticmethod
    def get_incoming_stock(product, warehouse=None):
        """
        Get quantity from pending purchase orders.
        
        Returns:
            Decimal: total incoming quantity
        """
        from apps.purchasing.models import PurchaseOrder, PurchaseOrderItem
        
        # Query pending PO items
        po_items = PurchaseOrderItem.objects.filter(
            product=product,
            purchase_order__status__in=['pending', 'approved', 'sent'],
        ).exclude(
            purchase_order__status__in=['received', 'cancelled']
        )
        
        if warehouse:
            po_items = po_items.filter(
                purchase_order__destination_warehouse=warehouse
            )
        
        # Sum quantities
        from django.db.models import Sum
        
        total_incoming = po_items.aggregate(
            total=Sum('quantity')
        )['total'] or Decimal('0')
        
        return total_incoming
    
    @staticmethod
    def get_stockout_date(current_stock, daily_velocity, product=None, warehouse=None):
        """
        Calculate exact date when product will run out.
        
        Returns:
            datetime: estimated stockout date
        """
        days_until = ReorderCalculator.calculate_days_until_stockout(
            current_stock=current_stock,
            daily_velocity=daily_velocity,
            include_pending_pos=True,
            product=product,
            warehouse=warehouse
        )
        
        if days_until >= Decimal('999'):
            # Effectively never
            return None
        
        stockout_date = timezone.now() + timedelta(days=float(days_until))
        
        return stockout_date
```

### Stockout Timeline Visualization
```
Today                                    Stockout Date
  │───────────────────────────────────────────│
  │<────── Days Until Stockout: 23 ──────────>│
  │                                            │
Current Stock: 230 units                  Stock: 0
Daily Velocity: 10 units/day

Calculation: 230 / 10 = 23 days
Stockout Date: 2025-02-13
```

### Expected Outcome
- Accurate stockout predictions
- Considers pending orders
- Handles edge cases gracefully

### Verification Checklist
- [ ] calculate_days_until_stockout() updated
- [ ] get_incoming_stock() queries POs
- [ ] get_stockout_date() calculates
- [ ] Zero velocity handled
- [ ] Negative stock handled
- [ ] Pending POs included
- [ ] Edge cases tested

---

## Task 62: Generate Reorder Suggestions Task

### Overview
Create Celery task to automatically generate reorder suggestions for all products.

### Dependencies
- Task 58-61: ReorderCalculator service complete
- Group C: Celery monitoring tasks

### Instructions

1. **Create reorder_suggestions.py task file**
   - Location: apps/inventory/alerts/tasks/
   - Celery shared_task decorator
   - Tenant-aware execution

2. **Add generate_reorder_suggestions task**
   - Iterate all products
   - Calculate suggestions
   - Create ReorderSuggestion records

3. **Add filter_products_needing_reorder method**
   - Skip excluded products
   - Check stock levels
   - Priority products first

4. **Add batch_process_products method**
   - Process in batches of 50
   - Prevent memory issues
   - Progress logging

5. **Add create_suggestion_record method**
   - Take suggestion_data dict
   - Create ReorderSuggestion model
   - Link relationships

6. **Add schedule in Celery Beat**
   - Run daily at 6 AM
   - Or custom frequency
   - Add to CELERY_BEAT_SCHEDULE

### Reorder Suggestions Task
```python
# apps/inventory/alerts/tasks/reorder_suggestions.py

from celery import shared_task
from django.utils import timezone
from decimal import Decimal
import logging

from apps.inventory.alerts.models import ReorderSuggestion, GlobalStockSettings
from apps.inventory.alerts.services.reorder_calculator import ReorderCalculator
from apps.inventory.models import Product

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def generate_reorder_suggestions(self):
    """
    Generate reorder suggestions for all products.
    
    Runs daily to identify products that need reordering.
    """
    logger.info("Starting reorder suggestions generation")
    
    start_time = timezone.now()
    
    # Get settings
    settings = GlobalStockSettings.get_settings()
    
    if not settings.reorder_suggestions_enabled:
        logger.info("Reorder suggestions disabled")
        return {
            'status': 'disabled',
            'message': 'Reorder suggestions disabled in settings'
        }
    
    # Get products to check
    products = filter_products_needing_reorder()
    
    logger.info(f"Checking {len(products)} products for reorder")
    
    # Process in batches
    suggestions_created = 0
    suggestions_updated = 0
    errors = 0
    
    batch_size = 50
    
    for i in range(0, len(products), batch_size):
        batch = products[i:i + batch_size]
        
        for product in batch:
            try:
                result = process_product_reorder(product)
                
                if result == 'created':
                    suggestions_created += 1
                elif result == 'updated':
                    suggestions_updated += 1
                
            except Exception as e:
                logger.error(f"Error processing {product.name}: {e}")
                errors += 1
        
        # Progress logging
        logger.info(
            f"Processed {min(i + batch_size, len(products))}/{len(products)} products"
        )
    
    # Calculate execution time
    execution_time = (timezone.now() - start_time).total_seconds()
    
    result = {
        'status': 'completed',
        'products_checked': len(products),
        'suggestions_created': suggestions_created,
        'suggestions_updated': suggestions_updated,
        'errors': errors,
        'execution_time': execution_time,
    }
    
    logger.info(
        f"Reorder suggestions generation complete: "
        f"{suggestions_created} created, {suggestions_updated} updated, "
        f"{errors} errors in {execution_time:.2f}s"
    )
    
    return result


def filter_products_needing_reorder():
    """
    Get products that should be checked for reorder.
    
    Returns:
        QuerySet: filtered products
    """
    products = Product.objects.filter(
        is_active=True,
        track_inventory=True,
    ).exclude(
        status='discontinued'
    ).select_related(
        'category'
    ).prefetch_related(
        'stock_levels'
    )
    
    # Filter out excluded products
    from apps.inventory.alerts.models import ProductStockConfig
    
    excluded_configs = ProductStockConfig.objects.filter(
        exclude_from_monitoring=True
    ).values_list('product_id', flat=True)
    
    products = products.exclude(id__in=excluded_configs)
    
    return list(products)


def process_product_reorder(product):
    """
    Process single product for reorder suggestion.
    
    Returns:
        str: 'created', 'updated', or 'none'
    """
    # Calculate suggestion
    suggestion_data = ReorderCalculator.calculate_reorder_suggestion(
        product=product,
        warehouse=None  # Company-wide for now
    )
    
    if not suggestion_data:
        # No reorder needed
        return 'none'
    
    # Check for existing pending suggestion
    existing = ReorderSuggestion.objects.filter(
        product=product,
        status='pending'
    ).first()
    
    if existing:
        # Update existing suggestion
        update_suggestion(existing, suggestion_data)
        return 'updated'
    else:
        # Create new suggestion
        create_suggestion_record(suggestion_data)
        return 'created'


def create_suggestion_record(suggestion_data):
    """
    Create ReorderSuggestion record from calculation data.
    
    Args:
        suggestion_data: dict from ReorderCalculator
    """
    suggestion = ReorderSuggestion.objects.create(
        product=suggestion_data['product'],
        warehouse=suggestion_data.get('warehouse'),
        suggested_qty=suggestion_data['suggested_qty'],
        current_stock=suggestion_data['current_stock'],
        suggested_supplier=suggestion_data.get('suggested_supplier'),
        urgency=suggestion_data['urgency'],
        days_until_stockout=suggestion_data.get('days_until_stockout'),
        daily_velocity=suggestion_data.get('daily_velocity'),
        safety_stock=suggestion_data.get('safety_stock'),
        eoq=suggestion_data['calculation_details'].get('eoq'),
        reorder_point=suggestion_data.get('reorder_point'),
        estimated_cost=suggestion_data.get('estimated_cost'),
        unit_cost=suggestion_data.get('unit_cost'),
        minimum_order_qty=suggestion_data.get('minimum_order_qty', Decimal('1')),
        calculation_details=suggestion_data['calculation_details'],
        auto_generated=True,
    )
    
    logger.info(
        f"Created reorder suggestion for {suggestion_data['product'].name}: "
        f"{suggestion_data['suggested_qty']} units (urgency: {suggestion_data['urgency']})"
    )
    
    return suggestion


def update_suggestion(existing, suggestion_data):
    """Update existing suggestion with new calculations."""
    existing.suggested_qty = suggestion_data['suggested_qty']
    existing.current_stock = suggestion_data['current_stock']
    existing.urgency = suggestion_data['urgency']
    existing.days_until_stockout = suggestion_data.get('days_until_stockout')
    existing.daily_velocity = suggestion_data.get('daily_velocity')
    existing.safety_stock = suggestion_data.get('safety_stock')
    existing.reorder_point = suggestion_data.get('reorder_point')
    existing.estimated_cost = suggestion_data.get('estimated_cost')
    existing.calculation_details = suggestion_data['calculation_details']
    existing.save()
    
    logger.info(f"Updated reorder suggestion for {existing.product.name}")

# Add to GlobalStockSettings
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    reorder_suggestions_enabled = models.BooleanField(
        default=True,
        help_text="Enable automated reorder suggestions"
    )
```

### Celery Beat Schedule
```python
# settings.py
CELERY_BEAT_SCHEDULE = {
    # ... existing tasks
    
    'generate-reorder-suggestions': {
        'task': 'apps.inventory.alerts.tasks.reorder_suggestions.generate_reorder_suggestions',
        'schedule': crontab(hour=6, minute=0),  # Daily at 6 AM
        'options': {
            'queue': 'monitoring',
            'priority': 5,
        }
    },
}
```

### Expected Outcome
```
Task execution:
- Products checked: 523
- Suggestions created: 47
- Suggestions updated: 12
- Errors: 0
- Execution time: 34.5s
```

### Verification Checklist
- [ ] reorder_suggestions.py task created
- [ ] generate_reorder_suggestions() task works
- [ ] filter_products_needing_reorder() filters
- [ ] Batch processing implemented
- [ ] create_suggestion_record() saves
- [ ] update_suggestion() updates existing
- [ ] Celery Beat schedule added
- [ ] Logging comprehensive
- [ ] Error handling robust

---

## Task 63: Add Suggestion to PO Conversion

### Overview
Allow manual or automated conversion of reorder suggestions into purchase orders.

### Dependencies
- Task 51-53: ReorderSuggestion model
- Phase-05: PurchaseOrder model

### Instructions

1. **Add convert_to_purchase_order method**
   - Create PO from suggestion
   - Copy all relevant data
   - Mark suggestion as converted

2. **Add validate_conversion method**
   - Check supplier present
   - Validate quantity > 0
   - Confirm product active

3. **Add create_po_from_suggestion method**
   - Build PO object
   - Add PO items
   - Set status to draft

4. **Add bulk_convert_suggestions method**
   - Select multiple suggestions
   - Group by supplier
   - Create one PO per supplier

5. **Add conversion admin action**
   - Select suggestions in admin
   - Click "Convert to PO"
   - Redirect to PO form

6. **Add API endpoint for conversion**
   - POST /api/reorder-suggestions/{id}/convert/
   - Return created PO
   - Update suggestion status

### Conversion Implementation
```python
# In ReorderSuggestion model
class ReorderSuggestion(TenantAwareModel):
    # ... existing fields and methods
    
    def convert_to_purchase_order(self, user=None):
        """
        Convert suggestion to purchase order.
        
        Args:
            user: User creating the PO
        
        Returns:
            PurchaseOrder: created PO instance
        """
        from apps.purchasing.models import PurchaseOrder, PurchaseOrderItem
        
        # Validate conversion
        can_convert, message = self.can_convert()
        
        if not can_convert:
            logger.error(f"Cannot convert suggestion {self.id}: {message}")
            raise ValueError(message)
        
        # Create PO
        po = PurchaseOrder.objects.create(
            supplier=self.suggested_supplier,
            destination_warehouse=self.warehouse,
            status='draft',
            notes=f"Auto-generated from reorder suggestion {self.id}",
            created_by=user,
        )
        
        # Create PO item
        PurchaseOrderItem.objects.create(
            purchase_order=po,
            product=self.product,
            variant=self.variant,
            quantity=self.suggested_qty,
            unit_price=self.unit_cost or self.product.cost_price,
            notes=f"Suggested reorder (urgency: {self.urgency})",
        )
        
        # Mark suggestion as converted
        self.mark_converted(po, user)
        
        logger.info(
            f"Converted reorder suggestion {self.id} to PO {po.po_number}"
        )
        
        return po

# Service function for bulk conversion
def bulk_convert_suggestions(suggestion_ids, user=None):
    """
    Convert multiple suggestions to purchase orders.
    
    Groups suggestions by supplier to minimize number of POs.
    
    Args:
        suggestion_ids: list of suggestion IDs
        user: User creating POs
    
    Returns:
        dict: summary of conversions
    """
    from apps.inventory.alerts.models import ReorderSuggestion
    from apps.purchasing.models import PurchaseOrder, PurchaseOrderItem
    from collections import defaultdict
    
    suggestions = ReorderSuggestion.objects.filter(
        id__in=suggestion_ids,
        status='pending'
    ).select_related('product', 'suggested_supplier')
    
    if not suggestions:
        return {
            'success': False,
            'message': 'No valid suggestions found'
        }
    
    # Group by supplier
    by_supplier = defaultdict(list)
    
    for suggestion in suggestions:
        supplier_id = suggestion.suggested_supplier.id if suggestion.suggested_supplier else None
        by_supplier[supplier_id].append(suggestion)
    
    # Create POs
    created_pos = []
    converted_count = 0
    
    for supplier_id, sugg_list in by_supplier.items():
        if supplier_id is None:
            logger.warning("Skipping suggestions without supplier")
            continue
        
        supplier = sugg_list[0].suggested_supplier
        
        # Create PO
        po = PurchaseOrder.objects.create(
            supplier=supplier,
            status='draft',
            notes=f"Bulk conversion of {len(sugg_list)} reorder suggestions",
            created_by=user,
        )
        
        # Add items
        for suggestion in sugg_list:
            PurchaseOrderItem.objects.create(
                purchase_order=po,
                product=suggestion.product,
                variant=suggestion.variant,
                quantity=suggestion.suggested_qty,
                unit_price=suggestion.unit_cost or suggestion.product.cost_price,
                notes=f"From suggestion {suggestion.id} (urgency: {suggestion.urgency})",
            )
            
            # Mark converted
            suggestion.mark_converted(po, user)
            converted_count += 1
        
        created_pos.append(po)
    
    return {
        'success': True,
        'pos_created': len(created_pos),
        'suggestions_converted': converted_count,
        'purchase_orders': created_pos,
    }

# Admin action
def convert_suggestions_to_pos(modeladmin, request, queryset):
    """Admin action to convert selected suggestions to POs."""
    result = bulk_convert_suggestions(
        suggestion_ids=list(queryset.values_list('id', flat=True)),
        user=request.user
    )
    
    if result['success']:
        modeladmin.message_user(
            request,
            f"Created {result['pos_created']} purchase orders from "
            f"{result['suggestions_converted']} suggestions"
        )
    else:
        modeladmin.message_user(
            request,
            f"Error: {result.get('message', 'Unknown error')}",
            level='error'
        )

convert_suggestions_to_pos.short_description = "Convert to Purchase Orders"

# In ReorderSuggestionAdmin
class ReorderSuggestionAdmin(admin.ModelAdmin):
    # ... existing config
    
    actions = [convert_suggestions_to_pos]
```

### Conversion Flow
```
Reorder Suggestion(s)
         │
         ▼
Select for Conversion
         │
         ▼
Validate
    ├─→ No Supplier → Error
    ├─→ Invalid Qty → Error
    └─→ Valid → Continue
         │
         ▼
Group by Supplier
         │
         ▼
Create PO (draft status)
         │
         ▼
Add PO Items
         │
         ▼
Mark Suggestions as Converted
         │
         ▼
Return PO for Review/Approval
```

### Expected Outcome
- Suggestions easily converted to POs
- Bulk conversion groups by supplier
- Streamlined procurement workflow

### Verification Checklist
- [ ] convert_to_purchase_order() method works
- [ ] validate_conversion() checks requirements
- [ ] create_po_from_suggestion() creates PO
- [ ] bulk_convert_suggestions() groups by supplier
- [ ] Admin action added
- [ ] API endpoint created (in Group E)
- [ ] Conversion tracked
- [ ] PO created in draft status
