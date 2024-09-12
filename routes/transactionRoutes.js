// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Create a new transaction
router.post('/', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a transaction
router.put('/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch transactions for a specific month
router.get('/report/:year/:month', async (req, res) => {
    const { year, month } = req.params;
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Move to the next month

    try {
        const transactions = await Transaction.find({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        // Group by category and calculate totals
        const report = transactions.reduce((acc, transaction) => {
            const { category, amount, type } = transaction;
            if (!acc[category]) acc[category] = { total: 0, transactions: 0 };
            acc[category].total += amount;
            acc[category].transactions += 1;
            return acc;
        }, {});

        // Total income and expenses
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

        res.json({ report, totalIncome, totalExpenses });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
