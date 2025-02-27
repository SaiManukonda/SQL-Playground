import React, { useState } from 'react';

interface TableRow {
    [key: string]: string | number | null;
  }

interface AvailableTablesProps {
    tables: Record<string, TableRow[]>;
    maxHeight: number;
  }
  

const AvailableTables: React.FC<AvailableTablesProps> = ({ tables, maxHeight }) => {
    const tableNames = Object.keys(tables);
    const [selectedTable, setSelectedTable] = useState<string>(tableNames[0] || "");
    const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedTable(event.target.value);
    };

    return (
        <div>
            <style>
                {`
                    .responsive-table-container {
                        overflow: auto;
                        max-height: ${maxHeight}px;
                    }

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
                {tableNames.map((table) => (
                    <option key={table} value={table}>
                    {table}
                    </option>
                ))}
                </select>
            </div>

      {selectedTable && tables[selectedTable]?.length > 0 ? (
        <div className="responsive-table-container">
        <table className="responsive-table">
          <thead>
            <tr>
              {Object.keys(tables[selectedTable][0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables[selectedTable].map((row, index) => (
              <tr key={index}>
                {Object.entries(row).map(([key, value]) => (
                  <td key={key} data-label={key}>{value?.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>No data available</p>
      )}
    </div>
  );
};

export default AvailableTables;