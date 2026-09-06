# Blogsify Server

The backend REST API service for **Blogsify — The Journal of Modern Ideas**, built with Node.js, Express.js, MongoDB Atlas, and JSON Web Tokens.

---

## 🚀 Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Blogsify?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_random_secret_string
FRONTEND_URL=http://localhost:5173
```

### 3. Start API Service
```bash
# Development (with nodemon auto-restart)
npm run dev

# Production
npm start
```
The API listens on port `5000` (or `PORT` from `.env`).

---

## 📡 REST API Reference

### Health & Monitoring
- `GET /api/health` — Check server status, database connectivity, and uptime.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account.
- `POST /api/auth/login` — Sign in and receive a JWT.
- `GET /api/auth/me` — Retrieve current authenticated session info.
- `PUT /api/auth/change-password` — Change password.
- `PUT /api/auth/update-username` — Update username.
- `DELETE /api/auth/delete-account` — Delete account and data.
- `GET /api/auth/users` — Admin member registry.
- `DELETE /api/auth/user/:id` — Admin account termination.

### Posts (`/api/posts`)
- `GET /api/posts` — Fetch paginated posts (filters: `category`, `search`, `page`, `limit`).
- `GET /api/posts/:id` — Retrieve full article by ID.
- `POST /api/posts` — Create a new article.
- `PUT /api/posts/:id` — Update an article.
- `DELETE /api/posts/:id` — Delete an article.
- `POST /api/posts/:id/like` — Toggle article reaction.
- `POST /api/posts/:id/comment` — Post discussion response.
- `DELETE /api/posts/:id/comment/:commentId` — Delete discussion response.
