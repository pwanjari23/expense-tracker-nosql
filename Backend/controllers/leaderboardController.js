const Expense = require("../models/Expense");

exports.getCategoryLeaderboard = async (req, res) => {
  try {
    const userId = req.user; // from protect middleware

    const leaderboard = await Expense.aggregate([
      {
        $match: { user: userId }, 
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};