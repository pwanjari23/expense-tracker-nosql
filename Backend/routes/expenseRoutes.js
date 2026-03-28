const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, expenseController.addExpense);
router.get("/", protect, expenseController.getExpenses);
router.put("/:id", protect, expenseController.updateExpense);
router.delete("/:id", protect, expenseController.deleteExpense);

module.exports = router;