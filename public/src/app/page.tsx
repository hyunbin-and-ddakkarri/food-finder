"use client"
import React, { useState } from 'react';
import { gql, useQuery } from "@apollo/client";

const query = gql`query getRegion($region: String!) {
  regions(region: $region) {
    rid
    name
  }
}`;

const Home = () => {
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showMoodFilter, setShowMoodFilter] = useState(false);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [showBusinessHourFilter, setShowBusinessHourFilter] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle search functionality here
  };

  const handleFilter = (filter: string) => {
    switch (filter) {
      case 'filter1':
        setShowPriceFilter(!showPriceFilter);
        break;
      case 'filter2':
        setShowMoodFilter(!showMoodFilter);
        break;
      case 'filter3':
        setShowRatingFilter(!showRatingFilter);
        break;
      case 'filter4':
        setShowBusinessHourFilter(!showBusinessHourFilter);
        break;
      default:
        break;
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className="flex items-center mt-2 ml-1 mr-1 mb-2">
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          </div>
          <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required/>
        </div>
        <button type="submit" className="p-2.5 text-blue-400 ml-0 mr-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <span className="sr-only">Search</span>
        </button>
      </div>

      <div className="flex flex-row overflow-x-auto mb-4 ml-1 mr-1">
        <div onClick={() => handleFilter('filter1')} className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-7 py-1 text-center mr-2 mb-2">
          Price</div>
        {showPriceFilter && (
          <div className="ml-8 space-y-2">
            {/* Price filter checkboxes */}
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">0~5000</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">5000~10000</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">10000~20000</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">20000~30000</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">30000~</span>
            </label>
          </div>
        )}
        <div onClick={() => handleFilter('filter2')} className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-7 py-1 text-center mr-2 mb-2">
          Mood</div>
        {showMoodFilter && (
          <div className="ml-8 space-y-2">
            {/* Mood filter checkboxes */}
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">a</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">b</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">c</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">d</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">e</span>
            </label>
          </div>
        )}
        <div onClick={() => handleFilter('filter3')} className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-7 py-1 text-center mr-2 mb-2">
          Rating</div>
        {showRatingFilter && (
          <div className="ml-8 space-y-2">
            {/* Rating filter checkboxes */}
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">a</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">b</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">c</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">d</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">e</span>
            </label>
          </div>
        )}
        <div onClick={() => handleFilter('filter4')} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-7 py-1 text-center mr-2 mb-2">
          OpenStatus</div>
        {showBusinessHourFilter && (
          <div className="ml-8 space-y-2">
            {/* Business Hour filter checkboxes */}
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4">open</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-400" />
              <span className="text-blue-400 ml-0 mr-4"></span>
            </label>
          </div>
        )}
      </div>
      <div className="content flex-1 overflow-y-auto">
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
          <div>
          <img src="img/logo.png" alt="img/logo.png"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
