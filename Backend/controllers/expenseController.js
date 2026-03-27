const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const lastExpense = await Expense.findOne().sort({ customId: -1 });

    const newId = lastExpense ? lastExpense.customId + 1 : 1;

    const expense = new Expense({
      customId: newId,
      title,
      amount,
      category,
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error("ERROR ", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const customId = parseInt(req.params.id); // convert string → number

    const deletedExpense = await Expense.findOneAndDelete({ customId });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const customId = parseInt(req.params.id); // convert to number

    const updatedExpense = await Expense.findOneAndUpdate(
      { customId },
      req.body,
      { new: true } 
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
