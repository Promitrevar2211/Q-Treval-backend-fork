import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { CustomError } from "./custome.error";
import { transporter } from "./mailTransporter";

let otpData = {};
// Function to send the verification email
function sendVerificationEmail(userEmail, verificationCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Email Verification",
    text: `Your Email Verification OTP is : ${verificationCode}`,
  };

  transporter.sendMail(mailOptions);
}

export async function sendOTP(userEmail) {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    sendVerificationEmail(userEmail, otp);

    // Store the OTP code with its expiration timestamp
    const otpExpiration = Date.now() + 5 * 60 * 1000; // Expiration set to 5 minutes from now
    otpData[userEmail] = { otp, expiresAt: otpExpiration };
  } catch (error) {
    throw new CustomError("OTP generation failed. Please try again!");
  }
}

// Function to verify the OTP
export function verifyOTP(userEmail, otp) {
  try {
    const storedOTPData = otpData[userEmail];

    if (!storedOTPData) {
      return false; // OTP code not found or expired
    }

    if (otp === storedOTPData.otp) {
      const currentTime = Date.now();
      if (currentTime <= storedOTPData.expiresAt) {
        // OTP is correct and not expired, perform the necessary actions
        console.log("OTP verified successfully");
        // You can remove the OTP code from memory or mark it as used to prevent reuse
        delete otpData[userEmail];
        return true;
      } else {
        // OTP expired, remove it from memory
        delete otpData[userEmail];
        return false;
      }
    }

    return false;
  } catch (error) {
    throw new CustomError("OTP verification failed. Please try again!");
  }
  // OTP is incorrect
}

// Usage example
// const userEmail = "example@example.com";

// sendOTP(userEmail); // Send OTP to the email address

// // Simulate OTP verification
// const otpInput = "123456"; // Replace with the OTP input from the user
// const isOTPVerified = verifyOTP(userEmail, otpInput);
// console.log("Is OTP verified?", isOTPVerified);
