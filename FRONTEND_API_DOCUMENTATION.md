# Frontend API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Management Endpoints](#user-management-endpoints)
4. [Location Endpoints](#location-endpoints)
5. [Service Endpoints](#service-endpoints)
6. [Favorites Endpoints](#favorites-endpoints)
7. [Additional Endpoints](#additional-endpoints)
8. [Error Handling](#error-handling)
9. [JWT Token Handling](#jwt-token-handling)

---

## Quick Start

### Registration & Login Flow

```
1. Register → User created with isActive: false
2. Verify Email → Account activated (isActive: true)
3. Login → Get access token
4. Use API → Include token in Authorization header
```

### Key Points

- **Email Verification Required**: Users must verify email before login
- **Login**: Only with email (not username)
- **Password**: Min 8 chars, uppercase, lowercase, number, special char
- **Tokens**: Access token (7 days), Refresh token (30 days)
- **Headers**: `Authorization: Bearer <accessToken>`

---

## Authentication Endpoints

### 1. Register (PRIVAT Account)

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe123",
  "name": "John Doe",
  "password": "SecurePass123!",
  "phone": "+49123456789",
  "postcode": "10115",
  "accountType": "PRIVAT",
  "termsAccepted": true,
  "privacyAccepted": true
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&_-#)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "cmh50vh1f0000qm3ot6gjchid",
      "email": "user@example.com",
      "username": "johndoe123",
      "name": "John Doe",
      "profileImage": null,
      "accountType": "PRIVAT",
      "emailVerified": false,
      "isActive": false,
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d",
    "verificationToken": "abc123...",
    "verificationUrl": "http://localhost:3000/verify-email?token=abc123...",
    "message": "Registration successful. Please check your email to verify your account."
  },
  "timestamp": "2025-10-24T15:45:09.134Z"
}
```

**Important Notes:**
- Account is created with `isActive: false` 
- User **cannot login** until email is verified
- Use the `verificationUrl` to verify email (send via email in production)
- After verification, account becomes active (`isActive: true`)

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "timestamp": "2025-10-24T15:43:01.479Z",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&_-#)",
      "value": "Password123"
    }
  ]
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe123",
    "name": "John Doe",
    "password": "SecurePass123!",
    "phone": "+49123456789",
    "postcode": "10115",
    "accountType": "PRIVAT",
    "termsAccepted": true,
    "privacyAccepted": true
  }'
```

---

### 2. Register (GEWERBLICH Account)

**Endpoint:** `POST /auth/register`

**Content-Type:** `multipart/form-data` (when uploading documents)

**Request Body (FormData):**
```javascript
const formData = new FormData();
formData.append('email', 'business@example.com');
formData.append('username', 'businessuser');
formData.append('name', 'Business User');
formData.append('password', 'SecurePass123!');
formData.append('accountType', 'GEWERBLICH');
formData.append('legalForm', 'GmbH');
formData.append('industry', 'IT');
formData.append('companyName', 'Tech Solutions GmbH');
formData.append('termsAccepted', 'true');
formData.append('privacyAccepted', 'true');

// Optional: Business documents (max 5 PDFs)
formData.append('businessDocuments', pdfFile1);
formData.append('businessDocuments', pdfFile2);
```

**Required Fields for GEWERBLICH:**
- `legalForm` (Legal form: e.g., GmbH, UG, AG, etc.)
- `industry` (Industry/Sector)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "cmh50wxy...",
      "email": "business@example.com",
      "username": "businessuser",
      "name": "Business User",
      "profileImage": null,
      "accountType": "GEWERBLICH",
      "legalForm": "GmbH",
      "industry": "IT",
      "companyName": "Tech Solutions GmbH",
      "businessDocuments": [
        "/uploads/documents/Business_License-1234567890-abc.pdf"
      ],
      "emailVerified": false,
      "isActive": false,
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d",
    "verificationToken": "abc123...",
    "verificationUrl": "http://localhost:3000/verify-email?token=abc123...",
    "message": "Registration successful. Please check your email to verify your account."
  },
  "timestamp": "2025-10-24T15:45:09.134Z"
}
```

**Example Request (curl with file upload):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -F "email=business@example.com" \
  -F "username=businessuser" \
  -F "name=Business User" \
  -F "password=SecurePass123!" \
  -F "accountType=GEWERBLICH" \
  -F "legalForm=GmbH" \
  -F "industry=IT" \
  -F "companyName=Tech Solutions GmbH" \
  -F "termsAccepted=true" \
  -F "privacyAccepted=true" \
  -F "businessDocuments=@/path/to/document1.pdf" \
  -F "businessDocuments=@/path/to/document2.pdf"
```

---

### 3. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Important:** Login works **ONLY with Email**, NOT with Username!

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "cmh50vh1f0000qm3ot6gjchid",
      "email": "user@example.com",
      "username": "johndoe123",
      "name": "John Doe",
      "profileImage": null,
      "accountType": "PRIVAT",
      "emailVerified": true,
      "isActive": true,
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  },
  "timestamp": "2025-10-24T15:45:17.304Z"
}
```

**Error Responses:**

**Invalid Credentials (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "timestamp": "2025-10-24T15:45:17.304Z"
}
```

**Account Banned (401):**
```json
{
  "success": false,
  "message": "Account is banned",
  "timestamp": "2025-10-24T15:45:17.304Z"
}
```

**Account Not Activated / Email Not Verified (401):**
```json
{
  "success": false,
  "message": "Account is deactivated",
  "timestamp": "2025-10-24T15:45:17.304Z"
}
```

**Note:** This error appears when the user has not verified their email yet.

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

### 4. Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2025-10-24T15:50:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

---

### 5. Forgot Password - Request

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email",
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### 6. Reset Password - Confirm

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "timestamp": "2025-10-24T16:05:00.000Z"
}
```

---

### 7. Email Verification

**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```json
{
  "token": "verification-token-from-registration"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Email verified successfully. Your account is now active.",
    "user": {
      "id": "cmh51gqhr0000px3oeftdadur",
      "email": "user@example.com",
      "username": "johndoe123",
      "profileImage": null,
      "emailVerified": true,
      "isActive": true,
      "role": "USER"
    },
    "alreadyVerified": false
  },
  "timestamp": "2025-10-24T16:10:00.000Z"
}
```

**Important:**
- After verification, `emailVerified` becomes `true`
- Account is activated: `isActive` becomes `true`
- User can now login
- Token is consumed and cannot be used again

**Already Verified Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Email already verified",
    "alreadyVerified": true
  }
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token-from-registration"
  }'
```

---

### 8. Resend Verification Email

**Endpoint:** `POST /auth/resend-verification`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Verification email sent successfully"
  },
  "timestamp": "2025-10-24T16:20:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/resend-verification \
  -H "Authorization: Bearer <accessToken>"
```

---

### 9. Token Refresh

**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  },
  "timestamp": "2025-10-24T16:15:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

---

## User Management Endpoints

### 10. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cmh50vh1f0000qm3ot6gjchid",
      "email": "user@example.com",
      "username": "johndoe123",
      "name": "John Doe",
      "profileImage": null,
      "phone": "+49123456789",
      "postcode": "10115",
      "accountType": "PRIVAT",
      "role": "USER",
      "isActive": true,
      "isBanned": false,
      "emailVerified": true,
      "createdAt": "2025-10-24T15:45:09.124Z",
      "updatedAt": "2025-10-24T15:45:09.124Z"
    }
  },
  "timestamp": "2025-10-24T16:20:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

---

### 11. Update User Profile

**Endpoint:** `PUT /users/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "phone": "+49987654321",
  "postcode": "10117"
}
```

**Important:** 
- Users can only edit their own profile
- Admins can edit any profile
- `email`, `username`, `password` must be changed via separate endpoints

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "cmh50vh1f0000qm3ot6gjchid",
      "email": "user@example.com",
      "username": "johndoe123",
      "name": "John Updated Doe",
      "phone": "+49987654321",
      "postcode": "10117",
      "accountType": "PRIVAT",
      "role": "USER",
      "updatedAt": "2025-10-24T16:25:00.000Z"
    }
  },
  "timestamp": "2025-10-24T16:25:00.000Z"
}
```

---

### 12. Deactivate Account

**Endpoint:** `POST /users/:id/deactivate`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "timestamp": "2025-10-24T16:45:00.000Z"
}
```

**Important:** Users can deactivate their own account (soft delete).

---

### 13. Get Profile Image

**Endpoint:** `GET /users/:id/profile-image`

**Path Parameters:**
- `id`: User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "profileImage": "/uploads/images/avatar-1761322864364.png",
    "userId": "cmh51u4jx0002px3oivl14wjf"
  },
  "message": "Profile image retrieved successfully",
  "timestamp": "2025-10-24T18:21:04.000Z"
}
```

**No Image Response (200):**
```json
{
  "success": true,
  "data": {
    "profileImage": null,
    "userId": "cmh51u4jx0002px3oivl14wjf"
  },
  "message": "Profile image retrieved successfully",
  "timestamp": "2025-10-24T18:21:04.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET http://localhost:3001/api/v1/users/user123/profile-image
```

**Important:**
- **Public endpoint** - No authentication required
- Other users can see profile images
- Returns `null` if user has no profile image
- Used for displaying profile images in services, user lists, etc.

---

### 14. Upload Profile Image

**Endpoint:** `POST /users/:id/profile-image`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `profileImage`: Image file (JPG, PNG, GIF, WebP)
- Max size: 5MB

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "imageUrl": "/uploads/images/avatar-1761322864364.png",
    "user": {
      "id": "cmh51u4jx0002px3oivl14wjf",
      "email": "user@example.com",
      "profileImage": "/uploads/images/avatar-1761322864364.png"
    }
  },
  "timestamp": "2025-10-24T18:21:04.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/users/:userId/profile-image \
  -H "Authorization: Bearer <accessToken>" \
  -F "profileImage=@/path/to/image.jpg"
```

**Important:**
- Old profile image is automatically deleted from server
- Supported formats: JPG, PNG, GIF, WebP
- User can only upload their own profile image (or admin)

---

### 15. Delete Profile Image

**Endpoint:** `DELETE /users/:id/profile-image`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile image deleted successfully",
  "data": {
    "user": {
      "id": "cmh51u4jx0002px3oivl14wjf",
      "email": "user@example.com",
      "profileImage": null
    }
  },
  "timestamp": "2025-10-24T18:22:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X DELETE http://localhost:3001/api/v1/users/:userId/profile-image \
  -H "Authorization: Bearer <accessToken>"
```

---

## Location Endpoints

### 16. Geocoding (Address → Coordinates)

**Endpoint:** `POST /location/geocode`

**Request Body:**
```json
{
  "address": "Berlin, Germany"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "address": "Berlin, Germany",
    "latitude": 52.5200,
    "longitude": 13.4050,
    "formattedAddress": "Berlin, Germany"
  },
  "timestamp": "2025-10-24T16:50:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/location/geocode \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Berlin, Germany"
  }'
```

---

### 17. Reverse Geocoding (Coordinates → Address)

**Endpoint:** `POST /location/reverse-geocode`

**Request Body:**
```json
{
  "latitude": 52.5200,
  "longitude": 13.4050
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "latitude": 52.5200,
    "longitude": 13.4050,
    "address": "Unter den Linden, Berlin, Germany",
    "city": "Berlin",
    "country": "Germany",
    "postcode": "10117"
  },
  "timestamp": "2025-10-24T16:55:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/location/reverse-geocode \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 52.5200,
    "longitude": 13.4050
  }'
```

---

### 18. Calculate Distance

**Endpoint:** `POST /location/distance`

**Request Body:**
```json
{
  "lat1": 52.5200,
  "lon1": 13.4050,
  "lat2": 48.1351,
  "lon2": 11.5820
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "distance": 504.32,
    "unit": "km"
  },
  "timestamp": "2025-10-24T17:00:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/location/distance \
  -H "Content-Type: application/json" \
  -d '{
    "lat1": 52.5200,
    "lon1": 13.4050,
    "lat2": 48.1351,
    "lon2": 11.5820
  }'
```

---

## Service Endpoints

### 19. Location Auto-Complete

**Endpoint:** `GET /services/autocomplete/location`

**Description:** Get location suggestions from Photon API in real-time as user types

**Query Parameters:**
- `q`: Search query (e.g., "Ber", "Par", "Ams") - Required
- `limit`: Maximum results (default: 10, max: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "name": "Berlin",
        "city": "",
        "country": "Deutschland",
        "fullAddress": "Berlin, Deutschland",
        "latitude": 52.5173885,
        "longitude": 13.3951309
      },
      {
        "name": "Bern",
        "city": "",
        "country": "Schweiz/Suisse/Svizzera/Svizra",
        "fullAddress": "Bern, Bern/Berne, Schweiz/Suisse/Svizzera/Svizra",
        "latitude": 46.9484742,
        "longitude": 7.4521749
      }
    ]
  },
  "message": "Location suggestions"
}
```

**Example Request (curl):**
```bash
# User types "Ber" → Get suggestions
curl -X GET "http://localhost:3001/api/v1/services/autocomplete/location?q=Ber&limit=5"

# User types "Par" → Get suggestions
curl -X GET "http://localhost:3001/api/v1/services/autocomplete/location?q=Par&limit=5"

# User types "Ams" → Get suggestions
curl -X GET "http://localhost:3001/api/v1/services/autocomplete/location?q=Ams&limit=3"
```

**Error Response (400 - Missing Query):**
```json
{
  "success": false,
  "message": "Location query (q) is required",
  "timestamp": "2025-10-24T17:50:00.000Z"
}
```

**Features:**
- Real-time suggestions from Photon Geocoding API
- Covers cities, regions, countries worldwide
- Returns coordinates (latitude, longitude) for each suggestion
- Includes full address formatting
- Case-insensitive search
- Max 10 results

**Frontend Implementation Example:**
```javascript
// While user types in location input field
const handleLocationChange = async (e) => {
  const query = e.target.value;
  
  if (query.length < 2) return; // Wait for at least 2 characters
  
  const response = await fetch(
    `/api/v1/services/autocomplete/location?q=${query}&limit=10`
  );
  const data = await response.json();
  
  // Display suggestions in dropdown
  showSuggestions(data.data.suggestions);
};
```

---

### 20. Create Service

**Endpoint:** `POST /services`

**Authentication:** Required (Bearer Token)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
title: "Professional Cleaning Service" (required, 3-100 chars)
description: "Professional cleaning services for homes and offices..." (required, 10-2000 chars)
category: "Cleaning" (required)
subcategory: "Home Cleaning" (optional)
location: "Berlin, Germany" (required - will be geocoded via Photon API)
price: 50.00 (required, positive number)
priceType: "FIXED" (optional, default: FIXED. Options: FIXED, HOURLY)
currency: "EUR" (optional, default: EUR)
distanceLimit: 25 (optional, in kilometers)
languages: ["de", "en"] (optional, JSON array)
keywords: ["cleaning", "professional"] (optional, JSON array)
availability: [{"dayOfWeek": 0, "startTime": "09:00", "endTime": "18:00"}] (optional, JSON array)
images: [file1.jpg, file2.jpg] (optional, max 6 files)
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "service": {
      "id": "clz2h3k9j0001xyz",
      "title": "Professional Cleaning Service",
      "description": "Professional cleaning services...",
      "category": "Cleaning",
      "subcategory": "Home Cleaning",
      "price": 50.00,
      "priceType": "FIXED",
      "currency": "EUR",
      "location": "Berlin, Germany",
      "latitude": 52.5200,
      "longitude": 13.4050,
      "distanceLimit": 25,
      "images": ["/uploads/images/image1-1234567890.jpg"],
      "languages": ["de", "en"],
      "keywords": ["cleaning", "professional"],
      "isActive": true,
      "userId": "user123",
      "createdAt": "2025-10-24T18:00:00.000Z",
      "updatedAt": "2025-10-24T18:00:00.000Z",
      "availability": [
        {
          "id": "avail123",
          "dayOfWeek": 0,
          "startTime": "09:00",
          "endTime": "18:00",
          "isAvailable": true
        }
      ],
      "user": {
        "id": "user123",
        "username": "john_doe",
        "name": "John Doe",
        "profileImage": "/uploads/images/profile-user123.jpg"
      }
    }
  },
  "message": "Service created successfully",
  "timestamp": "2025-10-24T18:00:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/services \
  -H "Authorization: Bearer <accessToken>" \
  -F "title=Professional Cleaning" \
  -F "description=Professional cleaning services for homes" \
  -F "category=Cleaning" \
  -F "location=Berlin, Germany" \
  -F "price=50.00" \
  -F "languages=[\"de\", \"en\"]" \
  -F "keywords=[\"cleaning\", \"professional\"]" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 100 characters"
    },
    {
      "field": "location",
      "message": "Address not found"
    }
  ]
}
```

**Notes:**
- Location is automatically geocoded using Photon API
- Coordinates (latitude, longitude) are automatically determined from the address
- Images are stored in `/uploads/images/` with generic filenames
- Max 6 images per service
- Address must be resolvable by Photon Geocoding API

---

### 21. Get All Services (Paginated)

**Endpoint:** `GET /services`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "clz2h3k9j0001xyz",
        "title": "Professional Cleaning Service",
        "price": 50.00,
        "location": "Berlin, Germany",
        "latitude": 52.5200,
        "longitude": 13.4050,
        "user": {
          "id": "user123",
          "username": "john_doe",
          "name": "John Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/services?page=1&limit=10"
```

---

### 22. Get Service by ID

**Endpoint:** `GET /services/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "service": {
      "id": "clz2h3k9j0001xyz",
      "title": "Professional Cleaning Service",
      "description": "Professional cleaning services...",
      "category": "Cleaning",
      "price": 50.00,
      "priceType": "FIXED",
      "location": "Berlin, Germany",
      "latitude": 52.5200,
      "longitude": 13.4050,
      "distanceLimit": 25,
      "images": ["/uploads/images/image1-1234567890.jpg"],
      "languages": ["de", "en"],
      "keywords": ["cleaning"],
      "isActive": true,
      "availability": [
        {
          "dayOfWeek": 0,
          "startTime": "09:00",
          "endTime": "18:00"
        }
      ]
    }
  }
}
```

**Example Request (curl):**
```bash
curl -X GET http://localhost:3001/api/v1/services/clz2h3k9j0001xyz
```

---

### 23. Search Services

**Endpoint:** `GET /services/search`

**Query Parameters:**
- `q`: Search query (keyword, title, description) - Required
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "clz2h3k9j0001xyz",
        "title": "Professional Cleaning Service",
        "price": 50.00,
        "location": "Berlin, Germany"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "totalPages": 2
    }
  }
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/services/search?q=cleaning&page=1"
```

---

### 24. Get Nearby Services

**Endpoint:** `GET /services/nearby`

**Query Parameters:**
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: Search radius in kilometers (default: 25)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "clz2h3k9j0001xyz",
        "title": "Professional Cleaning Service",
        "price": 50.00,
        "location": "Berlin, Germany",
        "latitude": 52.5200,
        "longitude": 13.4050,
        "distance": 3.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 23,
      "totalPages": 3
    }
  }
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/services/nearby?lat=52.5200&lng=13.4050&radius=25&page=1"
```

---

### 25. Get Services by Category

**Endpoint:** `GET /services/category/:category`

**Path Parameters:**
- `category`: Category name (e.g., "Cleaning", "Plumbing")

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "clz2h3k9j0001xyz",
        "title": "Professional Cleaning Service",
        "price": 50.00,
        "category": "Cleaning"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 34,
      "totalPages": 4
    }
  }
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/services/category/Cleaning?page=1"
```

---

### 26. Get User Services

**Endpoint:** `GET /services/user/:userId`

**Path Parameters:**
- `userId`: User ID

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "clz2h3k9j0001xyz",
        "title": "Professional Cleaning Service",
        "price": 50.00,
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/services/user/user123?page=1"
```

---

### 27. Update Service

**Endpoint:** `PUT /services/:id`

**Authentication:** Required (Bearer Token - Service owner only)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data - All optional):**
```
title: "Updated Title" (optional)
description: "Updated description" (optional)
category: "New Category" (optional)
location: "New Location" (optional - will be re-geocoded)
price: 60.00 (optional)
priceType: "HOURLY" (optional)
languages: ["de", "en", "es"] (optional, JSON array)
keywords: ["new", "tags"] (optional, JSON array)
images: [file1.jpg] (optional, replaces all images)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "service": {
      "id": "clz2h3k9j0001xyz",
      "title": "Updated Title",
      "price": 60.00,
      "priceType": "HOURLY",
      "updatedAt": "2025-10-24T19:00:00.000Z"
    }
  },
  "message": "Service updated successfully"
}
```

**Example Request (curl):**
```bash
curl -X PUT http://localhost:3001/api/v1/services/clz2h3k9j0001xyz \
  -H "Authorization: Bearer <accessToken>" \
  -F "title=Updated Service Title" \
  -F "price=60.00" \
  -F "priceType=HOURLY"
```

---

### 28. Delete Service

**Endpoint:** `DELETE /services/:id`

**Authentication:** Required (Bearer Token - Service owner only)

**Success Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Service deleted successfully"
}
```

**Example Request (curl):**
```bash
curl -X DELETE http://localhost:3001/api/v1/services/clz2h3k9j0001xyz \
  -H "Authorization: Bearer <accessToken>"
```

**Notes:**
- All associated images are automatically deleted from server
- Service owner verification is enforced

---

### 29. Add Service Availability

**Endpoint:** `POST /services/:id/availability`

**Authentication:** Required (Bearer Token - Service owner only)

**Request Body:**
```json
{
  "dayOfWeek": 0,
  "startTime": "09:00",
  "endTime": "18:00",
  "isAvailable": true
}
```

**Parameters:**
- `dayOfWeek`: 0 (Sunday) to 6 (Saturday)
- `startTime`: Time in HH:mm format (24-hour)
- `endTime`: Time in HH:mm format (24-hour)
- `isAvailable`: Boolean (default: true)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "availability": {
      "id": "avail123",
      "dayOfWeek": 0,
      "startTime": "09:00",
      "endTime": "18:00",
      "isAvailable": true
    }
  },
  "message": "Availability added successfully"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/services/clz2h3k9j0001xyz/availability \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": 0,
    "startTime": "09:00",
    "endTime": "18:00"
  }'
```

---

## Favorites Endpoints

### 30. Add Service to Favorites

**Endpoint:** `POST /favorites/:serviceId`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `serviceId`: Service ID to add to favorites

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "favorite": {
      "id": "fav123",
      "userId": "user123",
      "serviceId": "service456",
      "createdAt": "2025-10-24T19:00:00.000Z"
    }
  },
  "message": "Service added to favorites successfully",
  "timestamp": "2025-10-24T19:00:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/favorites/service456 \
  -H "Authorization: Bearer <accessToken>"
```

---

### 31. Remove Service from Favorites

**Endpoint:** `DELETE /favorites/:serviceId`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `serviceId`: Service ID to remove from favorites

**Success Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Service removed from favorites successfully",
  "timestamp": "2025-10-24T19:05:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X DELETE http://localhost:3001/api/v1/favorites/service456 \
  -H "Authorization: Bearer <accessToken>"
```

---

### 32. Toggle Favorite Status

**Endpoint:** `POST /favorites/:serviceId/toggle`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `serviceId`: Service ID to toggle favorite status

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "action": "added",
    "favorited": true,
    "favorite": {
      "id": "fav123",
      "userId": "user123",
      "serviceId": "service456",
      "createdAt": "2025-10-24T19:00:00.000Z"
    }
  },
  "message": "Service added to favorites successfully",
  "timestamp": "2025-10-24T19:00:00.000Z"
}
```

**Note:** Returns `action: "removed"` and `favorited: false` if service was removed from favorites.

**Example Request (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/favorites/service456/toggle \
  -H "Authorization: Bearer <accessToken>"
```

---

### 33. Get User Favorites

**Endpoint:** `GET /favorites`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "fav123",
        "serviceId": "service456",
        "createdAt": "2025-10-24T19:00:00.000Z",
        "service": {
          "id": "service456",
          "title": "Professional Cleaning Service",
          "price": 50.00,
          "location": "Berlin, Germany",
          "images": ["/uploads/images/image1.jpg"],
          "user": {
            "id": "user789",
            "username": "cleaner_pro",
            "name": "John Cleaner"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  },
  "message": "Favorites retrieved successfully",
  "timestamp": "2025-10-24T19:10:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/favorites?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

---

### 34. Check if Service is Favorited

**Endpoint:** `GET /favorites/:serviceId/is-favorited`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `serviceId`: Service ID to check

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "favorited": true
  },
  "message": "Favorite status retrieved",
  "timestamp": "2025-10-24T19:15:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET http://localhost:3001/api/v1/favorites/service456/is-favorited \
  -H "Authorization: Bearer <accessToken>"
```

---

### 35. Get Service Favorites Count

**Endpoint:** `GET /favorites/:serviceId/count`

**Path Parameters:**
- `serviceId`: Service ID to get count for

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 42
  },
  "message": "Favorites count retrieved",
  "timestamp": "2025-10-24T19:20:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET http://localhost:3001/api/v1/favorites/service456/count
```

---

### 36. Get Top Favorited Services

**Endpoint:** `GET /favorites/top`

**Query Parameters:**
- `limit`: Maximum results (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "service456",
        "title": "Professional Cleaning Service",
        "price": 50.00,
        "location": "Berlin, Germany",
        "favoritesCount": 42,
        "user": {
          "id": "user789",
          "username": "cleaner_pro",
          "name": "John Cleaner"
        }
      }
    ]
  },
  "message": "Top favorited services retrieved",
  "timestamp": "2025-10-24T19:25:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/favorites/top?limit=10"
```

---

## Additional Endpoints

### 37. Get Location by Postcode

**Endpoint:** `GET /location/postcode/:postcode`

**Path Parameters:**
- `postcode`: German postcode (5 digits)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "postcode": "10115",
    "city": "Berlin",
    "state": "Berlin",
    "country": "Germany",
    "latitude": 52.5200,
    "longitude": 13.4050
  },
  "timestamp": "2025-10-24T20:00:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET http://localhost:3001/api/v1/location/postcode/10115
```

---

### 38. Get Service Filters

**Endpoint:** `GET /services/filters`

**Query Parameters:**
- `type`: Filter type (e.g., "categories", "subcategories", "languages")

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "filters": [
      "Cleaning",
      "Plumbing",
      "Electrical",
      "Gardening",
      "IT Support"
    ]
  },
  "message": "Filter options",
  "timestamp": "2025-10-24T20:05:00.000Z"
}
```

**Example Request (curl):**
```bash
curl -X GET "http://localhost:3001/api/v1/services/filters?type=categories"
```

---

## Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2025-10-24T17:05:00.000Z",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error",
      "value": "invalid-value"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

### Common Errors

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address",
      "value": "not-an-email"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Permission Error (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Conflict (409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

## JWT Token Handling

### Token Structure

**Access Token:**
- Validity: 7 days
- Usage: In every API request in Authorization header

**Refresh Token:**
- Validity: 30 days
- Usage: To refresh the access token

### Token Storage

**Recommendations:**
- `localStorage` for web apps
- `SecureStore` for React Native
- `httpOnly Cookies` for maximum security (requires backend adjustment)

### Authorization Header Format

```
Authorization: Bearer <accessToken>
```

### Token Management

**Store tokens after login/register:**
- `accessToken`: Store in localStorage/sessionStorage
- `refreshToken`: Store in localStorage/sessionStorage (or httpOnly cookie for better security)

**Include token in requests:**
```
Authorization: Bearer <accessToken>
```

**Handle 401 errors:**
- Try to refresh token using `/auth/refresh-token` endpoint
- If refresh fails, redirect to login

---

## Validation Rules

### Email
- Format: `email@domain.com`
- Automatically stored as lowercase
- **Gmail Normalization:** For Gmail addresses, dots (.) are removed and +aliases are stripped
  - `test.user@gmail.com` → stored as `testuser@gmail.com`
  - `testuser+spam@gmail.com` → stored as `testuser@gmail.com`
  - This prevents duplicate accounts using Gmail tricks

### Username
- 3-30 characters
- Only letters, numbers, and underscores
- Must be unique

### Password
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&_-#)

### Phone
- Optional
- Format: +49... (with country code recommended)

### Postcode
- Optional
- 5 digits for Germany

### Business Documents
- Max 5 files
- PDF format only
- Max 5MB per file

### Profile Image
- Optional field for all users
- Supported formats: JPG, PNG, GIF, WebP
- Max 5MB per file
- Old image is automatically deleted when uploading a new one
- Accessible via `/uploads/images/` path

---

## Rate Limiting

**Currently DISABLED** - Rate limiting is turned off for easier development and testing.

**Note:** Rate limiting can be enabled later when needed by updating the middleware configuration.

---

## CORS

**Currently ALLOWS ALL ORIGINS** - CORS restrictions are disabled for easier development.

**Allowed:**
- All origins (*)
- All standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Headers: `Content-Type`, `Authorization`

**Note:** CORS can be restricted to specific origins later when deploying to production.

---

## Testing with cURL

**Test Registration:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "name": "Test User",
    "password": "TestPass123!",
    "accountType": "PRIVAT",
    "termsAccepted": true,
    "privacyAccepted": true
  }'
```

**Test Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Test Protected Endpoint:**
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

