# Blogsify Client

This is the client-side of the Blogsify application, a modern blogging platform. It is built with React and Vite, and it uses Tailwind CSS for styling.

## Features

- User authentication (signup, login, logout)
- View, create, edit, and delete blog posts
- User and Admin dashboards
- Responsive design

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server.
- **React Router**: For client-side routing.
- **Tailwind CSS**: A utility-first CSS framework.
- **Axios**: For making HTTP requests to the server.
- **Context API**: for state management.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed on your machine.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/codesrahul96/blogsify.git
    ```
2.  Navigate to the client directory:
    ```sh
    cd blogsify/client
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the Development Server

To run the client in development mode, execute the following command:

```sh
npm run dev
```

This will start the development server, and you can view the application in your browser at `http://localhost:5173`.

### Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the code using ESLint.
-   `npm run preview`: Starts a local server to preview the production build.

## Project Structure

```
client
├── public
│   └── ... # Public assets
├── src
│   ├── assets
│   │   └── ... # Images, icons, etc.
│   ├── components
│   │   ├── auth # Auth-related components
│   │   ├── home # Components for the home page
│   │   └── ... # Other shared components
│   ├── context
│   │   └── AuthContext.jsx # Auth context for state management
│   ├── pages
│   │   ├── AdminDashboard.jsx
│   │   ├── BlogDetails.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   └── ... # Other page components
│   ├── App.jsx # Main application component with routing
│   ├── index.css # Global styles
│   └── main.jsx # Entry point of the application
├── .gitignore
├── package.json
└── ... # Configuration files
```

# Blogsify Server

This is the server-side of the Blogsify application. It is a Node.js application built with Express.js and MongoDB. It provides a RESTful API for managing users and blog posts.

## Features

-   User authentication with JWT (signup, login)
-   CRUD operations for blog posts
-   Liking and commenting on posts
-   Admin functionalities (e.g., deleting users)
-   Password management (change, reset)

## Technologies Used

-   **Node.js**: A JavaScript runtime environment.
-   **Express.js**: A web framework for Node.js.
-   **MongoDB**: A NoSQL database.
-   **Mongoose**: An ODM for MongoDB.
-   **JWT (JSON Web Tokens)**: For user authentication.
-   **bcryptjs**: For password hashing.
-   **CORS**: For enabling Cross-Origin Resource Sharing.
-   **Dotenv**: For managing environment variables.
-   **Helmet**: For securing HTTP headers.

## Getting Started

### Prerequisites

-   Node.js and npm (or yarn) installed on your machine.
-   MongoDB Atlas account or a local MongoDB instance.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/codesrahul96/blogsify.git
    ```
2.  Navigate to the server directory:
    ```sh
    cd blogsify/server
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:

```
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
FRONTEND_URL=<your_frontend_url>
```

-   `MONGODB_URI`: The connection string for your MongoDB database.
-   `JWT_SECRET`: A secret key for signing JWTs.
-   `FRONTEND_URL`: The URL of the frontend application (e.g., `http://localhost:5173`).

### Running the Development Server

To run the server in development mode, execute the following command:

```sh
npm run dev
```

This will start the development server using `nodemon`, which will automatically restart the server on file changes. The server will be running on `http://localhost:5000` by default.

### Available Scripts

-   `npm start`: Starts the server in production mode.
-   `npm run dev`: Starts the server in development mode with `nodemon`.

## API Endpoints

### Auth Routes (`/api/auth`)

-   `POST /register`: Register a new user.
-   `POST /login`: Log in a user and get a JWT.
-   `PUT /change-password`: Change the current user's password.
-   `PUT /reset-password/:id`: Reset a user's password (admin only).
-   `DELETE /delete-account`: Delete the current user's account.
-   `DELETE /user/:id`: Delete a user account (admin only).
-   `PUT /update-username`: Update the current user's username.
-   `PUT /sync-posts`: Sync posts from an old username to the current one.
-   `PUT /update-avatar`: Update the current user's avatar.
-   `GET /users`: Get a list of all users (admin only).

### Posts Routes (`/api/posts`)

-   `GET /`: Get all posts with pagination.
-   `GET /:id`: Get a single post by ID.
-   `POST /`: Create a new post.
-   `PUT /:id`: Update a post.
-   `DELETE /:id`: Delete a post.
-   `POST /:id/like`: Like or unlike a post.
-   `POST /:id/comment`: Add a comment to a post.
-   `DELETE /:id/comment/:commentId`: Delete a comment from a post.

## Project Structure

```
server
├── middleware
│   └── auth.js # Auth middleware (auth, isAdmin)
├── models
│   ├── Post.js # Post schema
│   └── User.js # User schema
├── routes
│   ├── auth.js # Authentication routes
│   └── posts.js # Post-related routes
├── .env.example # Example environment variables
├── index.js # Main server file
├── package.json
└── ...
```
