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
