# Tasks 47-50: Points Redemption, Expiry and Balance Calculator

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** C - Loyalty Points System  
> **Document:** 03 of 03  
> **Tasks Covered:** 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-46_Points-Transaction-Earning.md](02_Tasks-41-46_Points-Transaction-Earning.md)
- **→ Next Group:** [../Group-D_Loyalty-Tiers-Rewards/](../Group-D_Loyalty-Tiers-Rewards/)

---

## Document Overview

This document completes the loyalty points system by implementing points redemption, automatic expiry processing, and balance calculation with expiry forecasting. These features provide full lifecycle management for loyalty points.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 47 | Implement Points Redemption | Medium | 25 min |
| 48 | Implement Points Expiry | Medium | 25 min |
| 49 | Create Points Expiry Task | Medium | 25 min |
| 50 | Implement Points Balance Calculator | Medium | 25 min |

---

## Task 47: Implement Points Redemption

### Overview
Implement the redeem_points method in LoyaltyService to handle points redemption for discounts at checkout. This method validates redemption eligibility, creates redemption transactions, updates balances, and calculates discount amounts.

### Dependencies
- Task 46: Implement Points Earning
- LoyaltyService class exists

### Instructions

1. **Open loyalty service file**
   - Navigate to `apps/credit/services/loyalty_service.py`
   - Locate LoyaltyService class

2. **Create redeem_points method**
   - Static method or class method
   - Parameters: loyalty, points_to_redeem, reference_id, reference_type, description
   - Validates redemption
   - Creates transaction
   - Updates balance
   - Returns (transaction, discount_amount) tuple

3. **Add redemption validation**
   - Validate loyalty account active
   - Validate program active
   - Check minimum redemption requirement
   - Validate sufficient points available
   - Check maximum redemption rules

4. **Calculate discount amount**
   - Get redemption_value_per_point from program
   - Multiply points by redemption value
   - Calculate discount in rupees
   - Validate against purchase amount limits

5. **Create redemption transaction**
   - Use database transaction (atomic)
   - Set type='redeem'
   - Set points (negative value)
   - Set description
   - Set reference information

6. **Update CustomerLoyalty balance**
   - Subtract points from points_balance
   - Add points to total_points_redeemed
   - Update last_activity_date
   - Save loyalty account

7. **Set balance_after in transaction**
   - Set transaction.balance_after = loyalty.points_balance
   - Save transaction

8. **Return transaction and discount**
   - Return tuple: (transaction, discount_amount)
   - Allows caller to apply discount
   - Transaction for audit trail

### redeem_points Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def redeem_points(
    loyalty_account,
    points_to_redeem,
    reference_id=None,
    reference_type=None,
    description=None
):
    """
    Redeem loyalty points for discount.
    
    Args:
        loyalty_account: CustomerLoyalty instance
        points_to_redeem: Integer points to redeem
        reference_id: UUID of order
        reference_type: String type (Order)
        description: Transaction description
    
    Returns:
        tuple: (PointsTransaction, Decimal discount_amount)
    
    Raises:
        ValueError: If validation fails
    """
    # Validation
    LoyaltyService.validate_account_active(loyalty_account)
    LoyaltyService.validate_program_active(loyalty_account.program)
    
    program = loyalty_account.program
    
    # Check minimum redemption
    if points_to_redeem < program.min_points_for_redemption:
        raise ValueError(
            f"Minimum {program.min_points_for_redemption} points required"
        )
    
    # Check sufficient balance
    LoyaltyService.validate_sufficient_points(
        loyalty_account,
        points_to_redeem
    )
    
    # Calculate discount amount
    discount_amount = Decimal(str(points_to_redeem)) * \
                      program.redemption_value_per_point
    
    # Create transaction
    with transaction.atomic():
        # Create redemption transaction
        redemption_txn = PointsTransaction.objects.create(
            customer_loyalty=loyalty_account,
            type='redeem',
            points=-points_to_redeem,  # Negative
            balance_after=0,  # Set after update
            description=description or f"Redeemed {points_to_redeem} points",
            reference_id=reference_id,
            reference_type=reference_type
        )
        
        # Update loyalty account
        loyalty_account.points_balance -= points_to_redeem
        loyalty_account.total_points_redeemed += points_to_redeem
        loyalty_account.last_activity_date = timezone.now()
        loyalty_account.save()
        
        # Update balance_after
        redemption_txn.balance_after = loyalty_account.points_balance
        redemption_txn.save()
    
    return (redemption_txn, discount_amount)
```

### Redemption Flow Diagram

```
Redemption Process:
─────────────────────────────────────────────────────

┌─────────────┐
│  Customer   │
│  Requests   │
│ Redemption  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validate   │────── Check account active
│  Eligibility│────── Check program active
└──────┬──────┘────── Check minimum points
       │
       ▼
┌─────────────┐
│   Validate  │────── Check available balance
│   Balance   │────── Check expiring points
└──────┬──────┘────── Ensure sufficient
       │
       ▼
┌─────────────┐
│  Calculate  │────── points × value_per_point
│   Discount  │────── Validate max discount
└──────┬──────┘────── Return discount amount
       │
       ▼
┌─────────────┐
│   Create    │────── type = REDEEM
│ Transaction │────── points = -amount (negative)
└──────┬──────┘────── description
       │
       ▼
┌─────────────┐
│   Update    │────── points_balance -= points
│   Balance   │────── total_redeemed += points
└──────┬──────┘────── last_activity = now
       │
       ▼
┌─────────────┐
│   Return    │
│ Transaction │
│ & Discount  │
└─────────────┘
```

### Redemption Scenarios

#### Scenario 1: Standard Redemption
```
Customer Balance: 1,500 points
Purchase Amount: Rs. 5,000
Redemption Request: 500 points
Min Redemption: 100 points
Value Per Point: Rs. 1.00

Validation:
├── Account active: ✓
├── Program active: ✓
├── Min redemption: 500 >= 100 ✓
└── Sufficient balance: 1500 >= 500 ✓

Calculation:
├── Discount: 500 × Rs. 1.00 = Rs. 500
└── Final Amount: Rs. 5,000 - Rs. 500 = Rs. 4,500

Transaction:
├── type: redeem
├── points: -500
├── balance_after: 1,000
└── description: "Redeemed 500 points for Rs. 500 discount"

Result:
├── Balance Updated: 1,500 → 1,000 points
├── Lifetime Redeemed: +500 points
└── Discount Applied: Rs. 500
```

#### Scenario 2: Below Minimum Redemption
```
Customer Balance: 500 points
Redemption Request: 75 points
Min Redemption: 100 points

Validation:
├── Min redemption: 75 < 100 ✗
└── Error: "Minimum 100 points required"

Result:
├── No transaction created
├── Balance unchanged
└── Error message displayed
```

#### Scenario 3: Insufficient Balance
```
Customer Balance: 150 points
Redemption Request: 200 points

Validation:
├── Sufficient balance: 150 < 200 ✗
└── Error: "Insufficient points. Available: 150"

Result:
├── No transaction created
├── Balance unchanged
└── Suggest max redemption: 150 points
```

#### Scenario 4: Maximum Discount Limit (50% Rule)
```
Customer Balance: 3,000 points
Purchase Amount: Rs. 2,000
Redemption Request: 1,500 points
Max Discount: 50% of purchase
Value Per Point: Rs. 1.00

Calculation:
├── Requested Discount: 1,500 × Rs. 1.00 = Rs. 1,500
├── Max Allowed: Rs. 2,000 × 50% = Rs. 1,000
├── Adjusted Redemption: Rs. 1,000 / Rs. 1.00 = 1,000 points
└── Final Discount: Rs. 1,000

Result:
├── Redeemed: 1,000 points (not 1,500)
├── Balance: 3,000 → 2,000 points
└── Note: "Maximum 50% discount applied"
```

### Redemption Value Configuration

```
Program Configuration Examples:
─────────────────────────────────────────────────────

Configuration 1: Standard (1:1)
├── redemption_value_per_point: Rs. 1.00
├── 100 points = Rs. 100 discount
└── 500 points = Rs. 500 discount

Configuration 2: Premium (0.5:1)
├── redemption_value_per_point: Rs. 0.50
├── 100 points = Rs. 50 discount
└── 500 points = Rs. 250 discount

Configuration 3: Generous (2:1)
├── redemption_value_per_point: Rs. 2.00
├── 100 points = Rs. 200 discount
└── 500 points = Rs. 1,000 discount
```

### Integration with Checkout

```python
Example Usage in Checkout:
─────────────────────────────────────────────────────

def apply_loyalty_discount(order, points_to_redeem):
    """Apply loyalty points discount to order."""
    # Get loyalty account
    try:
        loyalty = order.customer.loyalty_account
    except CustomerLoyalty.DoesNotExist:
        return None
    
    # Calculate max redeemable (50% rule)
    max_discount = order.total_amount * Decimal('0.50')
    max_points = int(max_discount / loyalty.program.redemption_value_per_point)
    
    # Limit redemption
    actual_points = min(points_to_redeem, max_points)
    
    # Redeem points
    try:
        transaction, discount = LoyaltyService.redeem_points(
            loyalty_account=loyalty,
            points_to_redeem=actual_points,
            reference_id=order.id,
            reference_type='Order',
            description=f"Order {order.order_number} redemption"
        )
    except ValueError as e:
        # Handle validation errors
        return {'error': str(e)}
    
    # Apply discount to order
    order.loyalty_discount = discount
    order.loyalty_transaction = transaction
    order.final_amount = order.total_amount - discount
    order.save()
    
    return {
        'success': True,
        'points_redeemed': actual_points,
        'discount_amount': discount,
        'remaining_points': loyalty.points_balance
    }
```

### Expected Outcome
- Complete redemption implementation
- Validation and balance checks
- Discount calculation
- Transaction creation

### Verification Checklist
- [ ] redeem_points method implemented
- [ ] Validation checks included
- [ ] Minimum redemption enforced
- [ ] Sufficient balance validated
- [ ] Discount calculation correct
- [ ] PointsTransaction created (negative points)
- [ ] CustomerLoyalty balance updated
- [ ] Database transaction atomic
- [ ] Returns transaction and discount
- [ ] Error handling comprehensive

---

## Task 48: Implement Points Expiry

### Overview
Implement the expire_points method in LoyaltyService to handle automatic points expiry. This method identifies expired earned points, creates expiry transactions, and updates customer balances using FIFO (First In, First Out) logic.

### Dependencies
- Task 47: Implement Points Redemption

### Instructions

1. **Open loyalty service file**
   - Navigate to `apps/credit/services/loyalty_service.py`
   - Locate LoyaltyService class

2. **Create expire_points method**
   - Static method or class method
   - Parameters: loyalty_account, expiry_date (optional)
   - Finds expired EARN transactions
   - Creates EXPIRE transactions
   - Updates balance
   - Returns list of expired transactions

3. **Find expired EARN transactions**
   - Query PointsTransaction
   - Filter by type='earn'
   - Filter by expiry_date <= today
   - Filter by is_expired=False
   - Order by expiry_date (FIFO)

4. **Process each expired transaction**
   - Loop through expired EARN records
   - Create corresponding EXPIRE transaction
   - Link to original EARN transaction
   - Mark original as is_expired=True

5. **Create EXPIRE transaction**
   - Set type='expire'
   - Set points (negative, same as EARN)
   - Set reference_id (original transaction ID)
   - Set reference_type='PointsTransaction'
   - Set description

6. **Update CustomerLoyalty balance**
   - Subtract expired points from points_balance
   - Ensure balance doesn't go negative
   - Update last_activity_date
   - Save loyalty account

7. **Return expiry summary**
   - Return list of EXPIRE transactions
   - Include total points expired
   - Include affected EARN transactions

### expire_points Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def expire_points(loyalty_account, cutoff_date=None):
    """
    Expire points that have passed their expiry date.
    
    Args:
        loyalty_account: CustomerLoyalty instance
        cutoff_date: Date to check expiry (default: today)
    
    Returns:
        list: List of EXPIRE transactions created
    """
    if cutoff_date is None:
        cutoff_date = date.today()
    
    # Find expired EARN transactions
    expired_earns = PointsTransaction.objects.filter(
        customer_loyalty=loyalty_account,
        type='earn',
        expiry_date__lte=cutoff_date,
        is_expired=False
    ).order_by('expiry_date')
    
    if not expired_earns.exists():
        return []
    
    expire_transactions = []
    total_expired = 0
    
    # Process each expired transaction
    with transaction.atomic():
        for earn_txn in expired_earns:
            # Create EXPIRE transaction
            expire_txn = PointsTransaction.objects.create(
                customer_loyalty=loyalty_account,
                type='expire',
                points=-earn_txn.points,  # Negative
                balance_after=0,  # Set after update
                description=f"Expired {earn_txn.points} points from {earn_txn.created.date()}",
                reference_id=earn_txn.id,
                reference_type='PointsTransaction'
            )
            
            # Mark original as expired
            earn_txn.is_expired = True
            earn_txn.save()
            
            # Track expiry
            total_expired += earn_txn.points
            expire_transactions.append(expire_txn)
        
        # Update loyalty account balance
        loyalty_account.points_balance -= total_expired
        
        # Ensure balance doesn't go negative
        if loyalty_account.points_balance < 0:
            loyalty_account.points_balance = 0
        
        loyalty_account.last_activity_date = timezone.now()
        loyalty_account.save()
        
        # Update balance_after for all expire transactions
        for expire_txn in expire_transactions:
            expire_txn.balance_after = loyalty_account.points_balance
            expire_txn.save()
    
    return expire_transactions
```

### Points Expiry Flow Diagram

```
Expiry Process (FIFO):
─────────────────────────────────────────────────────

┌─────────────┐
│  Daily      │
│  Celery     │
│  Task       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Find     │────── Query EARN transactions
│   Expired   │────── expiry_date <= today
│  Transactions│────── is_expired = False
└──────┬──────┘────── Order by expiry_date (FIFO)
       │
       ▼
┌─────────────┐
│  For Each   │
│   Expired   │
│    EARN     │
└──────┬──────┘
       │
       ├────────────┐
       │            │
       ▼            ▼
┌─────────────┐ ┌─────────────┐
│   Create    │ │    Mark     │
│   EXPIRE    │ │   Original  │
│ Transaction │ │ is_expired  │
└──────┬──────┘ └──────┬──────┘
       │               │
       └───────┬───────┘
               ▼
       ┌─────────────┐
       │   Update    │────── balance -= expired_points
       │   Balance   │────── Ensure balance >= 0
       └──────┬──────┘────── last_activity = now
              │
              ▼
       ┌─────────────┐
       │   Return    │
       │   Expiry    │
       │   Summary   │
       └─────────────┘
```

### Expiry Scenarios

#### Scenario 1: Single Transaction Expiry
```
Loyalty Account Balance: 1,000 points

Expired Transaction:
├── Earn Date: 2025-01-24
├── Points: 150
├── Expiry Date: 2026-01-24
├── Today: 2026-01-25 (1 day overdue)
└── Status: Not expired yet

Process:
1. Find expired EARN: Transaction #ABC123 (150 points)
2. Create EXPIRE transaction: -150 points
3. Mark EARN is_expired = True
4. Update balance: 1,000 - 150 = 850 points

Result:
├── EXPIRE transaction created
├── Balance updated: 1,000 → 850
├── Original marked expired
└── Customer notified
```

#### Scenario 2: Multiple Transactions Expiry (FIFO)
```
Loyalty Account Balance: 2,000 points

Expired Transactions:
├── EARN #1: 100 points (expires 2026-01-20)
├── EARN #2: 200 points (expires 2026-01-22)
└── EARN #3: 150 points (expires 2026-01-24)

Today: 2026-01-25

Process (FIFO order):
1. Expire EARN #1: -100 points (balance: 1,900)
2. Expire EARN #2: -200 points (balance: 1,700)
3. Expire EARN #3: -150 points (balance: 1,550)

Result:
├── 3 EXPIRE transactions created
├── Total expired: 450 points
├── Balance: 2,000 → 1,550
└── All originals marked is_expired = True
```

#### Scenario 3: Expiry with Insufficient Balance
```
Loyalty Account Balance: 100 points

Expired Transactions:
├── EARN #1: 500 points (should expire)
└── EARN #2: 300 points (should expire)

Total to Expire: 800 points
Current Balance: 100 points

Process:
1. Expire EARN #1: -500 points (would be negative)
2. Adjust balance to 0 (prevent negative)
3. Expire EARN #2: already at 0
4. Mark both as expired

Result:
├── Balance: 100 → 0 points (not negative)
├── Discrepancy logged
├── Admin notified of balance issue
└── Both transactions marked expired
```

#### Scenario 4: No Expired Points
```
Loyalty Account Balance: 1,500 points

All EARN Transactions:
├── EARN #1: 500 points (expires 2026-06-15)
├── EARN #2: 600 points (expires 2026-07-20)
└── EARN #3: 400 points (expires 2026-08-10)

Today: 2026-01-25

Process:
1. Query expired transactions
2. No results (all expiry dates in future)
3. Return empty list

Result:
├── No EXPIRE transactions created
├── Balance unchanged: 1,500 points
└── No action needed
```

### FIFO (First In, First Out) Logic

```
FIFO Expiry Order:
─────────────────────────────────────────────────────

Earned Points Queue:
┌─────────────────────────────────────────────────┐
│ #1: Jan 15 → 100 pts (expires Jan 15, 2027)    │ ← Oldest (expires first)
│ #2: Jan 20 → 150 pts (expires Jan 20, 2027)    │
│ #3: Jan 25 → 200 pts (expires Jan 25, 2027)    │
│ #4: Feb 01 → 250 pts (expires Feb 01, 2027)    │ ← Newest (expires last)
└─────────────────────────────────────────────────┘

On Jan 16, 2027:
├── #1 expires (100 pts)
├── #2, #3, #4 still valid
└── Balance reduced by 100 pts

On Jan 21, 2027:
├── #2 expires (150 pts)
├── #3, #4 still valid
└── Balance reduced by 150 pts

Ensures fairness: Oldest points expire first
```

### Expected Outcome
- Automatic points expiry
- FIFO expiry logic
- Expired transactions marked
- Balance reconciliation

### Verification Checklist
- [ ] expire_points method implemented
- [ ] Finds expired EARN transactions
- [ ] FIFO ordering applied
- [ ] EXPIRE transactions created
- [ ] Original transactions marked is_expired
- [ ] Balance updated correctly
- [ ] Prevents negative balance
- [ ] Database transaction atomic
- [ ] Returns expiry summary
- [ ] Error handling included

---

## Task 49: Create Points Expiry Task

### Overview
Create a Celery periodic task to automatically run points expiry checks daily. This task ensures that expired points are processed automatically without manual intervention, maintaining loyalty account accuracy.

### Dependencies
- Task 48: Implement Points Expiry
- Celery configured in project

### Instructions

1. **Create expiry tasks module**
   - Navigate to `apps/credit/tasks/` directory
   - Create directory if it doesn't exist
   - Create file `expiry_tasks.py`

2. **Create tasks directory structure**
   - Create `__init__.py` in tasks directory
   - Import expiry task in __init__
   - Register with Celery

3. **Import required dependencies**
   - Import Celery shared_task decorator
   - Import CustomerLoyalty model
   - Import LoyaltyService
   - Import logging

4. **Create expire_loyalty_points task**
   - Use @shared_task decorator
   - name='credit.expire_loyalty_points'
   - No parameters (runs for all accounts)
   - Returns summary of expired points

5. **Query all active loyalty accounts**
   - Filter CustomerLoyalty by status='active'
   - Filter by accounts with points_balance > 0
   - Optimize with select_related('program')

6. **Process each loyalty account**
   - Loop through active accounts
   - Call LoyaltyService.expire_points
   - Catch and log exceptions per account
   - Continue processing on errors

7. **Track expiry statistics**
   - Count accounts processed
   - Count accounts with expiries
   - Sum total points expired
   - Log summary

8. **Send notifications (optional)**
   - Email customers with expired points
   - Alert admin of bulk expiries
   - Log notification status

9. **Configure periodic schedule**
   - Add to Celery beat schedule
   - Run daily at 2:00 AM
   - Use crontab schedule

10. **Add error handling and logging**
    - Log task start and completion
    - Log errors per account
    - Return detailed summary
    - Alert on task failure

### Celery Task Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

# apps/credit/tasks/expiry_tasks.py

from celery import shared_task
from django.utils import timezone
from apps.credit.models import CustomerLoyalty
from apps.credit.services import LoyaltyService
import logging

logger = logging.getLogger(__name__)

@shared_task(name='credit.expire_loyalty_points')
def expire_loyalty_points():
    """
    Celery task to expire loyalty points daily.
    
    Runs: Daily at 2:00 AM
    
    Returns:
        dict: Summary of expiry processing
    """
    logger.info("Starting loyalty points expiry task")
    
    # Statistics
    stats = {
        'accounts_processed': 0,
        'accounts_with_expiry': 0,
        'total_points_expired': 0,
        'errors': [],
        'started_at': timezone.now()
    }
    
    # Get all active loyalty accounts with balance
    active_accounts = CustomerLoyalty.objects.filter(
        status='active',
        points_balance__gt=0
    ).select_related('program', 'customer')
    
    logger.info(f"Found {active_accounts.count()} active accounts to process")
    
    # Process each account
    for loyalty in active_accounts:
        try:
            # Expire points for this account
            expired_txns = LoyaltyService.expire_points(loyalty)
            
            stats['accounts_processed'] += 1
            
            if expired_txns:
                # Points were expired
                total_expired = sum(abs(txn.points) for txn in expired_txns)
                stats['accounts_with_expiry'] += 1
                stats['total_points_expired'] += total_expired
                
                logger.info(
                    f"Expired {total_expired} points for "
                    f"customer {loyalty.customer.name}"
                )
                
                # Optional: Send notification
                notify_customer_points_expired(
                    loyalty.customer,
                    total_expired
                )
        
        except Exception as e:
            # Log error but continue processing
            error_msg = f"Error expiring points for {loyalty.id}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
    
    # Completion
    stats['completed_at'] = timezone.now()
    duration = (stats['completed_at'] - stats['started_at']).total_seconds()
    
    logger.info(
        f"Loyalty points expiry task completed. "
        f"Processed: {stats['accounts_processed']}, "
        f"Expired: {stats['accounts_with_expiry']}, "
        f"Total Points: {stats['total_points_expired']}, "
        f"Duration: {duration}s"
    )
    
    return stats
```

### Celery Beat Schedule Configuration

```python
Celery Beat Schedule:
─────────────────────────────────────────────────────

# settings.py or celery.py

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'expire-loyalty-points-daily': {
        'task': 'credit.expire_loyalty_points',
        'schedule': crontab(hour=2, minute=0),  # 2:00 AM daily
        'options': {
            'expires': 3600,  # Task expires after 1 hour
        }
    },
}
```

### Task Execution Timeline

```
Daily Execution:
─────────────────────────────────────────────────────

02:00 AM: Task triggered by Celery Beat
    │
    ├─ Query active loyalty accounts
    │
    ├─ For each account:
    │   ├─ Check expired points
    │   ├─ Create EXPIRE transactions
    │   ├─ Update balance
    │   └─ Send notification
    │
    ├─ Log statistics
    │
    └─ Task complete (typically 2-5 minutes)

Example Timeline:
├── 02:00:00 - Task started
├── 02:00:05 - Queried 2,500 accounts
├── 02:02:30 - Processed 2,500 accounts
│              - Expired points for 150 customers
│              - Total: 12,500 points expired
└── 02:02:35 - Task completed
```

### Monitoring and Alerts

```
Task Monitoring:
─────────────────────────────────────────────────────

Success Metrics:
├── Task completion time < 5 minutes
├── Error rate < 1%
├── All active accounts processed
└── Notifications sent successfully

Alert Conditions:
├── Task fails to complete
├── Error rate > 5%
├── Execution time > 10 minutes
├── No accounts processed (potential query issue)
└── Database connection errors

Logging Levels:
├── INFO: Task start, completion, summaries
├── WARNING: Individual account errors
├── ERROR: Task failure, database errors
└── CRITICAL: Task didn't run, beat scheduler issues
```

### Customer Notification Example

```python
Notification Function:
─────────────────────────────────────────────────────

def notify_customer_points_expired(customer, points_expired):
    """
    Notify customer of expired loyalty points.
    
    Args:
        customer: Customer instance
        points_expired: Integer points expired
    """
    # Email notification
    send_email(
        to=customer.email,
        subject="Loyalty Points Expired",
        template="loyalty/points_expired.html",
        context={
            'customer': customer,
            'points_expired': points_expired,
            'current_balance': customer.loyalty_account.points_balance,
            'earn_more_url': '/shop/',
        }
    )
    
    # SMS notification (optional)
    if customer.phone_number:
        send_sms(
            to=customer.phone_number,
            message=f"Hi {customer.first_name}, {points_expired} loyalty "
                   f"points expired. Current balance: "
                   f"{customer.loyalty_account.points_balance} points."
        )
```

### Expected Outcome
- Automated daily expiry processing
- All active accounts checked
- Points expired automatically
- Customers notified

### Verification Checklist
- [ ] `expiry_tasks.py` file created
- [ ] expire_loyalty_points task defined
- [ ] @shared_task decorator used
- [ ] Queries all active accounts
- [ ] Calls LoyaltyService.expire_points
- [ ] Error handling per account
- [ ] Statistics tracked and logged
- [ ] Celery beat schedule configured
- [ ] Task runs daily at 2:00 AM
- [ ] Notifications implemented

---

## Task 50: Implement Points Balance Calculator

### Overview
Create a comprehensive points balance calculator that provides detailed breakdowns of available points, expiring soon points, and forecasts. This utility helps customers and staff understand points status with expiry visibility.

### Dependencies
- Task 49: Create Points Expiry Task

### Instructions

1. **Open loyalty service file**
   - Navigate to `apps/credit/services/loyalty_service.py`
   - Locate LoyaltyService class

2. **Create get_points_breakdown method**
   - Static method or class method
   - Parameter: loyalty_account
   - Returns dictionary with detailed breakdown
   - Includes all balance components

3. **Calculate available points**
   - Current points_balance
   - Exclude points expiring today
   - Real-time calculation

4. **Calculate expiring soon points**
   - Query EARN transactions
   - Group by expiry timeframes (7, 30, 60, 90 days)
   - Filter by is_expired=False
   - Aggregate points per timeframe

5. **Calculate lifetime statistics**
   - lifetime_points_earned from loyalty account
   - total_points_redeemed from loyalty account
   - total_points_expired (calculate from transactions)
   - Effective earn rate

6. **Generate expiry forecast**
   - List upcoming expiry dates
   - Points expiring on each date
   - Visual timeline
   - Earliest expiry highlighted

7. **Calculate redemption value**
   - Convert available points to currency
   - Use redemption_value_per_point
   - Show potential discount

8. **Add tier bonus information**
   - Current tier multiplier
   - Next tier requirements
   - Points/spend needed for upgrade

9. **Return comprehensive dictionary**
   - All calculated values
   - Formatted for display
   - Ready for API response

### get_points_breakdown Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def get_points_breakdown(loyalty_account):
    """
    Get comprehensive points balance breakdown.
    
    Args:
        loyalty_account: CustomerLoyalty instance
    
    Returns:
        dict: Detailed balance breakdown
    """
    from django.db.models import Sum, Q
    from datetime import timedelta
    
    today = date.today()
    program = loyalty_account.program
    
    # Calculate expiring soon
    expiring_7_days = PointsTransaction.objects.filter(
        customer_loyalty=loyalty_account,
        type='earn',
        is_expired=False,
        expiry_date__lte=today + timedelta(days=7),
        expiry_date__gt=today
    ).aggregate(Sum('points'))['points__sum'] or 0
    
    expiring_30_days = PointsTransaction.objects.filter(
        customer_loyalty=loyalty_account,
        type='earn',
        is_expired=False,
        expiry_date__lte=today + timedelta(days=30),
        expiry_date__gt=today + timedelta(days=7)
    ).aggregate(Sum('points'))['points__sum'] or 0
    
    expiring_60_days = PointsTransaction.objects.filter(
        customer_loyalty=loyalty_account,
        type='earn',
        is_expired=False,
        expiry_date__lte=today + timedelta(days=60),
        expiry_date__gt=today + timedelta(days=30)
    ).aggregate(Sum('points'))['points__sum'] or 0
    
    expiring_90_days = PointsTransaction.objects.filter(
        customer_loyalty=loyalty_account,
        type='earn',
        is_expired=False,
        expiry_date__lte=today + timedelta(days=90),
        expiry_date__gt=today + timedelta(days=60)
    ).aggregate(Sum('points'))['points__sum'] or 0
    
    # Calculate total expired
    total_expired = abs(
        PointsTransaction.objects.filter(
            customer_loyalty=loyalty_account,
            type='expire'
        ).aggregate(Sum('points'))['points__sum'] or 0
    )
    
    # Get expiry forecast
    upcoming_expiries = PointsTransaction.objects.filter(
        customer_loyalty=loyalty_account,
        type='earn',
        is_expired=False,
        expiry_date__isnull=False,
        expiry_date__gt=today
    ).values('expiry_date').annotate(
        points=Sum('points')
    ).order_by('expiry_date')[:10]
    
    # Calculate redemption value
    redemption_value = Decimal(str(loyalty_account.points_balance)) * \
                      program.redemption_value_per_point
    
    # Build breakdown
    breakdown = {
        'current_balance': loyalty_account.points_balance,
        'available_now': loyalty_account.points_balance - expiring_7_days,
        'expiring_soon': {
            'next_7_days': expiring_7_days,
            'next_30_days': expiring_30_days,
            'next_60_days': expiring_60_days,
            'next_90_days': expiring_90_days,
        },
        'lifetime_stats': {
            'total_earned': loyalty_account.lifetime_points_earned,
            'total_redeemed': loyalty_account.total_points_redeemed,
            'total_expired': total_expired,
            'net_balance': loyalty_account.points_balance,
        },
        'redemption_value': {
            'points': loyalty_account.points_balance,
            'currency_value': redemption_value,
            'min_redeemable': program.min_points_for_redemption,
        },
        'tier_info': {
            'current_tier': loyalty_account.tier_name,
            'tier_multiplier': loyalty_account.tier_multiplier,
            'tier_expiry': loyalty_account.tier_expiry_date,
        },
        'upcoming_expiries': list(upcoming_expiries),
        'calculated_at': timezone.now(),
    }
    
    return breakdown
```

### Points Breakdown Example

```json
Complete Balance Breakdown:
─────────────────────────────────────────────────────

{
  "current_balance": 1500,
  "available_now": 1400,
  "expiring_soon": {
    "next_7_days": 100,
    "next_30_days": 200,
    "next_60_days": 300,
    "next_90_days": 150
  },
  "lifetime_stats": {
    "total_earned": 8500,
    "total_redeemed": 5200,
    "total_expired": 1800,
    "net_balance": 1500
  },
  "redemption_value": {
    "points": 1500,
    "currency_value": "1500.00",
    "min_redeemable": 100
  },
  "tier_info": {
    "current_tier": "Gold",
    "tier_multiplier": 1.5,
    "tier_expiry": "2026-12-31"
  },
  "upcoming_expiries": [
    {"expiry_date": "2026-02-01", "points": 100},
    {"expiry_date": "2026-02-15", "points": 150},
    {"expiry_date": "2026-03-01", "points": 200},
    {"expiry_date": "2026-04-10", "points": 300}
  ],
  "calculated_at": "2026-01-24T15:30:00Z"
}
```

### Visual Expiry Timeline

```
Points Expiry Timeline:
─────────────────────────────────────────────────────

Today: Jan 24, 2026
Current Balance: 1,500 points

┌─────────────────────────────────────────────────┐
│  Next 7 Days (Jan 24-31)                       │
│  ▓▓▓▓▓▓▓ 100 points                            │ ← Urgent!
├─────────────────────────────────────────────────┤
│  Next 30 Days (Feb 1-23)                       │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 200 points                     │
├─────────────────────────────────────────────────┤
│  Next 60 Days (Feb 24-Mar 24)                  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 300 points              │
├─────────────────────────────────────────────────┤
│  Next 90 Days (Mar 25-Apr 23)                  │
│  ▓▓▓▓▓▓▓▓▓▓▓ 150 points                        │
├─────────────────────────────────────────────────┤
│  Beyond 90 Days                                 │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 750 points   │
└─────────────────────────────────────────────────┘

Recommendation: Use 100 points soon to avoid expiry!
```

### Customer Dashboard Integration

```python
Dashboard View Usage:
─────────────────────────────────────────────────────

def loyalty_dashboard(request):
    """Customer loyalty dashboard view."""
    customer = request.user.customer
    
    try:
        loyalty = customer.loyalty_account
    except CustomerLoyalty.DoesNotExist:
        # Offer enrollment
        return render(request, 'loyalty/enroll.html')
    
    # Get comprehensive breakdown
    breakdown = LoyaltyService.get_points_breakdown(loyalty)
    
    # Add context
    context = {
        'loyalty': loyalty,
        'breakdown': breakdown,
        'alerts': [],
    }
    
    # Add alerts for expiring points
    if breakdown['expiring_soon']['next_7_days'] > 0:
        context['alerts'].append({
            'type': 'warning',
            'message': f"{breakdown['expiring_soon']['next_7_days']} "
                      f"points expiring in 7 days!"
        })
    
    # Recent transactions
    context['recent_transactions'] = PointsTransaction.objects.filter(
        customer_loyalty=loyalty
    ).order_by('-created')[:10]
    
    return render(request, 'loyalty/dashboard.html', context)
```

### Expected Outcome
- Comprehensive balance breakdown
- Expiry forecasting
- Lifetime statistics
- Redemption value calculation

### Verification Checklist
- [ ] get_points_breakdown method implemented
- [ ] Current balance calculated
- [ ] Expiring soon grouped by timeframes
- [ ] Lifetime statistics included
- [ ] Upcoming expiries listed
- [ ] Redemption value calculated
- [ ] Tier information included
- [ ] Returns formatted dictionary
- [ ] Optimized database queries
- [ ] Ready for API/dashboard use

---

## Summary

This document completed the loyalty points system:

### Completed Features
- ✅ Points redemption with validation
- ✅ Automatic points expiry (FIFO logic)
- ✅ Celery task for daily expiry processing
- ✅ Comprehensive balance calculator

### Key Achievements
1. **Redemption Logic** - Discount calculation, validation
2. **Expiry Processing** - FIFO, automatic, notifications
3. **Automated Tasks** - Celery beat, daily execution
4. **Balance Visibility** - Expiry forecasts, statistics

### Service Methods Completed
```
LoyaltyService:
├── award_points (Task 46)
├── redeem_points (Task 47)
├── expire_points (Task 48)
└── get_points_breakdown (Task 50)

Celery Tasks:
└── expire_loyalty_points (Task 49)
```

### Integration Complete
- Purchase → earn points
- Checkout → redeem points
- Daily → expire points
- Dashboard → show balance

### Next Steps
Proceed to [../Group-D_Loyalty-Tiers-Rewards/](../Group-D_Loyalty-Tiers-Rewards/) to implement loyalty tiers, tier evaluation, and rewards system.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 4  
**Total Lines:** ~1395
