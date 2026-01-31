# Tasks 74-80: Schedule, Reports & Verify

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** E - Installment Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 74, 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-73_Calculator-Models.md](01_Tasks-67-73_Calculator-Models.md)

---

## Document Overview

This document covers individual installment tracking, payment schedule management, status monitoring, webhook handling, overdue management, BNPL reporting, and complete flow verification for Sri Lankan BNPL providers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 74 | Create Installment Model | Medium | 35 min |
| 75 | Create Payment Schedule | Medium | 30 min |
| 76 | Create Status Tracking | Medium | 25 min |
| 77 | Create Installment Webhook | Medium | 40 min |
| 78 | Create Overdue Handling | Medium | 30 min |
| 79 | Create BNPL Reports | Medium | 45 min |
| 80 | Verify Installments | Low | 20 min |

---

## Task 74: Create Installment Model

### Overview
Create Django model to track individual installments for each BNPL order with payment status and due date tracking.

### Dependencies
- Task 73: BNPLOrder Model created

### Instructions

1. **Create model file** at `backend/apps/payments/models/installment.py`
2. **Define Installment model** with comprehensive tracking fields
3. **Link to BNPLOrder** via foreign key relationship
4. **Track payment status** with detailed state management
5. **Store payment confirmation** from KOKO/MintPay providers
6. **Include retry logic** for failed payments
7. **Add audit fields** for payment history

### Model Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| bnpl_order | ForeignKey | Link to BNPLOrder |
| installment_number | IntegerField | 1, 2, 3, etc. |
| amount | DecimalField | Installment amount in LKR |
| due_date | DateField | Payment due date |
| paid_date | DateTimeField | When payment received (null if unpaid) |
| status | CharField | Payment status |
| payment_method | CharField | How payment was made |
| provider_payment_id | CharField | Provider transaction reference |
| retry_count | IntegerField | Number of retry attempts |
| last_retry_date | DateTimeField | Last retry attempt |
| notes | TextField | Admin notes about payment |
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Last modification |

### Status Choices
| Status | Description | Next Actions |
|--------|-------------|--------------|
| SCHEDULED | Future installment | None (waiting) |
| DUE | Payment due now | Process payment |
| PROCESSING | Payment in progress | Wait for confirmation |
| PAID | Payment successful | None |
| FAILED | Payment failed | Retry or mark overdue |
| OVERDUE | Past due date | Collection process |
| CANCELLED | Installment cancelled | None |

### Payment Methods
| Method | Description |
|--------|-------------|
| AUTO_CHARGE | Provider auto-charge |
| MANUAL_PAYMENT | Customer manual payment |
| BANK_TRANSFER | Direct bank payment |
| CARD_PAYMENT | Credit/debit card |
| MOBILE_WALLET | Digital wallet |

### Model Methods
| Method | Purpose |
|--------|---------|
| mark_paid() | Update status to paid |
| mark_failed() | Handle payment failure |
| can_retry() | Check if retry allowed |
| days_overdue() | Calculate overdue days |
| get_display_status() | Human-readable status |

### Constraints and Validations
| Constraint | Rule |
|------------|------|
| Unique installment | Per BNPL order |
| Positive amount | Amount > 0 |
| Valid due date | Future or today |
| Status transitions | Logical flow only |
| Retry limits | Max 3 retries |

### Expected Outcome
Complete Installment model tracking all individual payments with full audit trail.

### Verification Checklist
- [ ] Installment model created
- [ ] Relationship with BNPLOrder established
- [ ] Status tracking comprehensive
- [ ] Payment methods covered
- [ ] Audit trail complete

---

## Task 75: Create Payment Schedule

### Overview
Implement payment schedule generation and management for creating all installments when BNPL order is confirmed.

### Dependencies
- Task 74: Installment Model created
- Task 73: BNPLOrder Model exists

### Instructions

1. **Create schedule generator** in `backend/apps/payments/services/bnpl_schedule.py`
2. **Generate all installments** when BNPLOrder is created
3. **Set proper due dates** based on calculation from Task 71
4. **Handle schedule modifications** if order changes
5. **Support schedule preview** before order confirmation
6. **Include schedule validation** for accuracy

### Schedule Generation Process
| Step | Action |
|------|--------|
| 1 | Validate BNPLOrder parameters |
| 2 | Calculate installment amounts |
| 3 | Generate due dates |
| 4 | Create Installment records |
| 5 | Set first installment as DUE |
| 6 | Set others as SCHEDULED |

### Schedule Generator Class
```
class BNPLScheduleGenerator:
    - create_schedule(bnpl_order)
    - preview_schedule(order_amount, plan_months)
    - modify_schedule(bnpl_order, changes)
    - validate_schedule(installments)
    - recalculate_schedule(bnpl_order)
```

### Schedule Rules
| Rule | Implementation |
|------|----------------|
| First installment | Due immediately or within 24 hours |
| Subsequent installments | 30-day intervals |
| Holiday adjustment | Move to next business day |
| Amount accuracy | Total equals order amount |
| Sequential numbering | 1, 2, 3, etc. |

### Modification Scenarios
| Scenario | Handling |
|----------|----------|
| Order cancelled | Mark all CANCELLED |
| Payment plan change | Regenerate remaining |
| Amount adjustment | Recalculate installments |
| Date change | Adjust future due dates |

### Preview Functionality
- Show schedule before order confirmation
- Allow customer to see payment breakdown
- Display in customer-friendly format
- Include all fees and charges

### Expected Outcome
Automated payment schedule generation creating accurate installment records for each BNPL order.

### Verification Checklist
- [ ] Schedule generator created
- [ ] Installment creation automated
- [ ] Due dates accurate
- [ ] Schedule modification working
- [ ] Preview functionality complete

---

## Task 76: Create Status Tracking

### Overview
Implement comprehensive status tracking system for monitoring installment payment progress and order lifecycle.

### Dependencies
- Task 74: Installment Model created
- Task 75: Payment Schedule generated

### Instructions

1. **Create status manager** in `backend/apps/payments/services/bnpl_status.py`
2. **Implement status updates** for installments and orders
3. **Add status transition validation** to prevent invalid changes
4. **Create status query methods** for reporting and UI
5. **Include status history** for audit purposes
6. **Set up automated status checks** for due date monitoring

### Status Manager Class
```
class BNPLStatusManager:
    - update_installment_status(installment, new_status)
    - check_due_installments()
    - mark_overdue_installments()
    - get_order_status_summary(bnpl_order)
    - validate_status_transition(current, new)
```

### Status Transitions
| From | To | Trigger |
|------|----|---------| 
| SCHEDULED | DUE | Due date reached |
| DUE | PROCESSING | Payment initiated |
| PROCESSING | PAID | Payment confirmed |
| PROCESSING | FAILED | Payment declined |
| DUE | OVERDUE | Past due date |
| FAILED | DUE | Retry attempt |

### Automated Status Updates
| Frequency | Check | Action |
|-----------|-------|--------|
| Daily | Due dates | Mark DUE installments |
| Daily | Overdue | Mark OVERDUE installments |
| Hourly | Processing | Check payment status |
| Real-time | Webhooks | Update from providers |

### Status Query Methods
| Method | Purpose |
|--------|---------|
| get_due_installments() | Find payments due today |
| get_overdue_installments() | Find past due payments |
| get_processing_payments() | Find pending payments |
| get_order_progress(order) | Calculate completion % |
| get_payment_summary(customer) | Customer payment status |

### Order Status Calculation
| Installment Status | Order Impact |
|-------------------|--------------|
| All PAID | Order COMPLETED |
| Any OVERDUE | Order AT_RISK |
| First PAID, others SCHEDULED | Order ACTIVE |
| First DUE | Order PENDING |
| Multiple FAILED | Order DEFAULTED |

### Status History Tracking
- Log all status changes with timestamp
- Record who made the change
- Include reason for status update
- Maintain audit trail for compliance

### Expected Outcome
Robust status tracking system providing real-time visibility into BNPL payment progress.

### Verification Checklist
- [ ] Status manager implemented
- [ ] Status transitions validated
- [ ] Automated checks working
- [ ] Query methods functional
- [ ] History tracking enabled

---

## Task 77: Create Installment Webhook

### Overview
Implement webhook handlers to receive payment confirmations from KOKO and MintPay providers and update installment status accordingly.

### Dependencies
- Task 74: Installment Model created
- Task 76: Status Tracking implemented

### Instructions

1. **Create webhook endpoints** in `backend/apps/payments/webhooks/bnpl_webhooks.py`
2. **Handle KOKO webhooks** with their specific format
3. **Handle MintPay webhooks** with their format
4. **Validate webhook authenticity** using provider signatures
5. **Update installment status** based on webhook data
6. **Handle webhook failures** with retry mechanism
7. **Log all webhook activity** for debugging

### Webhook Endpoints
| Provider | Endpoint | Method |
|----------|----------|--------|
| KOKO | `/webhooks/koko/installments/` | POST |
| MintPay | `/webhooks/mintpay/installments/` | POST |

### KOKO Webhook Format
| Field | Description |
|-------|-------------|
| order_id | KOKO order reference |
| installment_id | Installment identifier |
| status | Payment status |
| amount | Payment amount |
| payment_date | When payment processed |
| payment_method | How payment was made |
| signature | Webhook signature |

### MintPay Webhook Format
| Field | Description |
|-------|-------------|
| transaction_id | MintPay transaction ID |
| merchant_order_id | Our order reference |
| installment_number | Which installment |
| payment_status | Success/Failed/Pending |
| amount_paid | Amount received |
| timestamp | Payment timestamp |
| hash | Security hash |

### Webhook Authentication
| Provider | Method |
|----------|--------|
| KOKO | HMAC-SHA256 signature |
| MintPay | MD5 hash validation |

### Webhook Processing Flow
| Step | Action |
|------|--------|
| 1 | Receive webhook payload |
| 2 | Validate signature/hash |
| 3 | Find matching installment |
| 4 | Update installment status |
| 5 | Update order status if needed |
| 6 | Send confirmation response |
| 7 | Log webhook activity |

### Error Handling
| Error | Response |
|-------|---------|
| Invalid signature | HTTP 401 Unauthorized |
| Installment not found | HTTP 404 Not Found |
| Already processed | HTTP 200 OK (idempotent) |
| Server error | HTTP 500 Internal Server Error |

### Retry Mechanism
- Providers retry failed webhooks
- Exponential backoff: 1min, 5min, 15min, 1hr
- Maximum 5 retry attempts
- Dead letter queue for failed webhooks

### Expected Outcome
Reliable webhook handling updating installment status when payments are processed by KOKO and MintPay.

### Verification Checklist
- [ ] Webhook endpoints created
- [ ] Provider formats handled
- [ ] Authentication working
- [ ] Status updates accurate
- [ ] Error handling complete
- [ ] Logging implemented

---

## Task 78: Create Overdue Handling

### Overview
Implement overdue payment management system for tracking, notifications, and automated handling of missed BNPL payments.

### Dependencies
- Task 76: Status Tracking implemented
- Task 77: Installment Webhook handling

### Instructions

1. **Create overdue manager** in `backend/apps/payments/services/bnpl_overdue.py`
2. **Implement daily overdue check** job
3. **Mark overdue installments** based on due dates
4. **Send overdue notifications** to customers and admin
5. **Handle grace periods** before marking overdue
6. **Create escalation process** for persistent overdue
7. **Generate overdue reports** for management

### Overdue Manager Class
```
class BNPLOverdueManager:
    - check_overdue_payments()
    - mark_overdue_installment(installment)
    - send_overdue_notification(customer, installment)
    - calculate_grace_period(installment)
    - escalate_overdue_case(bnpl_order)
    - generate_overdue_report()
```

### Grace Period Rules
| Plan Type | Grace Period | Actions |
|-----------|--------------|---------|
| First payment | 3 days | Reminder emails |
| Regular installments | 7 days | SMS + email alerts |
| Final payment | 14 days | Phone call + email |

### Overdue Escalation Process
| Days Overdue | Action | Responsible |
|--------------|--------|-------------|
| 1-7 days | Automated reminders | System |
| 8-14 days | Admin notification | Customer service |
| 15-30 days | Provider notification | KOKO/MintPay |
| 30+ days | Collection process | Provider |

### Notification Types
| Trigger | Method | Recipients |
|---------|--------|------------|
| Payment due tomorrow | Email | Customer |
| Payment overdue | SMS + Email | Customer |
| 7 days overdue | Admin alert | Staff |
| 15 days overdue | Provider webhook | KOKO/MintPay |

### Daily Overdue Check Job
| Time | Action |
|------|--------|
| 6:00 AM | Check due dates |
| 6:15 AM | Mark overdue installments |
| 6:30 AM | Send notifications |
| 7:00 AM | Generate reports |
| 7:30 AM | Update provider systems |

### Overdue Status Tracking
| Field | Description |
|-------|-------------|
| days_overdue | Number of days past due |
| grace_period_active | Still in grace period |
| notifications_sent | Count of notices sent |
| last_contact_date | Last customer contact |
| escalation_level | Current escalation stage |

### Provider Integration
- KOKO: Automatic account suspension after 30 days
- MintPay: Collection agency referral after 45 days
- Both: Report to credit bureau after 60 days

### Expected Outcome
Comprehensive overdue management system protecting business interests while maintaining customer relationships.

### Verification Checklist
- [ ] Overdue manager created
- [ ] Daily checks automated
- [ ] Grace periods implemented
- [ ] Notifications working
- [ ] Escalation process active
- [ ] Provider integration complete

---

## Task 79: Create BNPL Reports

### Overview
Implement comprehensive reporting system for BNPL orders, installment tracking, payment analytics, and business intelligence for Sri Lankan operations.

### Dependencies
- Task 74: Installment Model created
- Task 76: Status Tracking implemented
- Task 78: Overdue Handling active

### Instructions

1. **Create reports module** in `backend/apps/payments/reports/bnpl_reports.py`
2. **Implement summary reports** for management overview
3. **Create detailed analytics** for operational insights
4. **Generate provider reports** for KOKO and MintPay
5. **Add customer payment reports** for service
6. **Include overdue analysis** for risk management
7. **Create automated report scheduling** for regular delivery

### Report Types
| Report | Frequency | Audience |
|--------|-----------|----------|
| Daily Summary | Daily | Operations team |
| Weekly Analytics | Weekly | Management |
| Monthly Provider | Monthly | KOKO/MintPay |
| Customer Statements | Monthly | Customers |
| Risk Analysis | Weekly | Finance team |

### BNPL Reports Manager
```
class BNPLReportsManager:
    - generate_daily_summary()
    - generate_weekly_analytics()
    - generate_provider_report(provider)
    - generate_customer_statement(customer)
    - generate_risk_analysis()
    - schedule_automated_reports()
```

### Daily Summary Report
| Metric | Description |
|--------|-------------|
| New BNPL Orders | Orders created today |
| Total Order Value | Sum of order amounts in LKR |
| Payments Received | Installments paid today |
| Payment Amount | Total payments received |
| Overdue Count | New overdue installments |
| Active Orders | Currently active BNPL orders |

### Weekly Analytics Report
| Section | Metrics |
|---------|---------|
| Order Trends | New orders, cancellations, conversions |
| Payment Performance | On-time rate, overdue rate |
| Provider Comparison | KOKO vs MintPay performance |
| Plan Analysis | 3/4/6 month plan popularity |
| Customer Segments | Repeat customers, demographics |

### Provider Reports
**KOKO Report**
- Orders processed through KOKO
- Payment success rates
- Overdue accounts requiring attention
- Commission calculations
- Technical integration status

**MintPay Report**
- Orders processed through MintPay
- Payment collection efficiency
- Risk account notifications
- Settlement reconciliation
- API usage statistics

### Customer Payment Statements
| Section | Content |
|---------|---------|
| Account Summary | Current balance, next payment |
| Payment History | All completed payments |
| Upcoming Payments | Future installment schedule |
| Payment Methods | Saved payment options |
| Support Information | Contact details |

### Risk Analysis Report
| Risk Factor | Metrics |
|-------------|---------|
| Overdue Trends | Increasing/decreasing overdue rates |
| High-Risk Orders | Orders likely to default |
| Provider Risk | Risk comparison between providers |
| Customer Risk | Customers with multiple overdue |
| Economic Impact | Revenue impact of overdue payments |

### Report Generation Features
- Export to PDF, Excel, CSV formats
- Email delivery to stakeholders
- Dashboard visualizations
- Real-time data updates
- Historical trend analysis

### Automated Scheduling
| Report | Schedule | Recipients |
|--------|----------|------------|
| Daily Summary | 8:00 AM daily | operations@company.com |
| Weekly Analytics | Monday 9:00 AM | management@company.com |
| Provider Reports | 1st of month | providers + finance |
| Risk Analysis | Friday 10:00 AM | finance@company.com |

### Sri Lankan Business Context
- Currency amounts in LKR
- Business day calculations
- Local holiday considerations
- Regulatory compliance reports
- Tax reporting integration

### Expected Outcome
Comprehensive reporting system providing full visibility into BNPL operations with actionable business intelligence.

### Verification Checklist
- [ ] Reports module created
- [ ] All report types implemented
- [ ] Automated scheduling working
- [ ] Export formats functional
- [ ] Provider reports accurate
- [ ] Sri Lankan context included

---

## Task 80: Verify Installments

### Overview
Comprehensive verification and testing of complete BNPL installment management system including end-to-end flow validation.

### Dependencies
- All previous tasks (67-79) completed

### Instructions

1. **Create verification test suite** covering all BNPL functionality
2. **Test installment calculation** accuracy across all scenarios
3. **Verify payment schedule generation** for all plan types
4. **Test webhook processing** for both providers
5. **Validate overdue handling** and escalation
6. **Check report generation** accuracy and completeness
7. **Perform end-to-end testing** of complete customer journey

### Verification Test Categories
| Category | Test Scope |
|----------|------------|
| Calculator Tests | All plan combinations, edge cases |
| Model Tests | Database operations, relationships |
| Schedule Tests | Payment schedule generation |
| Status Tests | Status transitions, automation |
| Webhook Tests | Provider integration, error handling |
| Overdue Tests | Detection, notification, escalation |
| Reports Tests | Data accuracy, formatting |
| Integration Tests | Complete flow testing |

### Calculator Verification
| Test Case | Expected Result |
|-----------|----------------|
| LKR 100,000 / 4 months | First: 25,000, Monthly: 25,000 × 3 |
| LKR 77,777 / 3 months | Total equals exactly 77,777 |
| Minimum order (5,000) | Proper first payment calculation |
| Maximum order (500,000) | All installments within limits |
| Weekend due dates | Adjusted to business days |

### Model Verification
| Test | Validation |
|------|------------|
| BNPLOrder creation | All fields saved correctly |
| Installment relationships | Foreign keys working |
| Status constraints | Only valid transitions allowed |
| Data integrity | No orphaned records |
| Audit trails | All changes logged |

### Schedule Verification
| Scenario | Validation |
|----------|------------|
| 3-month plan | 3 installments created |
| 4-month plan | 4 installments created |
| 6-month plan | 6 installments created |
| Due date calculation | 30-day intervals |
| Holiday adjustment | Business day rules applied |

### Webhook Verification
| Provider | Test Cases |
|----------|------------|
| KOKO | Valid signature, payment confirmation |
| MintPay | Valid hash, status updates |
| Both | Error handling, retry logic |
| Security | Invalid signature rejection |
| Idempotency | Duplicate webhook handling |

### Overdue Verification
| Test | Expected Behavior |
|------|------------------|
| Grace period | Proper delay before marking overdue |
| Notifications | Emails and SMS sent correctly |
| Escalation | Admin alerts triggered |
| Provider notification | Webhooks sent to providers |
| Status updates | Overdue status set correctly |

### Reports Verification
| Report | Validation |
|--------|------------|
| Daily Summary | Accurate counts and amounts |
| Weekly Analytics | Trend calculations correct |
| Provider Reports | Provider-specific data |
| Customer Statements | Customer-specific information |
| Risk Analysis | Risk metrics accurate |

### End-to-End Test Scenarios
| Scenario | Steps |
|----------|-------|
| Successful BNPL Order | Create → Schedule → Pay → Complete |
| Partial Payment Failure | Create → Schedule → Fail → Retry → Pay |
| Overdue Management | Create → Schedule → Miss Payment → Overdue → Collect |
| Order Cancellation | Create → Schedule → Cancel → Update Status |
| Provider Webhook | Order → Payment → Webhook → Status Update |

### Performance Verification
| Metric | Target |
|--------|-------|
| Calculator response | < 100ms |
| Schedule generation | < 500ms |
| Webhook processing | < 200ms |
| Report generation | < 5 seconds |
| Database queries | Optimized with indexes |

### Security Verification
| Check | Validation |
|-------|------------|
| Webhook signatures | All validated correctly |
| Data encryption | Sensitive data protected |
| Access controls | Proper authorization |
| Audit logging | All actions logged |
| Input validation | All inputs sanitized |

### Business Rules Verification
| Rule | Test |
|------|-----|
| LKR currency only | Non-LKR amounts rejected |
| Plan restrictions | Only 3/4/6 month plans |
| Amount limits | 5K-500K LKR enforced |
| Provider support | KOKO and MintPay only |
| Zero interest | No interest calculations |

### Expected Outcome
Fully verified BNPL installment management system meeting all requirements for Sri Lankan market deployment.

### Verification Checklist
- [ ] Calculator tests passing
- [ ] Model tests complete
- [ ] Schedule generation verified
- [ ] Webhook processing tested
- [ ] Overdue handling validated
- [ ] Reports accuracy confirmed
- [ ] End-to-end flow working
- [ ] Performance targets met
- [ ] Security checks passed
- [ ] Business rules enforced

---

## Integration Summary

### System Architecture
The complete BNPL installment management system integrates:
- **Calculator Engine**: Accurate payment calculations
- **Data Models**: BNPLOrder and Installment tracking
- **Schedule Manager**: Automated payment scheduling
- **Status Tracking**: Real-time payment status
- **Webhook Handler**: Provider payment confirmations
- **Overdue Management**: Missed payment handling
- **Reporting System**: Business intelligence and analytics

### Provider Integration
| Provider | Integration Points |
|----------|-------------------|
| KOKO | Webhooks, API calls, order management |
| MintPay | Webhooks, payment processing, reporting |

### Customer Experience
- Clear payment breakdown display
- Automated payment reminders
- Flexible payment options
- Responsive customer service

### Business Benefits
- Increased sales through BNPL options
- Reduced payment processing overhead
- Comprehensive risk management
- Data-driven business insights

### Technical Excellence
- Robust error handling
- Comprehensive testing
- Security best practices
- Performance optimization
- Maintainable code architecture

---

## Maintenance and Support

### Monitoring
- Daily health checks on all components
- Performance monitoring and alerting
- Error tracking and resolution
- Provider API status monitoring

### Updates and Maintenance
- Regular security updates
- Provider API version updates
- Business rule adjustments
- Performance optimizations

### Support Procedures
- 24/7 system monitoring
- Provider relationship management
- Customer issue escalation
- Technical documentation maintenance

---

## Future Enhancements

### Potential Features
- Multi-currency support
- Dynamic interest rates
- Advanced risk scoring
- Machine learning predictions
- Mobile app integration
- Blockchain payment verification

### Scalability Considerations
- Database sharding for large volumes
- Microservices architecture
- Cloud deployment options
- International expansion support

---

## Summary

This document completes the BNPL installment management system with:
- Individual installment tracking via Installment model
- Automated payment schedule generation
- Comprehensive status tracking and monitoring
- Reliable webhook processing for provider integration
- Proactive overdue management with escalation
- Comprehensive reporting and business intelligence
- Complete system verification and testing

The system provides a robust, scalable solution for managing BNPL orders in the Sri Lankan market, supporting both KOKO and MintPay providers while maintaining excellent customer experience and business control.