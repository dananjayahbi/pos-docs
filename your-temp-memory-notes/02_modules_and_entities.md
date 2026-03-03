# LCC — Modules and Data Entities

## ERP Modules Map

### Starter Plan (All Tenants)
- Products (simple, variable, bundle, composite)
- Inventory (single warehouse)
- POS Terminal (basic)
- Orders & Sales
- Invoicing
- Customers (basic)
- Dashboard KPIs

### Growth Plan +
- Vendors / Suppliers
- Purchase Orders + GRN + Bills
- Customer Credit Limits + Store Credit
- HR: Employees, Departments, Attendance, Leave
- Payroll (EPF/ETF/PAYE)
- Accounting (Chart of Accounts, Journals, Bank Reconciliation)
- Financial Reports (P&L, Balance Sheet, Cash Flow)
- Custom Domain

### Enterprise Plan +
- Multi-Warehouse Inventory
- Stock Transfers between warehouses
- Customer Groups + Loyalty Points
- Dual POS Screen
- Advanced POS Offline mode
- API Access
- Remove LCC Branding
- AI Features

---

## Database Entities

### Public Schema
| Entity | Key Fields |
|--------|-----------|
| Tenant | id, name, schema_name, plan_id, is_active, created_at |
| Domain | domain, tenant_id, is_primary, is_custom |
| SubscriptionPlan | name (Starter/Growth/Enterprise), price_lkr, features (JSON), user_limit, product_limit |
| PlatformUser | Super admin accounts |
| FeatureFlag | Per-plan/per-tenant toggle |

### Tenant Schema

#### Products
| Entity | Key Fields |
|--------|-----------|
| Category | id, name, slug, parent_id (MPTT hierarchical), image, is_active, display_order, seo_title |
| AttributeGroup | name, type (text/number/select/multi-select/boolean) |
| Attribute | name, group, is_filterable, is_searchable |
| Product | id, name, slug, sku, barcode (EAN-13/UPC), description, short_description, category_id, brand, product_type (simple/variable/bundle/composite), status (draft/active/archived), is_webstore_visible, is_pos_visible, tax_class, unit_of_measure |
| ProductVariant | parent_product, sku, barcode, attributes (JSONB: {Size: M, Color: Red}), price, stock_qty, image |
| BundleItem | bundle_product, component_product, quantity |
| CompositeRecipe (BOM) | output_product, ingredient_product, quantity, unit |
| ProductPrice | product/variant, price_type (base/sale/cost/wholesale), amount (LKR), is_tax_inclusive |
| ProductTieredPrice | product, min_qty, max_qty, price_per_unit |
| ProductMedia | product/variant, image, alt_text, is_primary, order; sizes: thumb(150×150), medium(500×500), large(1000×1000) |

#### Inventory
| Entity | Key Fields |
|--------|-----------|
| Warehouse | id, name, code, address, is_default, is_active |
| StorageLocation | warehouse, name (e.g. "Aisle A Shelf 3"), barcode |
| StockLevel | product/variant, warehouse, quantity, reserved_quantity |
| StockMovement | product/variant, from_warehouse, to_warehouse, quantity, movement_type (stock_in/stock_out/transfer/adjustment/stock_take/damage/write_off), reference, timestamp |
| ProductStockConfig | product, warehouse, low_stock_threshold (default 10), reorder_point (default 20), reorder_quantity (default 50) |

#### Sales & POS
| Entity | Key Fields |
|--------|-----------|
| POSSession | id, terminal, cashier, opened_at, closed_at, opening_cash, closing_cash, status (open/closed) |
| POSSale | session, customer (nullable), items (JSON), payment_method, total, discount, is_offline_sync, synced_at |
| Quote | quote_number, customer, items[], valid_until, status (draft/sent/accepted/rejected/expired/converted) |
| Order | order_number, source (pos/webstore/manual/whatsapp), customer, items[], status (pending/confirmed/processing/shipped/delivered/completed/returned/cancelled), fulfillment_type (pickup/delivery), shipping_address |
| Invoice | invoice_number, order, customer, type (standard/svat/credit_note/debit_note), brn, vat_reg_number, items[], subtotal, tax_breakdown, total (LKR), status (draft/issued/partially_paid/paid/overdue/void), payment_terms (COD/Net15/Net30) |
| Payment | invoice, amount (LKR), method (cash/card_visa/card_master/bank_transfer/mobile_frimi/cheque/store_credit/split), status (recorded/reversed), receipt_number, timestamp |
| Receipt | Printable header: business name, logo, address; items; totals; format: 58mm/80mm/PDF/email |
| CreditNote | invoice, reason, amount, issued_at |
| DeliveryNote | order, items, courier, waybill_number, dispatched_at |
| PaymentLink | order, token, amount, expires_at, is_used |

#### Customers
| Entity | Key Fields |
|--------|-----------|
| Customer | id, first_name, last_name, email, phone (+94), address (province/district/city), customer_type (individual/business), business_name, tax_id, notes, tags[], credit_limit, credit_used, loyalty_points, store_credit_balance, customer_since, total_orders, total_spent, avg_order_value |
| CustomerAddress | customer, type (billing/shipping), address_line1, city, district, province |
| CustomerGroup | name, pricing_rule, customers[] |
| LoyaltyTier | name, min_points, discount_rate, benefits[] |

#### Vendors
| Entity | Key Fields |
|--------|-----------|
| Vendor | id, company_name, contact_person, email, phone, address, payment_terms, currency, tax_id, bank_details, lead_time (days) |
| PurchaseOrder | po_number, vendor, items[], expected_delivery_date, status (draft/sent/acknowledged/partially_received/fully_received/billed/cancelled) |
| GoodsReceiptNote (GRN) | purchase_order, received_by, received_at, items[] (received qty per line) |
| VendorBill | bill_number, vendor, purchase_order, items[], total (LKR), due_date, status (pending/partially_paid/paid/overdue) |
| VendorPayment | bill, amount, method, payment_date |

#### HR
| Entity | Key Fields |
|--------|-----------|
| Department | name, code, parent (self-ref), manager |
| Designation | title, level, department |
| Employee | employee_id (auto), user (FK optional), first_name, last_name, email, phone, nic_number, dob, gender, address, emergency_contact, department, designation, manager, hire_date, employment_type (full-time/part-time/contract), status (active/inactive/terminated) |
| AttendanceRecord | employee, date, clock_in, clock_out, status (present/absent/late/half-day), work_hours, overtime_hours |
| LeaveType | Annual, Casual, Sick, Maternity/Paternity, No-Pay |
| LeaveRequest | employee, leave_type, start_date, end_date, reason, status (pending/approved/rejected) |
| SalaryStructure | earnings (basic, allowances[], overtime, bonus, commission), deductions (epf_employee 8%, loan, advance, no_pay), employer_costs (epf_employer 12%, etf 3%) |
| PayrollRun | period (month/year), employees[], status (draft/processing/approved/paid/reversed) |
| Payslip | employee, payroll_run, earnings_breakdown, deductions_breakdown, net_pay, ytd_totals |

#### Accounting
| Entity | Key Fields |
|--------|-----------|
| Account | code (1000–5999), name, type (asset/liability/equity/revenue/expense), parent, is_active |
| JournalEntry | entry_number, date, description, type (manual/auto/adjusting/reversing), lines[] (account/debit/credit), status (draft/posted/reversed) |
| BankReconciliation | bank_account, statement_date, opening_balance, closing_balance, matched_transactions[], unmatched_transactions[], status (in_progress/completed) |

#### Webstore
| Entity | Key Fields |
|--------|-----------|
| WebstoreOrder | Links ERP Order + shipping_address, courier_id, waybill_no, tracking_status |
| Cart | session_id/customer_id, items (JSON), coupon_id, created_at |
| WebstoreCustomer | Webstore login, maps to ERP Customer |
| Wishlist | customer_id, product_ids[] |
| Coupon | code, type (percent/fixed), value, min_order, max_uses, expiry, uses_count |
| BlogPost | title, slug, content, author, published_at, seo_meta (JSON) |
| StaticPage | title, slug, content |
| ShippingZone | name, provinces[], districts[], flat_rate, free_above_amount |
| ThemeSettings | primary_color, font_family, logo_url, banner_images, custom_css |

#### Integrations
| Entity | Key Fields |
|--------|-----------|
| PaymentGatewayConfig | gateway (payhere/webxpay/koko/mintpay/etc), merchant_id, api_key, secret, is_active |
| CourierConfig | courier (koombiyo/domex/promptx), api_key, is_active, cod_enabled |
| WhatsAppConfig | phone_number_id, access_token, is_active, opt_in_enabled |
| SMSConfig | provider (dialog/notifylk/textit), api_key, sender_id |
