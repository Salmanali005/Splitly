# Splitly - Trip Expense Splitter

A modern, full-stack web application for splitting trip expenses with friends and family. Track shared expenses, split bills, and settle debts effortlessly with a clean black & white theme.

## ✨ Features
- **🔐 Authentication** - Register, login, JWT tokens, remember me
- **✈️ Trip Management** - Create, edit, delete trips with status tracking
- **👥 Members** - Add members, invite via email, role-based permissions
- **💰 Expenses** - Multiple split methods: Equal, Shares (family size), Percentage, Custom
- **📊 Balances** - Real-time balance calculation, simplified debt algorithm
- **🤝 Settlements** - Track payments, mark debts as paid, auto-settle
- **🌓 Dark/Light Mode** - Smooth toggle with persistent preference

## 🚀 Tech Stack
- **Frontend:** React 19, Tailwind CSS, React Router, Axios, Context API
- **Backend:** FastAPI, PostgreSQL, JWT Authentication, bcrypt, Pydantic

## 📁 Project Structure
```
Splitly/
├── backend/
│   ├── database.py, database.sql, main.py, schemas.py, setup_db.py
│   └── services/ (user.py, trip.py, expense.py, split.py, debt.py, invitation.py)
├── frontend/
│   └── src/
│       ├── Components/ (common/, layout/, contexts/)
│       ├── pages/ (Add/, Dashboard, Trips, Members, Balances, Settlements, Invitations, Profile)
│       ├── services/ (api.js)
│       └── App.jsx
└── README.md
```

## 🛠️ Installation

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
```

Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=splitly
DB_USER=postgres
DB_PASSWORD=your_password
SECRET_KEY=your_secret_key_min_32_chars
```

Setup and run:
```bash
python setup_db.py
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000` | API: `http://localhost:8000` | Docs: `http://localhost:8000/docs`

## 🗄️ Database Schema
```sql
users (id, email, name, password_hash, avatar_url, phone, created_at, last_login)
trips (id, name, destination, start_date, end_date, currency, status, created_by, created_at)
members (id, trip_id, user_id, role, joined_at, is_active)
expenses (id, trip_id, paid_by, description, amount, category, date, notes, receipt_url, split_type)
expense_splits (id, expense_id, member_id, share_amount, split_type, split_value)
settlements (id, trip_id, from_member_id, to_member_id, amount, status, settled_at)
invitations (id, trip_id, email, inviter_id, token, status, expires_at)
```

## 📬 API Endpoints

**Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/me`
**Trips:** `GET /api/trips`, `POST /api/trips`, `GET /api/trips/{id}`, `PUT /api/trips/{id}`, `DELETE /api/trips/{id}`
**Expenses:** `GET /api/trips/{id}/expenses`, `POST /api/trips/{id}/expenses`, `GET /api/expenses/{id}`, `PUT /api/expenses/{id}`, `DELETE /api/expenses/{id}`
**Balances:** `GET /api/trips/{id}/balances`, `GET /api/trips/{id}/debts/simplified`
**Settlements:** `POST /api/trips/{id}/settlements`, `GET /api/trips/{id}/settlements`

## 🎯 Key Features Walkthrough

**Create a Trip:** Click "New Trip" → Enter name, destination, dates, currency → Invite members → Start adding expenses.

**Add an Expense:** Open a trip → Click "Add Expense" → Enter description, amount, who paid → Choose split method (Family Size/Equal/Custom) → Review split breakdown → Submit.

**View & Settle Balances:** Dashboard shows total balances → Trip detail shows member-specific balances → Simplified debts show minimum transactions → Click "Settle" to mark debts as paid.

## 🤝 Contributing
1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open Pull Request


## 👤 Author
**Salman Ali** - [GitHub](https://github.com/Salmanali005)

---
