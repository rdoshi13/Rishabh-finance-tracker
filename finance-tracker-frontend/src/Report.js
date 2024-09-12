// src/Report.js
import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Report = () => {
    const [reportData, setReportData] = useState(null);
    const [year, setYear] = useState('2024'); // Default year
    const [month, setMonth] = useState('09'); // Default month

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

    return (
        <div>
            <h1>Generate Monthly Report</h1>
            <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
            <input type="text" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" />

            <button onClick={fetchReport}>Fetch Report</button>

            {reportData && (
                <div>
                    <h2>Report Summary</h2>
                    <p>Total Income: ${reportData.totalIncome}</p>
                    <p>Total Expenses: ${reportData.totalExpenses}</p>

                    <button onClick={generatePDF}>Download PDF</button>
                </div>
            )}
        </div>
    );
};

export default Report;
