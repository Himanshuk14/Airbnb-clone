const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const DbInit = require("./dbinit/DbInit");
const multer = require("multer");
const fs = require("fs");
DbInit();
const User = require("./models/User");
const Place = require("./models/PlaceSchema");
const imageDownloader = require("image-downloader");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || "secret";
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(cookieParser());
const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsConfig));

app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, bcryptSalt),
  });
  user.save();
  res.json(user);
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        jwt.sign(
          { email: user.email, id: user._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              return res.status(500).json({ message: "Error signing token" });
            }

            res.cookie("token", token).json(user);
          }
        );
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    }
  } catch (e) {
    console.log("login error at server side");
    console.log(e);
  }
});
app.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({
      message:
        "User Not found , Not in database , New user? Try registering first",
    });
  }
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.id);
    res.json(user);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: path.join(__dirname, "uploads", newName),
  });
  res.status(200).json(newName);
});
const photosMiddleware = multer({
  dest: path.join(__dirname, "uploads"),
});
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  const uploads = [];
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    const newName = "photo" + Date.now() + ".jpg";
    fs.renameSync(file.path, path.join(__dirname, "uploads", newName));
    file.filename = newName;
    uploads.push(newName);
  }

  res.json(uploads);
});

app.post("/places", async (req, res) => {
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkInTime,
    checkOutTime,
    maxGuests,
  } = req.body;
  const token = req.cookies.token;

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      throw new Error("Unauthorized");
    }

    const placeDoc = await Place.create({
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      maxGuests,
      userId: decoded.id,
    });

    res.json(placeDoc);
  });
});

app.get("/places", async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      throw new Error("Unauthorized");
    }
    const places = await Place.find({ userId: decoded.id });

    res.json(places);
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.json(place);
});

app.put("/places", async (req, res) => {
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkInTime,
    checkOutTime,
    maxGuests,
  } = req.body;
  const token = req.cookies.token;

  jwt.verify(token, jwtSecret, async (err, userData) => {
    if (err) {
      throw new Error("Unauthorized");
    }
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.userId.toString()) {
      placeDoc.set({
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        maxGuests,
      });
      const doc = await placeDoc.save();
      console.log(doc);
      res.json("ok");
    }
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
