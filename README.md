# AI-Powered Support Ticket Triage Dashboard

Full-stack application for automated ticket categorization, prioritization, and summarization using AI.

## Tech Stack

- **Backend:** Node.js 22+, Express.js, MongoDB, Mongoose
- **Frontend:** React 18+, Vite, Tailwind CSS
- **AI:** OpenAI API (GPT-3.5-turbo)

## Project Structure

- `backend/` - Express.js API server
- `frontend/` - React application
- `docs/` - Project documentation

## Quick Start

### Prerequisites

- Node.js 22+ LTS installed
- MongoDB installed and running (or MongoDB Atlas account)
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
npm run dev
```

Backend runs on http://localhost:3000

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on http://localhost:5173

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Features

### User Story 1: Customer Submitting a Ticket
- ✅ Ticket submission form with validation
- ✅ AI-powered categorization
- ✅ AI-powered priority assignment
- ✅ AI-generated summaries
- ✅ Ticket ID display after submission

## Documentation

See `docs/` directory for detailed documentation:
- `vision.md` - Project vision and features
- `user-stories.md` - User stories
- `requirements.md` - Requirements and edge cases
- `architecture.md` - System architecture
- `stack-decisions.md` - Technology stack decisions
- `domain-model.md` - Database schema
- `api-contracts.md` - API documentation
- `project-setup.md` - Setup instructions

## License

MIT
