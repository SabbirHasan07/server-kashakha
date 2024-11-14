const express = require("express");
const User = require("../models/Users");
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const Users = await User.find();
        res.status(200).json(Users); // Respond with the list of donations
    } catch (error) {
        console.error("Error occurred while fetching Users:", error);
        res.status(500).json({ error: "An error occurred while fetching Users" });
    }
});

module.exports = router;
