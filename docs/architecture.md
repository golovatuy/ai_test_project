# AI-Powered Support Ticket Triage Dashboard - Architecture

## High-Level Architecture Overview

This document describes the system architecture for the AI-Powered Support Ticket Triage Dashboard, including component diagrams, data flow, and system design decisions.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────────┐      │
│  │  Ticket Submission   │         │   Triage Dashboard       │      │
│  │      Form            │         │  (List & Detail View)    │      │
│  │  (React Component)   │         │   (React Components)     │      │
│  └──────────────────────┘         └──────────────────────────┘      │
│           │                                   │                     │
│           │                                   │                     │
│           └───────────────┬───────────────────┘                     │
│                           │                                         │
│                   ┌───────▼────────┐                                │
│                   │  React App     │                                │
│                   │  (Vite)        │                                │
│                   │  Tailwind CSS  │                                │
│                   └───────┬────────┘                                │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                      API LAYER (Express.js)                         │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Middleware Layer                          │   │
│  │  • CORS                                                      │   │
│  │  • Helmet (Security)                                         │   │
│  │  • Express-validator (Input Validation)                      │   │
│  │  • Rate Limiting                                             │   │
│  │  • Error Handling                                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                            │                                        │
│  ┌─────────────────────────▼────────────────────────────────────┐   │
│  │                    Route Handlers                            │   │
│  │                                                              │   │
│  │  POST   /api/tickets       → Create ticket, trigger AI       │   │
│  │  GET    /api/tickets       → List all tickets (filtered)     │   │
│  │  GET    /api/tickets/:id   → Get single ticket               │   │
│  │  PUT    /api/tickets/:id   → Update ticket                   │   │
│  │  DELETE /api/tickets/:id   → Delete ticket                   │   │
│  └─────────────────────────┬────────────────────────────────────┘   │
│                            │                                        │
│  ┌─────────────────────────▼────────────────────────────────────┐   │
│  │                  Service Layer                               │   │
│  │                                                              │   │
│  │  • Ticket Service (CRUD operations)                          │   │
│  │  • AI Service (OpenAI integration)                           │   │
│  │  • Validation Service                                        │   │
│  │  • Queue Service (for AI processing)                         │   │
│  └─────────────────────────┬────────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         │                   │                   │
┌────────▼────────┐  ┌───────▼────────┐  ┌──────▼─────────┐
│   MongoDB       │  │   OpenAI API   │  │   (Future)     │
│   Database      │  │   (AI Service) │  │   Redis Cache  │
│                 │  │                │  │   Queue        │
│  • tickets      │  │  • Categorize  │  │                │
│  • (future)     │  │  • Prioritize  │  │                │
│    users        │  │  • Summarize   │  │                │
└─────────────────┘  └────────────────┘  └────────────────┘
```

---

## Architecture Layers

### 1. Client Layer (Frontend)

**Technology:** React 18+ with Tailwind CSS, Vite

**Components:**
- **Ticket Submission Form:** Customer-facing form to submit tickets
- **Triage Dashboard:** Support team dashboard with ticket list and detail views
- **Shared Components:** Reusable UI components (buttons, cards, modals, etc.)

**Responsibilities:**
- User interface rendering
- Form validation (client-side)
- API communication via HTTP
- State management (React Context/State)
- Error handling and user feedback

**Key Features:**
- Responsive design (mobile, tablet, desktop)
- Loading states
- Error messages
- Filtering and sorting UI

---

### 2. API Layer (Backend)

**Technology:** Node.js 22+ with Express.js 4+

#### 2.1 Middleware Layer

**Components:**
- **CORS:** Cross-origin resource sharing configuration
- **Helmet:** Security headers
- **express-validator:** Request validation and sanitization
- **Rate Limiting:** Prevent abuse (express-rate-limit)
- **Error Handler:** Centralized error handling middleware
- **Morgan:** HTTP request logging

**Responsibilities:**
- Request preprocessing
- Security enforcement
- Input validation
- Error handling

#### 2.2 Route Handlers

**Endpoints:**
```
POST   /api/tickets        - Create new ticket (triggers AI processing)
GET    /api/tickets        - Get all tickets (with query params: category, priority, status)
GET    /api/tickets/:id    - Get single ticket by ID
PUT    /api/tickets/:id    - Update ticket (status, assignment, etc.)
DELETE /api/tickets/:id    - Delete ticket (optional)
```

**Responsibilities:**
- Handle HTTP requests/responses
- Call appropriate services
- Return standardized JSON responses
- Error handling and status codes

#### 2.3 Service Layer

**Services:**

**Ticket Service:**
- Create, read, update, delete tickets
- Database operations (MongoDB/Mongoose)
- Business logic for tickets

**AI Service:**
- Integration with OpenAI API
- Prompt engineering for categorization, prioritization, summarization
- Error handling and retry logic
- Response parsing and validation

**Validation Service:**
- Additional business rule validation
- Email validation
- Data sanitization

**Queue Service (Future):**
- Async AI processing
- Retry logic for failed AI calls
- Priority-based processing

**Responsibilities:**
- Business logic implementation
- External service integration
- Data transformation
- Error handling

---

### 3. Data Layer

#### 3.1 MongoDB Database

**Collections:**

**tickets:**
```javascript
{
  _id: ObjectId,
  customerName: String (required, max: 100),
  email: String (required, valid email),
  subject: String (required, max: 200),
  description: String (required, max: 5000),
  category: String (enum: ['Billing', 'Technical Support', 'Sales', 'General Inquiry', 'Bug Report', 'Feature Request']),
  priority: String (enum: ['Critical', 'High', 'Medium', 'Low']),
  summary: String (AI-generated, max: 500),
  status: String (enum: ['New', 'In Progress', 'Resolved', 'Closed'], default: 'New'),
  assignedTeam: String (optional),
  aiConfidence: Number (0-1, optional),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Indexes:**
- `{ category: 1 }` - For filtering by category
- `{ priority: 1 }` - For sorting by priority
- `{ createdAt: -1 }` - For sorting by date
- `{ status: 1 }` - For filtering by status
- `{ category: 1, priority: -1 }` - Compound index for common queries

**Responsibilities:**
- Persistent data storage
- Data integrity
- Query optimization via indexes

---

#### 3.2 External Services

**OpenAI API:**
- Categorization: Single API call with structured output
- Prioritization: Single API call with structured output
- Summarization: Single API call with text output
- Can be combined into single call for efficiency

**Responsibilities:**
- AI-powered ticket analysis
- Natural language processing

---

## Data Flow

### Ticket Submission Flow

```
1. User fills out form (Frontend)
   ↓
2. Client-side validation
   ↓
3. POST /api/tickets (HTTP Request)
   ↓
4. Middleware: CORS, validation, rate limiting
   ↓
5. Route Handler: POST /api/tickets
   ↓
6. Ticket Service: Save ticket to DB (status: "Processing")
   ↓
7. AI Service: Call OpenAI API
   ├─ Categorize ticket
   ├─ Assign priority
   └─ Generate summary
   ↓
8. Ticket Service: Update ticket with AI results
   ↓
9. Return response to client
   ↓
10. Frontend: Show success message + ticket ID
```

### Dashboard View Flow

```
1. User opens dashboard (Frontend)
   ↓
2. GET /api/tickets (HTTP Request, with optional query params)
   ↓
3. Middleware: CORS, validation
   ↓
4. Route Handler: GET /api/tickets
   ↓
5. Ticket Service: Query MongoDB with filters
   ↓
6. Apply sorting (by priority, date, etc.)
   ↓
7. Paginate results (if needed)
   ↓
8. Return JSON response
   ↓
9. Frontend: Render ticket list with filters/sorting UI
```

### Error Handling Flow

```
1. Error occurs (any layer)
   ↓
2. Error handler middleware catches it
   ↓
3. Log error (Winston)
   ↓
4. Format error response:
   {
     success: false,
     error: {
       message: "User-friendly message",
       code: "ERROR_CODE",
       details: {} // optional
     }
   }
   ↓
5. Return appropriate HTTP status code
   ↓
6. Frontend: Display error message to user
```

---

## Component Interaction Diagram

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP Request
       │
┌──────▼──────────────────────────────────┐
│          Express.js API                 │
│                                         │
│  ┌──────────────┐    ┌──────────────┐   │
│  │   Routes     │───▶│   Services   │   │
│  └──────────────┘    └───────┬──────┘   │
│         │                    │          │
│         │                    │          │
│  ┌──────▼──────────┐  ┌──────▼──────┐   │
│  │   Middleware    │  │    Models   │   │
│  └─────────────────┘  └───────┬─────┘   │
└───────────────────────────────┼─────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼───┐ ┌─────▼─────┐ ┌───▼─────┐
            │  MongoDB  │ │  OpenAI   │ │  (Queue)│
            │           │ │    API    │ │  Future │
            └───────────┘ └───────────┘ └─────────┘
```

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │   Frontend   │      │    Backend   │                     │
│  │   (Vercel/   │◄────►│  (Heroku/    │                     │
│  │  Netlify)    │      │  Railway/    │                     │
│  │   or CDN     │      │   Render)    │                     │
│  └──────────────┘      └──────┬───────┘                     │
│                               │                             │
│                        ┌──────▼───────┐                     │
│                        │   MongoDB    │                     │
│                        │  (Atlas)     │                     │
│                        └──────────────┘                     │
│                                                             │
│  External Services:                                         │
│  • OpenAI API                                               │
│  • (Future) Redis, Queue Service                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Security Layers

1. **Transport Layer:**
   - HTTPS/TLS in production
   - Secure API key storage (environment variables)

2. **Application Layer:**
   - Helmet.js for security headers
   - CORS configuration (restrict origins in production)
   - Input validation and sanitization
   - Rate limiting (prevent abuse)
   - SQL/NoSQL injection prevention (Mongoose parameterized queries)

3. **Authentication (Future):**
   - JWT tokens for API authentication
   - Password hashing with bcrypt
   - Role-based access control (RBAC)

4. **Data Layer:**
   - Encrypted database connections
   - Environment variable secrets
   - No sensitive data in logs

---

## Scalability Considerations

### Current (MVP)
- Single server deployment
- Direct database connections
- Synchronous AI processing

### Future Scalability
- **Horizontal Scaling:**
  - Load balancer for multiple API instances
  - Stateless API design (JWT tokens)
  - CDN for frontend assets

- **Database Scaling:**
  - MongoDB replica sets
  - Read replicas for dashboard queries
  - Connection pooling

- **AI Processing:**
  - Queue system (Bull/BullMQ) for async processing
  - Worker processes for AI calls
  - Caching AI responses (Redis)

- **Caching:**
  - Redis for frequently accessed data
  - Frontend caching (React Query/SWR)
  - CDN caching for static assets

---

## Error Handling Strategy

### Error Types

1. **Client Errors (4xx):**
   - Validation errors (400)
   - Not found (404)
   - Rate limit exceeded (429)

2. **Server Errors (5xx):**
   - AI service failures (503)
   - Database errors (500)
   - Internal server errors (500)

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "User-friendly error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Error Handling Layers
1. **Service Layer:** Throw errors with context
2. **Route Handlers:** Catch and format errors
3. **Error Middleware:** Final error formatting and logging
4. **Frontend:** Display user-friendly messages

---

## Performance Optimization

### Backend
- Database indexes on frequently queried fields
- Pagination for large result sets
- Connection pooling
- Response compression (gzip)

### Frontend
- Code splitting (lazy loading)
- Virtual scrolling for large lists
- Debounced search/filter inputs
- React.memo for expensive components
- Image optimization (if needed)

### API
- Efficient database queries (select only needed fields)
- Caching strategies (future: Redis)
- Batch processing for AI calls (future)

---

## Monitoring & Logging

### Logging Strategy
- **Winston/Pino** for structured logging
- Log levels: error, warn, info, debug
- Log errors with stack traces
- Log API requests (morgan)

### Metrics to Monitor
- API response times
- Error rates
- AI API latency and success rate
- Database query performance
- Ticket processing time

### Future Monitoring
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Uptime monitoring
- Analytics for user behavior

