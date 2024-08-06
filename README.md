# Decentralized-Todo-App

## Table of Contents
1.Project Overview
</br>
2.Architecture
</br>
3.Setup Instructions
</br>
4.Usage Guide
</br>
5.Contributing

## Project Overview
This project provides a web application that integrates Web3 authentication, allowing users to log in using MetaMask and manage notes. It also includes traditional authentication mechanisms using email and password.

### Architecture
The architecture of the project is divided into several key components:

## 1. Frontend
<b>Technologies:</b> React, Web3.js
</br>
<b>Components:</b>
</br>
<b>Login:</b> Handles user authentication using both email/password and MetaMask.
</br>
<b>Signin:</b> Allows users to register using email/password.
</br>
<b>UpdateNotes:</b> Manages updating notes for logged-in users.
### Context Providers:
<b>Web3Provider:</b> Provides Web3 functionality and connects to MetaMask.
</br>
<b>UserContext:</b> Manages user authentication state and tokens.

## 2. Backend
<b>Technologies:</b> Node.js, Express, MongoDB
</br>
<b>Endpoints:</b>
`POST /auth/users/register/newUser:` Registers a new user.
</br>
`POST /auth/users/login:` Logs in a user with email and password.
</br>
`POST /auth/users/wallet-login:` Logs in a user using MetaMask.
</br>
`GET /auth/users/getUser:` Retrieves user details.

## 3. Authentication
<b>Email/Password Authentication:</b> Uses bcrypt for hashing passwords and JWT for generating tokens.
</br>
<b>Web3 Authentication:</b> Uses MetaMask for signing messages and verifying signatures.

## Setup Instructions
### Prerequisites
`Node.js (v14 or later)`
</br>
`npm or yarn`
</br>
`MongoDB (Local or Atlas instance)`
</br>
`MetaMask browser extension (for Web3 functionality)`
### 1. Clone the Repository
```

git clone https://github.com/zamanali423/Decentralized-Todo-App
cd project

```

### 2. Install Dependencies
#### Backend:
```

cd backend
npm install

```

#### Frontend
```

cd frontend
npm install

```

## 3. Configure Environment Variables
<b>Backend:</b> Create a `.env` file in the `backend` directory with the following variables:
```

MONGO_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-jwt-secret

```

<b>Frontend:</b> Create a `.env` file in the `frontend` directory with the following variables:
```

REACT_APP_BACKEND_URL=http://localhost:3001

```

## 4. Start the Application
#### Backend:
```

cd backend
npm start

```

#### Frontend
```

cd frontend
npm start

```
The backend server will be running on  `http://localhost:3001`, and the frontend application will be accessible at `http://localhost:3000`.

## Usage Guide
### 1. Register a New User
Navigate to the Sign Up page.
</br>
Fill in the registration form with your details.
</br>
Submit the form to create a new user.
</br>
### 2. Log In
#### Using Email/Password:

Navigate to the Login page.
</br>
Enter your email and password.
</br>
Click `Login` to authenticate.

### Using MetaMask:

Click `Login with Crypto Wallet`.
</br>
MetaMask will prompt you to sign a message.
</br>
The application will handle the rest and log you in if the signature is verified.
</br>
## 3. Update Notes
After logging in, you can navigate to the notes section.
</br>
Use the provided form to update your notes.
</br>
The changes will be saved and reflected immediately.

## Contributing
We welcome contributions to this project. To contribute:

1.Fork the repository.
2.Create a new branch for your changes.
3.Make your changes and test them thoroughly.
4.Submit a pull request with a clear description of your changes.
