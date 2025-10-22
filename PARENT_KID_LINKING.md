# 👨‍👩‍👧 Parent-Kid Linking Feature Guide

## Overview

The Parent-Kid Linking feature allows parents to connect with their children's accounts to monitor their learning progress, view achievements, and track activities.

---

## 🌟 Key Features

### For Kids:
- **Send link requests** to parents via email
- **Approve/reject** incoming requests from parents
- **View pending requests** in real-time
- **Link Parent button** in dashboard header

### For Parents:
- **Send link requests** to kids via email
- **Approve/reject** incoming requests from kids
- **View all linked kids** in one place
- **Monitor kid's progress** with detailed stats:
  - Total stars earned
  - Badges collected
  - Completed lessons
  - Recent activities
  - Learning timeline

---

## 🚀 How to Use

### For Kids (Linking to Parent):

1. **Login** to your kid account
2. Click the **"Link Parent"** button in the dashboard header
3. Enter your **parent's email address**
4. Click **"Send Request"**
5. Wait for parent to approve the request
6. Once approved, your parent can view your progress!

### For Parents (Linking to Kid):

1. **Login** to your parent account
2. Click the **"Link Kid"** button in the dashboard header
3. Enter your **kid's email address**
4. Click **"Send Request"**
5. Wait for kid to approve the request
6. Once approved, you can view their progress!

### Approving Requests:

**When you receive a request:**
1. Open the **Link Modal** (click Link button)
2. You'll see **"Pending Requests"** section
3. Review the request details
4. Click **✓ Approve** or **✗ Reject**

---

## 📊 Viewing Kid's Progress (Parents Only)

Once linked, parents can:

1. Go to **Parent Dashboard**
2. See all **linked kids** displayed as cards
3. Click **"View Progress"** on any kid card
4. See detailed information:
   - **Stats**: Total stars, completed lessons, badges
   - **Recent Progress**: Latest learning activities
   - **Badges Earned**: All achievements
   - **Recent Activities**: Timeline of actions

---

## 🔒 Security & Privacy

- ✅ **Email verification required** - Only valid registered users can link
- ✅ **Two-way approval** - Both parties must approve the link
- ✅ **Role validation** - Kids can only link to parents, parents to kids
- ✅ **Unique links** - One kid can only link to one parent at a time
- ✅ **Revocable** - Links can be removed anytime

---

## 🛠️ Technical Details

### Database Schema

New table: `parent_kid_requests`
```sql
- id: Primary key
- kid_id: Reference to users table
- parent_id: Reference to users table
- status: 'pending', 'approved', 'rejected'
- requested_by: 'kid' or 'parent'
- created_at, updated_at: Timestamps
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parent-kid/request` | Send link request |
| GET | `/api/parent-kid/requests` | Get pending requests |
| POST | `/api/parent-kid/respond/:id` | Approve/reject request |
| GET | `/api/parent-kid/my-kids` | Get linked kids (parents) |
| GET | `/api/parent-kid/kid-progress/:id` | Get kid's progress |
| POST | `/api/parent-kid/unlink/:id` | Unlink kid from parent |

---

## 📝 Example Workflow

### Scenario 1: Kid Initiates Link

1. **Kid** (email: `kid@example.com`) clicks "Link Parent"
2. Enters parent email: `parent@example.com`
3. Request is sent with `requested_by: 'kid'`
4. **Parent** logs in and sees pending request
5. Parent clicks "Approve"
6. Database updates:
   - Request status → `approved`
   - Kid's `parent_id` → Parent's ID
7. Parent can now view kid's progress!

### Scenario 2: Parent Initiates Link

1. **Parent** (email: `parent@example.com`) clicks "Link Kid"
2. Enters kid email: `kid@example.com`
3. Request is sent with `requested_by: 'parent'`
4. **Kid** logs in and sees pending request
5. Kid clicks "Approve"
6. Database updates:
   - Request status → `approved`
   - Kid's `parent_id` → Parent's ID
7. Parent can now view kid's progress!

---

## 🎨 UI Components

### ParentKidLink Component
- Modal for sending and managing link requests
- Shows pending requests with approve/reject buttons
- Email input with validation
- Success/error messages

### KidProgressView Component
- Modal showing detailed kid progress
- Stats cards (stars, badges, completed lessons)
- Recent progress list
- Badges showcase
- Activity timeline

---

## 🐛 Troubleshooting

### "User not found with this email"
- ✅ Make sure the email is registered
- ✅ Check for typos in the email address
- ✅ Ensure the user has the correct role (kid/parent)

### "Link request already exists"
- ✅ Check pending requests - request may already be sent
- ✅ Wait for the other party to respond
- ✅ If stuck, contact support to clear old requests

### "Already linked to this parent"
- ✅ The kid is already linked to this parent
- ✅ No action needed - progress is already shared

### Can't see kid's progress
- ✅ Ensure the link request was approved
- ✅ Refresh the page
- ✅ Check that you're logged in as a parent
- ✅ Verify the kid has some activity/progress

---

## 🔄 Database Migration

To add the new table to your existing database:

1. Go to **Neon Dashboard** → **SQL Editor**
2. Run the following SQL:

```sql
-- Parent-Kid link requests table
CREATE TABLE IF NOT EXISTS parent_kid_requests (
  id SERIAL PRIMARY KEY,
  kid_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  requested_by VARCHAR(20) NOT NULL CHECK (requested_by IN ('kid', 'parent')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(kid_id, parent_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_kid_requests_kid ON parent_kid_requests(kid_id);
CREATE INDEX IF NOT EXISTS idx_parent_kid_requests_parent ON parent_kid_requests(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_kid_requests_status ON parent_kid_requests(status);
```

3. Click **"Run"**
4. Restart your server: `npm run dev`

---

## ✨ Benefits

### For Parents:
- 📊 **Real-time monitoring** of kid's learning
- 🎯 **Track progress** and identify areas needing help
- 🏆 **Celebrate achievements** together
- 📈 **View learning trends** over time

### For Kids:
- 🌟 **Share achievements** with parents
- 💪 **Get motivated** by parental support
- 🎉 **Celebrate milestones** together
- 🔒 **Control privacy** with approval system

---

## 🎉 Success!

The Parent-Kid Linking feature is now fully integrated into Kid Quest Adventures!

Parents and kids can now connect, share progress, and celebrate learning achievements together! 🚀📚✨
