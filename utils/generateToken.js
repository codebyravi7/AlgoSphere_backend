import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Prevent access to the cookie via JavaScript
    secure: false, // Cannot be true since localhost isn't HTTPS
    sameSite: "None", // Needed for cross-origin requests
    domain: "localhost", // Ensure this matches the original path
  })
  return token;
};

export default generateTokenAndSetCookie;
