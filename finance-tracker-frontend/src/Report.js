import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import AddTransaction from './AddTransaction';

const Report = () => {
    const [reportData, setReportData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [year, setYear] = useState('2024');
    const [month, setMonth] = useState('09');
    const [isFormVisible, setFormVisible] = useState(false); // Toggle form visibility

    // Add new transaction to the list
    const handleAddTransaction = (newTransaction) => {
        setTransactions([...transactions, newTransaction]);
    };

    // Fetch the report data from the backend
    const fetchReport = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/transactions/report/${year}/${month}`);
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    // Fetch all transactions from the backend
    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/transactions');
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Generate a PDF from the report data
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Monthly Report', 10, 10);

        if (reportData) {
            let yPos = 20;
            doc.text(`Total Income: $${reportData.totalIncome}`, 10, yPos);
            yPos += 10;
            doc.text(`Total Expenses: $${reportData.totalExpenses}`, 10, yPos);
            yPos += 20;

            Object.keys(reportData.report).forEach((category, index) => {
                const { total, transactions } = reportData.report[category];
                doc.text(`${category}: $${total} (${transactions} transactions)`, 10, yPos);
                yPos += 10;
            });
        }

        doc.save('monthly_report.pdf');
    };

    // Toggle form visibility
    const toggleForm = () => {
        setFormVisible(!isFormVisible); // Toggle between true and false
    };

    // Handle delete transaction (same button for deleting any selected transactions)
    const handleDelete = async () => {
        const transactionId = prompt('Enter the ID of the transaction you want to delete:');
        if (!transactionId) return;

        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await fetch(`http://localhost:5001/api/transactions/${transactionId}`, {
                method: 'DELETE',
            });

            setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    // Fetch transactions when the component loads
    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="container">
            <header>
                <h1>Rishabh's Financial Tracker</h1>
                <p>This is a basic financial tracker I made for myself using Node.js and Express for the backend, MongoDB for data storage, and React for the frontend. It also integrates PDF generation for reports and uses HTML, CSS, and JavaScript for a responsive design.</p>
            </header>

            <section className="transactions-section">
                <h2>Recent Transactions</h2>

                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction._id} className="transaction-item">
                            {transaction.category}: ${transaction.amount} - {transaction.description}
                        </li>
                    ))}
                </ul>

                {/* Buttons in a single line */}
                <div className="action-buttons">
                    <button onClick={toggleForm}>Add</button>
                    <button onClick={() => alert('Edit functionality to be implemented.')}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>

                {/* Conditionally render the form based on the state */}
                {isFormVisible && (
                    <AddTransaction onAdd={handleAddTransaction} />
                )}
            </section>


        </div>
    );
};

export default Report;
