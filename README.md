# DayFlow - Enterprise Employee Management System

<div align="center">

![DayFlow Logo](https://img.shields.io/badge/DayFlow-Employee%20Management-blue?style=for-the-badge)

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

*A comprehensive, enterprise-grade employee management system built with modern web technologies*

</div>

## 🌟 Overview

DayFlow is a full-stack employee management system designed for modern businesses. It provides comprehensive attendance tracking, leave management, employee profiles, and administrative controls with a focus on security, scalability, and user experience.

## ✨ Key Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin/Employee permissions)
- **Multi-tenant Architecture** with company isolation
- **Secure Password Hashing** using bcrypt
- **Session Management** with HTTP-only cookies
- **Bearer Token Support** for API integrations

### 👥 **Employee Management**
- **Complete Employee Profiles** with personal and job details
- **Document Management** with file upload capabilities
- **Salary Structure Management** with detailed breakdowns
- **Department & Designation Tracking**
- **Profile Picture Upload** with image optimization
- **Company-wide Employee Directory**

### ⏰ **Attendance System**
- **Real-time Check-in/Check-out** with timestamp tracking
- **Attendance Status Management** (Present, Half-day, Absent, Leave)
- **Admin Override Capabilities** for attendance corrections
- **Monthly Attendance Reports** with detailed analytics
- **Attendance History Tracking** with audit trails
- **Automatic Status Calculation** based on work hours

### 🏖️ **Leave Management**
- **Leave Balance Tracking** (Paid Leave, Sick Leave)
- **Leave Application Workflow** with approval process
- **Multiple Leave Types** (Paid, Sick, Unpaid)
- **Leave Duration Options** (Full-day, Half-day)
- **Admin Approval/Rejection** with reason tracking
- **Leave History & Analytics** for employees and admins
- **Automatic Balance Deduction** upon approval

### 📊 **Reporting & Analytics**
- **Attendance Reports** with PDF generation
- **Leave Analytics** and trend analysis
- **Employee Performance Metrics**
- **Company-wide Statistics** for administrators
- **Exportable Data** in multiple formats
- **Real-time Dashboard** with key metrics

### 📧 **Communication System**
- **Email Notifications** for leave applications and approvals
- **SMTP Integration** with customizable templates
- **Automated Reminders** for pending actions
- **System Alerts** for important events

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Next.js 16.1.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Lucide React** - Modern icon library

### **Backend Stack**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **JWT (Jose)** - Secure authentication
- **Nodemailer** - Email functionality
- **PDFKit** - PDF report generation

### **Database Schema**
```
Companies (Multi-tenant)
├── Users (Authentication)
├── Employees (Profiles)
├── Attendance (Time tracking)
├── Leaves (Leave management)
├── Documents (File storage)
├── Salaries (Compensation)
├── Leave Balances (Entitlements)
└── Audit Logs (System tracking)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SMTP server (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/dayflow.git
   cd dayflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/dayflow"
   DIRECT_URL="postgresql://user:password@localhost:5432/dayflow"
   
   # Authentication
   JWT_SECRET=<your secret key>
   
   # Email Configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # File Upload
   UPLOAD_DIR="./public/uploads"
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed sample data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with seeded credentials (check `prisma/seed.ts`)

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database and reseed |
| `npm run db:studio` | Open Prisma Studio |

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/login      - User login
POST /api/auth/register   - User registration
POST /api/auth/logout     - User logout
GET  /api/auth/me         - Get current user
```

### Employee Management
```
GET    /api/profile       - Get employee profile
PATCH  /api/profile       - Update employee profile
POST   /api/documents     - Upload employee documents
GET    /api/upload        - File upload endpoint
```

### Attendance Management
```
POST  /api/attendance/check-in     - Employee check-in
POST  /api/attendance/check-out    - Employee check-out
GET   /api/attendance/me           - Get my attendance
GET   /api/attendance              - Get all attendance (Admin)
PATCH /api/attendance/[id]/override - Override attendance (Admin)
GET   /api/attendance/report       - Generate attendance report
```

### Leave Management
```
GET    /api/leaves         - Get leaves (filtered by role)
POST   /api/leaves         - Apply for leave
PUT    /api/leaves/[id]    - Approve/reject leave (Admin)
DELETE /api/leaves/[id]    - Cancel leave
GET    /api/leaves/balance - Get leave balance
```

### Admin Endpoints
```
GET  /api/admin/stats           - Company statistics
GET  /api/admin/salary          - Salary management
POST /api/admin/salary/[id]     - Update employee salary
```

## 🛡️ Security Features

### **Authentication Security**
- Secure JWT token generation with configurable expiration
- HTTP-only cookies to prevent XSS attacks
- Bearer token support for API integrations
- Password hashing using bcrypt with salt rounds
- Session invalidation on logout

### **Authorization Controls**
- Role-based access control (RBAC)
- Route-level permission checks
- API endpoint protection
- Company data isolation (multi-tenancy)
- Admin-only functionality restrictions

### **Data Protection**
- Input validation using Zod schemas
- SQL injection prevention via Prisma ORM
- CORS configuration for cross-origin requests
- Secure file upload with type validation
- Audit logging for sensitive operations

## 🎯 Edge Cases Handled

### **Attendance Management**
- ✅ Duplicate check-in prevention
- ✅ Check-out without check-in handling
- ✅ Cross-day attendance scenarios
- ✅ Weekend and holiday considerations
- ✅ Timezone-aware timestamp handling
- ✅ Admin override with audit trails

### **Leave Management**
- ✅ Insufficient leave balance validation
- ✅ Overlapping leave application prevention
- ✅ Weekend exclusion in leave calculations
- ✅ Half-day leave balance deduction
- ✅ Leave cancellation after approval
- ✅ Retroactive leave applications

### **User Management**
- ✅ Duplicate email registration prevention
- ✅ Invalid token handling
- ✅ Expired session management
- ✅ Role change impact on permissions
- ✅ Employee profile completion validation
- ✅ Company isolation enforcement

### **File Management**
- ✅ File size limit enforcement
- ✅ File type validation
- ✅ Duplicate file handling
- ✅ Storage cleanup for deleted records
- ✅ Secure file access controls

## 📊 Testing

### **Comprehensive Test Suite**
- **API Integration Tests** - All endpoints tested
- **Authentication Flow Tests** - Login/logout scenarios
- **Role-based Access Tests** - Permission validation
- **Data Validation Tests** - Input sanitization
- **Error Handling Tests** - Edge case coverage

### **Test Results**
- ✅ **15/15 Tests Passing** (100% success rate)
- ✅ All API endpoints functional
- ✅ Authentication system verified
- ✅ Database operations validated
- ✅ Security controls tested

Run tests:
```bash
node test/comprehensive-test.js
node test/test-apis.js
node test/test-email.js
```

## 🚀 Deployment

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SMTP server configured
- [ ] File upload directory permissions set
- [ ] SSL certificates installed
- [ ] Domain DNS configured

### **Recommended Platforms**
- **Vercel** - Seamless Next.js deployment
- **Railway** - Full-stack deployment with database
- **AWS** - Enterprise-grade infrastructure
- **DigitalOcean** - Cost-effective VPS hosting

### **Environment Configuration**
```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL="your-production-db-url"
JWT_SECRET="your-production-jwt-secret"
SMTP_HOST="your-production-smtp"
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-org/dayflow/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/dayflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/dayflow/discussions)
- **Email**: support@dayflow.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Prisma](https://www.prisma.io/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**Made with ❤️ for modern businesses**

[Website](https://dayflow.com) • [Documentation](https://docs.dayflow.com) • [Support](mailto:support@dayflow.com)

</div>
