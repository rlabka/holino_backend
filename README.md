# Holino Backend

A modern Node.js backend API service built with Express.js and Postgreesql.
## 🚀 Features

- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** for secure user sessions
- **Password Hashing** with bcryptjs
- **CORS** enabled for cross-origin requests
- **Security** middleware with Helmet
- **Request Logging** with Morgan
- **Environment Configuration** with dotenv
- **Error Handling** middleware
- **Modular Architecture** with organized folder structure

## 📁 Project Structure

```
holino_backend/
├── src/
│   ├── config/
│   │   └── database.js      # Database connection
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/
│   │   └── User.js         # User model
│   ├── routes/
│   │   ├── index.js        # Main router
│   │   ├── auth.js         # Authentication routes
│   │   └── users.js        # User management routes
│   ├── utils/              # Utility functions
│   └── index.js            # Main application file
├── .gitignore
├── env.example             # Environment variables template
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/holino_backend.git
   cd holino_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/holino_db
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   API_VERSION=v1
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📚 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 🧪 Testing

```bash
npm test
```

## 🔧 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run build` - Build the application

## 📦 Dependencies

### Production Dependencies
- **express** - Web framework
- **cors** - CORS middleware
- **helmet** - Security middleware
- **morgan** - HTTP request logger
- **dotenv** - Environment variable loader
- **mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token handling
- **express-validator** - Input validation
- **multer** - File upload handling

### Development Dependencies
- **nodemon** - Development server
- **jest** - Testing framework
- **supertest** - HTTP assertion library

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Security headers with Helmet
- Input validation
- Error handling without sensitive data exposure

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/holino_db |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `API_VERSION` | API version | v1 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
