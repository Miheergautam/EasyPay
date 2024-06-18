# PayTM Basic Backend

This project builds a basic version of the PayTM backend, featuring user authentication and account management using Node.js, Express, MongoDB, and JWT for authentication.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v12 or higher)
- MongoDB

## Getting Started

Follow these steps to set up and run the backend locally on your device.

### Step 1: Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/paytm-backend.git
cd paytm-backend
```


## Step 2: Install Dependencies

Install the necessary dependencies using npm:

```bash
npm install
```

## Step 3: Set Up Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```plaintext
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-database
JWT_SECRET=your_jwt_secret
```

## Step 4: Create Mongoose Schemas

1. **Create the User Schema**

Define a schema for user information including `firstName`, `lastName`, `username`, and `password`.

2. **Create the Account Schema**

Define a schema for accounts including `userId` (referencing the User schema) and `balance`.

## Step 5: Set Up Routing

1. **Create API Routes**

   Create a file for API routes to manage user and account routes.

2. **Create User Routes**

   Implement routes for user signup, signin, and updating user information.

3. **Create Account Routes**

   Implement routes for checking account balance and transferring funds between accounts.

## Step 6: Create Middleware

Create a JWT authentication middleware to protect certain routes and ensure only authenticated users can access them.

## Step 7: Connect Everything in index.js

Set up the Express server, connect to MongoDB, and link the routes and middleware.

### Running the Application

Once everything is set up, you can run the server using:

```bash
npm start
```
## API Endpoints

### User Authentication

- Signup: `POST /api/v1/user/signup`
- Signin: `POST /api/v1/user/signin`
- Update User: `PUT /api/v1/user/update`

### Account Management

- Get Balance: `GET /api/v1/account/balance`
- Transfer Funds: `POST /api/v1/account/transfer`


## Conclusion

By following these steps, you should be able to set up and run the backend for a basic version of PayTM locally on your machine. This backend supports user authentication, account creation, balance retrieval, and fund transfers.
