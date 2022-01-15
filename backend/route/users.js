import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    let { email, password, displayName, passwordCheck } = req.body;

    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "please enter all required fields" });
    }

    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "enter the same password twice for verification" });
    }

    if (await User.findOne({ email: email })) {
      return res
        .status(400)
        .json({ msg: "an account already exists with same email address" });
    }

    if (!displayName) {
      displayName = email;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      displayName,
    });
    const savedUser = await newUser.save();

    res.send(savedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //validate
    if ((!email, !password)) {
      return res.status(400).json({ msg: "Enter all the required fields" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ msg: "no account with entered email address found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Enter valid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//DELETE
router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//CHECK IF TOKEN IS VALID
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

export default router;
