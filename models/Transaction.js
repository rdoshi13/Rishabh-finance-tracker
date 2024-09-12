// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense', 'subscription'], // restricts to these types
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String,
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
