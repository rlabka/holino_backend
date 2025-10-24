const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');

class User {
  // Create a new user
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          profileImage: true,
          phone: true,
          postcode: true,
          accountType: true,
          legalForm: true,
          industry: true,
          companyName: true,
          businessDocuments: true,
          emailVerified: true,
          isActive: true,
          isBanned: true,
          role: true,
          verificationToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      return await prisma.user.findUnique({
        where: { username },
      });
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          profileImage: true,
          phone: true,
          postcode: true,
          accountType: true,
          legalForm: true,
          industry: true,
          companyName: true,
          businessDocuments: true,
          emailVerified: true,
          isActive: true,
          isBanned: true,
          role: true,
          verificationToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  // Update user
  static async update(id, updateData) {
    try {
      // Hash password if it's being updated
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      return await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          profileImage: true,
          phone: true,
          postcode: true,
          accountType: true,
          legalForm: true,
          industry: true,
          companyName: true,
          businessDocuments: true,
          emailVerified: true,
          isActive: true,
          isBanned: true,
          role: true,
          verificationToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete user
  static async delete(id) {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Compare password
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Find by verification token
  static async findByVerificationToken(token) {
    try {
      return await prisma.user.findUnique({
        where: { verificationToken: token },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          profileImage: true,
          phone: true,
          postcode: true,
          accountType: true,
          legalForm: true,
          industry: true,
          companyName: true,
          businessDocuments: true,
          emailVerified: true,
          isActive: true,
          isBanned: true,
          role: true,
          verificationToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error(`Error finding user by token: ${error.message}`);
    }
  }

  // Verify email and activate account
  static async verifyEmail(token) {
    try {
      return await prisma.user.update({
        where: { verificationToken: token },
        data: {
          emailVerified: true,
          isActive: true,
          verificationToken: null,
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          profileImage: true,
          phone: true,
          postcode: true,
          accountType: true,
          legalForm: true,
          industry: true,
          companyName: true,
          businessDocuments: true,
          emailVerified: true,
          isActive: true,
          isBanned: true,
          role: true,
          verificationToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error(`Error verifying email: ${error.message}`);
    }
  }

  // Get all users (with pagination)
  static async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            phone: true,
            postcode: true,
            accountType: true,
            legalForm: true,
            industry: true,
            companyName: true,
            businessDocuments: true,
            emailVerified: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding users: ${error.message}`);
    }
  }
}

module.exports = User;
