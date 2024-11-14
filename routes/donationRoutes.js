const express = require("express");
const Donation = require("../models/Donation");
const router = express.Router();

// Create a new donation
router.post("/", async (req, res) => {
    try {
        const { name, amount, lastFourDigits } = req.body;

        // Validate that all fields are provided
        if (!name || !amount || !lastFourDigits) {
            return res.status(400).json({ error: "All fields (name, amount, last four digits) are required." });
        }

        // Validate that lastFourDigits is exactly 4 digits
        if (!/^\d{4}$/.test(lastFourDigits)) {
            return res.status(400).json({ error: "Last four digits must be exactly 4 numeric characters" });
        }

        // Create the new donation
        const donation = new Donation({ name, amount, lastFourDigits, status: "pending" });
        await donation.save();

        // Respond with success
        res.status(201).json({ message: "Donation created successfully", donation });
    } catch (error) {
        console.error("Error occurred during donation creation:", error);
        res.status(500).json({ error: "An error occurred while creating the donation" });
    }
});

// Get all donations
router.get("/", async (req, res) => {
    try {
        const donations = await Donation.find();
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching donations" });
    }
});

// Get a specific donation by ID
router.get('/:id', async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        res.status(200).json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the donation' });
    }
});

// Update a donation by ID
router.post("/:id", async (req, res) => {
    const { name, amount, lastFourDigits, status } = req.body;  // Capture the body data

    try {
        // Find the donation by ID and update the relevant fields
        const updatedDonation = await Donation.findByIdAndUpdate(
            req.params.id, // Get the donation by ID from the URL parameter
            { name, amount, lastFourDigits, status }, // Fields to update
            { new: true } // Return the updated donation object
        );

        // If no donation found with that ID, return a 404 error
        if (!updatedDonation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        // Send the updated donation as a response
        res.status(200).json(updatedDonation);
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating the donation" });
    }
});

// Delete all donations
router.delete("/", async (req, res) => {
    try {
        // Delete all donations from the database
        await Donation.deleteMany({});

        res.status(200).json({ message: "All donation data has been deleted successfully." });
    } catch (error) {
        console.error("Error occurred while deleting donations:", error);
        res.status(500).json({ error: "An error occurred while deleting the donations" });
    }
});

module.exports = router;
