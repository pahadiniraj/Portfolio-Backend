import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import transporter from "../../utils/emailConfig.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const passwordResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(400, "Email doesnot exist ");
  }

  const secret = user._id + process.env.ACCESS_TOKEN_SECRET;
  const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "15m" });

  const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FORM,
    to: user.email,
    subject: "Reset Password",
    html: `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #fff;
      }
      .container {
        width: 90%;
        max-width: 600px;
        margin: 20px auto;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        padding: 20px;
        text-align: left;
        border-left: 6px solid #00c6ff;
        position: relative; /* Add relative positioning */
      }
      h1 {
        color: #00c6ff;
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: bold;
      }
      p {
        font-size: 15px;
        color: #e0e0e0;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      .button {
        color: #ffffff;
        text-decoration: none;
        background: linear-gradient(90deg, #00c6ff, #0072ff);
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
        font-size: 15px;
        display: inline-block;
        margin-top: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: background 0.3s, transform 0.3s;
      }
      .button:hover {
        background: linear-gradient(90deg, #0072ff, #00c6ff);
        transform: scale(1.05);
      }
      .footer {
        margin-top: 20px;
        font-size: 13px;
        color: #b0b0b0;
      }
      .footer a {
        color: #00c6ff;
        text-decoration: none;
        font-weight: bold;
      }
      .logo {
        width: 50px;
      }
      .logo-container {
        display: flex;
        align-items: end;
        justify-content: end;
      }
    </style>
  </head>
  <body>
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      bgcolor="#000"
    >
      <tr>
        <td
          background="https://www.haxxess.com/wp-content/uploads/2019/10/bigstock-Cyber-Security-Data-Protection-287211133-1-1024x611.jpg"
          style="
            background-size: cover;
            background-position: center center;
            padding: 20px;
          "
        >
          <div class="container" style="background: rgba(0, 0, 0, 0.8)">
            <!-- Heading and Content -->
            <h1>Reset Your Password</h1>
            <p>Hello ${user.firstName},</p>
            <p>
              You requested to reset your password. Please click the link below
              to proceed:
            </p>
            <a href="${resetLink}" class="button">🔑 Reset Password</a>
            <p>
              This link will expire in 15 minutes. If you did not request a
              password reset, please ignore this email or
              <a href="sharma12345niraj@gmail.com">contact support</a>.
            </p>
            <div class="footer">
              <p>
                <a href="${process.env.FRONTEND_HOST}">Visit our website</a> |
                <a href="mailto:support@example.com">Contact Support</a>
              </p>
            </div>

            <div class="logo-container">
              <!-- Logo Section -->
              <img
                src="https://res.cloudinary.com/pahadi123/image/upload/v1725682581/Niraj-01_l5eup0.png"
                alt="Niraj's Logo"
                class="logo"
              />
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>

      `,
  });
  res
    .status(200)
    .json(new ApiResponse(200, "Password reset email sent! Check your Email."));
});

export { passwordResetEmail };
