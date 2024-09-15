import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB().then(() => {
  app.on("error", (err) => {
    console.log("err", err);
    throw err;
  });

  app.listen(process.env.PORT, () => {
    console.log(`Serving on port ${process.env.PORT}`);
  });

  app.get("/", (req, res) => {
    res.send("Hello, World i'm Niraj!");
  });
});
