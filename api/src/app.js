import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

import userRouter from "./routes/user.route.js";
import placeRouter from "./routes/places.route.js";
import bookingRouter from "./routes/bookings.route.js";
app.use("/users", userRouter);
app.use("/places", placeRouter);
app.use("/bookings", bookingRouter);

export default app;
