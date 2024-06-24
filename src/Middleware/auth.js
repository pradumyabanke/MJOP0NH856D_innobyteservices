const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CreateModel = require("../Models/SingupUser");
const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'pradumgurjar2@gmail.com',
        pass: 'pRADU123'   
    }
});

//===================== [ Create User ] =====================/
const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { username, email, password } = data;

        // Manual validation
        if (!username || typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 30) {
            return res.status(400).send({ status: false, message: "Username must be a string between 3 and 30 characters" });
        }
        if (!email || typeof email !== 'string' || !email.match(/^\S+@\S+\.\S+$/)) {
            return res.status(400).send({ status: false, message: "Invalid email format" });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).send({ status: false, message: "Password must be at least 6 characters long" });
        }

        // Check if the email already exists in the database
        if (await CreateModel.findOne({ email: email })) {
            return res.status(400).send({ status: false, message: "Email already exists" });
        }

        // Encrypt the password
        const encryptedPassword = bcrypt.hashSync(password, 12);
        data.password = encryptedPassword;

        // Generate a JWT token
        var token = jwt.sign(
            {
                userId: CreateModel._id,
            },
            "project"
        );
        data.token = token;

        // Save the new user to the database
        let savedData = await CreateModel.create(data);

        // Send confirmation email
        const mailOptions = {
            from: 'pradumgurjar2@gmail.com',
            to: savedData.email,          
            subject: 'Account Confirmation',
            text: `Hello ${savedData.username},\n\nThank you for registering. Please confirm your email by clicking the link below:\n\nhttp://yourdomain.com/confirm-email?token=${token}\n\nThank you!`,
            html: `<p>Hello ${savedData.username},</p><p>Thank you for registering. Please confirm your email by clicking the link below:</p><a href="http://yourdomain.com/confirm-email?token=${token}">Confirm Email</a><p>Thank you!</p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).send({
            status: true,
            msg: "User Register Successful",
            data: {
                username: savedData.username,
                email: savedData.email,
                password: savedData.password
            }
        });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};

//===================== [ User Login ] =====================/
const userLogin = async function (req, res) {
    try {
        let data = req.body;
        let { email, password } = data;

        // Manual validation
        if (!email || typeof email !== 'string' || !email.match(/^\S+@\S+\.\S+$/)) {
            return res.status(400).send({ status: false, message: "Invalid email format" });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).send({ status: false, message: "Password must be at least 6 characters long" });
        }

        // Check if the user exists in the database
        let userExists = await CreateModel.findOne({ email: email });

        if (!userExists) {
            return res.status(400).send({
                status: false,
                message: "Email or Password is invalid",
            });
        }

        // Compare the provided password with the stored hash
        let compared = await bcrypt.compare(password, userExists.password);
        if (!compared) {
            return res.status(400).send({
                status: false,
                message: "Email or Password is invalid",
            });
        }

        // Generate a JWT token
        var token = jwt.sign(
            {
                userId: userExists._id,
            },
            "project"
        );

        // Update the token in the database
        let updateToken = await CreateModel.findByIdAndUpdate(
            { _id: userExists._id },
            { token },
            { new: true }
        );
        userExists.token = updateToken.token;

        return res.status(200).send({
            status: true,
            message: "User login successful",
            data: {
                username: userExists.username,
                email: userExists.email,
                token: userExists.token
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message,
        });
    }
};

//=======================================//
module.exports = {
    createUser,
    userLogin,
};

