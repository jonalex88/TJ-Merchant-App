# Transpector App – Visual Screen Guide

## Screen 1: Sign In

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│                                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🔒 TRANSPECTOR        │   │
│  │  Merchant Portal       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Username                │   │
│  │ [_________________]     │   │
│  │                         │   │
│  │ Password                │   │
│  │ [_________________]  👁 │   │
│  │                         │   │
│  │ ☐ Remember me          │   │
│  │                         │   │
│  │ [  SIGN IN  ]           │   │
│  │                         │   │
│  │ Terms & Privacy Policy  │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## Screen 2: Setup Wizard – Step 1 (Select Stores)

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│ < Setup Wizard              1/3 │
├─────────────────────────────────┤
│ ▓▓░░░░ Progress             │   │
│                             │   │
│ Select Stores               │   │
│ Choose which stores you     │   │
│ want to manage              │   │
│                             │   │
│ ┌─────────────────────────┐ │   │
│ │ ☑ The Corner Shop       │ │   │
│ │   Cape Town STR-00441   │ │   │
│ └─────────────────────────┘ │   │
│                             │   │
│ ┌─────────────────────────┐ │   │
│ │ ☑ Harbour Point         │ │   │
│ │   V&A STR-00442         │ │   │
│ └─────────────────────────┘ │   │
│                             │   │
│ ┌─────────────────────────┐ │   │
│ │ ☐ Stellenbosch Flagship │ │   │
│ │   STR-00443             │ │   │
│ └─────────────────────────┘ │   │
│                             │   │
│ ———————————────────— │   │
│ [  SKIP  ]  [  NEXT  →  ]   │   │
└─────────────────────────────────┘
```

---

## Screen 3: Dashboard – Top Section

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│ 🏠 💳 🖥️ ⚙️                       │ ← Bottom nav (🏠 active)
├─────────────────────────────────┤
│                                 │
│ Good morning, Sarah 👋          │
│ Here's your overview            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📅 Date & Time Range        │ │
│ │ From: Today, 14:00          │ │
│ │ To: Today, 15:00            │ │
│ │ Window: [10s][1m][5m]       │ │
│ │         [1h] [1d]           │ │
│ │ (Set to 1 hour ago)         │ │
│ └─────────────────────────────┘ │
│                                 │
│ 🔄 Last updated 2m ago [Refresh]│
│                                 │
└─────────────────────────────────┘
```

---

## Screen 4: Dashboard – KPI Cards

```
┌─────────────────────────────────┐
│                                 │
│ ┌──────────────┬──────────────┐ │
│ │ Total Sales  │ Transactions │ │
│ │ R 84,320.00  │     247      │ │
│ │ ▲ +12.5%     │ today        │ │
│ └──────────────┴──────────────┘ │
│                                 │
│ ┌──────────────┬──────────────┐ │
│ │ Approval     │ Declined     │ │
│ │ 96.2% ◯      │     9        │ │
│ │       ◉      │ needs att... │ │
│ └──────────────┴──────────────┘ │
│                                 │
│ SALES BY STORE                  │
│ ┌─────────────────────────────┐ │
│ │ Corner         ████████ R.. │ │
│ │ Harbour        ██████ R..   │ │
│ │ Stellenbosch   ████ R..     │ │
│ └─────────────────────────────┘ │
│                                 │
│ RECENT TRANSACTIONS             │
│ ┌─────────────────────────────┐ │
│ │ 🔵 Corner Shop      R 1,234  │ │
│ │ Purchase · 14:32    [✓Appr]  │ │
│ │                             │ │
│ │ 🟢 Harbour Point    R 89.00  │ │
│ │ Purchase · 14:12    [✗Decl]  │ │
│ └─────────────────────────────┘ │
│ See all →                       │
└─────────────────────────────────┘
```

---

## Screen 5: Transactions – Search & Filters

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│ 🏠 💳 🖥️ ⚙️  (💳 active - blue)   │
├─────────────────────────────────┤
│ 🔍 Search transactions...       │ ← Search changes after 3 chars
│                                 │
│ [All][Approved][Declined]       │
│ [Purchase][Refund]              │
│              ▼ sticky filters   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔵 Corner Shop              │ │
│ │ Purchase · •••• 4521        │ │
│ │ R 1,234.56        [✓Approved]│ │
│ │ ▼                           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ ← Expands
│ │ Transaction ID: TXN-10001   │ │    onclick
│ │ Terminal ID: TID-00104      │ │
│ │ Store ID: STR-00441         │ │
│ │ Card: Visa                  │ │
│ │ Auth: A12345                │ │
│ │ Time: 2024-01-15 09:45:00   │ │
│ │ [📋 Copy Transaction ID]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ Loading more... (infinite scroll)
│                                 │
└─────────────────────────────────┘
```

---

## Screen 6: Terminals – List View

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│ 🏠 💳 🖥️ ⚙️  (🖥️ active - blue)   │
├─────────────────────────────────┤
│ Payment Terminals               │
│                                 │
│ Sorted by last activity         │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🟢 TID-00106     [Most Active]│
│ │ Harbour Point               │ │
│ │ 12 min ago      [🔔]  ▼     │ │
│ │ ▮▮▮▮▮▮▮▮▮░░░▒ (85% active)  │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🟢 TID-00105               │ │
│ │ Stellenbosch               │ │
│ │ 3 hours ago     [🔔]  ▼    │ │
│ │ ▮▮░░░░░ (activity bar)     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ ← Expanded
│ │ 🟡 TID-00104               │ │    view
│ │ Corner Shop                │ │
│ │ 1 day ago       [🔔]  ▲    │ │
│ │ Last Amount: R 780.00      │ │
│ │ Last Type: Purchase        │ │
│ │ Store: Corner Shop         │ │
│ │ 7-day activity:            │ │
│ │ ▮ ▮▮ ▮ ▮▮▮ ▮▮ ▮▮▮ ▮     │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## Screen 7: Settings – Overview

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│ 🏠 💳 🖥️ ⚙️  (⚙️ active - blue)   │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ SM │ Sarah Mitchell          │ │ ← Tap to edit
│ │    │ sarah@transpector...   │ │
│ │    └────────────────────────│ │
│ └─────────────────────────────┘ │
│                                 │
│ YOUR STORES                     │
│ ┌─────────────────────────────┐ │
│ │ 🔧 Manage Stores            │ │
│ │ 2 stores selected           │ │
│ └─────────────────────────────┘ │
│                                 │
│ STORE NAMES                     │
│ ┌─────────────────────────────┐ │
│ │ Corner Shop      ✏️          │ │
│ │ STR-00441                   │ │
│ │ Harbour Point    ✏️          │ │
│ │ STR-00442                   │ │
│ └─────────────────────────────┘ │
│                                 │
│ APP PREFERENCES                 │
│ ┌─────────────────────────────┐ │
│ │ 🌙 Dark Mode        [OFF   ]│ │
│ │ 🔔 Notifications     >       │ │
│ │ 🔄 Sync: 1 hour    [●──────]│ │
│ │ 📅 Date Range: This Week     │ │
│ └─────────────────────────────┘ │
│                                 │
│ SECURITY                        │
│ ┌─────────────────────────────┐ │
│ │ 🔐 Biometrics      [ON    ]│ │
│ │ 🔑 Change PIN        >       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ACCOUNT                         │
│ ┌─────────────────────────────┐ │
│ │ ❓ Help & Support   >        │ │
│ │ 📄 Privacy Policy   >        │ │
│ │ 🚪 Sign Out (RED)           │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## Screen 8: Edit Profile

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│ < Edit Profile                  │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📖 TJ Account ID            │ │
│ │ TJ-4821-9471 (read-only)    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 👤 Full Name                │ │
│ │ [Sarah Mitchell_________]   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ✉️  Email Address            │ │
│ │ [sarah@transpector..._____] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ☎️ Contact Number            │ │
│ │ [+27 (0)21 555 0123_______] │ │
│ └─────────────────────────────┘ │
│                                 │
│              (scroll down)      │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [ SAVE CHANGES ]            │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## Screen 9: Store Manager (Modal)

```
┌─────────────────────────────────┐
│           9:41                  │
├─────────────────────────────────┤
│ < Select Stores                 │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ☑ The Corner Shop           │ │
│ │   Cape Town STR-00441       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ☑ Harbour Point             │ │
│ │   V&A STR-00442             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ☐ Stellenbosch Flagship     │ │
│ │   STR-00443                 │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## Screen 10: Offline Banner

```
┌─────────────────────────────────┐
│ 🔌 No Internet Connection        │  Red banner
│ Please check your network │  at top
├─────────────────────────────────┤
│          [Faded Content Below]   │
│                                 │
│ (App shows this and disables     │
│  most interactive features)      │
│                                 │
└─────────────────────────────────┘
```

---

## Color Legend

- 🟢 **Active/Success** – Teal/Green (used today)
- 🟡 **Recent** – Amber/Yellow (used yesterday)
- 🔴 **Dormant/Error** – Gray (not used in 2+ days)
- 🔵 **Accent/Active Tab** – Light Blue
- ⚪ **Inactive** – Gray/Muted

---

## Interactive Elements

| Element | Interaction |
|---------|-------------|
| KPI Cards | Tap to view details |
| Store Avatar | Shows store initials in colored circle |
| Chevron ▼ | Tap to expand details |
| Pencil ✏️ | Tap to edit/rename |
| Badges | Color-coded status (Approved/Declined) |
| Toggle Switches | Slide left/right |
| Sliders | Drag to adjust (Sync Frequency) |
| Pull-to-Refresh | Drag down on list to refresh |

---

## Animation Notes

✨ **Screen Transitions:**
- Dashboard → Transactions: Slide right with fade
- Transactions → Dashboard: Slide left with fade
- Setup Wizard Steps: Scale up + fade in

✨ **Card Animations:**
- Dashboard KPI cards: Cascade down staggered
- Transactions: Slide up from bottom
- Profile edits: Pulse confirmation on save

✨ **Loading States:**
- Skeleton loaders on first load
- Shimmer effect while fetching data
- Rotating refresh icon when updating

---

## Device Specifications

- **Screen Size:** 390 × 844 px (Android mobile)
- **Safe Area:** Accounts for notch & home indicator
- **Bottom Navigation:** Always visible except during modals
- **Status Bar:** Shows time (9:41) and signal indicators

---

End of Visual Guide
