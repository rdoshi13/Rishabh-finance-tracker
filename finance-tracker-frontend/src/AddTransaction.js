import React, { useState } from 'react';

const AddTransaction = ({ onAdd }) => {
    const [transaction, setTransaction] = useState({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
    });

    const [isFormVisible, setFormVisible] = useState(false); // State to toggle form visibility

    // Toggle form visibility
    const toggleForm = () => {
        setFormVisible(!isFormVisible); // Toggle between true and false
    };

    // Handle form input changes
    const handleChange = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send POST request to the backend to create a new transaction
            const response = await fetch('http://localhost:5001/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });

            const data = await response.json();
            onAdd(data); // Call the onAdd callback to update the transaction list in the parent
            setFormVisible(false); // Hide the form after submission
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <div>
            {/* Button to toggle form visibility */}
            <button onClick={toggleForm}>
                {isFormVisible ? 'Cancel' : 'Add New Transaction'}
            </button>

            {/* Conditionally render the form based on the state */}
            {isFormVisible && (
                <form onSubmit={handleSubmit}>
                    <h2>Add New Transaction</h2>
                    <div>
                        <label>Type</label>
                        <select name="type" value={transaction.type} onChange={handleChange}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="subscription">Subscription</option>
                        </select>
                    </div>
                    <div>
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={transaction.category}
                            onChange={handleChange}
                            placeholder="Enter category"
                            required
                        />
                    </div>
                    <div>
                        <label>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={transaction.amount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={transaction.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                        />
                    </div>
                    <button type="submit">Add Transaction</button>
                </form>
            )}
        </div>
    );
};

export default AddTransaction;
