# Blogsify Client

The modern frontend application for **Blogsify — The Journal of Modern Ideas**, built with React 19, Vite, Tailwind CSS, Framer Motion, and GitHub Flavored Markdown.

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
Ensure `VITE_BASE_URL` matches your backend address (default: `http://localhost:5000`):
```env
VITE_BASE_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```
The client will be running at `http://localhost:5173`.

---

## 🛠 Available Scripts

- `npm run dev`: Starts the local development server with hot module replacement (HMR).
- `npm run build`: Bundles and minifies the application into the `dist/` directory.
- `npm run preview`: Locally serves the production build from `dist/` to inspect final output.
- `npm run lint`: Runs ESLint across the codebase.

---

## 📖 Publishing & Markdown Guide

Articles support rich **GitHub Flavored Markdown (GFM)**:

### 1. Images & Step-by-Step Screenshots
```markdown
### Step 1: Open Developer Settings
Enable USB debugging from your device settings menu.

![Developer Settings Screenshot](https://example.com/screenshot.png)
*Figure 1.1: Enable USB debugging.*
```

### 2. Clickable Links
```markdown
[Read the documentation](https://example.com)
```

### 3. Tables & Code Blocks
```markdown
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique post identifier |

```javascript
console.log("Hello from Blogsify!");
```
```

---

## 📱 Responsive Design Standards

- **Mobile (<640px)**: Compact masthead, slide-down full navigation drawer with integrated authentication, and auto-scrolling dock.
- **Tablet (640px - 1024px)**: 2-column article grid, adaptive dashboard sidebars.
- **Desktop (>1024px)**: Full editorial spreads, category sub-bar, and 12-column front page grids.
