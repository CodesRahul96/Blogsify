# Blogsify — The Journal of Modern Ideas

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248.svg)](https://www.mongodb.com/)

A modern, full-stack editorial publishing platform designed for engineering breakdowns, culture dispatches, and in-depth investigative stories. Features full Markdown authoring with inline imagery and tables, video dispatches, curated topic tags, ambient light/dark theme switching, and robust JWT-authenticated contributor/admin dashboards.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Layout](#-project-directory-layout)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [How to Use & Publish Stories](#-how-to-use--publish-stories)
  - [Writing Rich Markdown Articles](#writing-rich-markdown-articles)
  - [Embedding Screenshots & Step-by-Step Photos (XDA Style)](#embedding-screenshots--step-by-step-photos-xda-style)
  - [Adding Video Links & Dispatches](#adding-video-links--dispatches)
  - [Using the Interactive Label Picker](#using-the-interactive-label-picker)
- [API Reference](#-api-reference)
- [Scripts & Maintenance](#-scripts--maintenance)

---

## ✨ Key Features

- **Editorial Reading Experience**:
  - High-precision typography with serif mastheads, legible body copy, and reading progress indicators.
  - Seamless dark and light mode adaptation with smooth contrast transitions.
  - Video player integration supporting YouTube, Vimeo, and direct MP4/WebM streams.
  - GitHub Flavored Markdown (`remark-gfm`) with automatic link detection, copy-to-clipboard story sharing, and tables.
- **Contributor & Admin Desks**:
  - **User Dashboard**: Live analytics (total stories published, likes received, comments), Markdown editor, interactive label picker, and real-time drafts manager.
  - **Admin Dashboard**: System-wide story management, categorized filtering, and searchable member registry.
  - **Account & Security**: Profile bio customization, password strength verification meter, and secure account lifecycle management.
- **Cross-Device Responsiveness**:
  - 100% fluid layouts across mobile smartphones, tablets, and ultra-wide desktop monitors.
  - Mobile-friendly navigation drawer with integrated profile access and theme toggling.
  - Responsive floating dock navigation with touch constraints (`max-w-[95vw]`).

---

## 🏛 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Blogsify Client (Vite)                   │
│  React 19 • Tailwind CSS • Framer Motion • React-Markdown   │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Blogsify Server (Node.js)                │
│       Express 4.21 • JWT Auth • Helmet • CORS Rate Limits   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Atlas Cloud Database               │
│         Users Collection   •   Posts & Comments Indices     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, React Markdown, Remark GFM, React Router DOM v7, React Icons, React Toastify |
| **Backend** | Node.js, Express.js, Mongoose 8, MongoDB Native Driver, JSON Web Tokens (JWT), bcryptjs, Helmet, CORS, Dotenv |
| **Database** | MongoDB Atlas with compound indexes on `category`, `tags`, and `createdAt` |

---

## 📂 Project Directory Layout

```
Blogsify/
├── client/                     # Frontend Vite Application
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Logos, brand typography, fallback posters
│   │   ├── components/
│   │   │   ├── about/          # Team and editorial philosophy cards
│   │   │   ├── auth/           # PasswordChecker, strength meters
│   │   │   ├── dashboard/      # User & Admin statistics widgets
│   │   │   ├── home/           # HeroSection, RecentBlogsSection, BlogCard
│   │   │   ├── layout/         # Masthead Navbar, Footer, Loader
│   │   │   └── ui/             # GlassCard, Dock, LabelPicker, VideoPlayer
│   │   ├── context/            # AuthContext, ThemeContext (light/dark)
│   │   ├── pages/              # Home, Blogs, BlogDetails, Login, SignUp,
│   │   │                       # UserDashboard, AdminDashboard, Profile,
│   │   │                       # About, Contact, Support, Guidelines, etc.
│   │   ├── App.jsx             # Top-level routing & layout wrappers
│   │   ├── index.css           # Tailwind configuration & typography layer
│   │   └── main.jsx            # DOM entry point
│   ├── .env.example            # Client environment template
│   └── package.json
│
├── server/                     # Backend REST API
│   ├── middleware/
│   │   └── auth.js             # JWT bearer verification & admin check
│   ├── models/
│   │   ├── Post.js             # Article schema with tags, likes, comments
│   │   └── User.js             # User account schema with password hash
│   ├── routes/
│   │   ├── auth.js             # Registration, login, profile, user list
│   │   └── posts.js            # Paginated articles, likes, comments
│   ├── index.js                # Express app, health checks & error handler
│   ├── .env.example            # Server environment template
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** database URI (or local MongoDB running on `mongodb://localhost:27017`)

---

### 1. Clone Repository

```bash
git clone https://github.com/codesrahul96/blogsify.git
cd blogsify
```

---

### 2. Backend Setup

1. Open a terminal and switch to the `server/` directory:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Blogsify?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_random_secret_string
   FRONTEND_URL=http://localhost:5173
   ```

3. Launch the server:
   ```bash
   # Development (with nodemon hot-reload)
   npm run dev

   # Production
   npm start
   ```
   The server will start on `http://localhost:5000`. You can test health at `http://localhost:5000/api/health`.

---

### 3. Frontend Setup

1. In another terminal tab, switch to the `client/` directory:
   ```bash
   cd client
   npm install
   ```

2. Configure client environment:
   ```bash
   cp .env.example .env
   ```
   Verify `.env` points to your backend:
   ```env
   VITE_BASE_URL=http://localhost:5000
   ```

3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## ✍️ How to Use & Publish Stories

### Writing Rich Markdown Articles

When composing stories in your **Writer Dashboard** (`/dashboard`), use standard Markdown formatting:

```markdown
# Level 1 Heading (Main Section)
## Level 2 Heading (Subsection)
### Level 3 Heading

You can write **bold text**, *italic commentary*, or ~~strikethrough text~~.

> Editorial quote or advisory note to emphasize key takeaways.

* Unordered item 1
* Unordered item 2

1. Numbered step 1
2. Numbered step 2
```

---

### Embedding Screenshots & Step-by-Step Photos (XDA Style)

To add screenshots, diagrams, and step-by-step photos like those on XDA-Developers or tech blogs:

```markdown
### Step 1: Access Developer Options
Open the Android Settings application, scroll down to **About Phone**, and tap **Build Number** 7 times.

![Developer Options Screen](https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80)
*Figure 1.1: Developer Options unlocked in Settings.*

---

### Step 2: Verify ADB Connection
Connect your device to your workstation via USB and execute:

```bash
adb devices
```

![ADB Terminal Verification](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80)
*Figure 1.2: Terminal output confirming USB debugging authorization.*
```

> 💡 **Image Hosting Tip:** You can host your images on free image hosts like [Imgur](https://imgur.com) or upload them directly to a GitHub repository/issue and paste the raw image link.

---

### Adding Video Links & Dispatches

In the **Video URL (YouTube, Vimeo, MP4)** input field when publishing:
- **YouTube Links**: Paste any regular URL (`https://www.youtube.com/watch?v=...`) or short link (`https://youtu.be/...`).
- **Vimeo Links**: Paste standard Vimeo links (`https://vimeo.com/...`).
- **Direct Video Files**: Paste any direct `.mp4` or `.webm` link.

The application automatically embeds a custom-styled, responsive player at the top of the article.

---

### Using the Interactive Label Picker

When composing an article:
1. Click any pre-defined category pill (e.g., `#Artificial Intelligence`, `#Cybersecurity`, `#Engineering`, `#Tutorial`).
2. Type custom tags into the tag field and press **Enter** or **,** to add them.
3. Readers can tap any hashtag on the blog cards or article footers to instantly filter all stories tagged under that topic.

---

## 📡 API Reference

### Auth Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with username, email, and strong password |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user session profile |
| `PUT` | `/api/auth/change-password` | Authenticated | Update user password |
| `PUT` | `/api/auth/update-username` | Authenticated | Update username |
| `DELETE`| `/api/auth/delete-account` | Authenticated | Permanently delete own user account |
| `GET` | `/api/auth/users` | Admin | List all registered members |
| `DELETE`| `/api/auth/user/:id` | Admin | Terminate a user account |

### Post Endpoints (`/api/posts`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | Paginated list of articles (supports `category`, `search`, `page`, `limit`) |
| `GET` | `/api/posts/:id` | Public | Retrieve article details and increment view count |
| `POST` | `/api/posts` | Authenticated | Create a new article |
| `PUT` | `/api/posts/:id` | Author / Admin | Update article content or metadata |
| `DELETE`| `/api/posts/:id` | Author / Admin | Delete an article |
| `POST` | `/api/posts/:id/like` | Authenticated | Toggle like/clap reaction |
| `POST` | `/api/posts/:id/comment` | Authenticated | Add a discussion comment |
| `DELETE`| `/api/posts/:id/comment/:commentId` | Author / Admin | Delete a comment |

### System Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Service uptime, database status, and system metrics |

---

## 📜 Scripts & Maintenance

### Client (`/client`)
```bash
npm run dev      # Run local development server
npm run build    # Build optimized production bundle
npm run preview  # Preview production build locally
npm run lint     # Lint source code with ESLint
```

### Server (`/server`)
```bash
npm run dev      # Run API server with nodemon auto-reload
npm start        # Run production API server
```

---

## ⚖️ License

This project is licensed under the [ISC License](LICENSE).
