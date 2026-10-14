# USOF

USOF is a Stack Overflow-inspired question and answer forum. Users can publish posts in categories, comment, like, favorite posts, and earn awards through a gacha system. The project is split into three parts:

- **backend**: REST API built with Express.js and MySQL, with Swagger documentation.
- **frontend**: React application built with Vite.
- **admin_panel**: plain html admin interface served by the backend.

## Screenshots

I havent added any yet

## Requirements and Dependencies

Before running the project, make sure the following are installed:

- Node.js and npm
- MySQL Server

The JavaScript dependencies are installed with npm from each package's `package.json`:

- **Backend**: Express.js, mysql2, bcrypt, express-session, multer, nodemailer, cors, dotenv, swagger-jsdoc and swagger-ui-express
- **Frontend**: React, React DOM, React Router and Vite

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/NikolenkoRostislav/usof.git
cd ./usof
```

### 2. Install dependencies

Install the dependencies for both the backend and the frontend:

```bash
npm run install:all
```

### 3. Set up the database

Make sure the MySQL server is running, then run the SQL scripts located in `backend/src/infra/db` in the following order:

1. `init.sql`: creates the `usof` database and the `usof_user` MySQL user.
2. `schema.sql`: creates the tables.
3. `seed.sql` (optional): inserts test data.

`seed.sql` can be skipped if test data is not required. The scripts must be run in this order because the database has to exist before the schema and seed data are created.

### 4. Configure the backend

Create a `.env` file in the `backend` directory. `backend/.env.example` shows the required variables:

```env
SECRET_KEY=your-secret-key
DB_HOST=localhost
DB_USER=usof_user
DB_PASS=pass
DB_NAME=usof
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=example@ethereal.email
SMTP_PASSWORD=your-password-here
```

The `SMTP_*` variables are used to send registration and password-reset emails.

### 5. Start the backend

```bash
npm run start:api
```

The API is available at `http://localhost:3000/api`, and the Swagger documentation at `http://localhost:3000/api-docs`.

### 6. Start the frontend

In a second terminal, run:

```bash
npm run start:web
```

The Vite development server starts at `http://localhost:5173`. The frontend expects the API at `http://localhost:3000/api`, so the backend must be running on port 3000.
