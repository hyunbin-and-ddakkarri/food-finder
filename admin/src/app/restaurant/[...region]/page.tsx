"use client";
import React, { useEffect, useState } from "react";
import EditableCellModal from "./popup";
import { columnStyle } from "./style";
import ClickableCell from "./clickcell";
import TagCell from "./tagcell";
import MenuCell from "./menucell";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";

const query = gql`query getData($region: String!) {
    restaurants(region: $region) {
      id
      name
      introduction
      address
      location
      region
      phone
      price
      businessHours
      moods
      characteristics
      images
      menus
      reviews {
        username
        context
        date
      }
      rating
  }
}`;

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

  const { data } = useSuspenseQuery(query, {'variables': {region: params.region[2]}});
  const dataT = data as {[restaurants: string]: Array<any>};
  console.log(dataT.restaurants[0].name);
  const dummyData = dataT.restaurants.map((d) => ({
      name: d.name as string,
      introduction: d.introduction as string,
      address: d.address as string,
      location: [d.location[0] as Number, d.location[1] as Number],
      phone: d.phone as string,
      price: d.price as Number,
      businessHours: d.businessHours as {[key:string]:Array<Number>},
      moods: d.moods as Array<String>,
      characteristics: d.characteristics as Array<String>,
      images: d.images as Array<String>,
      menus: d.menus as {[key: string]:Number},
      reviews: d.reviews as Array<{[key:string]:string}>,
      rating: d.rating as Number,
    }));
  const dataKeys = Object.keys(dummyData[0]);
  const detailKeys = new Array("address", "businessHours", "reviews", "images");
  const tagKeys = new Array("moods", "characteristics");
  const menuKeys = new Array("menus");
  const [tableData, setTableData] = useState<{ [key: string]: any }[]>(dummyData);

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
      // if (key === 'businessHours') {
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
    <div className="block h-full w-full overflow-scroll justify-center items-center p-8 text-black">
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