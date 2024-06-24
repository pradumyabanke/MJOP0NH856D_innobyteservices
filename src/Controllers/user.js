const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CreateModel = require("../Models/SingupUser");
const nodemailer = require("nodemailer");
const { confirmationEmailTemplate } = require("../Models/emailTemplate");

// Function to send confirmation email
const sendConfirmationEmail = async (email, username, confirmationCode) => {
    // Create reusable transporter object using SMTP transport (change as needed)
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "your_email@example.com", // generated ethereal user
            pass: "your_password", // generated ethereal password
        },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Your App" <your_email@example.com>', // sender address
        to: email, // list of receivers
        subject: "Confirm Your Email", // Subject line
        html: confirmationEmailTemplate(username, confirmationCode), // html body
    });

    console.log("Message sent: %s", info.messageId);
};

//===================== [ Create User ] =====================/

const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { username, email, password } = data;

        if (await CreateModel.findOne({ email: email })) {
            return res
                .status(400)
                .send({ status: false, message: "Email already exists" });
        }

        const encryptedPassword = bcrypt.hashSync(password, 12);
        data.password = encryptedPassword;

        // Generate a random confirmation code (you can use a library for this)
        const confirmationCode = Math.random().toString(36).substring(7);

        // Send confirmation email
        await sendConfirmationEmail(email, username, confirmationCode);

        // Save the new user to the database
        let savedData = await CreateModel.create({ ...data, confirmationCode });

        res.status(201).send({
            status: true,
            msg: "User Register Successful",
            data: {
                username: savedData.username,
                email: savedData.email,
                password: savedData.password,
            },
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

        let userExists = await CreateModel.findOne({ email: email });

        if (!userExists) {
            return res.status(400).send({
                status: false,
                msg: "Email and Password is Invalid",
            });
        }

        let compared = await bcrypt.compare(password, userExists.password);
        if (!compared) {
            return res.status(400).send({
                status: false,
                message: "Your password is invalid",
            });
        }
        var token = jwt.sign(
            {
                userId: userExists._id,
            },
            "project"
        );

        let updateToken = await CreateModel.findByIdAndUpdate(
            { _id: userExists._id },
            { token },
            { new: true }
        );
        userExists.token = updateToken.token;

        return res.status(200).send({
            status: true,
            msg: " User Login successfully",
            data: userExists,
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message,
        });
    }
};


//=======================================//
module.exports = {
    createUser,
    userLogin,

}




