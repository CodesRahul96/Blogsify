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
