const { prisma } = require('../config/database');

/**
 * Service Model
 */
class Service {
  /**
   * Create a new service
   */
  static async create(serviceData) {
    try {
      const service = await prisma.service.create({
        data: {
          title: serviceData.title,
          description: serviceData.description,
          category: serviceData.category,
          subcategory: serviceData.subcategory,
          price: serviceData.price,
          priceType: serviceData.priceType || 'FIXED',
          currency: serviceData.currency || 'EUR',
          location: serviceData.location,
          latitude: serviceData.latitude,
          longitude: serviceData.longitude,
          distanceLimit: serviceData.distanceLimit,
          images: serviceData.images || [],
          languages: serviceData.languages || [],
          keywords: serviceData.keywords || [],
          userId: serviceData.userId,
          isActive: true,
        },
        include: {
          availability: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });

      return service;
    } catch (error) {
      throw new Error(`Error creating service: ${error.message}`);
    }
  }

  /**
   * Find service by ID
   */
  static async findById(id) {
    try {
      return await prisma.service.findUnique({
        where: { id },
        include: {
          availability: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Error finding service: ${error.message}`);
    }
  }

  /**
   * Find services by user ID
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where: { userId },
          skip,
          take: limit,
          include: {
            availability: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.service.count({ where: { userId } }),
      ]);

      return {
        services,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding user services: ${error.message}`);
    }
  }

  /**
   * Find services by category
   */
  static async findByCategory(category, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where: { 
            category,
            isActive: true,
          },
          skip,
          take: limit,
          include: {
            availability: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.service.count({ 
          where: { 
            category,
            isActive: true,
          },
        }),
      ]);

      return {
        services,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding services by category: ${error.message}`);
    }
  }

  /**
   * Update service
   */
  static async update(id, updateData) {
    try {
      return await prisma.service.update({
        where: { id },
        data: updateData,
        include: {
          availability: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Error updating service: ${error.message}`);
    }
  }

  /**
   * Delete service
   */
  static async delete(id) {
    try {
      await prisma.service.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Error deleting service: ${error.message}`);
    }
  }

  /**
   * Add availability for a service
   */
  static async addAvailability(serviceId, availabilityData) {
    try {
      return await prisma.availability.create({
        data: {
          serviceId,
          dayOfWeek: availabilityData.dayOfWeek,
          startTime: availabilityData.startTime,
          endTime: availabilityData.endTime,
          isAvailable: availabilityData.isAvailable !== false,
        },
      });
    } catch (error) {
      throw new Error(`Error adding availability: ${error.message}`);
    }
  }

  /**
   * Get all services (paginated)
   */
  static async findAll(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;

      const whereClause = {
        isActive: true,
        ...filters,
      };

      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            availability: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.service.count({ where: whereClause }),
      ]);

      return {
        services,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding services: ${error.message}`);
    }
  }
}

module.exports = Service;
