const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('📦 PostgreSQL Database Connected Successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('📦 Database Disconnected');
  } catch (error) {
    console.error('❌ Database disconnection error:', error.message);
  }
};

module.exports = { prisma, connectDB, disconnectDB };
