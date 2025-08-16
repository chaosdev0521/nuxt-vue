# FinanceFlow 💰

> A modern, full-stack transaction management application built with Nuxt 3 and Express.js

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00C58E?logo=nuxt.js)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A comprehensive financial transaction management system with role-based authentication, real-time updates, and a beautiful dark/light theme interface.

## Features

### Authentication & Authorization
- **Login/Register**: Simple email/password authentication
- **Role-based Access**: Two roles - User and Manager
- **Auto-promote**: First registered user automatically becomes a Manager

### User Permissions
- **Manager**: Can view, create, update, and delete all transactions and users
- **User**: Can only view their own transactions (as sender or receiver)

### Transaction Management
- **Color-coded Amounts**: Green (+) for received money, Red (-) for sent money
- **Transaction Status**: Completed, Pending, or Failed
- **Full CRUD**: Managers can create, read, update, delete transactions

### User Management (Manager Only)
- View all users
- Edit user details and roles
- View user profiles

## Tech Stack

**Frontend:**
- Nuxt 3
- Vue 3 Composition API
- Tailwind CSS
- Pinia (State Management)

**Backend:**
- Express.js
- SQLite Database
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### 1. Start the API Server

```bash
cd api
npm install
npm start
```

The API will run on `http://localhost:3001`

### 2. Start the Nuxt App

In a new terminal:

```bash
npm install
npm run dev
```

The app will run on `http://localhost:3000`

## Usage

### First Time Setup
1. Register a new account - this will automatically be a Manager account
2. You can now:
   - Create transactions
   - Manage users
   - View all transactions

### User Experience
- **Managers** see all transactions and can perform all operations
- **Users** only see transactions where they are sender or receiver
- Transaction amounts show as:
  - Green with "+" for money received
  - Red with "-" for money sent

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Transactions
- `GET /api/transactions` - Get transactions (filtered by role)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction (Manager only)
- `PUT /api/transactions/:id` - Update transaction (Manager only)
- `DELETE /api/transactions/:id` - Delete transaction (Manager only)

#### Users (Manager Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user

## Database

The SQLite database (`database.sqlite`) is created automatically in the `api` folder when you first run the server. It includes:

- **users** table: id, email, password, roles, created_at
- **transactions** table: id, sender_id, receiver_id, reason, amount, status, created_at

## Project Structure

```
transaction-manager/
├── api/                  # Express.js API
│   ├── server.js        # Main server file
│   ├── database.js      # Database setup
│   ├── middleware.js    # Auth middleware
│   └── package.json
├── assets/css/          # CSS files
├── composables/         # Vue composables
├── layouts/             # Nuxt layouts
├── middleware/          # Route middleware
├── pages/               # Vue pages/routes
├── stores/              # Pinia stores
└── README.md
```

This is a test project designed to be simple, clear, and easy to understand for client demonstration purposes.
