# AI-Powered Support Ticket Triage Dashboard - Domain Model

## Overview

This document defines the database schema and domain model for the ticket triage system. The model is designed to support ticket submission, AI processing, and dashboard operations.

---

## Database Choice

**Primary Database:** MongoDB (NoSQL document database)
**ODM:** Mongoose

**Rationale:**
- Flexible schema allows for rapid development and future extensions
- Document structure matches ticket objects naturally
- Easy integration with Node.js/Express
- Horizontal scaling capability for future growth

---

## Collections

### 1. Tickets Collection

The `tickets` collection stores all customer support tickets with their AI-processed metadata.

#### Mongoose Schema Definition

```javascript
const ticketSchema = new mongoose.Schema({
  // User-provided fields
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    maxlength: [255, 'Email cannot exceed 255 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  // AI-generated fields
  category: {
    type: String,
    enum: {
      values: ['Billing', 'Technical Support', 'Sales', 'General Inquiry', 'Bug Report', 'Feature Request'],
      message: 'Invalid category. Must be one of: Billing, Technical Support, Sales, General Inquiry, Bug Report, Feature Request'
    },
    default: 'General Inquiry',
    index: true
  },
  priority: {
    type: String,
    enum: {
      values: ['Critical', 'High', 'Medium', 'Low'],
      message: 'Invalid priority. Must be one of: Critical, High, Medium, Low'
    },
    default: 'Medium',
    index: true
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  
  // System fields
  status: {
    type: String,
    enum: {
      values: ['New', 'Processing', 'In Progress', 'Resolved', 'Closed'],
      message: 'Invalid status'
    },
    default: 'New',
    index: true
  },
  assignedTeam: {
    type: String,
    trim: true,
    maxlength: [100, 'Assigned team cannot exceed 100 characters']
  },
  
  // AI metadata
  aiConfidence: {
    type: Number,
    min: [0, 'AI confidence must be between 0 and 1'],
    max: [1, 'AI confidence must be between 0 and 1']
  },
  aiProcessingError: {
    type: String,
    trim: true
  },
  aiProcessedAt: {
    type: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  collection: 'tickets'
});

// Indexes for performance
ticketSchema.index({ category: 1, priority: -1 }); // Compound index for filtering
ticketSchema.index({ createdAt: -1 }); // For sorting by date
ticketSchema.index({ status: 1 }); // For filtering by status
ticketSchema.index({ email: 1 }); // For finding tickets by customer email

// Pre-save middleware to update updatedAt
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```

#### Schema Field Details

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `customerName` | String | Yes | Max 100 chars, trimmed | Customer's full name |
| `email` | String | Yes | Valid email format, max 255 chars | Customer's email address |
| `subject` | String | Yes | Max 200 chars, trimmed | Ticket subject line |
| `description` | String | Yes | Max 5000 chars, trimmed | Detailed ticket description |
| `category` | Enum | No (auto) | One of: Billing, Technical Support, Sales, General Inquiry, Bug Report, Feature Request | AI-assigned or default category |
| `priority` | Enum | No (auto) | One of: Critical, High, Medium, Low | AI-assigned or default priority |
| `summary` | String | No | Max 500 chars | AI-generated summary |
| `status` | Enum | No | One of: New, Processing, In Progress, Resolved, Closed | Current ticket status |
| `assignedTeam` | String | No | Max 100 chars | Suggested or assigned team |
| `aiConfidence` | Number | No | 0-1 | AI processing confidence score |
| `aiProcessingError` | String | No | - | Error message if AI processing fails |
| `aiProcessedAt` | Date | No | - | Timestamp when AI processing completed |
| `createdAt` | Date | Auto | - | Ticket creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

#### Indexes

**Single Field Indexes:**
- `category`: Fast filtering by category
- `priority`: Fast sorting/filtering by priority
- `status`: Fast filtering by status
- `createdAt`: Fast sorting by date (descending)
- `email`: Fast lookup of tickets by customer email

**Compound Indexes:**
- `{ category: 1, priority: -1 }`: Optimize common query pattern (filter by category, sort by priority)

#### Example Document

```json
{
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
}
```

---

## Data Validation Rules

### Customer Name
- **Required:** Yes
- **Type:** String
- **Min Length:** 1 character (after trim)
- **Max Length:** 100 characters
- **Validation:** Must not be empty after trimming whitespace
- **Sanitization:** Trim leading/trailing whitespace

### Email
- **Required:** Yes
- **Type:** String
- **Format:** Valid email address (RFC 5322 compliant)
- **Max Length:** 255 characters
- **Sanitization:** Convert to lowercase, trim whitespace
- **Example Valid:** `user@example.com`, `user.name@example.co.uk`
- **Example Invalid:** `notanemail`, `user@`, `@example.com`

### Subject
- **Required:** Yes
- **Type:** String
- **Min Length:** 1 character (after trim)
- **Max Length:** 200 characters
- **Validation:** Must not be empty after trimming whitespace
- **Sanitization:** Trim leading/trailing whitespace

### Description
- **Required:** Yes
- **Type:** String
- **Min Length:** 10 characters (after trim) - encourages detailed descriptions
- **Max Length:** 5000 characters
- **Validation:** Must not be empty and meet minimum length
- **Sanitization:** Trim leading/trailing whitespace, preserve newlines
- **Special Characters:** Support UTF-8 encoding (emojis, special chars allowed)

### Category (AI-Generated)
- **Required:** No (default: "General Inquiry")
- **Type:** Enum
- **Values:** `["Billing", "Technical Support", "Sales", "General Inquiry", "Bug Report", "Feature Request"]`
- **Validation:** Must be one of the allowed values
- **Fallback:** If AI fails or returns invalid value, default to "General Inquiry"

### Priority (AI-Generated)
- **Required:** No (default: "Medium")
- **Type:** Enum
- **Values:** `["Critical", "High", "Medium", "Low"]`
- **Validation:** Must be one of the allowed values
- **Fallback:** If AI fails or returns invalid value, default to "Medium"
- **Mapping Logic:**
  - Critical: Payment issues, service outages, security breaches
  - High: Major feature broken, urgent requests
  - Medium: Minor bugs, general questions
  - Low: Feature requests, non-urgent inquiries

### Summary (AI-Generated)
- **Required:** No
- **Type:** String
- **Max Length:** 500 characters
- **Format:** Plain text, 2-3 sentences
- **Content:** Should extract key issue, affected feature, customer impact

### Status
- **Required:** No (default: "New")
- **Type:** Enum
- **Values:** `["New", "Processing", "In Progress", "Resolved", "Closed"]`
- **Workflow:**
  - `New`: Ticket created, AI processing pending or completed
  - `Processing`: AI is currently processing the ticket
  - `In Progress`: Ticket assigned and being worked on
  - `Resolved`: Issue resolved, awaiting customer confirmation
  - `Closed`: Ticket closed/completed

---

## Relationships (Future Considerations)

### Current Design
- **No relationships** - Self-contained ticket documents
- All data needed for MVP is embedded in ticket document

### Future Extensions

#### Users Collection (Future)
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  role: Enum ['admin', 'manager', 'agent'],
  team: String,
  createdAt: Date,
  updatedAt: Date
}
```
**Relationship:** One-to-many with tickets (assignedAgent field)

#### Comments Collection (Future)
```javascript
{
  _id: ObjectId,
  ticketId: ObjectId (ref: 'Ticket'),
  authorId: ObjectId (ref: 'User'),
  content: String,
  isInternal: Boolean,
  createdAt: Date
}
```
**Relationship:** Many-to-one with tickets

#### Ticket History Collection (Future)
```javascript
{
  _id: ObjectId,
  ticketId: ObjectId (ref: 'Ticket'),
  changedBy: ObjectId (ref: 'User'),
  field: String,
  oldValue: Mixed,
  newValue: Mixed,
  changeType: Enum ['created', 'updated', 'status_changed'],
  timestamp: Date
}
```
**Relationship:** Many-to-one with tickets (audit trail)

---

## Data Migration Considerations

### Initial Setup
- No migration needed for MongoDB (schema-less)
- Mongoose handles validation and structure

### Future Migrations
- Add new fields: Simply update schema, Mongoose handles backward compatibility
- Change enum values: Update schema validation, existing data remains until updated
- Rename fields: Use migration script to update existing documents

---

## Performance Considerations

### Query Optimization
- Use indexes for frequently queried fields (category, priority, status, createdAt)
- Limit result sets with pagination (default: 50 tickets per page)
- Use projection to return only needed fields

### Storage Optimization
- Trim whitespace to reduce storage
- Limit text field lengths (description max 5000, summary max 500)
- Use ObjectId for _id (12 bytes vs longer strings)

### Index Strategy
- Create indexes on frequently filtered/sorted fields
- Monitor index usage and query performance
- Consider compound indexes for common query patterns

---

## Data Integrity

### Constraints
- Required fields enforced at schema level
- Enum validation prevents invalid values
- Email format validation
- String length limits

### Consistency
- Timestamps automatically managed by Mongoose
- Default values set for optional fields
- Atomic operations for ticket updates

### Error Handling
- Validation errors returned with field-level messages
- Invalid enum values default to safe fallbacks
- AI processing errors stored in `aiProcessingError` field

---

