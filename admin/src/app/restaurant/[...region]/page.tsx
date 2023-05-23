"use client";
import { useEffect, useState } from 'react';

interface EditableCellProps {
  value: string;
  onValueChange: (value: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onValueChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onValueChange(editedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  return isEditing ? (
    <td>
      <input
        value={editedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        style={{ width: '100%', boxSizing: 'border-box' }}
      />
    </td>
  ) : (
    <td className="border px-4 py-2" onClick={handleEdit}>{value}</td>
  );
}

export default function RestaurantPage({ params }: { params: { region: string[] } }) {
    const data = Array(6).fill(0).map(() => (
      {
        "name": "Asobu",
        "introduction": "A best place for KAIST students",
        "address": "14, Eoeun-ro 48beon-gil, Yuseong-gu, Daejeon-si",
        "location": [34.21, 66.55],
        "phone": "042-XXX-XXXX",
        "price": 9500,
        "business_hour": {
          "Mon": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          "Tue": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          "Wed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          "Thu": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          "Fri": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          "Sat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
          "Sun": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        },
        "moods": ["Cozy", "Affordable"],
        "characteristics": ["Sushi", "Donburi"],
        "images": ["path/to/image1"],
        "menus": {
          "menu A": 9500,
          "menu B": 11000,
        },
        "reviews": [ {
          "username": "minji",
          "content": "Good"
          }],
        "rating": 4.6
      }) 
    )
    const dataKeys = Object.keys(data[0]);
    const [tableData, setTableData] = useState<{ [key: string]: any }[]>(data);

    const handleCellValueChange = (rowIndex: number, columnIndex: number, newValue: string) => {
      const updatedData = [...tableData];
      updatedData[rowIndex][dataKeys[columnIndex]] = newValue;
      setTableData(updatedData);
    };

    const renderTableCell = (key: string, value: any) => {
        if (Array.isArray(value) || typeof value === 'object') {
          // if (key === 'business_hour') {
          //   const weekdays = Object.keys(value);
          //   return weekdays.map((day) => {
          //     const hours = value[day];
          //     const openRanges = [];
          //     let startHour = -1;
          //     for (let i = 0; i < 24; i++) {
          //       if (hours[i] === 1 && startHour === -1) {
          //         startHour = i;
          //       } else if (hours[i] === 0 && startHour !== -1) {
          //         openRanges.push(`${startHour}-${i-1}`);
          //         startHour = -1;
          //       }
          //     }
          //     if (startHour !== -1) {
          //       openRanges.push(`${startHour}-23`);
          //     }
          //     return `${day} ${openRanges.join(', ')}`;
          //   }).join(', ');
          // }
          return JSON.stringify(value);
        }
        return value;
      };

    return (
        <div className="block w-full overflow-y-scroll justify-center items-center m-8">
            <div className="text-2xl font-bold mb-8">Restaurant Information</div>
            <div>Showing results of {params.region[2]}, {params.region[1]}, {params.region[0]}</div>
            <table className="text-xs border-collapse w-full">
                <thead>
                <tr>
                    {tableData.length > 0 &&
                    Object.keys(tableData[0]).map((key) => (
                        <th key={key} className="border px-4 py-2">
                        {key}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, columnIndex) => (
                      <EditableCell 
                        key={`${rowIndex}-${columnIndex}`} 
                        value={renderTableCell(dataKeys[columnIndex], value)} 
                        onValueChange={(newValue) => handleCellValueChange(rowIndex, columnIndex, newValue)} 
                      />
                    ))}
                  </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
  }