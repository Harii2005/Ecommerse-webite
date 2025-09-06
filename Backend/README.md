# Ecommerce Backend API Documentation

## Overview

This is a RESTful API for an ecommerce website built with Express.js and MongoDB. It provides authentication, item management, and cart functionality.

## Base URL

```
http://localhost:8080/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Register User

- **POST** `/api/auth/signup`
- **Description**: Register a new user
- **Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

#### 2. Login User

- **POST** `/api/auth/login`
- **Description**: Login existing user
- **Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response**: Same as register

#### 3. Get Profile

- **GET** `/api/auth/profile`
- **Description**: Get current user profile
- **Auth**: Required
- **Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Item Routes (`/api/items`)

#### 1. Get All Items

- **GET** `/api/items`
- **Description**: Get all items with optional filters
- **Query Parameters**:
  - `category`: Filter by category
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
  - `search`: Search by item name
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `sortBy`: Sort field (e.g., 'price', 'name', 'createdAt')
  - `sortOrder`: 'asc' or 'desc' (default: 'asc')
- **Example**: `/api/items?category=electronics&minPrice=100&maxPrice=1000&page=1&limit=5`

#### 2. Get Single Item

- **GET** `/api/items/:id`
- **Description**: Get item by ID

#### 3. Create Item (Admin Only)

- **POST** `/api/items`
- **Description**: Create new item
- **Auth**: Required (Admin only)
- **Body**:

```json
{
  "name": "iPhone 14",
  "description": "Latest iPhone",
  "price": 999.99,
  "category": "electronics",
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg",
  "rating": 4.5,
  "numReviews": 100
}
```

#### 4. Update Item (Admin Only)

- **PUT** `/api/items/:id`
- **Description**: Update existing item
- **Auth**: Required (Admin only)
- **Body**: Same as create (all fields optional)

#### 5. Delete Item (Admin Only)

- **DELETE** `/api/items/:id`
- **Description**: Delete item
- **Auth**: Required (Admin only)

### Cart Routes (`/api/cart`)

#### 1. Add to Cart

- **POST** `/api/cart`
- **Description**: Add item to user's cart
- **Auth**: Required
- **Body**:

```json
{
  "itemId": "item_id",
  "quantity": 2
}
```

#### 2. Get Cart

- **GET** `/api/cart`
- **Description**: Get user's cart
- **Auth**: Required

#### 3. Update Cart Item

- **PUT** `/api/cart/:itemId`
- **Description**: Update item quantity in cart
- **Auth**: Required
- **Body**:

```json
{
  "quantity": 3
}
```

#### 4. Remove from Cart

- **DELETE** `/api/cart/:itemId`
- **Description**: Remove item from cart
- **Auth**: Required

#### 5. Clear Cart

- **DELETE** `/api/cart`
- **Description**: Clear entire cart
- **Auth**: Required

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Sample Data

The API includes sample data that can be seeded using:

- **POST** `/api/seed` (Development only)

### Sample Users:

- Admin: `admin@ecommerce.com` / `admin123`
- User: `john@example.com` / `user123`
- User: `jane@example.com` / `user123`

### Categories Available:

- electronics
- clothing
- books
- home
- sports
- beauty
- toys
- food

## Development Endpoints

### Health Check

- **GET** `/api/health`
- **Description**: Check if server is running

### Seed Database

- **POST** `/api/seed`
- **Description**: Populate database with sample data (development only)
