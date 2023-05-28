"use client";
import React, { useEffect, useState } from "react";
import EditableCellModal from "./popup";
import { columnStyle } from "./style";
import ClickableCell from "./clickcell";
import TagCell from "./tagcell";
import MenuCell from "./menucell";

export default function RestaurantPage({
  params,
}: {
  params: { region: string[] };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    value: "",
    rowIndex: 0,
    columnIndex: 0,
  });

  const data = Array(60)
    .fill(0)
    .map(() => ({
      name: "Asobu",
      introduction: "A best place for KAIST students",
      address: "14, Eoeun-ro 48beon-gil, Yuseong-gu, Daejeon-si",
      location: [34.21, 66.55],
      phone: "042-XXX-XXXX",
      price: 9500,
      business_hour: {
        Mon: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
          0,
        ],
        Tue: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
          0,
        ],
        Wed: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
          0,
        ],
        Thu: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
          0,
        ],
        Fri: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
          0,
        ],
        Sat: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
          0,
        ],
        Sun: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
          0,
        ],
      },
      moods: ["Cozy", "Affordable"],
      characteristics: ["Sushi", "Donburi"],
      images: ["path/to/image1"],
      menus: {
        "menu A": 9500,
        "menu B": 11000,
      },
      reviews: [
        {
          username: "minji",
          content: "Good",
        },
      ],
      rating: 4.6,
    }));
  const dataKeys = Object.keys(data[0]);
  const detailKeys = new Array("address", "business_hour", "reviews", "images");
  const tagKeys = new Array("moods", "characteristics");
  const menuKeys = new Array("menus");
  const [tableData, setTableData] = useState<{ [key: string]: any }[]>(data);

  const handleCellValueChange = (
    rowIndex: number,
    columnIndex: number,
    newValue: string | string[] | {[menu: string]: number}
  ) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][dataKeys[columnIndex]] = newValue;
    setTableData(updatedData);
  };

  const handleModalValueChange = (newValue: string) => {
    handleCellValueChange(modalData.rowIndex, modalData.columnIndex, newValue);
    setIsModalOpen(false);
  };

  const handleCellClick = (
    value: string,
    rowIndex: number,
    columnIndex: number
  ) => {
    console.log("clicked");
    setModalData({ value, rowIndex, columnIndex });
    setIsModalOpen(true);
  };

  const renderTableCell = (key: string, value: any) => {
    if (tagKeys.includes(key)) {
      return value;
    }
    else if (Array.isArray(value) || typeof value === "object") {
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
    <div className="block h-full w-full overflow-scroll justify-center items-center p-8">
      <div className="text-2xl font-bold mb-8">Restaurant Information</div>
      <div className="mb-4">
        Showing results of {params.region[2]}, {params.region[1]},{" "}
        {params.region[0]}
      </div>
      <table className="text-xs border-collapse w-full">
        <thead>
          <tr>
            {tableData.length > 0 &&
              Object.keys(tableData[0]).map((key) => (
                <th style={columnStyle} key={key} className="border px-1 py-2">
                  {key}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, columnIndex) => {
                if(tagKeys.includes(dataKeys[columnIndex])){
                  return (
                  <TagCell 
                    key={`${rowIndex}-${columnIndex}`} 
                    value={value} 
                    onValueChange={(newValue) => handleCellValueChange(rowIndex, columnIndex, newValue)} 
                  /> );
                } else if (menuKeys.includes(dataKeys[columnIndex])){
                  return (
                    <MenuCell 
                      key={`${rowIndex}-${columnIndex}`} 
                      value={value} 
                      onValueChange={(newValue) => handleCellValueChange(rowIndex, columnIndex, newValue)} 
                    /> );
                } else {
                  return (
                    <ClickableCell
                      key={`${rowIndex}-${columnIndex}`}
                      onClick={() =>
                        handleCellClick(
                          renderTableCell(dataKeys[columnIndex], value),
                          rowIndex,
                          columnIndex
                        )
                      }
                      value={detailKeys.includes(dataKeys[columnIndex]) ? 'View' : renderTableCell(dataKeys[columnIndex], value)}
                    />
                  )
                }  
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <EditableCellModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          value={modalData.value}
          onValueChange={handleModalValueChange}
        />
      )}
    </div>
  );
}