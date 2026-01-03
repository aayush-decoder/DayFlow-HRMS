// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Create Test Company
  const company = await prisma.company.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'DayFlow Technologies',
      timezone: 'Asia/Kolkata',
      fiscalYearStartMonth: 4, // April
      fiscalYearStartDay: 1,
    },
  });

  console.log('✅ Company created:', company.name);
  console.log('   ID:', company.id);
  console.log('   Timezone:', company.timezone);

  // 2. Create Admin User
  const hashedPasswordAdmin = await bcrypt.hash('Admin@123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: {},
    create: {
      email: 'admin@dayflow.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
      companyId: company.id,
    },
  });

  console.log('\n✅ Admin user created:', adminUser.email);

  // 2.1 Create Admin Profile
  await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      companyId: company.id,
      name: 'Admin User',
      department: 'Management',
      designation: 'System Administrator',
      phone: '+91-ADMIN-0000',
      address: 'HQ',
      joinDate: new Date('2023-01-01'),
    },
  });


  // 3. Create Sample Employee User & Profile
  const hashedPasswordEmp = await bcrypt.hash('Employee@123', 10);

  const employeeUser = await prisma.user.upsert({
    where: { email: 'employee@dayflow.com' },
    update: {},
    create: {
      email: 'employee@dayflow.com',
      password: hashedPasswordEmp,
      role: 'EMPLOYEE',
      companyId: company.id,
    },
  });

  console.log('✅ Employee user created:', employeeUser.email);

  // 4. Create Employee Profile
  const employee = await prisma.employee.upsert({
    where: { userId: employeeUser.id },
    update: {},
    create: {
      userId: employeeUser.id,
      companyId: company.id,
      name: 'John Doe',
      department: 'Engineering',
      designation: 'Senior Developer',
      phone: '+91-9876543210',
      address: 'Surat, Gujarat, India',
      joinDate: new Date('2024-01-01'),
    },
  });

  console.log('✅ Employee profile created:', employee.name);

  // 5. Create Salary Record
  const salary = await prisma.salary.upsert({
    where: { employeeId: employee.id },
    update: {},
    create: {
      employeeId: employee.id,
      monthlyWage: 80000,
      yearlyWage: 960000,
      basicPercent: 50,
      hraPercent: 20,
      performanceBonusPercent: 10,
      standardAllowance: 5000,
      fixedAllowance: 3000,
      pfEmployeePercent: 12,
      pfEmployerPercent: 12,
      professionalTax: 2400,
    },
  });

  console.log('✅ Salary record created: ₹', salary.monthlyWage, '/month');

  // 6. Create Leave Balance
  const leaveBalance = await prisma.leaveBalance.upsert({
    where: { employeeId: employee.id },
    update: {},
    create: {
      employeeId: employee.id,
      paidLeave: 12,
      sickLeave: 6,
      year: new Date().getFullYear(),
    },
  });

  console.log('✅ Leave balance created:', leaveBalance.paidLeave, 'paid,', leaveBalance.sickLeave, 'sick');

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Database seeding completed successfully!');
  console.log('='.repeat(60));
  console.log('\n📝 Test Credentials:\n');
  console.log('👨‍💼 Admin:');
  console.log('   Email: admin@dayflow.com');
  console.log('   Password: Admin@123');
  console.log('\n👤 Employee:');
  console.log('   Email: employee@dayflow.com');
  console.log('   Password: Employee@123');
  console.log('\n🏢 Company ID:', company.id);
  console.log('\n💡 Next steps:');
  console.log('   1. npm run dev');
  console.log('   2. npm run db:studio (to view data)');
  console.log('   3. Test the registration API with the company ID above');
  console.log('='.repeat(60) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });