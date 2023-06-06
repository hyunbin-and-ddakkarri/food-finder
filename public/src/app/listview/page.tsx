"use client"
import Link from "next/link"
import React, { useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import Layout from './layout';

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
    <div className='flex flex-col h-screen m-2'>
      <Link href="/datamap">
        <div className="flex items-center mb-2">
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
            </div>
            <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
          </div>
          <button type="submit" className="p-2.5 primaryButton ml-2 text-sm font-medium rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </Link>
      <Link href="/datamap">
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
          <div key={index}>
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

            <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
              <div className="-m-1 flex flex-wrap md:-m-2">
                <div className="flex w-1/3 flex-wrap">
                  <div className="w-full p-1 md:p-2">
                    <img
                      alt="gallery"
                      className="block h-full w-full rounded-lg object-cover object-center"
                      src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp" />
                  </div>
                </div>
                <div className="flex w-1/3 flex-wrap">
                  <div className="w-full p-1 md:p-2">
                    <img
                      alt="gallery"
                      className="block h-full w-full rounded-lg object-cover object-center"
                      src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp" />
                  </div>
                </div>
                <div className="flex w-1/3 flex-wrap">
                  <div className="w-full p-1 md:p-2">
                    <img
                      alt="gallery"
                      className="block h-full w-full rounded-lg object-cover object-center"
                      src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
    </div>
    </div >
  );
};

export default Page;
