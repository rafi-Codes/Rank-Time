@echo off
echo Installing dependencies...

:: Install production dependencies
npm install next@14.0.3 react@18.2.0 react-dom@18.2.0
npm install next-themes lucide-react mongoose mongodb next-auth@4.24.5

:: Install dev dependencies
npm install -D typescript @types/react @types/node @types/react-dom
npm install -D tailwindcss@3.3.0 postcss@8 autoprefixer@10.4.16
npm install -D @types/mongoose @types/bcryptjs

echo All dependencies installed successfully!
pause
