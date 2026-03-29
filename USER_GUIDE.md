# Transpector Merchant Dashboard – User Guide

## Quick Start

Welcome to the Transpector Merchant Portal! This guide will walk you through all key features.

---

## 1. Sign In

**Screen: Login Page**
- Empty state with Transpector logo and tagline "Merchant Portal"
- Two input fields: **Username** and **Password**
- "Remember me" checkbox (optional – enables auto-signin on next visit)
- Blue **Sign In** button

**How to Sign In:**
1. Enter your merchant username
2. Enter your password
3. (Optional) Check "Remember me" to stay logged in on this device
4. Tap **Sign In**
5. If credentials are valid, you'll proceed to the Setup Wizard

---

## 2. Setup Wizard (First Login Only)

The setup wizard runs on your first login. All steps are optional (can skip).

### Step 1: Select Stores

**What You See:**
- Progress bar (1/3)
- List of all available stores as checkboxes
- Each store shows: store name, location, store ID

**What to Do:**
- ✓ Check the stores you want to manage
- You must select at least one store to proceed
- Tap **Next** to continue

**Example Stores:**
- The Corner Shop (Cape Town) – STR-00441
- Harbour Point (V&A Waterfront) – STR-00442
- Stellenbosch Flagship – STR-00443

---

### Step 2: Rename Stores (Optional)

**What You See:**
- Progress bar (2/3)
- Text input for each selected store
- Default names pre-filled

**What to Do:**
- Optionally rename each store (e.g., "Shop 1" → "Main Location")
- Tap **Next** to continue or **Skip** to use default names

---

### Step 3: Set PIN (Optional)

**What You See:**
- Progress bar (3/3)
- PIN input (4+ digits)
- PIN confirmation input
- "Set to 1 hour ago" quick button for testing

**What to Do:**
- Enter a 4-digit PIN in both fields
- OR tap **Skip** to skip PIN setup
- Tap **Get Started** to complete setup

**You're Now in the App!**

---

## 3. Dashboard

**Main Overview Screen – Shows your business metrics**

### Top Section: Greeting & Date/Time Picker
- "Good morning/afternoon/evening, [Your Name] 👋"
- "Here's your overview"

### Date & Time Range Selector
- **From Date/Time:** Tap to select starting date and time (default: 1 hour ago)
- **Window:** Quick buttons for time ranges:
  - 10s (10 seconds)
  - 1m (1 minute)
  - 5m (5 minutes)
  - 1h (1 hour) ← default
  - 1d (1 day)

**Example:** If you select "Today at 2:00 PM" with "1h" window, you'll see data from 2:00 PM to 3:00 PM.

### Last Updated Badge
- Shows "Last updated X hours/minutes ago"
- Blue **Refresh** button to manually update data

---

### KPI Cards (Metrics)

Four cards appear animating in:

| Card | Shows | Example |
|------|-------|---------|
| **Total Sales** | Revenue for period | R 84,320.00 (+12.5%) |
| **Transactions** | Transaction count | 247 |
| **Approval Rate** | % of approved txns | 96.2% (circle graph) |
| **Declined** | Failed transactions | 9 (needs attention) |

---

### Sales by Store (Bar Chart)
- Shows breakdown across your selected stores
- Visual bar chart with sales amounts
- Colors: accent green for active bars

**Example:**
```
The Corner Shop   ████████████ R 34,500
Harbour Point     ██████████ R 28,200  
Stellenbosch      ████████ R 21,620
```

---

### Recent Transactions
- Shows 5 most recent transactions
- Each row shows:
  - Store avatar (initials) + store name
  - Transaction time
  - Amount (R ZAR format)
  - Status badge (Approved/Declined/Pending)
- Blue "See all →" link to view full transactions list

---

## 4. Transactions

**Full Transaction History with Search & Filters**

### Search Bar
- Icon: 🔍 Search icon
- Placeholder: "Search transactions..."
- Activates after typing 3+ characters
- Searches store names and card masking (masked PAN)

**Example Search:**
- Type "Corner" → shows Corner Shop transactions
- Type "•••• 4521" → shows transactions with that card

---

### Filter Chips (Horizontal Scroll)
Quick filter buttons:
- **All** (default – shows everything)
- **Approved** (only successful transactions)
- **Declined** (only failed transactions)
- **Purchase** (all purchase types)
- **Refund** (refund transactions)

---

### Transaction List
Each transaction card shows:

```
┌─ Store Avatar + Name ─────────────────┐
│  The Corner Shop                      │
│  Purchase · •••• 4521                 │
│                                       │
│  Transaction Amount    Status Badge   │
│  R 1,234.56           [✓ Approved]   │
└───────────────────────────────────────┘
```

**How to Expand:**
- Tap any transaction to reveal full details:
  - Transaction ID (with copy button)
  - Terminal ID
  - Store ID
  - Card Scheme
  - Auth Code
  - Full timestamp

---

### Infinite Scroll
- As you scroll down, more transactions load automatically
- Loading indicator shows "Fetching more..."
- Pulls data in batches (20 transactions per load)

---

## 5. Terminals

**Monitor Your Payment Terminals**

### Filter by Store
- Dropdown showing selected stores
- Shows count: "Store (3)"
- Tap to add/remove stores from view

---

### Terminal List
Each terminal card shows:

```
┌─ Status Dot ─ Terminal ID ─────┐
│ 🟢 TID-00106        [Most Active]│
│ Harbour Point                    │
│                                  │
│ 3 hours ago     [🔔 0]  ▼       │
│ ▮▮▮▮▮▮▮▮▮░░░ (activity bar)    │
└──────────────────────────────────┘
```

**Status Indicators:**
- 🟢 **Active** = Used today
- 🟡 **Recent** = Used yesterday
- ⚪ **Dormant** = Not used in 2+ days

**Last Used:**
- Shows "12 min ago", "3 hours ago", "5 days ago"

**Notification Bell:**
- 🔔 Blue = notifications ON
- 🔕 Muted = notifications OFF
- Tap to toggle

---

### Expand Terminal Details
Tap chevron ▼ to see:
- Last Amount
- Last Type (Purchase/Refund)
- Store Name
- 7-day activity chart (mini bar graph)

---

### Terminal Sorting
- Automatically sorted by most recent use
- Most active terminals appear first

---

## 6. Settings

**Manage Your Account & Preferences**

### Profile Section (Top)
```
┌─────────────────────────────┐
│ SM │ Sarah Mitchell          │
│    │ sarah@transpector.co.za │
│    └──────────────────────────┘
```
- Tap to edit your profile (see below)

---

### Your Stores
- Shows count of selected stores
- Tap **Manage Stores** to add/remove stores
- Lists all selected stores by name with rename pencil icon ✏️

**How to Rename a Store:**
1. Tap the pencil icon next to any store
2. Bottom sheet slide up with text field
3. Edit the name
4. Tap **Save**

---

### App Preferences
- 🌙 **Dark Mode** – Toggle on/off
- 🔔 **Notifications** – Tap to configure alerts
- 🔄 **Sync Frequency** – Slider: 5 min / 1 hour / 1 day / Never
- 📅 **Default Date Range** – Shows "This Week"

---

### Security
- 🔐 **Biometric Login** – Toggle to enable fingerprint/face login
- 🔑 **Change PIN** – Tap to change your PIN

---

### Account
- ❓ **Help & Support** – Tap for support
- 📄 **Privacy Policy** – Tap to view
- 🚪 **Sign Out** – Red text, tap to logout

---

## 7. Edit Profile

**Update Your Personal Information**

Accessible from Settings > tap profile card

**Fields:**
- **TJ Account ID** – Read-only (e.g., TJ-4821-9471)
- **Full Name** – Editable
- **Email Address** – Editable
- **Contact Number** – Editable

**How to Update:**
1. Tap Settings tab
2. Tap your profile card at top
3. Edit desired fields
4. Tap **Save Changes**
5. Toast notification confirms: "Profile updated ✓"

---

## 8. Offline Mode

**When Internet is Unavailable:**

A banner appears at the top:
```
┌────────────────────────────┐
│ 🔌 No Internet Connection  │
│ Please check your network  │
└────────────────────────────┘
```

- Most features are disabled
- Tap to dismiss banner (it reappears)
- Reconnect internet to resume

---

## 9. Bottom Navigation

Four buttons always accessible:

| Icon | Screen | Purpose |
|------|--------|---------|
| 🏠 **Dashboard** | Overview | View KPIs and recent activity |
| 💳 **Transactions** | Full list | Search, filter, view all transactions |
| 🖥️ **Terminals** | Device status | Monitor payment terminals |
| ⚙️ **Settings** | Account | Manage profile, stores, preferences |

- Current screen shows in **blue accent color**
- Tap any icon to navigate
- Smooth slide/fade animation between screens

---

## 10. Security & Session Management

### Session Timeout
- **Inactive for 10 hours?** You'll be automatically logged out
- App will take you back to login screen
- If "Remember me" was checked, you can auto-signin

### Remember Me
- Checkbox on login screen
- If checked, your username is saved
- Next visit automatically logs you in
- To forget device: Sign Out → uncheck "Remember me"

### PIN Setup
- Optional during setup wizard
- Can create/change in Settings > Change PIN

---

## 11. Quick Tips & Tricks

✅ **Use Date/Time Picker** to compare periods:
- Select "Yesterday at 9:00 AM" with "1d" window to see entire previous day
- Select "Today at 2:00 PM" with "1h" to see last hour

✅ **Search Before Filtering:**
- Type 3+ characters in search bar for instant results

✅ **Rename Stores Meaningfully:**
- Use clear names like "Downtown Main" or "Airport Kiosk" for easy identification

✅ **Check Terminal Status:**
- Red (Dormant) terminals may need attention
- Green (Active) terminals are healthy

✅ **Pull to Refresh:**
- Many screens support pull-down to manually refresh data

✅ **Analytics Tracking:**
- Your activities are tracked for insights
- No personal data is shared

---

## 12. Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't log in | Verify username/password are correct |
| Stuck on setup wizard | Ensure you've selected at least 1 store to proceed |
| No transactions showing | Check your date/time range and store filters |
| Terminal list empty | Verify store is selected in filter dropdown |
| Profile won't save | Check internet connection |
| App shows "No Internet" | Reconnect WiFi or cellular data |

---

## Contact & Support

- **Help & Support:** Tap Settings > Help & Support
- **Email:** support@transpector.co.za
- **Website:** www.transpector.co.za

---

**Last Updated:** March 2026  
**Version:** 1.0.0
