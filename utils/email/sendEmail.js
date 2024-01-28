const nodemailer = require('nodemailer');


const sendTokenMail = async (email, verification = true, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail.com',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.E_PASS
        }
    })
    
    const html = verification ? `If you requested to verify your acccount, verify now within 10  minutes or ignore this message. To verify, enter the code ${token}` : null;
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: verification ? "Verification Token" : "Password Reset Token",
        html
    }
    

    const send = await transporter.sendMail(mailOptions)
    return send
}

module.exports = {
    sendTokenMail
}