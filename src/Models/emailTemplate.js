const confirmationEmailTemplate = (username, confirmationCode) => {
    return `
        <p>Hello ${username},</p>
        <p>Thank you for registering!</p>
        <p>Please click the following link to confirm your email:</p>
        <a href="http://yourapp.com/confirm/${confirmationCode}">Confirm Email</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Regards,<br>Your App Team</p>
    `;
};

module.exports = {
    confirmationEmailTemplate,
};
