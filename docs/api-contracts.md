# AI-Powered Support Ticket Triage Dashboard - API Contracts

## Overview

This document defines the REST API contracts for the ticket triage system. All endpoints follow RESTful conventions and return JSON responses.

**Base URL:** `http://localhost:3000/api` (development)
**Production URL:** TBD

---

## Authentication

**MVP:** No authentication required (public endpoints)
**Future:** JWT Bearer token authentication

---

## API Conventions

### Request Headers
```
Content-Type: application/json
Accept: application/json
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": { /* optional additional error details */ }
  }
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT request
- `201 Created` - Successful POST request (resource created)
- `400 Bad Request` - Validation error, malformed request
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - AI service unavailable

---

## Endpoints

### 1. Create Ticket

**Endpoint:** `POST /api/tickets`

**Description:** Submit a new support ticket. This endpoint accepts customer-submitted ticket data, validates it, saves it to the database, triggers AI processing, and returns the created ticket with AI-generated metadata.

**Request Body:**
```json
{
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "subject": "Payment not processed",
  "description": "I tried to make a payment yesterday but it seems the transaction didn't go through. I received an error message saying 'Payment failed'. This is urgent as my subscription expires today."
}
```

**Request Validation:**
- `customerName` (required, string, 1-100 chars)
- `email` (required, valid email format, max 255 chars)
- `subject` (required, string, 1-200 chars)
- `description` (required, string, 10-5000 chars)

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "subject": "Payment not processed",
    "description": "I tried to make a payment yesterday but it seems the transaction didn't go through. I received an error message saying 'Payment failed'. This is urgent as my subscription expires today.",
    "category": "Billing",
    "priority": "Critical",
    "summary": "Customer reports payment failure with urgent subscription expiration concern. Payment attempted yesterday with error message 'Payment failed'. Subscription expires today.",
    "status": "New",
    "assignedTeam": "Billing",
    "aiConfidence": 0.92,
    "aiProcessedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:29:45.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Ticket created successfully"
}
```

**Response: 400 Bad Request (Validation Error)**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "customerName": "Customer name is required",
      "email": "Please provide a valid email address",
      "description": "Description must be at least 10 characters long"
    }
  }
}
```

**Response: 400 Bad Request (Invalid Email)**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Please provide a valid email address"
    }
  }
}
```

**Response: 429 Too Many Requests (Rate Limit)**
```json
{
  "success": false,
  "error": {
    "message": "Too many requests. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "retryAfter": 60
    }
  }
}
```

**Response: 503 Service Unavailable (AI Service Down)**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "subject": "Payment not processed",
    "description": "I tried to make a payment yesterday...",
    "category": "General Inquiry",
    "priority": "Medium",
    "summary": null,
    "status": "Processing",
    "assignedTeam": null,
    "aiConfidence": null,
    "aiProcessingError": "AI service temporarily unavailable. Ticket will be processed when service recovers.",
    "aiProcessedAt": null,
    "createdAt": "2024-01-15T10:29:45.000Z",
    "updatedAt": "2024-01-15T10:29:45.000Z"
  },
  "message": "Ticket created. AI processing pending."
}
```

**Processing Flow:**
1. Validate request body
2. Sanitize inputs
3. Create ticket document with status "Processing"
4. Call AI service (OpenAI API) with ticket data
5. Update ticket with AI results (category, priority, summary)
6. Set status to "New"
7. Return complete ticket object

**AI Processing Timeout:** 30 seconds
**Fallback:** If AI service fails, ticket is saved with default category/priority and status "Processing"

---

### 2. Get All Tickets

**Endpoint:** `GET /api/tickets`

**Description:** Retrieve all tickets with optional filtering, sorting, and pagination.

**Query Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `category` | string | No | Filter by category | `?category=Billing` |
| `priority` | string | No | Filter by priority | `?priority=Critical` |
| `status` | string | No | Filter by status | `?status=New` |
| `sortBy` | string | No | Sort field (createdAt, priority, category) | `?sortBy=createdAt` |
| `sortOrder` | string | No | Sort order (asc, desc) | `?sortOrder=desc` |
| `page` | number | No | Page number (default: 1) | `?page=2` |
| `limit` | number | No | Items per page (default: 50, max: 100) | `?limit=25` |

**Valid Values:**
- `category`: `Billing`, `Technical Support`, `Sales`, `General Inquiry`, `Bug Report`, `Feature Request`
- `priority`: `Critical`, `High`, `Medium`, `Low`
- `status`: `New`, `Processing`, `In Progress`, `Resolved`, `Closed`
- `sortBy`: `createdAt`, `priority`, `category`, `status`
- `sortOrder`: `asc`, `desc`

**Example Request:**
```
GET /api/tickets?category=Billing&priority=Critical&sortBy=createdAt&sortOrder=desc&page=1&limit=50
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "customerName": "John Doe",
        "email": "john.doe@example.com",
        "subject": "Payment not processed",
        "description": "I tried to make a payment yesterday...",
        "category": "Billing",
        "priority": "Critical",
        "summary": "Customer reports payment failure...",
        "status": "New",
        "assignedTeam": "Billing",
        "aiConfidence": 0.92,
        "aiProcessedAt": "2024-01-15T10:30:00.000Z",
        "createdAt": "2024-01-15T10:29:45.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
      // ... more tickets
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 243,
      "itemsPerPage": 50,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**Response: 400 Bad Request (Invalid Query Parameter)**
```json
{
  "success": false,
  "error": {
    "message": "Invalid query parameter",
    "code": "VALIDATION_ERROR",
    "details": {
      "category": "Invalid category. Must be one of: Billing, Technical Support, Sales, General Inquiry, Bug Report, Feature Request"
    }
  }
}
```

**Default Behavior:**
- If no query parameters: Returns all tickets, sorted by `createdAt` descending, page 1, limit 50
- If invalid filter value: Returns 400 error
- If no tickets match: Returns empty array with pagination info

---

### 3. Get Single Ticket

**Endpoint:** `GET /api/tickets/:id`

**Description:** Retrieve a single ticket by its ID.

**URL Parameters:**
- `id` (required, string) - Ticket MongoDB ObjectId

**Example Request:**
```
GET /api/tickets/507f1f77bcf86cd799439011
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "subject": "Payment not processed",
    "description": "I tried to make a payment yesterday but it seems the transaction didn't go through. I received an error message saying 'Payment failed'. This is urgent as my subscription expires today.",
    "category": "Billing",
    "priority": "Critical",
    "summary": "Customer reports payment failure with urgent subscription expiration concern. Payment attempted yesterday with error message 'Payment failed'. Subscription expires today.",
    "status": "New",
    "assignedTeam": "Billing",
    "aiConfidence": 0.92,
    "aiProcessingError": null,
    "aiProcessedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:29:45.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response: 404 Not Found**
```json
{
  "success": false,
  "error": {
    "message": "Ticket not found",
    "code": "NOT_FOUND",
    "details": {
      "id": "507f1f77bcf86cd799439011"
    }
  }
}
```

**Response: 400 Bad Request (Invalid ID Format)**
```json
{
  "success": false,
  "error": {
    "message": "Invalid ticket ID format",
    "code": "VALIDATION_ERROR",
    "details": {
      "id": "invalid-id-format"
    }
  }
}
```

---

### 4. Update Ticket

**Endpoint:** `PUT /api/tickets/:id`

**Description:** Update ticket fields (status, assignedTeam, category, priority). Used by support team to manage tickets.

**URL Parameters:**
- `id` (required, string) - Ticket MongoDB ObjectId

**Request Body (all fields optional):**
```json
{
  "status": "In Progress",
  "assignedTeam": "Billing Team",
  "category": "Billing",
  "priority": "Critical"
}
```

**Request Validation:**
- `status` (optional, enum: `New`, `Processing`, `In Progress`, `Resolved`, `Closed`)
- `assignedTeam` (optional, string, max 100 chars)
- `category` (optional, enum: valid categories)
- `priority` (optional, enum: `Critical`, `High`, `Medium`, `Low`)

**Example Request:**
```
PUT /api/tickets/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "status": "In Progress",
  "assignedTeam": "Billing Team"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "subject": "Payment not processed",
    "description": "I tried to make a payment yesterday...",
    "category": "Billing",
    "priority": "Critical",
    "summary": "Customer reports payment failure...",
    "status": "In Progress",
    "assignedTeam": "Billing Team",
    "aiConfidence": 0.92,
    "aiProcessedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:29:45.000Z",
    "updatedAt": "2024-01-15T11:15:30.000Z"
  },
  "message": "Ticket updated successfully"
}
```

**Response: 400 Bad Request (Invalid Status)**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "status": "Invalid status. Must be one of: New, Processing, In Progress, Resolved, Closed"
    }
  }
}
```

**Response: 404 Not Found**
```json
{
  "success": false,
  "error": {
    "message": "Ticket not found",
    "code": "NOT_FOUND"
  }
}
```

**Note:** Only provided fields are updated. Omitted fields remain unchanged.

---

### 5. Delete Ticket

**Endpoint:** `DELETE /api/tickets/:id`

**Description:** Delete a ticket. (Optional feature - may be disabled in production)

**URL Parameters:**
- `id` (required, string) - Ticket MongoDB ObjectId

**Example Request:**
```
DELETE /api/tickets/507f1f77bcf86cd799439011
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Ticket deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011"
  }
}
```

**Response: 404 Not Found**
```json
{
  "success": false,
  "error": {
    "message": "Ticket not found",
    "code": "NOT_FOUND"
  }
}
```

**Security Consideration:** In production, may require authentication and soft delete instead of permanent deletion.

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `AI_SERVICE_ERROR` | 503 | AI service unavailable or error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limiting

**MVP:** 
- Ticket creation: 10 requests per minute per IP
- All other endpoints: 100 requests per minute per IP

**Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1642234567
```

---

## Request/Response Examples

### Complete Ticket Submission Flow

**1. Submit Ticket:**
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Smith",
    "email": "jane.smith@example.com",
    "subject": "Unable to login to account",
    "description": "I have been trying to login to my account for the past hour but keep getting an error message. I have reset my password twice but still cannot access my account. This is preventing me from accessing important documents."
  }'
```

**2. Get All Tickets (Filtered):**
```bash
curl "http://localhost:3000/api/tickets?category=Technical%20Support&priority=High&sortBy=createdAt&sortOrder=desc"
```

**3. Get Single Ticket:**
```bash
curl http://localhost:3000/api/tickets/507f1f77bcf86cd799439011
```

**4. Update Ticket Status:**
```bash
curl -X PUT http://localhost:3000/api/tickets/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "assignedTeam": "Technical Support Team"
  }'
```

---

## API Versioning

**MVP:** No versioning (v1 implied)
**Future:** Version via URL path (`/api/v1/tickets`) or header (`Accept: application/vnd.api+json;version=1`)

---

*API contracts may evolve as requirements change. Breaking changes will be communicated clearly.*

