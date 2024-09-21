import { Contact } from "../../../models/contact.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import transporter from "../../../utils/emailConfig.js";

const UpdateContact = asyncHandler(async (req, res) => {
  const { status, _id } = req.body;

  // Validate status
  if (!["unseen", "inprogress", "completed", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  // Find contact by ID
  const contact = await Contact.findById(_id);

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  if (contact.status === status) {
    throw new ApiError(400, "Status cannot be updated to the same value");
  }

  // Update status
  contact.status = status;
  const updatedContact = await contact.save();

  // Prepare email content based on status
  let subject = "";
  let htmlMessage = "";

  if (status === "inprogress") {
    subject = `${contact.subject} request is in Progress`;
    htmlMessage = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Niraj Pahadi</title>
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
  </style>
</head>
<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#000">
    <tr>
      <td
        background="https://static.vecteezy.com/system/resources/previews/006/430/145/non_2x/technology-background-concept-circuit-board-electronic-system-futuristic-hi-tech-light-on-dark-blue-free-vector.jpg"
        bgcolor="#000"
        style="background-size: cover; background-position: center center; padding: 20px;"
      >
        <div class="container">
          <h1>Hello ${contact.fullName},</h1>
          <p>
            We’re thrilled to inform you that your request regarding <strong>${contact.subject}</strong> has been reviewed and is currently <strong>in progress</strong>. Our team is diving deep into it, as it aligns perfectly with our vision and expertise.
          </p>
          <p>
            We appreciate the trust you’ve placed in us and are excited to collaborate on this project. Rest assured, we are dedicated to ensuring your needs are met with the utmost precision and innovation.
          </p>
          <p>
            If you have any further queries or need additional information, please don't hesitate to reach out. In the meantime, feel free to explore more about us through the link below.
          </p>
          <p>
            <a href="${process.env.FRONTEND_HOST}" class="button">Discover More</a>
          </p>
          <div class="footer">
            <p>
              <a href="${process.env.FRONTEND_HOST}">Visit Website</a> |
              <a href="mailto:sharma12345niraj@gmail.com">Contact Support</a>
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>

    `;
  } else if (status === "completed") {
    subject = "Your Contact Request is Completed";
    htmlMessage = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Niraj Pahadi</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #fff;
      background: #000;
    }
    .container {
      width: 90%;
      max-width: 600px;
      margin: 20px auto;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      padding: 20px;
      text-align: center;
      border-left: 6px solid #00c6ff;
    }
    h1 {
      color: #00c6ff;
      font-size: 26px;
      margin-bottom: 15px;
      font-weight: bold;
      letter-spacing: 1px;
    }
    p {
      font-size: 16px;
      color: #e0e0e0;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .button {
      color: #ffffff;
      text-decoration: none;
      background: linear-gradient(90deg, #00c6ff, #0072ff);
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      display: inline-block;
      margin-top: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
      transition: background 0.3s, transform 0.3s;
    }
    .button:hover {
      background: linear-gradient(90deg, #0072ff, #00c6ff);
      transform: scale(1.05);
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #b0b0b0;
    }
    .footer a {
      color: #00c6ff;
      text-decoration: none;
      font-weight: bold;
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
          <h1>Fantastic News, ${contact.fullName}!</h1>
          <p>We're thrilled to let you know that your Project request has been <strong>completed !</strong> 🎉 Our team has worked diligently to address your needs, and we're confident you'll be pleased with the results.</p>
          <p>If you have any more questions or need further assistance, just give us a shout. We're here to help!</p>
          <p>Thank you for placing your trust in us. We look forward to serving you again!</p>
          <p>
            <a href="${process.env.FRONTEND_HOST}" class="button">Explore More on Our Website</a>
          </p>
          <div class="footer">
            <p>
              <a href="${process.env.FRONTEND_HOST}">Visit our website</a> |
              <a href="mailto:sharma12345niraj@gmail.com">Contact Support</a>
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>

    `;
  } else if (status === "rejected") {
    subject = "Your Contact Request was Rejected";
    htmlMessage = `
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Request Update</title>
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
          <h1>Hello ${contact.fullName},</h1>
          <p>We sincerely apologize, but after careful review, we must inform you that your Project request has been <strong>rejected</strong>. Please understand that this decision was made after thorough consideration, and we regret that we cannot proceed further with your request at this time.</p>
          <p>We value your interest and appreciate the effort you put into reaching out to us. Should you have any questions or need further clarification, do not hesitate to contact us. Our team is here to assist you with any concerns you may have.</p>
          <p>Thank you for your understanding and for considering our services.</p>
          <p>
            <a href="${process.env.FRONTEND_HOST}" class="button">Visit Our Website</a>
          </p>
          <div class="footer">
            <p>
              <a href="${process.env.FRONTEND_HOST}">Explore More</a> |
              <a href="mailto:sharma12345niraj@gmail.com">Contact Support</a>
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  // Send email
  await transporter.sendMail({
    from: '"Nirajs portfolio" ',
    to: contact.email,
    subject,
    html: htmlMessage,
  });

  // Respond to client
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `${updatedContact.fullName}'s Project is ${updatedContact.status} `
      )
    );
});

export { UpdateContact };
