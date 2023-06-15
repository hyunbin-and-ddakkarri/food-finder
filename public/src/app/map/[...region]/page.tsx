"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from 'next/navigation'
import { stringsToRegion, regionToString, region } from "@/app/region";
import Link from "next/link";
import { faSearch, faList } from '@fortawesome/free-solid-svg-icons'
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

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapView({ params }: { params: { region: string[] } }) {
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
        businessHours: d.businessHours as {
          [key: string]: Array<Number>;
        },
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
    router.push(`/listview/${region.city}/${region.district}/${region.dong}`);
  };

  useEffect(() => {
    const mapScript = document.createElement("script");

    mapScript.async = true;
    mapScript.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=4db502f3df145cbe27c3dbc6376ef4e8&autoload=false`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(36.3629, 127.3568),
          level: 2,
        };
        var map = new window.kakao.maps.Map(mapContainer, mapOption);
        var markerPosition = new window.kakao.maps.LatLng(
          36.363169,
          127.357197
        );
        var marker = new window.kakao.maps.Marker({
          position: markerPosition,
          clickable: true,
        });
        marker.setMap(map);
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);
  }, []);

  return (
    <div className="h-full m-2">
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
      <FontAwesomeIcon icon={faList} size='lg' onClick={() => handleRegionClick(stringsToRegion(params.region))}/>
      <div className="Map h-screen relative">
        <div
          id="map"
          style={{
            position: "absolute",
            width: "100%",
            height: "105vh",
            marginTop: "-75px",
            zIndex: "-1",
          }}
        ></div>
      </div>
    </div>
  );
}
