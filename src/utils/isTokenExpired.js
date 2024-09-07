import jwt from "jsonwebtoken";

const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  const decodeToken = jwt.decode(token);
  const currentTime = Date.now() / 1000;

  return decodeToken?.exp < currentTime;
};
export default isTokenExpired;
