import React from 'react';

interface TableRow {
  [key: string]: string | number | null;
}

interface QueryOutputTableProps {
  results: Record<string, TableRow[]> | null;
  maxHeight: number;
}

const QueryOutputTable: React.FC<QueryOutputTableProps> = ({ results, maxHeight }) => {
  if (!results || Object.keys(results).length === 0) {
    return <p style={{ textAlign: 'center', color: 'gray' }}>No output available</p>;
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div 
        className="responsive-table-container" 
        style={{ 
          maxHeight: `${maxHeight}px`, 
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%'
        }}
      >
        {Object.entries(results).map(([tableName, rows]) => (
          <div key={tableName} style={{ marginBottom: '20px' }}>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                tableLayout: 'fixed'
              }}>
                <thead>
                  <tr>
                    {rows.length > 0 && Object.keys(rows[0]).map((col, index) => (
                      <th key={index} style={{
                        border: '1px solid #ddd',
                        padding: '8px 12px',
                        backgroundColor: '#f2f2f2',
                        textAlign: 'left'
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.entries(row).map(([key, cell]) => (
                        <td 
                          key={key} 
                          data-label={key}
                          style={{
                            border: '1px solid #ddd',
                            padding: '8px 12px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                          }}
                          title={cell?.toString() || "NULL"}
                        >
                          {cell?.toString() || "NULL"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryOutputTable;