const Expense = require("../models/Expense");
const mongoose = require("mongoose");

exports.getCategoryLeaderboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user); // convert string to ObjectId

    const leaderboard = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
      { $sort: { totalAmount: -1 } }, // highest first
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};