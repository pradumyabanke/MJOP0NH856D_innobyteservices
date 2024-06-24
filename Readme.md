--------------User Authentication API------------------

This Node.js application provides APIs for user registration, email confirmation, and user login functionalities using bcrypt for password hashing, JWT for authentication, and Nodemailer for sending confirmation emails.

Features
User Registration: Allows users to register with a unique email and password. Upon registration, a confirmation email is sent.
Email Confirmation: Users receive an email with a confirmation link containing a unique code to verify their email address.
User Login: Authenticated users can log in using their email and password. JWT tokens are issued upon successful login for further authenticated requests.

//========================================================================================//

Clone the repository:


    * git clone https://github.com/your_username/your_repository.git
    * cd your_repository


Install dependencies:

    * npm install


Start the server:

    * npm start

//===================================================================================//
User Registration
Endpoint:  POST /api/register
Request Body:
{
  "username": "exampleuser",
  "email": "user@example.com",
  "password": "password"
}


User Login
Endpoint: POST /api/login
Request Body:
{
  "email": "user@example.com",
  "password": "password"
}

//=================================================================================/

Note:
Make sure MongoDB is running.
Replace your_jwt_secret, your_email@example.com, and your_password with your actual JWT secret, email credentials, and MongoDB URI respectively.
