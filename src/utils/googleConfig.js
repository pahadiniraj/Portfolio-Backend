import { google } from "googleapis";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

console.log("client ID", clientID);
console.log("Client secret", clientSecret);

const oauth2client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  "postmessage"
);
export { oauth2client };
