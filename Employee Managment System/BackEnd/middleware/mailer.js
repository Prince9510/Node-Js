const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "satasiyaprince68@gmail.com",
    pass: "Your app password here",
  },
});

module.exports.sendOtp = (to, otp) => {
  let mailoption = {
    from: "satasiyaprince68@gmail.com",
    to: to,
    subject: "Your Password Reset OTP",
    text: `Your OTP is ${otp} 

    Main Admin Detail :
    
    name : Prince Satasiya 
    email : satasiyaprince9510@gmail.com
    phone : 8160636847
        `,
  };
  transporter.sendMail(mailoption, (err, info) => {
    if (err) {
      console.log("Error sending OTP email:", err);
    } else {
      console.log("OTP email sent successfully:", info.response);
    }
  });
};
