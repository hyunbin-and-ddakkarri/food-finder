"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { stringsToRegion, regionToString, region } from "@/app/region";
import { faSearch, faMap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const query = gql`
  query getData($region: String!) {
    restaurants(region: $region) {
      rid
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
  }
`;

export default function ListView({ params }: { params: { region: string[] } }) {
  const { error, data } = useQuery(query, {
    variables: { region: params.region[2] },
  });
  const [tableData, setTableData] = useState<{ [key: string]: any }[]>([{}]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const dataT = data as { [restaurants: string]: Array<any> };
      const newData = dataT.restaurants.map((d) => ({
        name: d.name as string,
        introduction: d.introduction as string,
        address: d.address as string,
        location: [d.location[0] as Number, d.location[1] as Number],
        phone: d.phone as string,
        price: d.price as Number,
        businessHours: d.businessHours as { [key: string]: Array<Number> },
        moods: d.moods as Array<String>,
        characteristics: d.characteristics as Array<String>,
        images: d.images as Array<String>,
        menus: d.menus as { [key: string]: Number },
        reviews: d.reviews as Array<{ [key: string]: string }>,
        rating: d.rating as Number,
      }));
      setTableData(newData);
      setDataKeys(Object.keys(newData[0]));
    }
  }, [data]);

  const router = useRouter();

  const handleRegionClick = (region: region) => {
    router.push(`/map/${region.city}/${region.district}/${region.dong}`);
  };

  const restaurantsList = [
    {
      name: "Restaurant A",
      rating: 4.8,
      openStatus: "Open",
    },
    {
      name: "Restaurant B",
      rating: 4.5,
      openStatus: "Close",
    },
    {
      name: "Restaurant C",
      rating: 3.7,
      openStatus: "Open",
    },
    {
      name: "Restaurant D",
      rating: 3.4,
      openStatus: "Open",
    },
    {
      name: "Restaurant D",
      rating: 3.4,
      openStatus: "Open",
    },
    {
      name: "Restaurant D",
      rating: 3.4,
      openStatus: "Open",
    },
  ];
  return (
    //later fix link to "/mapview"
    <div className="flex flex-col h-screen m-2">
      <Link href='/'>
        <div className="flex items-center mb-2">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faSearch} size='lg'/>
            </div>
            <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {regionToString(stringsToRegion(params.region))}
            </p>
          </div>
        </div>
      </Link>
      <FontAwesomeIcon icon={faMap} size='lg' onClick={() => handleRegionClick(stringsToRegion(params.region))}/>
      <div className="grid grid-rows-6 grid-flow-col gap-4 max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {" "}
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
                      src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp"
                    />
                  </div>
                </div>
                <div className="flex w-1/3 flex-wrap">
                  <div className="w-full p-1 md:p-2">
                    <img
                      alt="gallery"
                      className="block h-full w-full rounded-lg object-cover object-center"
                      src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp"
                    />
                  </div>
                </div>
                <div className="flex w-1/3 flex-wrap">
                  <div className="w-full p-1 md:p-2">
                    <img
                      alt="gallery"
                      className="block h-full w-full rounded-lg object-cover object-center"
                      src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
