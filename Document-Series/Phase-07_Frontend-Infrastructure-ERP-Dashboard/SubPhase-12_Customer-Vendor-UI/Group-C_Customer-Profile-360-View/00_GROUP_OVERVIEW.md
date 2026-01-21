# Group C: Customer Profile & 360 View

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** C of F  
> **Tasks Covered:** 31-48  
> **Group Goal:** Build complete customer 360 profile with tabs, history, and communication log

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Customer-Listing-Filters](../Group-B_Customer-Listing-Filters/)
- **→ Next Group:** [Group-D_Vendor-Management](../Group-D_Vendor-Management/)

---

## Group Overview

This group creates the complete Customer 360 profile view. Creates customer details page with header section showing name, status, and quick actions. Adds customer avatar (initials or image) and quick stats (orders, spent, last order). Creates tabbed interface with Overview, Orders, Invoices, Communication, and Notes tabs. Builds Overview tab with contact information card and credit information card. Creates Orders tab with order history table. Creates Invoices tab with invoice history. Creates Communication tab with timeline and add entry form. Adds edit customer modal and adjust credit limit modal. Connects to customer API.

### Key Outcomes

- Customer details page component
- Customer header section
- Customer avatar component
- Customer quick stats
- Customer tabs navigation
- Overview tab
- Contact information card
- Credit information card
- Orders tab
- Order history table
- Invoices tab
- Invoice history table
- Communication tab
- Communication timeline
- Add communication entry form
- Edit customer modal
- Adjust credit limit modal
- Connected to customer API

### Technology Context

- **Tabs:** Radix UI tabs
- **Timeline:** Vertical timeline
- **Cards:** Info card layouts
- **Modals:** Dialog components

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-42_Profile-Tabs.md` | Create profile header and tabs | 31-42 |
| 02 | `02_Tasks-43-48_Communication-Modals.md` | Create communication and modals | 43-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create Customer Details Page | Medium | Task 14 |
| 32 | Create Customer Header Section | Medium | Task 31 |
| 33 | Create Customer Avatar | Low | Task 32 |
| 34 | Create Customer Quick Stats | Low | Task 32 |
| 35 | Create Customer Tabs | Low | Task 31 |
| 36 | Create Overview Tab | Low | Task 35 |
| 37 | Create Contact Information Card | Low | Task 36 |
| 38 | Create Credit Information Card | Medium | Task 36 |
| 39 | Create Orders Tab | Low | Task 35 |
| 40 | Create Order History Table | Medium | Task 39 |
| 41 | Create Invoices Tab | Low | Task 35 |
| 42 | Create Invoice History Table | Medium | Task 41 |
| 43 | Create Communication Tab | Low | Task 35 |
| 44 | Create Communication Timeline | Medium | Task 43 |
| 45 | Create Add Communication Entry | Medium | Task 44 |
| 46 | Create Edit Customer Modal | Medium | Task 31 |
| 47 | Create Adjust Credit Limit Modal | Medium | Task 38 |
| 48 | Connect Customer Details to API | Medium | Task 47 |

---

## Execution Order

```
Task 31: Customer Details Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 32: Customer Header                               │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 33    Task 34       │                            │
(Avatar)   (Stats)        │                            │
    │          │          │                            │
    └──────────┘          │                            │
               │          │                            │
               ▼          │                            │
         Task 35: Customer Tabs                        │
               │          │                            │
         ┌─────┼─────┬─────┬─────┬─────┐               │
         ▼     ▼     ▼     ▼     ▼     │               │
      Task 36 Task 39 Task 41 Task 43  │               │
      (Overview)(Orders)(Invoices)(Comm)│               │
         │     │     │     │           │               │
         ├──┬──┘     │     │           │               │
         ▼  ▼        ▼     ▼           │               │
      Task 37 Task 38 Task 40 Task 42  │               │
      (Contact)(Credit)(Table)(Table)  │               │
         │     │     │     │           │               │
         └─────┴─────┴─────┘           │               │
               │                       │               │
               └───────────────────────┘               │
                              │                        │
                              ▼                        │
                        Task 44: Comm Timeline         │
                              │                        │
                              ▼                        │
                        Task 45: Add Entry             │
                              │                        │
               ┌──────────────┴──────────────┐         │
               ▼                             ▼         │
         Task 46: Edit Modal          Task 47: Credit  │
               │                             │         │
               └──────────────┬──────────────┘         │
                              ▼
                        Task 48: API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── crm/
            └── Customers/
                ├── CustomerProfile/
                │   ├── CustomerDetails.tsx
                │   ├── CustomerHeader.tsx
                │   ├── CustomerAvatar.tsx
                │   ├── CustomerQuickStats.tsx
                │   ├── CustomerTabs.tsx
                │   ├── OverviewTab.tsx
                │   ├── ContactInfoCard.tsx
                │   ├── CreditInfoCard.tsx
                │   ├── OrdersTab.tsx
                │   ├── OrderHistoryTable.tsx
                │   ├── InvoicesTab.tsx
                │   ├── InvoiceHistoryTable.tsx
                │   ├── CommunicationTab.tsx
                │   ├── CommunicationTimeline.tsx
                │   ├── AddCommunicationForm.tsx
                │   ├── EditCustomerModal.tsx
                │   ├── AdjustCreditModal.tsx
                │   └── index.ts
                └── index.ts
```

---

## Notes for AI Agents

### Customer Header (Task 32)
| Element | Content |
|---------|---------|
| Avatar | Initials or image |
| Name | Customer full name |
| Status | Active/Inactive badge |
| Actions | Edit, More options |

### Quick Stats (Task 34)
| Stat | Display |
|------|---------|
| Total Spent | ₨ X,XXX,XXX |
| Orders | Count |
| Last Order | Relative date |
| Member Since | Date |

### Customer Tabs (Task 35)
| Tab | Content |
|-----|---------|
| Overview | Key info cards |
| Orders | Order history |
| Invoices | Invoice history |
| Communication | Interaction log |
| Notes | Internal notes |

### Contact Information (Task 37)
| Field | Display |
|-------|---------|
| Phone | +94 XX XXX XXXX |
| Email | Email address |
| Address | Full address |

### Credit Information (Task 38)
| Field | Display |
|-------|---------|
| Credit Limit | ₨ X,XXX |
| Used | ₨ X,XXX |
| Available | ₨ X,XXX |
| Status | Good/Near/Over |

### Order History Columns (Task 40)
| Column | Width |
|--------|-------|
| Order # | 120px |
| Date | 100px |
| Items | 80px |
| Total | 120px |
| Status | 100px |

### Communication Types (Task 44)
| Type | Icon |
|------|------|
| Phone Call | Phone |
| Email | Mail |
| Meeting | Users |
| Note | FileText |

### Add Communication (Task 45)
| Field | Type |
|-------|------|
| Type | Select |
| Subject | Text |
| Notes | Textarea |
| Date | Date picker |

### Credit Limit Modal (Task 47)
| Field | Type |
|-------|------|
| Current | Display |
| New Limit | Number input |
| Reason | Select/Text |
| Approve | Submit |
