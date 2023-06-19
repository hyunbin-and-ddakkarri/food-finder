"use client";
import fetch from 'cross-fetch';
global.fetch = fetch;
import "./globals.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { Regions, region, regionToString } from "./region";
import SearchBar from "./searchbar";
import { optionsToRoute } from "./filters";

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

  const [query, setQuery] = useState("");

  //console.log(Region.filter(region=>region.name.toLowerCase().includes("1")))
  return (
    <>
      <SearchBar setText={setQuery} />
      <div className="flex flex-col mx-6 divide-y divide-secondary">
        {Regions.filter((region) =>
          regionToString(region).toLowerCase().includes(query.toLowerCase())
        ).map((region) => (
          <div className="h-10 pt-1 text-lg font-medium text-secondary"
            key={regionToString(region)} onClick={() => handleRegionClick(region)}>
            {regionToString(region)}
          </div>
        ))}
      </div>
    </>
  );
}
