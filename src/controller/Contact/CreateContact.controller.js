import { Contact } from "../../models/contact.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import transporter from "../../utils/emailConfig.js";

const createContact = asyncHandler(async (req, res) => {
  const { fullName, email, message, subject } = req.body;

  // Check if the email already exists
  const existedEmail = await Contact.findOne({ email });
  console.log(existedEmail);

  if (existedEmail) {
    const now = new Date();
    const createdAt = new Date(existedEmail.createdAt);

    const differenceInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    console.log(differenceInDays);

    if (differenceInDays < 2) {
      throw new ApiError(
        409,
        "I have already received your email. If you have further concerns, please try again after a few days or just send me a email."
      );
    }
  }

  // If email does not exist, create a new contact
  const newContact = await Contact.create({
    fullName,
    email,
    message,
    subject,
  });

  transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: newContact.email,
    subject: `${newContact.subject}`,
    html: `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          width: 90%;
          max-width: 600px;
          margin: 20px auto;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          padding: 20px;
          text-align: left;
          border-left: 6px solid #00c6ff;
          color: #fff;
        }
        h1 {
          color: #00c6ff;
          font-size: 24px;
          margin-bottom: 15px;
          font-weight: bold;
        }
        p {
          font-size: 16px;
          color: #ffffff;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        .strong-text {
          font-weight: bold;
          color: #ffffff;
        }
        .button {
          color: #fafafa;
          text-decoration: none;
          background: linear-gradient(90deg, #00c6ff, #0072ff);
          padding: 12px 25px;
          border-radius: 5px;
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
          margin-top: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: background 0.3s, transform 0.3s;
        }
        .button:hover {
          background: linear-gradient(90deg, #0072ff, #00c6ff);
          transform: scale(1.05);
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #b0b0b0;
          text-align: left;
        }
        .footer p {
          font-size: 15px;
          color: #e0e0e0;
          margin-bottom: 5px;
        }
        .footer a {
          color: #00c6ff;
          text-decoration: none;
          font-weight: bold;
        }
        .signature {
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          margin-top: 20px;
        }
        .social-icons {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }
        .social-icons a {
          text-decoration: none;
          color: #00c6ff;
          font-size: 20px;
          transition: color 0.3s ease;
        }
        .social-icons a:hover {
          color: #0072ff;
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
            background="https://static.vecteezy.com/system/resources/previews/006/430/145/non_2x/technology-background-concept-circuit-board-electronic-system-futuristic-hi-tech-light-on-dark-blue-free-vector.jpg"
            bgcolor="#000"
            style="
              background-size: cover;
              background-position: center center;
              padding: 20px;
            "
          >
            <div class="container">
              <h1>Dear ${newContact.fullName},</h1>
              <p>
                Thank you for reaching out to me regarding
                <strong class="strong-text">${newContact.subject}</strong>.
              </p>
              <p>
                I truly appreciate the time you’ve taken to share your inquiry. I
                am currently reviewing the details and will get back to you as
                soon as possible with more information or assistance on how we can
                proceed.
              </p>
              <p>
                If there’s anything you’d like to clarify or update, feel free to
                respond to this email at your convenience.
              </p>
              <p>
                I look forward to assisting you further and will ensure you
                receive the best possible support.
              </p>
              <a href="mailto:${process.env.EMAIL_FROM}" class="button"
                >Contact Me</a
              >

              <!-- Enhanced Footer Section -->
              <div class="footer">
                <p class="signature">Best regards,</p>
                <p class="signature">Niraj Pahadi</p>

                <p>Let’s connect and stay in touch:</p>
                <div class="social-icons">
                  <a
                    href="https://www.linkedin.com/in/niraj-pahadi-733147292/"
                    target="_blank"
                    >🔗 LinkedIn</a
                  >
                </div>
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
    .status(201)
    .json(
      new ApiResponse(
        201,
        newContact,
        `${newContact.fullName}, thank you for getting in touch! I've sent more details to your email.`
      )
    );
});

export { createContact };
