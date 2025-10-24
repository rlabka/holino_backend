const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      username: 'johndoe',
      name: 'John Doe',
      phone: '+49123456789',
      postcode: '10115',
      accountType: 'PRIVAT',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      username: 'janesmith',
      name: 'Jane Smith',
      phone: '+49987654321',
      postcode: '20095',
      accountType: 'GEWERBLICH',
      legalForm: 'GmbH',
      industry: 'IT Services',
      password: hashedPassword,
    },
  });

  // Create test services
  const service1 = await prisma.service.upsert({
    where: { id: 'service-1' },
    update: {},
    create: {
      id: 'service-1',
      title: 'Web Development Service',
      description: 'Professional web development using modern technologies like React, Node.js, and PostgreSQL.',
      category: 'IT',
      subcategory: 'Web Development',
      price: 75.0,
      location: 'Berlin, Germany',
      latitude: 52.5200,
      longitude: 13.4050,
      images: ['https://example.com/web-dev-1.jpg', 'https://example.com/web-dev-2.jpg'],
      userId: user1.id,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 'service-2' },
    update: {},
    create: {
      id: 'service-2',
      title: 'Graphic Design Consultation',
      description: 'Expert graphic design consultation for branding and marketing materials.',
      category: 'Design',
      subcategory: 'Graphic Design',
      price: 50.0,
      location: 'Hamburg, Germany',
      latitude: 53.5511,
      longitude: 9.9937,
      images: ['https://example.com/design-1.jpg'],
      userId: user2.id,
    },
  });

  // Create test booking
  await prisma.booking.upsert({
    where: { id: 'booking-1' },
    update: {},
    create: {
      id: 'booking-1',
      status: 'CONFIRMED',
      startDate: new Date('2024-02-01T10:00:00Z'),
      endDate: new Date('2024-02-01T18:00:00Z'),
      totalPrice: 75.0,
      notes: 'Please bring your laptop for the consultation.',
      userId: user2.id,
      serviceId: service1.id,
    },
  });

  // Create test review
  await prisma.review.upsert({
    where: { 
      userId_serviceId: {
        userId: user2.id,
        serviceId: service1.id,
      }
    },
    update: {},
    create: {
      rating: 5,
      comment: 'Excellent service! Very professional and delivered exactly what was promised.',
      userId: user2.id,
      serviceId: service1.id,
    },
  });

  // Create test message
  await prisma.message.upsert({
    where: { id: 'message-1' },
    update: {},
    create: {
      id: 'message-1',
      content: 'Hello! I am interested in your web development service. When would be a good time to discuss the project?',
      isRead: false,
      senderId: user2.id,
      receiverId: user1.id,
    },
  });

  // Create test favorite
  await prisma.favorite.upsert({
    where: {
      userId_serviceId: {
        userId: user2.id,
        serviceId: service1.id,
      }
    },
    update: {},
    create: {
      userId: user2.id,
      serviceId: service1.id,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`👤 Created users: ${user1.name}, ${user2.name}`);
  console.log(`🛠️ Created services: ${service1.title}, ${service2.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
