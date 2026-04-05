# StayMate

A full-stack housing and mess facility booking platform for college students.

## Features
- Student and owner signup/login with contact number
- Property search by type, sharing, college and search phrase
- Owner dashboard for listing management
- Image upload for property listings
- Booking flow with dummy Razorpay transaction simulation
- MongoDB-backed backend with Node.js/Express
- React frontend with Tailwind CSS and modern UI

## How to Add a Listing (for Owners)

1. Sign up or log in as an owner.
2. Go to the Owner Dashboard.
3. Click "Add new listing".
4. Fill in the form:
   - Title, description, type (PG/Hostel/Flat/Mess), sharing (Single/Double/etc.)
   - Price, college, location, contact number
   - Upload a cover image (optional, or use default)
5. Click "Publish listing" to save.

## Setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
3. Configure backend env:
   - Copy `backend/.env.example` to `backend/.env`
   - Update `MONGO_URI` and `JWT_SECRET` if needed

## Run locally

Start backend:
```bash
cd backend
npm run dev
```

Start frontend:
```bash
cd frontend
npm run dev
```

Open the app at `http://localhost:3000`.

## Notes
- The Razorpay flow is mocked in the backend for demo purposes.
- Use MongoDB locally or Atlas for persistence.
