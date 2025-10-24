const { prisma } = require('../config/database');
const { NotFoundError, ValidationError } = require('../utils/errors');

/**
 * Favorite Model - Data Access Object
 */
class Favorite {
  /**
   * Add a service to favorites
   */
  static async add(userId, serviceId) {
    if (!userId || !serviceId) {
      throw new ValidationError('User ID and Service ID are required');
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    if (existing) {
      throw new ValidationError('Service is already in your favorites');
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundError('Service');
    }

    // Add to favorites
    return prisma.favorite.create({
      data: {
        userId,
        serviceId,
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            price: true,
            location: true,
            images: true,
          },
        },
      },
    });
  }

  /**
   * Remove a service from favorites
   */
  static async remove(userId, serviceId) {
    if (!userId || !serviceId) {
      throw new ValidationError('User ID and Service ID are required');
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundError('Favorite');
    }

    return prisma.favorite.delete({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });
  }

  /**
   * Get all favorites for a user
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        include: {
          service: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              subcategory: true,
              price: true,
              priceType: true,
              currency: true,
              location: true,
              latitude: true,
              longitude: true,
              images: true,
              languages: true,
              keywords: true,
              isActive: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      favorites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Check if a service is favorited by a user
   */
  static async isFavorited(userId, serviceId) {
    if (!userId || !serviceId) {
      throw new ValidationError('User ID and Service ID are required');
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    return !!favorite;
  }

  /**
   * Get favorites count for a service
   */
  static async getServiceFavoritesCount(serviceId) {
    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }

    return prisma.favorite.count({
      where: { serviceId },
    });
  }

  /**
   * Delete all favorites for a service (when service is deleted)
   */
  static async deleteByServiceId(serviceId) {
    if (!serviceId) {
      throw new ValidationError('Service ID is required');
    }

    return prisma.favorite.deleteMany({
      where: { serviceId },
    });
  }

  /**
   * Get top favorited services
   */
  static async getTopFavorited(limit = 10) {
    const services = await prisma.favorite.groupBy({
      by: ['serviceId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    // Get full service details for top favorites
    const serviceIds = services.map(s => s.serviceId);
    
    const detailedServices = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    return detailedServices.map(service => ({
      ...service,
      favoritesCount: services.find(s => s.serviceId === service.id)?._count.id || 0,
    }));
  }
}

module.exports = Favorite;
