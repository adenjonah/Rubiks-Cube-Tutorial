# Troubleshooting Guide

This document provides solutions for common issues you might encounter when setting up and running the Rubik's Cube White Side Solver application.

## Installation Issues

### Missing Dependencies

If you encounter errors about missing dependencies, run the following commands:

```bash
# For backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# For frontend dependencies
cd frontend
npm install
cd ..
```

### web-vitals Error

If you see this error:
```
ERROR in ./src/reportWebVitals.js
Module not found: Error: Can't resolve 'web-vitals'
```

Fix it by running:
```bash
cd frontend
npm install web-vitals@2.1.4
```

Or by simplifying the `reportWebVitals.js` file:
```javascript
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Simplified version that doesn't require web-vitals
    console.log('Performance reporting is disabled');
  }
};

export default reportWebVitals;
```

## Running the Application

### Backend Won't Start

If you see "Address already in use" errors:
1. Find the process using port 5000:
   ```bash
   lsof -i :5000
   ```
2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

### Frontend Won't Start

If you see "Address already in use" errors for port 3000:
1. Find the process using port 3000:
   ```bash
   lsof -i :3000
   ```
2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

### run.sh Script Issues

If the `run.sh` script doesn't work:
1. Make sure it's executable:
   ```bash
   chmod +x run.sh
   ```
2. Start the backend and frontend separately:
   ```bash
   # Terminal 1
   cd backend
   python -m flask run
   
   # Terminal 2
   cd frontend
   npm start
   ```

## Browser Issues

### Blank Page or Connection Errors

1. Ensure both servers are running
2. Check if the backend is running on port 5000: http://localhost:5000/
3. Check if the frontend is running on port 3000: http://localhost:3000/

### API Errors in Console

If you see API connection errors in your browser console:
1. Verify that the backend server is running
2. Check if the `proxy` field in `frontend/package.json` is set to `"http://localhost:5000"`
3. Restart the frontend server after making changes

## Image Loading Issues

If images don't load, ensure you have:
1. Added proper image files to the `frontend/public/images/` directory
2. Named the files exactly as referenced in `backend/data.json` 