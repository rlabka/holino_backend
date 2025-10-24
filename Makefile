# Holino Backend Docker Commands

.PHONY: help build up down logs restart clean seed migrate

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build Docker images"
	@echo "  up        - Start all services"
	@echo "  down      - Stop all services"
	@echo "  logs      - Show logs"
	@echo "  restart   - Restart all services"
	@echo "  clean     - Remove all containers and volumes"
	@echo "  seed      - Run database seed"
	@echo "  migrate   - Run database migrations"
	@echo "  studio    - Open Prisma Studio"
	@echo "  shell     - Open shell in backend container"

# Build Docker images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Restart all services
restart:
	docker-compose restart

# Clean up (remove containers and volumes)
clean:
	docker-compose down -v
	docker system prune -f

# Run database seed
seed:
	docker-compose exec backend npm run db:seed

# Run database migrations
migrate:
	docker-compose exec backend npx prisma migrate dev

# Open Prisma Studio
studio:
	docker-compose exec backend npx prisma studio

# Open shell in backend container
shell:
	docker-compose exec backend sh

# Full setup (build, up, migrate, seed)
setup: build up
	@echo "Waiting for services to start..."
	@sleep 10
	@echo "Running migrations..."
	docker-compose exec backend npx prisma migrate deploy
	@echo "Seeding database..."
	docker-compose exec backend npm run db:seed
	@echo "Setup complete! Backend running on http://localhost:3001"
