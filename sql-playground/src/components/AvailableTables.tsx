import React, { useState } from 'react';
const AvailableTables: React.FC = () => {
    const tables = {
        Table1: [
            { id: 1, name: 'John Doe', age: 28 },
            { id: 2, name: 'Jane Smith', age: 34 },
        ],
        Table2: [
            { id: 1, product: 'Laptop', price: 1000, quantity: 2 },
            { id: 2, product: 'Phone', price: 500, quantity: 3 },
        ],
        Table3: [
            { id: 1, product: 'Laptop'},
            { id: 2, product: 'Phone'},
        ],
    };

    const [selectedTable, setSelectedTable] = useState<keyof typeof tables>('Table1');

    const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTable(event.target.value as keyof typeof tables);
    };

    return (
        <div>
            <style>
                {`
                    .responsive-table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .responsive-table th, .responsive-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }

                    .responsive-table th {
                        padding-top: 12px;
                        padding-bottom: 12px;
                        text-align: left;
                        background-color: #f2f2f2;
                    }

                    @media screen and (max-width: 600px) {
                        .responsive-table thead {
                            display: none;
                        }

                        .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td {
                            display: block;
                            width: 100%;
                        }

                        .responsive-table tr {
                            margin-bottom: 15px;
                        }

                        .responsive-table td {
                            text-align: right;
                            padding-left: 50%;
                            position: relative;
                        }

                        .responsive-table td::before {
                            content: attr(data-label);
                            position: absolute;
                            left: 0;
                            width: 50%;
                            padding-left: 15px;
                            font-weight: bold;
                            text-align: left;
                        }
                    }
                `}
            </style>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <select 
                    onChange={handleTableChange} 
                    value={selectedTable} 
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        fontSize: '16px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc' 
                    }}
                >
                    {Object.keys(tables).map((table) => (
                        <option key={table} value={table}>
                            {table}
                        </option>
                    ))}
                </select>
            </div>

            <table className="responsive-table">
                <thead>
                    <tr>
                        {Object.keys(tables[selectedTable][0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tables[selectedTable].map((row) => (
                        <tr key={row.id}>
                            {Object.entries(row).map(([key, value]) => (
                                <td key={key} data-label={key}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AvailableTables;