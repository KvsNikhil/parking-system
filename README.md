# Parking System

## Overview

This is a Node.js and Express parking management API backed by MongoDB. It includes:

- JWT authentication
- bcrypt password hashing
- user registration and login
- parking location management
- booking management
- Swagger API documentation
- a browser-based database viewer

## Features

- Register and login users
- Create and manage parking locations
- Create bookings with user authentication
- Admin-only update of parking availability
- API docs via Swagger UI
- Live front-end viewer for data collections

## Installation

### Prerequisites

- Node.js
- npm
- MongoDB running locally

### Setup

```bash
cd parking-system
npm install
```

Create a `.env` file with:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/parkingDB
JWT_SECRET=secret123
```

### Run the server

```bash
cd parking-system
npm start
```

The app will be available at `http://localhost:3000`.

## Seed Data

To load sample data, run:

```bash
cd parking-system
npm run seed
```

This adds:

- Admin user: `admin@parking.com` / `admin123`
- Regular user: `user@parking.com` / `user123`
- Several sample parking locations

## API Documentation

Watch the Swagger docs at:

```text
http://localhost:3000/api-docs
```

Use the `Authorize` button and enter the token as:

```text
Bearer <token>
```

## Database Viewer

Open the browser-based viewer at:

```text
http://localhost:3000/db-viewer.html
```

## Project Structure

- `server.js` - main Express server
- `config/db.js` - MongoDB connection
- `controllers/` - route handlers
- `routes/` - API routes
- `models/` - Mongoose schemas
- `public/` - static view files
- `docs/` - Swagger setup
- `seed.js` - data seeding script
- `show-db.js` - database inspect script

## Notes

- Protected routes require `Bearer <token>` authorization.
- The viewer page fetches live data from the API.
- `POST /api/auth/register` and `POST /api/auth/login` are public routes.
