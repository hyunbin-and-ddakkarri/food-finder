"use client";
import "./globals.css";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { Regions, region, regionToString } from "./region";
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from "./searchbar";
import { filterOptions, optionsToRoute } from "./filters";

const query = gql`
  query getRegion($region: String!) {
    regions(region: $region) {
      rid
      name
    }
  }
`;

interface OptionProps {
  filter: string;
  currentOptions: Array<Number>;
  optionIdx: Number;
  option: string;
  onCheck: (arg0: string, arg1: Number) => void;
}
const OptionCell: React.FC<OptionProps> = ({
  filter,
  currentOptions,
  optionIdx,
  option,
  onCheck,
}) => {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={currentOptions.includes(optionIdx)}
        className="form-checkbox h-5 w-5 text-blue-400"
        onChange={() => onCheck(filter, optionIdx)}
      />
      <span className="ml-1 mr-2 text-xs">{option}</span>
    </label>
  );
};

export default function Home() {
  const [displayedFilter, setDisplayedFilter] = useState("none");
  
  const [options, setOptions] = useState<{ [key: string]: Array<Number> }>({
    price: [],
    mood: [],
    rating: [],
    businessHours: [],
  });

  const router = useRouter();

  const handleRegionClick = (region: region) => {
    router.push(`/datamap/${region.city}/${region.district}/${region.dong}/${optionsToRoute(options)}`);
  };

  const handleFilter = (name: string) => {
    if (displayedFilter == name) {
      setDisplayedFilter("none");
    } else {
      setDisplayedFilter(name);
    }
  };

  const handleOption = (filter: string, optionIdx: Number) => {
    const currentOptions = { ...options };
    if (options[filter].includes(optionIdx)) {
      currentOptions[filter] = currentOptions[filter].filter(
        (f) => f !== optionIdx
      );
    } else {
      currentOptions[filter].push(optionIdx);
    }
    setOptions(currentOptions);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle search functionality here
  };
  const [query, setQuery] = useState("");
  const filters = ["Price", "Mood", "Rating", "Business Hours"];
  const [searchVal, setSearchVal] = useState("");

  //console.log(Region.filter(region=>region.name.toLowerCase().includes("1")))
  return (
    <div className="h-screen ">
      <SearchBar setText={setSearchVal}/>

      <div className="mb-4 ml-1 mr-1">
        <div className="flex overflow-x-scroll flex-row mt-1 hideScrollBar">
          {filters.map((filter, idx) => {
            const filterKey = Object.keys(options)[idx];
            if (options[filterKey].length > 0) {
              return (
                <div
                  onClick={() => handleFilter(filterKey)}
                  className="secondaryButton font-medium rounded-lg text-sm px-4 py-1 text-center mr-2 mb-2 w-fit h-fit whitespace-nowrap	selectedButton"
                  key={idx}
                >
                  {filter}
                </div>
              );
            } else
              return (
                <div
                  onClick={() => handleFilter(filterKey)}
                  className="secondaryButton font-medium rounded-lg text-sm px-4 py-1 text-center mr-2 mb-2 w-fit h-fit whitespace-nowrap	"
                  key={idx}
                >
                  {filter}
                </div>
              );
          })}
        </div>
        <div>
          {displayedFilter !== "none" && (
            <div className="ml-1 space-y-2">
              {filterOptions[displayedFilter].map((option, idx) => {
                return (
                  <OptionCell
                    key={idx}
                    filter={displayedFilter}
                    currentOptions={options[displayedFilter]}
                    optionIdx={idx}
                    option={option}
                    onCheck={handleOption}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="content flex-1 overflow-y-scroll hideScrollBar">
        <div className="grid grid-rows-6 gap-1 max-w-md divide-y divide-gray-200 dark:divide-gray-700">
          {Regions.filter((region) =>
            regionToString(region).toLowerCase().includes(query.toLowerCase())
          ).map((region) => (
            <div key={regionToString(region)}>
              <div className="flex-1 items-center space-x-0 min-w-0">
                <button
                  type="button"
                  onClick={() => handleRegionClick(region)}
                  className="block w-full cursor-pointer rounded-lg py-2 text-left text-sm"
                >
                  {regionToString(region)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
