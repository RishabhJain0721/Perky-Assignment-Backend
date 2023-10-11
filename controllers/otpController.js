import nodemailer from "nodemailer";
import dns from "dns";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "rishujain0721@gmail.com",
    pass: "nbmwdajxwxgzopqo",
  },
});

const storedOTPs = {};

const sendOtp = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  // Check if the email is valid
  let validEmail = false;

  const emailParts = email.split("@");
  const domain = emailParts[1];

  try {
    const addresses = await dns.promises.resolveMx(domain);
    console.log("Addresses are : ", addresses);

    if (addresses && addresses.length !== 0) {
      console.log("Email domain exists and can receive emails.");
      validEmail = true;
    }
  } catch (error) {
    console.error(error);
    if (!validEmail) {
      console.log("Email domain does not exist or cannot receive emails.");
      return res.status(401).send({
        message: "Email domain does not exist or cannot receive emails.",
        errorName: "Invalid email",
      });
    }
  }

  // Generate a random 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store the generated OTP associated with the user's email
  storedOTPs[email] = otp.toString();

  try {
    await transporter.sendMail({
      from: "rishujain0721@gmail.com",
      to: email,
      subject: "OTP for email verification",
      text: `Your OTP for email verification is ${otp}.`,
    });

    // Send a success response to the client
    res.status(200).send({
      message: "OTP sent successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the email sending process
    console.error(error);
    res.status(500).send({
      message: "Failed to send OTP email",
      errorName: "Email sending error",
    });
  }
};


// verify otp function
const verifyOtp = async (req, res) => {
  const { otp,email } = req.body;

  if (storedOTPs[email] && otp.toString() === storedOTPs[email]) {
    console.log("OTP verified");
    // Remove the OTP from storage to prevent reuse
    delete storedOTPs[email];
    return res.status(200).send({
      message: "OTP verified",
    });
  } else {
    console.log("OTP not verified");
    return res.status(401).send({
      message: "OTP not verified",
    });
  }
};

export { sendOtp, verifyOtp };
