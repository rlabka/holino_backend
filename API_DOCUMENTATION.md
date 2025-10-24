# 🚀 Holino Backend API Documentation

Base URL: `http://localhost:3001/api/v1`

## 📋 Table of Contents
- [Authentication](#authentication)
- [Location Services](#location-services)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register User
**POST** `/auth/register`

Registriert einen neuen Benutzer (Privat oder Gewerblich).

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "name": "John Doe",
  "password": "SecurePass123",
  "phone": "+491234567890",
  "postcode": "10115",
  "accountType": "PRIVAT",  // or "GEWERBLICH"
  "termsAccepted": true,
  "privacyAccepted": true,
  
  // Nur für GEWERBLICH:
  "legalForm": "GmbH",
  "industry": "IT Services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe",
      "accountType": "PRIVAT",
      ...
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": "7d"
  }
}
```

---

### Login
**POST** `/auth/login`

Meldet einen Benutzer mit E-Mail und Passwort an.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": "7d"
  }
}
```

---

### Refresh Token
**POST** `/auth/refresh`

Erneuert den Access Token mit einem Refresh Token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

---

### Forgot Password
**POST** `/auth/forgot-password`

Fordert einen Passwort-Reset-Link an.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": {
    "message": "If the email exists, a reset link has been sent",
    "resetToken": "token_here"  // Nur für Development
  }
}
```

---

### Reset Password
**POST** `/auth/reset-password`

Setzt das Passwort mit dem Reset-Token zurück.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecure123",
  "confirmPassword": "NewSecure123"
}
```

---

### Verify Email
**POST** `/auth/verify-email`

Verifiziert die E-Mail-Adresse mit dem Verifizierungs-Token.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

---

### Resend Verification Email
**POST** `/auth/resend-verification`

Sendet die Verifizierungs-E-Mail erneut (erfordert Authentifizierung).

**Headers:**
```
Authorization: Bearer <access_token>
```

---

### Get Current User
**GET** `/auth/me`

Ruft die Informationen des aktuell angemeldeten Benutzers ab.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe",
      "accountType": "PRIVAT",
      ...
    }
  }
}
```

---

### Logout
**POST** `/auth/logout`

Meldet den Benutzer ab (erfordert Authentifizierung).

**Headers:**
```
Authorization: Bearer <access_token>
```

---

## 📍 Location Services

### Get Location by Postcode
**GET** `/location/postcode/:postcode`

Ruft Standortinformationen basierend auf einer Postleitzahl ab.

**Example:**
```
GET /location/postcode/10115
```

**Response:**
```json
{
  "success": true,
  "data": {
    "postcode": "10115",
    "city": "Berlin",
    "state": "Berlin",
    "country": "Deutschland"
  }
}
```

---

### Geocode Address
**POST** `/location/geocode`

Konvertiert eine Adresse in Koordinaten.

**Request Body:**
```json
{
  "address": "Alexanderplatz, Berlin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "latitude": 52.520008,
    "longitude": 13.404954,
    "address": "Alexanderplatz, Berlin"
  }
}
```

---

### Reverse Geocode
**POST** `/location/reverse-geocode`

Konvertiert Koordinaten in eine Adresse.

**Request Body:**
```json
{
  "latitude": 52.520008,
  "longitude": 13.404954
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "Beispielstraße 123",
    "city": "Berlin",
    "postcode": "10115",
    "country": "Deutschland"
  }
}
```

---

### Calculate Distance
**POST** `/location/distance`

Berechnet die Entfernung zwischen zwei Punkten in Kilometern.

**Request Body:**
```json
{
  "lat1": 52.520008,
  "lon1": 13.404954,
  "lat2": 48.137154,
  "lon2": 11.576124
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "distance": 504.23,
    "unit": "km"
  }
}
```

---

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-10-24T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address",
      "value": "invalid-email"
    }
  ],
  "timestamp": "2024-10-24T12:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (Authentication required) |
| 403 | Forbidden (Insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., email already exists) |
| 429 | Too Many Requests (Rate limit exceeded) |
| 500 | Internal Server Error |

### Common Error Messages

**Validation Errors:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already registered"
    }
  ]
}
```

**Authentication Errors:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🔑 Authentication Headers

Für geschützte Endpunkte:
```
Authorization: Bearer <access_token>
```

---

## 💡 Validation Rules

### Email
- Valid email format
- Unique (not already registered)

### Username
- 3-30 characters
- Only letters, numbers, and underscores
- Unique

### Password
- Minimum 8 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### Phone (Optional)
- International format (e.g., +491234567890)

### Postcode (Optional)
- 5 digits for German postcodes

### Account Type
- PRIVAT or GEWERBLICH

### Business Account (GEWERBLICH)
- Requires: legalForm, industry

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "name": "Test User",
    "password": "Test123456",
    "phone": "+491234567890",
    "postcode": "10115",
    "accountType": "PRIVAT",
    "termsAccepted": true,
    "privacyAccepted": true
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Get Current User
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3001/api/v1/auth/me
```
