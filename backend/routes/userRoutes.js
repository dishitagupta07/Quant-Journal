const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//signup route
router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, username, password, phone } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ 
                message: "Please fill in all required fields (email, username, password)" 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();

        // Check for existing user using case-insensitive regex
        const existingUser = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
                { username: { $regex: new RegExp(`^${normalizedUsername}$`, "i") } }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName: fullName ? fullName.trim() : "",
            email: normalizedEmail,
            username: normalizedUsername,
            password: hashedPassword,
            phone: phone ? phone.trim() : ""
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully"
        });

    } catch (err) {
        console.error("SIGNUP ERROR:", err);

        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({
                message: `An account with this ${field} already exists.`
            });
        }

        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
});

//login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please enter both email and password" 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user case-insensitively
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                phone: user.phone
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
});

// GET PROFILE ROUTE
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// UPDATE PROFILE ROUTE (Email & Profile Updates)
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { fullName, email, username, phone } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Clean up input fields
        const targetEmail = email ? email.trim().toLowerCase() : user.email;
        const targetUsername = username ? username.trim().toLowerCase() : user.username;

        // Check if updating to a new email address
        if (targetEmail.toLowerCase() !== user.email.toLowerCase()) {
            const existingEmail = await User.findOne({
                email: { $regex: new RegExp(`^${targetEmail}$`, "i") },
                _id: { $ne: req.user.id }
            });

            if (existingEmail) {
                return res.status(400).json({
                    message: "This email address is already in use by another account."
                });
            }
        }

        // Check if updating to a new username
        if (targetUsername.toLowerCase() !== user.username.toLowerCase()) {
            const existingUsername = await User.findOne({
                username: { $regex: new RegExp(`^${targetUsername}$`, "i") },
                _id: { $ne: req.user.id }
            });

            if (existingUsername) {
                return res.status(400).json({
                    message: "This username is already taken."
                });
            }
        }

        // Apply changes
        user.fullName = fullName !== undefined ? fullName.trim() : user.fullName;
        user.email = targetEmail;
        user.username = targetUsername;
        user.phone = phone !== undefined ? phone.trim() : user.phone;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("PROFILE UPDATE ERROR:", error);

        // Catch MongoDB Unique Index Conflict (E11000) directly on .save()
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                message: `The ${duplicateField} you entered is already registered with another account.`
            });
        }

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

//  CHANGE PASSWORD ROUTE
router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: "Please fill in both current and new passwords" 
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("CHANGE PASSWORD ERROR:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

module.exports = router;