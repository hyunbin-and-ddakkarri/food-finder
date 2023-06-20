"use client";
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

export default function Home() {
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
