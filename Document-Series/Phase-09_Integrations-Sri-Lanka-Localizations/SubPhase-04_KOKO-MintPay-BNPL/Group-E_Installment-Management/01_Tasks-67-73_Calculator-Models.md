# Tasks 67-73: Calculator & Models

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** E - Installment Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-74-80_Schedule-Reports-Verify.md](02_Tasks-74-80_Schedule-Reports-Verify.md)

---

## Document Overview

This document covers installment calculation engine and BNPL order model creation for Sri Lankan BNPL providers KOKO and MintPay. Implements zero-interest installment plans with flexible payment schedules.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create Installment Calculator | High | 45 min |
| 68 | Create Plan Options | Low | 15 min |
| 69 | Create First Payment | Low | 20 min |
| 70 | Create Monthly Amounts | Low | 20 min |
| 71 | Create Due Dates | Medium | 25 min |
| 72 | Create Installment Display | Medium | 30 min |
| 73 | Create BNPLOrder Model | Medium | 35 min |

---

## Task 67: Create Installment Calculator

### Overview
Create core installment calculator for splitting BNPL orders into affordable monthly payments with Sri Lankan LKR currency support.

### Dependencies
- Task 66: Credit verification completed

### Instructions

1. **Create calculator file** at `backend/apps/payments/processors/bnpl/installments.py`
2. **Implement InstallmentCalculator class** with Sri Lankan payment patterns
3. **Support plan options**: 3, 4, and 6 month plans
4. **Calculate first payment**: Based on plan duration
5. **Calculate monthly amounts**: Split remaining balance evenly
6. **Generate due dates**: 30-day intervals from order date
7. **Handle LKR currency**: Decimal precision and rounding
8. **Return breakdown object**: Complete payment schedule

### Calculator Requirements
- Support KOKO and MintPay provider differences
- Handle minimum order amounts (LKR 5,000)
- Maximum order amounts (LKR 500,000)
- Zero interest calculations only
- Round to nearest LKR (no cents)

### Payment Structure
| Component | Description |
|-----------|-------------|
| First Payment | Due immediately or within 24 hours |
| Monthly Installments | Equal amounts, 30-day intervals |
| Total | Matches original order amount exactly |

### Expected Outcome
Installment calculator generating accurate payment breakdowns for Sri Lankan BNPL orders.

### Verification Checklist
- [ ] InstallmentCalculator class created
- [ ] Plan options supported (3/4/6 months)
- [ ] LKR currency handling implemented
- [ ] Payment breakdown accurate
- [ ] Provider differences handled

---

## Task 68: Create Plan Options

### Overview
Define available BNPL plan options with Sri Lankan market-appropriate durations and payment structures.

### Dependencies
- Task 67: Installment Calculator created

### Instructions

1. **Define plan configurations** in calculator
2. **Create PLAN_OPTIONS constant** with supported durations
3. **Set first payment percentages** for each plan
4. **Configure minimum order amounts** per plan
5. **Add plan validation** logic
6. **Include plan descriptions** for UI display

### Plan Configurations
| Plan | Duration | First Payment | Min Order | Max Order |
|------|----------|---------------|-----------|-----------|
| Quick | 3 months | 33.33% | LKR 5,000 | LKR 500,000 |
| Standard | 4 months | 25% | LKR 10,000 | LKR 500,000 |
| Extended | 6 months | 16.67% | LKR 15,000 | LKR 500,000 |

### Plan Benefits
- **Quick Plan**: Faster payoff, higher first payment
- **Standard Plan**: Balanced approach, popular choice
- **Extended Plan**: Lower monthly burden, longer commitment

### Provider Differences
| Provider | Specialty | Plan Preference |
|----------|-----------|-----------------|
| KOKO | Electronics, Fashion | 4 and 6 month plans |
| MintPay | General retail | All plan options |

### Expected Outcome
Structured plan options supporting Sri Lankan consumer payment preferences.

### Verification Checklist
- [ ] PLAN_OPTIONS constant defined
- [ ] Plan validations implemented
- [ ] Provider differences handled
- [ ] Min/max amounts configured

---

## Task 69: Create First Payment

### Overview
Calculate first payment amount for BNPL orders based on selected plan and order total.

### Dependencies
- Task 67: Installment Calculator created
- Task 68: Plan Options defined

### Instructions

1. **Implement first payment calculation** method
2. **Apply plan percentage** to order total
3. **Handle rounding** to nearest LKR
4. **Set due date** to order date or next business day
5. **Account for partial payments** if supported
6. **Validate minimum amounts** per plan

### First Payment Logic
```
first_payment = ceiling(order_total / plan_months)
```

### Payment Timing
| Scenario | Due Date |
|----------|----------|
| Online order | Immediate |
| In-store order | Within 24 hours |
| Weekend order | Next business day |

### Rounding Rules
- Always round up to ensure total is covered
- Minimum LKR 1,000 first payment
- Adjust monthly amounts to compensate

### Special Cases
| Case | Handling |
|------|----------|
| Small orders | Minimum first payment applies |
| Large orders | Maximum percentage limits |
| Odd amounts | Round up first, adjust monthly |

### Expected Outcome
Accurate first payment calculation with proper Sri Lankan currency handling.

### Verification Checklist
- [ ] First payment calculation implemented
- [ ] Rounding rules applied
- [ ] Due date logic working
- [ ] Special cases handled

---

## Task 70: Create Monthly Amounts

### Overview
Calculate equal monthly installment amounts after first payment for remaining plan duration.

### Dependencies
- Task 67: Installment Calculator created
- Task 69: First Payment calculated

### Instructions

1. **Calculate remaining balance** after first payment
2. **Divide by remaining months** (plan_months - 1)
3. **Round monthly amounts** to nearest LKR
4. **Adjust final payment** to match total exactly
5. **Handle uneven divisions** gracefully
6. **Validate total accuracy** after adjustments

### Monthly Calculation
```
remaining_balance = order_total - first_payment
monthly_amount = remaining_balance / (plan_months - 1)
```

### Adjustment Logic
| Scenario | Solution |
|----------|----------|
| Remainder exists | Add to final installment |
| Total exceeds | Reduce final installment |
| Total under | Increase final installment |

### Payment Distribution Examples
**LKR 100,000 Order - 4 Month Plan**
- First Payment: LKR 25,000
- Monthly Installments: LKR 25,000 × 3
- Total: LKR 100,000 exactly

**LKR 77,777 Order - 3 Month Plan**
- First Payment: LKR 25,926 (rounded up)
- Monthly Installments: LKR 25,926, LKR 25,925
- Total: LKR 77,777 exactly

### Expected Outcome
Evenly distributed monthly payments totaling original order amount.

### Verification Checklist
- [ ] Monthly calculation implemented
- [ ] Remainder handling working
- [ ] Total accuracy maintained
- [ ] All amounts positive

---

## Task 71: Create Due Dates

### Overview
Generate payment due dates for all installments based on Sri Lankan business calendar and payment customs.

### Dependencies
- Task 67: Installment Calculator created
- Task 69: First Payment timing set

### Instructions

1. **Set first payment due date** based on order timing
2. **Calculate monthly intervals** of 30 days
3. **Adjust for weekends** and Sri Lankan holidays
4. **Handle month-end scenarios** appropriately
5. **Account for business days** for payment processing
6. **Store in ISO format** for database compatibility

### Date Calculation Rules
| Rule | Implementation |
|------|----------------|
| Weekend dues | Move to next Monday |
| Holiday dues | Move to next business day |
| Month variations | Consistent 30-day intervals |
| Leap years | Standard date arithmetic |

### Sri Lankan Holidays to Consider
- Sinhala and Tamil New Year (April)
- Vesak Day (May)
- National holidays
- Bank holidays

### Business Day Logic
| Day | Treatment |
|-----|-----------|
| Monday-Friday | Standard due dates |
| Saturday | Move to Monday |
| Sunday | Move to Monday |
| Public Holiday | Move to next business day |

### Date Format
- Storage: ISO format (YYYY-MM-DD)
- Display: Sri Lankan format (DD/MM/YYYY)
- Timezone: Sri Lanka Standard Time (UTC+5:30)

### Expected Outcome
Accurate due dates respecting Sri Lankan business calendar and payment customs.

### Verification Checklist
- [ ] Due date calculation working
- [ ] Holiday adjustments implemented
- [ ] Weekend handling correct
- [ ] ISO format storage

---

## Task 72: Create Installment Display

### Overview
Create formatted display strings for showing installment breakdown to customers in Sri Lankan format.

### Dependencies
- Task 67: Installment Calculator created
- Task 71: Due Dates generated

### Instructions

1. **Format currency amounts** in Sri Lankan Rupees
2. **Create installment summaries** for UI display
3. **Generate payment schedule** text
4. **Include status indicators** for each installment
5. **Support both languages** (English and Sinhala if needed)
6. **Provide breakdown tooltips** for customer understanding

### Display Formats
| Component | Format | Example |
|-----------|--------|---------|
| Currency | Rs. 25,000.00 | Rs. 25,000.00 |
| Installment | 1 of 4 | 1 of 4 |
| Due Date | DD/MM/YYYY | 15/02/2024 |
| Status | Paid/Pending/Overdue | Paid ✓ |

### Breakdown Display Structure
```
Payment Plan: 4 Months
Total Amount: Rs. 100,000.00

1st Payment: Rs. 25,000.00 (Due: 15/01/2024) ✓ Paid
2nd Payment: Rs. 25,000.00 (Due: 14/02/2024) ⏳ Pending  
3rd Payment: Rs. 25,000.00 (Due: 15/03/2024) ⏳ Pending
4th Payment: Rs. 25,000.00 (Due: 14/04/2024) ⏳ Pending
```

### Status Indicators
| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Paid | ✓ | Green | Payment received |
| Pending | ⏳ | Blue | Not yet due |
| Due | ⚠ | Orange | Due now |
| Overdue | ❌ | Red | Past due date |

### Language Support
- Primary: English
- Optional: Sinhala numbers and currency
- Date formats: Local preferences

### Expected Outcome
Clear, formatted installment display suitable for customer-facing interfaces.

### Verification Checklist
- [ ] Currency formatting correct
- [ ] Status indicators working
- [ ] Date formats appropriate
- [ ] Breakdown structure clear

---

## Task 73: Create BNPLOrder Model

### Overview
Create Django model to store BNPL order information linking to main orders with installment tracking.

### Dependencies
- Task 66: Credit verification models exist
- Previous Phase: Order model created

### Instructions

1. **Create model file** at `backend/apps/payments/models/bnpl_order.py`
2. **Define BNPLOrder model** with required fields
3. **Add foreign key** to main Order model
4. **Include provider field** for KOKO/MintPay distinction
5. **Store installment parameters** for recalculation
6. **Add status tracking** for order lifecycle
7. **Implement model methods** for common operations

### Model Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| order | ForeignKey | Link to main order |
| provider | CharField | KOKO or MINTPAY |
| plan_months | IntegerField | 3, 4, or 6 months |
| total_amount | DecimalField | Order total in LKR |
| first_payment_amount | DecimalField | First installment |
| monthly_amount | DecimalField | Regular installments |
| first_payment_due | DateField | First payment date |
| status | CharField | Order status |
| provider_order_id | CharField | Provider reference |
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Last modification |
| metadata | JSONField | Provider-specific data |

### Status Choices
| Status | Description |
|--------|-------------|
| PENDING | Awaiting first payment |
| ACTIVE | First payment received |
| COMPLETED | All payments received |
| CANCELLED | Order cancelled |
| DEFAULTED | Payment failures |

### Model Methods
| Method | Purpose |
|--------|---------|
| recalculate_installments() | Recalc if needed |
| get_next_payment() | Next due installment |
| is_overdue() | Check overdue status |
| get_payment_summary() | Display summary |
| cancel_order() | Cancel BNPL |

### Relationships
- **One-to-One** with Order model
- **One-to-Many** with Installment model (next task)
- **Many-to-One** with User model (through Order)

### Constraints and Validations
| Constraint | Rule |
|------------|------|
| Provider choices | Only KOKO, MINTPAY |
| Plan months | Only 3, 4, 6 |
| Amount range | 5,000 - 500,000 LKR |
| Positive amounts | All amounts > 0 |

### Expected Outcome
Complete BNPLOrder model storing all BNPL order information with proper relationships.

### Verification Checklist
- [ ] BNPLOrder model created
- [ ] All required fields defined
- [ ] Relationships established
- [ ] Validations implemented
- [ ] Status choices complete
- [ ] Model methods working

---

## Integration Points

### Calculator Integration
The InstallmentCalculator integrates with:
- **Order processing**: Called during checkout
- **Payment gateway**: Provides breakdown to KOKO/MintPay
- **Customer display**: Shows payment schedule
- **Admin reporting**: Installment analytics

### Model Integration  
The BNPLOrder model integrates with:
- **Order model**: One-to-one relationship
- **Payment processor**: Stores provider data
- **Webhook handler**: Updates from providers
- **Reporting system**: BNPL analytics

### Provider Considerations
| Provider | Specifics |
|----------|-----------|
| KOKO | Electronics focus, prefers 4+ month plans |
| MintPay | General retail, flexible plan options |
| Both | LKR currency, Sri Lankan business calendar |

### Error Handling
| Error Type | Response |
|------------|----------|
| Invalid plan | Return validation error |
| Amount out of range | Reject with limits |
| Calculation error | Log and retry |
| Model save error | Rollback transaction |

### Performance Considerations
- Cache plan configurations
- Optimize database queries
- Index frequently queried fields
- Consider async calculation for large orders

---

## Testing Requirements

### Calculator Tests
- Test all plan combinations
- Verify amount accuracy
- Check date calculations
- Test edge cases (small/large amounts)

### Model Tests
- Test field validations
- Verify relationships
- Check model methods
- Test status transitions

### Integration Tests
- Test calculator with model
- Verify provider differences
- Check error handling
- Test complete flow

---

## Security Considerations

### Data Protection
- Encrypt sensitive financial data
- Log access to BNPL records
- Implement audit trails
- Secure provider communications

### Validation
- Validate all inputs
- Check authorization for model access
- Verify provider authenticity
- Sanitize display data

---

## Maintenance Notes

### Future Enhancements
- Support for promotional rates
- Dynamic plan options
- Provider-specific calculations
- Multi-currency support

### Monitoring
- Track calculation accuracy
- Monitor model performance
- Watch for provider changes
- Log error patterns

---

## Summary

This document establishes the foundation for BNPL installment management with:
- Accurate installment calculations for Sri Lankan market
- Flexible plan options (3/4/6 months)
- Proper currency handling in LKR
- Comprehensive BNPLOrder model
- Integration with KOKO and MintPay providers
- Customer-friendly payment displays

The calculator and model work together to provide a complete BNPL order management system suitable for Sri Lankan e-commerce platforms.