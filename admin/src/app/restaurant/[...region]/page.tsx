"use client";
import { useEffect, useState } from 'react';

export default function RestaurantPage({ params }: { params: { region: string[] } }) {
    const data = Array(4).fill(
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
        }, 
    )

    const [tableData, setTableData] = useState<{ [key: string]: any }[]>(data);

    const renderTableCell = (value: any) => {
        if (Array.isArray(value) || typeof value === 'object') {
          if (typeof value === 'object' && Object.keys(value).length === 7) {
            const weekdays = Object.keys(value);
            return weekdays.map((day) => {
              const hours = value[day];
              const openRanges = [];
              let startHour = -1;
              for (let i = 0; i < 24; i++) {
                if (hours[i] === 1 && startHour === -1) {
                  startHour = i;
                } else if (hours[i] === 0 && startHour !== -1) {
                  openRanges.push(`${startHour}-${i-1}`);
                  startHour = -1;
                }
              }
              if (startHour !== -1) {
                openRanges.push(`${startHour}-23`);
              }
              return `${day} ${openRanges.join(', ')}`;
            }).join(', ');
          }
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
                {tableData.map((row) => (
                    <tr key={row.id}>
                    {Object.values(row).map((value, index) => (
                        <td key={index} className="border px-4 py-2">
                        {renderTableCell(value)}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
  }