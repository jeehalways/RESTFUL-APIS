# Swedish Pastries Bakery Management System

## Description
This project manages inventory for a bakery specializing in Swedish pastries. Built with Express.js, TypeScript, and Zod for robust data validation, it provides a REST API to handle pastry inventory operations.

## Zod Schema Explanation

### `pastryCreateSchema`
Validates the structure of new pastry objects when creating entries, ensuring each has proper data types and required fields.

**Example:**
```typescript
const pastryCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"), 
  price: z.number().nonnegative("Price must be >= 0"),
  isVegan: z.boolean().optional(),
  ingredients: z.array(z.string()).optional()
});
```

### `pastrySchema`
Extends the create schema to include an ID field for existing pastry records, used for updates and retrievals.

**Example:**
```typescript
const pastrySchema = pastryCreateSchema.extend({
  id: z.number().int().positive()
});
```

### Why Zod?
- **Runtime Validation**: Catches invalid data before it enters your system
- **Type Safety**: Automatically generates TypeScript types from schemas
- **Clear Error Messages**: Provides specific feedback on validation failures
- **Schema Composition**: Easy to extend and modify validation rules

## How to Run the Code

### Prerequisites
- Node.js (version 14+)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install express zod
npm install -D @types/express @types/node typescript ts-node

# Run the server
npm run dev
```

### API Endpoints
- `GET /pastries` - Get all pastries
- `GET /pastries/:id` - Get pastry by ID  
- `POST /pastries` - Add new pastry
- `PUT /pastries/:id` - Update pastry
- `DELETE /pastries/:id` - Remove pastry

### Testing
The API has been tested and verified using Insomnia REST client. You can also test with curl, Postman, or any HTTP client.

**Sample Request:**
```bash
curl -X POST http://localhost:3000/pastries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kanelbulle",
    "type": "bulle", 
    "price": 25,
    "isVegan": false,
    "ingredients": ["flour", "butter", "sugar", "cinnamon"]
  }'
```

Server runs on `http://localhost:3000`