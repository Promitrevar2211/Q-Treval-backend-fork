import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { CustomError } from "./custome.error";
import SibApiV3Sdk from "sib-api-v3-sdk";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // or the port number provided by your SMTP provider
  secure: false, // Set it to true if you are using a secure connection (TLS/SSL)
  auth: {
    user: "bootesoft@gmail.com",
    pass: "hdwyruzyuvkepocd",
  },
});
let otpData = {};
// Function to send the verification email
function sendVerificationEmail(userEmail, verificationCode) {
  const mailOptions = {
    from: "bootesoft@gmail.com",
    to: userEmail,
    subject: "Email Verification",
    text: `Your Email Verification OTP is : ${verificationCode}`,
  };

  transporter.sendMail(mailOptions);
}

function sendVerificationEmail2(userEmail,verificationCode) {
  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      "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";

    new SibApiV3Sdk.TransactionalEmailsApi()
      .sendTransacEmail({
        sender: { email: "booking@quantumtravel.ai", name: "Quantum Travels" },
        subject: `Email Verification`,
        textContent: `Your Email Verification OTP is : ${verificationCode}`,
        messageVersions: [
          //Definition for Message Version 1
          {
            to: [
              {
                email: userEmail,
              },
            ],
          },
        ],
      })
      .then(
        async function (res) {
        },
        async function (error) {
        }
      );
}

export async function sendOTP(userEmail) {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
   // sendVerificationEmail(userEmail, otp);
    sendVerificationEmail2(userEmail,otp);

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
    throw new CustomError("OTP verification failed. Please try again!")
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
