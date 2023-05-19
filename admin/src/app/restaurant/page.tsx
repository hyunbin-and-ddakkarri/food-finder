"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const data = [
  {
    name: 'Seoul',
    sub: [
      {
        name: 'Gangnam-gu',
        sub: ['Sinsa-dong', 'Yeoksam-dong', 'Cheongdam-dong', 'Apgujeong-dong'],
      },
      {
        name: 'Seocho-gu',
        sub: ['Bangbae-dong', 'Seocho-dong', 'Yangjae-dong'],
      },
    ],
  },
  {
    name: 'Daejeon',
    sub: [
      {
        name: 'Yuseong-gu',
        sub: ['Eoen-dong', 'Bongmyeong-dong', 'Noen-dong'],
      },
      {
        name: 'Seo-gu',
        sub: ['Galma-dong', 'Dunsan-dong', 'Doan-dong'],
      },
    ],
  },
];

export default function ScrollableListboxes() {
  const [selectedCity, setSelectedCity] = useState(data[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(selectedCity.sub[0]);
  const router = useRouter();

  const handleCityChange = (city: any) => {
    setSelectedCity(city);
    setSelectedDistrict(city.sub[0]);
  };

  const handleDistrictChange = (district: any) => {
    setSelectedDistrict(district);
  };

  const handleDongClick = (dong: string) => {
    router.push(`/restaurant/${selectedCity.name}/${selectedDistrict.name}/${dong}`);
  };

  return (
    <div className="block w-full justify-center items-center m-8">
      <div className="text-2xl font-bold mb-8">Restaurant Information</div>
      <div className="flex w-full">
        <div className="w-1/3 mr-4 overflow-y-scroll">
            <h2 className="text-lg font-semibold mb-2">City</h2>
            <ul className='border border-gray-300 rounded-md h-40 overflow-y-auto'>
            {data.map((city) => (
              <li
                key={city.name}
                className={`cursor-pointer p-2 ${
                  city === selectedCity ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={() => handleCityChange(city)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/3 mr-4 overflow-y-scroll">
            <h2 className="text-lg font-semibold mb-2">Si/Gun/Gu</h2>
            <ul className='border border-gray-300 rounded-md h-40 overflow-y-auto'>
            {selectedCity.sub.map((district) => (
              <li
                key={district.name}
                className={`cursor-pointer p-2 ${
                  district === selectedDistrict ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={() => handleDistrictChange(district)}
              >
                {district.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/3 overflow-y-scroll">
            <h2 className="text-lg font-semibold mb-2">Dong</h2>
            <ul className='border border-gray-300 rounded-md h-40 overflow-y-auto'>
            {selectedDistrict.sub.map((subdistrict) => (
              <li 
                key={subdistrict} 
                className="cursor-pointer p-2 hover:bg-blue-500 hover:text-white"
                onClick={() => handleDongClick(subdistrict)}
              >
                {subdistrict}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};