# 🧩 Taskoria  
A modern, enterprise-grade project management platform built with **Django**, **Django REST Framework**, **Channels**, **Celery**, **Redis**, and **PostgreSQL** — with AWS integration planned.

Taskoria includes:

- Project management  
- Task management  
- Role-based access control (RBAC)  
- Comments, attachments  
- Email notifications + real-time notifications  
- Background jobs + scheduled tasks  
- WebSocket notification system  
- Production-ready architecture  

---

## 🚀 Features

### **Phase 1 – Foundations**
- Django project structure with `base / development / production` settings  
- Custom User model with roles: **admin, manager, member**  
- PostgreSQL integration  
- Docker & docker-compose setup  
- Pre-commit hooks (Black, isort, flake8)  
- GitHub CI workflows  
- App structure: `users`, `projects`, `tasks`, `comments`, `attachments`, `notifications`

---

### **Phase 2 – Authentication & Authorization**
- JWT Authentication (SimpleJWT)  
- User registration, login, logout  
- Password reset, password change  
- Email verification (dev mode: printed in console)  
- RBAC permissions using Django REST Framework  
- API tests for all auth flows

---

### **Phase 3 – Core Features**
- **Projects**
  - Create/update/delete
  - Member management
  - Progress calculation
  - Filtering, search, ordering
- **Tasks**
  - Full CRUD
  - Assignment + validation
  - Priority, status workflow
  - Timestamps: started_at, completed_at
  - Overdue detection
  - Dependencies (blocked_by)
- **Comments**
  - CRUD
  - Linked to tasks
  - Author permissions
  - Notification triggers
- **Attachments**
  - File uploads with type & size validation
  - Linked to tasks

---

### **Phase 4 – Notifications & Background Jobs**
- **Email Notifications**
  - Task assigned
  - Status changed
  - New comment
  - Uses console backend in dev
  - Celery async email tasks
- **In-App Notifications**
  - Database model
  - Read/unread
  - Notification list API
  - Unread count API
- **Celery + Redis**
  - Worker + Beat scheduler
  - Daily overdue-task reminder email
- **Real-Time Notifications**
  - Django Channels + Redis channel layer
  - WebSocket routing: `/ws/notifications/`
  - Push notifications when events occur

---

### **Upcoming Phases**
- **Phase 5 — API & Search**
- **Phase 6 — Analytics & Dashboard**
- **Phase 7 — AWS Integration**
  - SES (real email sending)
  - S3 file storage
  - RDS PostgreSQL
  - EC2 / Elastic Beanstalk deployment
  - CloudWatch logs
- **Phase 8 — Testing & CI/CD**
- **Phase 9 — Optimization & Security**
- **Phase 10 — Final Review & Launch**

---

## 🏗️ Tech Stack

- **Backend**: Django 5, DRF, Channels  
- **Database**: PostgreSQL  
- **Cache/Broker**: Redis  
- **Background Tasks**: Celery + Celery Beat  
- **WebSockets**: Channels, Daphne  
- **Auth**: SimpleJWT  
- **Containerization**: Docker / Docker Compose  
- **CI**: GitHub Actions  
- **Cloud (planned)**: AWS SES, S3, RDS, EC2/EB, CloudWatch  

---

# 📦 Installation Guide – Taskoria

# 1. Clone the repo
git clone https://github.com/yourusername/taskoria.git
cd taskoria

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py migrate

# 5. Run development server
python manage.py runserver



# 🐳 Running with Docker (recommended)
docker-compose up --build
# This starts:
# - Django (Daphne ASGI)
# - Celery worker
# - Celery beat
# - Redis
# - PostgreSQL



# 🔌 WebSocket Testing
# Connect to:
# ws://localhost:8000/ws/notifications/

# Example using browser console:
# let s = new WebSocket("ws://localhost:8000/ws/notifications/");
# s.onmessage = (e) => console.log("Notification:", e.data);



# 🧪 Running Tests
python manage.py test


📁 Project Structure
bash
Copy code
taskoria/
│
├── taskoria/               # core settings, ASGI, Celery
├── users/                  # authentication, roles, email verification
├── projects/               # project CRUD
├── tasks/                  # task CRUD + workflow logic
├── comments/               # task comments
├── attachments/            # file uploads
├── notifications/          # email + in-app + websocket notifications
│
├── docker-compose.yml
├── requirements.txt
└── README.md
📝 License
MIT. Free to use, modify, and redistribute.

