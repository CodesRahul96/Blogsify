@echo off
echo Starting Blogsify Server...
start "Blogsify Server" cmd /k "cd server && npm run dev"

echo Starting Blogsify Client...
start "Blogsify Client" cmd /k "cd client && npm run dev"

echo Application started! Happy coding.
