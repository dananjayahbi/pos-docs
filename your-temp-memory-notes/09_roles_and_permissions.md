# LCC — Roles, Permissions & Plan Gating

## Role Hierarchy
```
Super Admin (Platform Owner — LCC)
    └── Tenant Admin (Business Owner)
            └── Manager (Department Head)
                    └── Staff / Cashier (Employee)
                            └── Customer (Webstore User / Guest)
```

## Role Permission Matrix
| Permission | Super Admin | Tenant Admin | Manager | Staff/Cashier | Customer |
|-----------|-------------|-------------|---------|--------------|----------|
| Platform-wide config | ✅ | ❌ | ❌ | ❌ | ❌ |
| All tenant data | ✅ | ❌ | ❌ | ❌ | ❌ |
| Subscription/billing | ✅ | ❌ | ❌ | ❌ | ❌ |
| Own tenant ERP full | N/A | ✅ | Limited | Limited | ❌ |
| Staff management | N/A | ✅ | ❌ | ❌ | ❌ |
| Product management | N/A | ✅ | ✅ | View only | View store |
| Inventory management | N/A | ✅ | ✅ | Limited | ❌ |
| POS operations | N/A | ✅ | ✅ | ✅ | ❌ |
| Process orders | N/A | ✅ | ✅ | ✅ | Own only |
| Financial reports | N/A | ✅ | Limited | ❌ | ❌ |
| HR / Payroll | N/A | ✅ | Limited | Self only | ❌ |
| Webstore settings | N/A | ✅ | Limited | ❌ | ❌ |
| Custom domain | N/A | ✅ | ❌ | ❌ | ❌ |
| View own orders | N/A | N/A | N/A | N/A | ✅ |
| Checkout/purchase | N/A | N/A | N/A | N/A | ✅ |

## Subscription Plan Feature Gating (UI must gate these)
| Feature | Starter | Growth | Enterprise |
|---------|---------|--------|------------|
| Users | 1 | 5 | Unlimited |
| Products | 100 max | Unlimited | Unlimited |
| POS | Basic (online only) | Advanced | Full + Offline + Dual Screen |
| Inventory | Basic (single WH) | Advanced + Bundles/Composite | Multi-Warehouse |
| Accounting | ❌ | ✅ | Full Suite |
| HR/Payroll | ❌ | ✅ | ✅ |
| Vendors module | ❌ | Basic | Full |
| Customer segments | Basic | + Credit limits | + Groups + Loyalty |
| Reports | Basic | Standard | Custom + Export |
| API Access | ❌ | ❌ | ✅ |
| Custom Domain | ❌ | ✅ | ✅ |
| Remove LCC Branding | ❌ | ❌ | ✅ |
| AI Features | ❌ | ❌ | ✅ |

## Plan-Gated UI Behavior
- Locked feature: Show with padlock icon + "Upgrade to [Plan]" tooltip
- Product limit reached: Banner "You've reached your 100-product limit. Upgrade to Growth."
- User limit: "Add more users with Growth plan"
- On upgrade CTA click: redirect to `/settings/billing`

## Available Permissions (RBAC — Granular)
Per module:
- `view`, `create`, `edit`, `delete`, `export`

Modules:
- products
- inventory
- inventory.adjust
- inventory.transfer
- orders
- invoices
- quotes
- payments
- customers
- vendors
- purchase_orders
- vendor_bills
- hr.employees
- hr.attendance
- hr.leave
- hr.payroll
- accounting
- reports
- settings
- webstore_settings
- pos

## Settings → Roles Page (Permission Matrix UI)
```
ROLE: Manager
INHERIT FROM: Staff ▼

───────────────────────────────────────────────
MODULE      | View | Create | Edit | Delete | Export
Products    |  ✅  |   ✅   |  ✅  |   ❌   |  ✅
Inventory   |  ✅  |   ✅   |  ✅  |   ❌   |  ✅
Orders      |  ✅  |   ✅   |  ✅  |   ❌   |  ✅
Invoices    |  ✅  |   ✅   |  ✅  |   ❌   |  ✅
Customers   |  ✅  |   ✅   |  ✅  |   ❌   |  ✅
Vendors     |  ✅  |   ✅   |  ✅  |   ❌   |  ❌
HR          |  ✅  |   ❌   |  ❌  |   ❌   |  ❌
Accounting  |  ✅  |   ❌   |  ❌  |   ❌   |  ❌
Reports     |  ✅  |   ❌   |  ❌  |   ❌   |  ✅
Settings    |  ❌  |   ❌   |  ❌  |   ❌   |  ❌
[Save Changes]
```

## User Invite Flow (Settings → Users)
1. Admin enters email address
2. Selects role from dropdown (Admin / Manager / Staff / Cashier)
3. Optionally customizes granular permissions
4. Clicks [Send Invite]
5. Invitee receives email with set-password link
6. After password set → can log in → sees role-gated UI
