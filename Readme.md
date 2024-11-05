# Blogging Platform

[![Repo Link](https://github.com/sampremm/bloging)](https://github.com/sampremm/bloging)

## Project Overview

This Blogging Platform is a full-stack application designed to allow users to create, edit, and delete blog posts with secure, JWT-based authentication. The platform provides a rich and responsive user experience, with features such as Markdown support for text formatting and image uploads. 

## Features

- **User Authentication**: Secure JWT-based authentication for user sign-up, login, and protected actions.
- **Responsive UI**: Built with React.js and styled using TailwindCSS for a clean, responsive design.
- **Rich Text Formatting**: Integrated Markdown editor for rich text formatting in blog posts.
- **Image Uploads**: Integrated AWS S3 for image storage, allowing users to upload images within their posts.
- **Data Management**: Uses MongoDB for data storage with Mongoose for schema modeling.

## Tech Stack

### Frontend
- **React.js**: Framework for building the user interface.
- **TailwindCSS**: Utility-first CSS framework for responsive and modern styling.
- **Firebase**: Integrated for simplified frontend authentication management and potential hosting.

### Backend
- **Node.js**: JavaScript runtime environment for building the backend.
- **Express.js**: Web application framework for routing and middleware.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB schema modeling.
- **JWT**: Secure token-based authentication for user session management.
- **AWS S3**: Storage solution for managing user-uploaded images.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sampremm/bloging.git
   cd bloging
   ```

2. **Install dependencies** for both frontend and backend:
   ```bash
   cd client
   npm install
   cd ../backend
   npm install
   ```

3. **Environment Variables**: Set up a `.env` file in the backend directory with the following environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT authentication
   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: Credentials for AWS S3 access
   - Other required environment variables for Firebase authentication.

4. **Start the development servers**:
   - Backend: 
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd client
     npm start
     ```

5. Open your browser and navigate to `http://localhost:3000` to view the platform.

## Usage

1. **Sign Up / Login**: Create an account or log in with an existing account.
2. **Create Post**: Write a new blog post using Markdown for text formatting, and optionally add an image.
3. **Edit / Delete Post**: Manage existing posts with editing and deletion capabilities.

## Folder Structure

```plaintext
bloging/
├── client/                 # Frontend
│   ├── public/
│   └── src/
├── backend/                # Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── .env                    # Environment variables
└── README.md
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your improvements.
