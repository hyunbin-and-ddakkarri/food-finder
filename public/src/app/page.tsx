"use client"

import './globals.css'
import Link from "next/link"
import React, { useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import {Region} from "./region"
const query = gql`query getRegion($region: String!) {
  regions(region: $region) {
    rid
    name
  }
}`;

interface OptionProps {
  filter: string
  currentOptions: Array<string>
  option: string
  onCheck: (arg0: string, arg1: string) => void
}
const OptionCell: React.FC<OptionProps> = ({ filter, currentOptions, option, onCheck }) => {
  return (
    <label className="inline-flex items-center">
      <input type="checkbox" checked={currentOptions.includes(option)} className="form-checkbox h-5 w-5 text-blue-400" onChange={() => onCheck(filter, option)}/>
      <span className="ml-1 mr-2 text-xs">{option}</span>
    </label>
  )
}

export default function Home() {
  const [displayedFilter, setDisplayedFilter] = useState("none");
  const filterOptions: {[key: string]:Array<string>}  = {
    "price": ["0~5000", "5000~10000", "10000~15000", "15000~"],
    "mood": ["a", "b", "c"],
    "rating": ["~3.5", "3.5~4.0", "4.0~4.5", "4.5~"],
    "businessHours": ["Open now", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  }
  const [options, setOptions] = useState<{[key: string]:Array<string>}>({
    "price": [],
    "mood": [],
    "rating": [],
    "businessHours": []
  })

  const handleFilter = (name: string) => {
    if (displayedFilter == name) {
      setDisplayedFilter("none");
    } else {
      setDisplayedFilter(name);
    }
  }

  const handleOption = (filter: string, option: string) => {
    const currentOptions = {...options}
    if (options[filter].includes(option)) {
      currentOptions[filter] = currentOptions[filter].filter(f => f !== option)
    } else {
      currentOptions[filter].push(option)
    }
    setOptions(currentOptions)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle search functionality here
  };
  const [query, setQuery] = useState("");
  const filters = ["Price", "Mood", "Rating", "Business Hours"];

  //console.log(Region.filter(region=>region.name.toLowerCase().includes("1")))
  return (
    <div className='h-full m-2'>
      <div className="flex items-center mb-2">
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          </div>
          <input onChange={(e) => setQuery(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
        </div>
        <button type="submit" className="p-2.5 primaryButton ml-2 text-sm font-medium rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <span className="sr-only">Search</span>
        </button>
      </div>

      <div className='mb-4 ml-1 mr-1'>
        <div className="flex overflow-x-scroll flex-row mt-1 hideScrollBar">
          {
            filters.map((filter, idx) => {
              const filterKey = Object.keys(options)[idx];
              if (options[filterKey].length > 0){
                return (
                  <div 
                    onClick={() => handleFilter(filterKey)} 
                    className="secondaryButton font-medium rounded-lg text-sm px-4 py-1 text-center mr-2 mb-2 w-fit h-fit whitespace-nowrap	selectedButton"
                    key={idx}>
                    {filter}
                  </div>
                )
              } else return (
                <div 
                  onClick={() => handleFilter(filterKey)} 
                  className="secondaryButton font-medium rounded-lg text-sm px-4 py-1 text-center mr-2 mb-2 w-fit h-fit whitespace-nowrap	"
                  key={idx}>
                  {filter}
                </div>
              )
            })
          }
        </div>
        <div>
          { displayedFilter !== "none" && (
            <div className="ml-1 space-y-2">
            {
              filterOptions[displayedFilter].map((option, idx) => {
                return (
                  <OptionCell
                    key={idx}
                    filter={displayedFilter}
                    currentOptions={options[displayedFilter]}
                    option={option}
                    onCheck={handleOption}
                  />
                )
              })
            }
          </div>
          ) }
        </div>
      </div>
      <div className="content flex-1 overflow-y-auto">
        <div className="flex flex-col justify-between p-4">
            <div className="grid grid-rows-6 grid-flow-col gap-1 max-w-md divide-y divide-gray-200 dark:divide-gray-700"> {/* 6-> list element number */}
              {Region.filter((region)=>region.name.toLowerCase().includes(query)).map((region) => (
                <div key={region.id}>
                  <div className="flex-1 items-center space-x-0 min-w-0">
                    <Link href="/datamap">
                      <button
                        type="button"
                        // transition duration-500 hover:bg-subButton hover:text-neutral-500 text-sm focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0
                        className="block w-full cursor-pointer rounded-lg py-2 text-left text-sm">
                        {region.name}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
//hover:bg-subButton hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0
