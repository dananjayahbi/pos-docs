# Tasks 75-80: Points Promotions & Dashboard

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** E - Store Credit & Promotions  
> **Document:** 02 of 02 (Tasks 75-80)

---

## Navigation

- **↑ Parent:** [Group E Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-74_Store-Credit.md](./01_Tasks-67-74_Store-Credit.md)
- **→ Next Document:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Document Overview

### **Purpose**
Implement points promotions for bonus earning opportunities and create admin dashboard for credit/loyalty analytics.

### **Scope**
- PointsPromotion model for configurable promotions
- Double points and category bonus implementations
- Dashboard aggregations for admin reporting
- Database migrations

### **Key Outcomes**
1. ✅ PointsPromotion model with flexible rules
2. ✅ Promotion type configurations
3. ✅ Double points promotion logic
4. ✅ Category-specific bonus points
5. ✅ Credit/Loyalty dashboard data aggregations
6. ✅ Database migrations applied

---

## Tasks Covered

| Task # | Title | Complexity | Est. Time | Status |
|--------|-------|------------|-----------|--------|
| 75 | Create PointsPromotion Model | Medium | 25 min | ⏳ Not Started |
| 76 | Add Promotion Rules | Medium | 25 min | ⏳ Not Started |
| 77 | Implement Double Points Promotion | Medium | 25 min | ⏳ Not Started |
| 78 | Implement Category Bonus | Medium | 25 min | ⏳ Not Started |
| 79 | Create Credit/Loyalty Dashboard Data | High | 35 min | ⏳ Not Started |
| 80 | Run Promotion Migrations | Low | 15 min | ⏳ Not Started |

---

## Task Implementation Summary

### Tasks 75-76: PointsPromotion Model & Rules

Create `apps/credit/models/points_promotion.py` with fields for managing bonus points campaigns.

**Model Structure:**
- Inherits BaseModel (UUID, tenant, timestamps)
- Links to LoyaltyProgram
- Promotion types: MULTIPLIER (2x points), CATEGORY_BONUS (+500 pts), DATE_RANGE, SPEND_THRESHOLD
- Date range: valid_from, valid_to
- Configuration JSONField for flexible rules
- Active flag for enable/disable

**Key Fields:**
```
- program: FK → LoyaltyProgram
- name: CharField(100)
- description: TextField
- promotion_type: CharField (choices)
- multiplier: Decimal (default 1.0, e.g. 2.0 for double)
- bonus_points: Integer (flat bonus amount)
- valid_from: DateTime
- valid_to: DateTime
- is_active: Boolean
- configuration: JSONField
- min_purchase_amount: Decimal (threshold)
- applicable_categories: M2M → ProductCategory
- applicable_products: M2M → Product
```

**Promotion Types:**
- MULTIPLIER: Multiply normal points (2x, 3x)
- FLAT_BONUS: Add fixed points (+500)
- CATEGORY_BONUS: Bonus for specific categories
- SPEND_THRESHOLD: Bonus above amount (Rs. 10,000+)
- FIRST_PURCHASE: New customer bonus
- BIRTHDAY_MONTH: Bonus during birthday month

**Configuration Examples:**
```json
{
  "multiplier_value": 2.0,
  "min_purchase": 5000.00,
  "max_bonus_points": 10000,
  "categories": ["electronics", "appliances"],
  "exclude_sale_items": true
}
```

**Meta:**
```
db_table = 'credit_points_promotions'
ordering = ['-valid_from', 'name']
indexes on: program, promotion_type, is_active, valid_from, valid_to
```

---

### Task 77: Double Points Promotion

Extend `LoyaltyService` to check active promotions when awarding points.

**Implementation Flow:**
1. When awarding points for purchase, check active promotions
2. Query PointsPromotion where:
   - is_active = True
   - valid_from <= now() <= valid_to
   - program matches customer's loyalty program
3. For each matching promotion:
   - If MULTIPLIER type: multiply base points
   - If FLAT_BONUS: add bonus_points
   - If CATEGORY_BONUS: check product categories match
4. Apply highest multiplier or sum bonuses
5. Create separate PointsTransaction for bonus with reason="Promotion: {name}"

**Method:**
```python
def calculate_promotion_bonus(self, base_points, purchase_amount, categories=None):
    """Calculate bonus points from active promotions"""
    # Get active promotions
    promotions = PointsPromotion.objects.filter(
        program=self.program,
        is_active=True,
        valid_from__lte=now(),
        valid_to__gte=now()
    )
    
    total_bonus = 0
    multiplier = Decimal('1.0')
    
    for promo in promotions:
        if promo.promotion_type == 'MULTIPLIER':
            if purchase_amount >= promo.min_purchase_amount:
                multiplier = max(multiplier, promo.multiplier)
        elif promo.promotion_type == 'FLAT_BONUS':
            total_bonus += promo.bonus_points
        elif promo.promotion_type == 'CATEGORY_BONUS' and categories:
            if set(categories) & set(promo.applicable_categories.values_list('id', flat=True)):
                total_bonus += promo.bonus_points
    
    # Calculate final points
    points_after_multiplier = base_points * multiplier
    final_points = points_after_multiplier + total_bonus
    
    return {
        'base_points': base_points,
        'multiplier': multiplier,
        'bonus_points': total_bonus,
        'final_points': final_points
    }
```

**Integration with award_points:**
```python
def award_points(self, customer_loyalty_id, amount, reference='', categories=None):
    # Calculate base points
    base_points = calculate_points_for_amount(amount)
    
    # Apply promotions
    promo_result = calculate_promotion_bonus(base_points, amount, categories)
    
    # Award base points
    create_transaction(amount=promo_result['base_points'], type='EARN')
    
    # Award bonus points separately if any
    if promo_result['bonus_points'] > 0:
        create_transaction(
            amount=promo_result['bonus_points'],
            type='BONUS',
            reason=f"Promotion bonus"
        )
```

**Sri Lanka Example:**
- Vesak Day: 3x points on all purchases
- අලුත් අවුරුදු (New Year): +1000 bonus points on Rs. 10,000+ purchases
- Electronics category: +500 points

---

### Task 78: Category Bonus Implementation

Add category-specific bonus logic to promotions.

**Features:**
- M2M relationship: PointsPromotion ↔ ProductCategory
- Check if purchase contains products from bonus categories
- Apply category bonus additively
- Support multiple category bonuses in single purchase

**Method:**
```python
def get_category_bonuses(self, order_items):
    """Calculate category-specific bonuses for order"""
    category_ids = set()
    for item in order_items:
        if item.product.category:
            category_ids.add(item.product.category.id)
    
    bonuses = PointsPromotion.objects.filter(
        program=self.program,
        promotion_type='CATEGORY_BONUS',
        is_active=True,
        valid_from__lte=now(),
        valid_to__gte=now(),
        applicable_categories__id__in=category_ids
    ).distinct()
    
    total_bonus = sum(promo.bonus_points for promo in bonuses)
    
    return {
        'applicable_promotions': [p.name for p in bonuses],
        'total_bonus_points': total_bonus,
        'categories_matched': category_ids
    }
```

**Use Cases:**
- Electronics: +500 points per purchase
- Groceries: +100 points
- Clothing (අඳුම්): +300 points during festivals
- Combo: If purchase has both electronics and clothing, customer gets both bonuses (+800 total)

---

### Task 79: Credit/Loyalty Dashboard

Create `apps/credit/views/dashboard_views.py` with aggregation views for admin dashboard.

**Dashboard Metrics:**

**1. Credit Overview:**
```python
def get_credit_dashboard_data(tenant_id=None):
    """Aggregate store credit metrics"""
    credits = StoreCredit.objects.filter(tenant_id=tenant_id) if tenant_id else StoreCredit.objects.all()
    
    return {
        'total_customers_with_credit': credits.count(),
        'total_credit_balance': credits.aggregate(Sum('balance'))['balance__sum'] or 0,
        'total_credit_issued_lifetime': credits.aggregate(Sum('total_issued'))['total_issued__sum'] or 0,
        'total_credit_used_lifetime': credits.aggregate(Sum('total_used'))['total_used__sum'] or 0,
        'average_credit_balance': credits.aggregate(Avg('balance'))['balance__avg'] or 0,
        'credits_expiring_soon': credits.filter(
            expiry_date__lte=date.today() + timedelta(days=30),
            expiry_date__gte=date.today()
        ).count(),
        'expired_credits_value': credits.filter(
            expiry_date__lt=date.today()
        ).aggregate(Sum('balance'))['balance__sum'] or 0,
    }
```

**2. Loyalty Overview:**
```python
def get_loyalty_dashboard_data(tenant_id=None):
    """Aggregate loyalty program metrics"""
    loyalty = CustomerLoyalty.objects.filter(tenant_id=tenant_id) if tenant_id else CustomerLoyalty.objects.all()
    
    return {
        'total_loyalty_members': loyalty.count(),
        'total_points_balance': loyalty.aggregate(Sum('points_balance'))['points_balance__sum'] or 0,
        'total_points_earned_lifetime': loyalty.aggregate(Sum('lifetime_earned'))['lifetime_earned__sum'] or 0,
        'total_points_redeemed_lifetime': loyalty.aggregate(Sum('lifetime_redeemed'))['lifetime_redeemed__sum'] or 0,
        'average_points_per_customer': loyalty.aggregate(Avg('points_balance'))['points_balance__avg'] or 0,
        'tier_breakdown': loyalty.values('tier__name').annotate(count=Count('id')),
        'points_expiring_soon': PointsTransaction.objects.filter(
            transaction_type='EARN',
            expiry_date__lte=date.today() + timedelta(days=30),
            expiry_date__gte=date.today()
        ).aggregate(Sum('points_remaining'))['points_remaining__sum'] or 0,
    }
```

**3. Promotion Analytics:**
```python
def get_promotion_analytics(tenant_id=None, days=30):
    """Track promotion effectiveness"""
    start_date = date.today() - timedelta(days=days)
    
    active_promos = PointsPromotion.objects.filter(
        is_active=True,
        valid_from__lte=now(),
        valid_to__gte=now()
    )
    
    # Count bonus points awarded per promotion
    promo_stats = []
    for promo in active_promos:
        bonus_txns = PointsTransaction.objects.filter(
            transaction_type='BONUS',
            notes__icontains=promo.name,
            created_at__gte=start_date
        )
        
        promo_stats.append({
            'promotion_name': promo.name,
            'type': promo.promotion_type,
            'customers_participated': bonus_txns.values('customer_loyalty').distinct().count(),
            'total_bonus_awarded': bonus_txns.aggregate(Sum('amount'))['amount__sum'] or 0,
            'average_bonus_per_customer': bonus_txns.aggregate(Avg('amount'))['amount__avg'] or 0,
        })
    
    return promo_stats
```

**4. Transaction Trends:**
```python
def get_transaction_trends(tenant_id=None, days=90):
    """Daily transaction trends"""
    start_date = date.today() - timedelta(days=days)
    
    # Credit transactions by day
    credit_txns = StoreCreditTransaction.objects.filter(
        created_at__gte=start_date
    ).extra(select={'day': 'date(created_at)'}).values('day').annotate(
        issue_count=Count('id', filter=Q(transaction_type='ISSUE')),
        redeem_count=Count('id', filter=Q(transaction_type='REDEEM')),
        issue_amount=Sum('amount', filter=Q(transaction_type='ISSUE')),
        redeem_amount=Sum('amount', filter=Q(transaction_type='REDEEM')),
    ).order_by('day')
    
    # Points transactions by day
    points_txns = PointsTransaction.objects.filter(
        created_at__gte=start_date
    ).extra(select={'day': 'date(created_at)'}).values('day').annotate(
        earn_count=Count('id', filter=Q(transaction_type='EARN')),
        redeem_count=Count('id', filter=Q(transaction_type='REDEEM')),
        earn_points=Sum('amount', filter=Q(transaction_type='EARN')),
        redeem_points=Sum('amount', filter=Q(transaction_type='REDEEM')),
    ).order_by('day')
    
    return {
        'credit_trends': list(credit_txns),
        'points_trends': list(points_txns)
    }
```

**5. Top Customers:**
```python
def get_top_loyalty_customers(tenant_id=None, limit=10):
    """Top customers by points"""
    return CustomerLoyalty.objects.filter(
        tenant_id=tenant_id
    ).select_related('customer').order_by('-lifetime_earned')[:limit]

def get_top_credit_users(tenant_id=None, limit=10):
    """Top users by store credit"""
    return StoreCredit.objects.filter(
        tenant_id=tenant_id
    ).select_related('customer').order_by('-total_used')[:limit]
```

**Dashboard View:**
```python
from rest_framework.views import APIView
from rest_framework.response import Response

class CreditLoyaltyDashboardView(APIView):
    """Combined credit and loyalty dashboard"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        tenant_id = request.user.tenant_id if hasattr(request.user, 'tenant_id') else None
        
        data = {
            'credit_metrics': get_credit_dashboard_data(tenant_id),
            'loyalty_metrics': get_loyalty_dashboard_data(tenant_id),
            'promotion_analytics': get_promotion_analytics(tenant_id, days=30),
            'trends': get_transaction_trends(tenant_id, days=90),
            'top_loyalty_customers': get_top_loyalty_customers(tenant_id, limit=10),
            'top_credit_users': get_top_credit_users(tenant_id, limit=10),
        }
        
        return Response(data)
```

**Sri Lanka Context:**
- Display in Rs. currency
- Show festival campaign effectiveness (Vesak, Avurudu)
- Tier breakdown in Sinhala/Tamil/English
- Regional breakdowns (Colombo, Kandy, Galle)

---

### Task 80: Run Promotion Migrations

**Commands:**
```bash
python manage.py makemigrations credit
python manage.py migrate credit
```

**Expected Migration:**
- Create `credit_points_promotions` table
- M2M tables for categories and products
- Indexes on dates, program, is_active
- Foreign keys to LoyaltyProgram

**Verification:**
```sql
\d credit_points_promotions
SELECT * FROM information_schema.tables WHERE table_name LIKE '%points_promotions%';
```

---

## Summary

### Completed Tasks

| Task # | Component | Deliverable |
|--------|-----------|-------------|
| 75-76 | PointsPromotion Model | Flexible promotion configuration |
| 77 | Double Points | Multiplier logic in LoyaltyService |
| 78 | Category Bonus | Category-specific point bonuses |
| 79 | Dashboard | Comprehensive admin analytics |
| 80 | Migrations | Database schema applied |

### Key Features

**Promotions:**
- Multiple promotion types (multiplier, flat bonus, category)
- Date range validation
- Minimum purchase thresholds
- Category and product targeting
- Active/inactive toggling

**Dashboard:**
- Credit overview (balance, issued, used, expiring)
- Loyalty metrics (members, points, tiers)
- Promotion effectiveness tracking
- Transaction trends over time
- Top customers by loyalty/credit usage

**Sri Lanka Context:**
- Festival promotions (Vesak 3x points, අලුත් අවුරුදු bonuses)
- Category bonuses in Sinhala (ඉලෙක්ට්‍රොනික +500)
- Rs. currency display
- Regional analytics

### Testing Checklist

- [ ] PointsPromotion model creates successfully
- [ ] Promotion types validate correctly
- [ ] Date range filtering works
- [ ] Multiplier applies to base points
- [ ] Category bonus checks product categories
- [ ] Dashboard aggregations accurate
- [ ] Trends calculate correctly
- [ ] Top customers ranked properly
- [ ] Migrations applied successfully

---

## Navigation

- **↑ Parent:** [Group E Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-74_Store-Credit.md](./01_Tasks-67-74_Store-Credit.md)
- **→ Next Document:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

**Document End** - Tasks 75-80 Complete ✅
