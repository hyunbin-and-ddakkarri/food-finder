'use client'
import React from 'react';
import Layout from './layout';
import Link from "next/link"


const Page = () => {
  //dummy data
  const restaurantsList = [
    {
      name: 'Restaurant A',
      rating: 4.8,
      openStatus: 'Open',
    },
    {
      name: 'Restaurant B',
      rating: 4.5,
      openStatus: 'Close',
    },
    {
      name: 'Restaurant C',
      rating: 3.7,
      openStatus: 'Open',
    },
    {
      name: 'Restaurant D',
      rating: 3.4,
      openStatus: 'Open',
    },
    {
      name: 'Restaurant D',
      rating: 3.4,
      openStatus: 'Open',
    },
    {
      name: 'Restaurant D',
      rating: 3.4,
      openStatus: 'Open',
    }
  ];
  return (
    //later fix link to "/mapview"
    <div>   
      <Link href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="h-8 w-8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </Link>
      <div className="grid grid-rows-6 grid-flow-col gap-4 max-w-md divide-y divide-gray-200 dark:divide-gray-700"> {/* 6-> list element number */}
        {restaurantsList.map((restaurant, index) => (
          <li key={index}>
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <Link href="/detail">
                  <p className="text-lg font-semibold text-gray-900 truncate dark:text-white">
                    {restaurant.name}
                  </p>
                </Link>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  Rating: {restaurant.rating}
                </p>
              </div>
              <div className="text-xs inline-flex items-center text-base text-gray-900 dark:text-white">
                Open Status: {restaurant.openStatus}
              </div>
            </div>
            <img src="restaurantA1" alt="restaurant A1" />
            <img src="restaurantA2" alt="restaurant A2" />
            <img src="restaurantA3" alt="restaurant A3" />
          </li>
        ))}
      </div>
    </div>
  );
};

export default Page;
