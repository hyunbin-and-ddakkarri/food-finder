"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { stringsToRegion, regionToString, region } from "@/app/region";
import { Restaurant, resultsToRestaurants, isOpenNow } from "@/app/restaurant";
import { faStar, faMap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DetailPage from '@/app/listview/[...region]/detail'
import SearchBar from "@/app/searchbar";

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
  const [detail, setDetail] = useState(-1);

  const { error, data } = useQuery(query, {
    variables: { region: params.region[2] },
  });
  const [tableData, setTableData] = useState<Restaurant[]>(Array(10).fill({
    name: "잇마이타이",
    introduction: "대전 태국음식점 잇마이타이 입니다. 본점은 봉명동, 분점은 어은동에 위치해 있습니다.",
    address: "대전 유성구 어은동 112-4 1층 잇마이타이",
    location: [127.3588931, 36.3636649],
    phone: '042-335-5466',
    price: 17882,
    
    businessHours: {'토': [11, 21], '일': [11, 21], '월': [11, 21], '화': [11, 21], '수': [11, 21], '목': [11, 21], '금': [11, 21]},
    moods: ["Cozy", "Affordable"],
    characteristics: ["Donburi", "Thai"],
    images: ['https://ldb-phinf.pstatic.net/20220129_229/1643445449356YqHLz_JPEG/F4E7C2F6-E23D-473B-A3D2-34FE3629BD2A.jpeg', 'https://ldb-phinf.pstatic.net/20220129_223/1643445449972ANjAr_JPEG/EB91198E-6E71-4768-856C-2327FCBA6A0B.jpeg', 'https://ldb-phinf.pstatic.net/20220129_238/1643445449839aeKWh_JPEG/827F2745-6F0D-4B85-8336-DE4D8FA1254B.jpeg', 'https://ldb-phinf.pstatic.net/20200210_183/15813306588974vCcd_JPEG/5E0AZu2O5C5vrl40bW1mi9xd.jpeg.jpg'],
    menus: {'A세트(2인)': 23900, 'A-1세트(2인)': 36500, 'B세트(3인)': 45100, 'C세트(4인)': 58100, '팟타이': 9900, '뿌팟퐁커리': 22900, '꿍팟퐁커리': 9900, '그린커리': 9900, '쌀국수': 9900, '똠양꿍누들': 13900, '카오팟똠양': 9900, '팟카파오무쌉': 9900, '카오팟탈레': 9900, '까이텃': 9900, '카이룩커이': 5000, '모닝글로리': 9500, '쏨땀': 9900},
    reviews: [{'민지': '맛있어요'}],
    rating: 4.4
  } as Restaurant));
  // Only for dev, will be replaced when server done
  const [dataKeys, setDataKeys] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const dataT = data as { [restaurants: string]: Array<any> };
      const newData: Array<Restaurant> = resultsToRestaurants(dataT.restaurants);
      setTableData(newData);
      setDataKeys(Object.keys(newData[0]));
    }
  }, [data]);

  const router = useRouter();

  const handleRegionClick = (region: region) => {
    router.push(`/map/${region.city}/${region.district}/${region.dong}`);
  };

  return (
    <div>
      {
        detail == -1 ? (
        <>
        <div className="flex flex-col h-screen overflow-x-hidden">
        <SearchBar text={regionToString(stringsToRegion(params.region))} link backButton/>
        
        <div className="mx-6">
          <div className="flex flex-col gap-2 overflow-y-scroll hideScrollBar divide-y divide-secondary overflow-x-hidden">
            {tableData.map((restaurant, index) => {
              return (
                <div className="flex flex-col gap-3" onClick={() => setDetail(index)}>
                  <div className="flex justify-between items-end w-full flex-wrap mt-2">
                    <h2 className="font-bold text-xl text-secondary">
                      {restaurant.name}
                    </h2>
                    <div className="flex gap-2 items-center">
                      <FontAwesomeIcon icon={faStar} style={{color: "rgb(var(--primary))",}}/>
                      <div className="text-base text-secondary">
                        {restaurant.rating.toString()}
                      </div>
                      <div className="text-base font-medium text-primary">
                        {isOpenNow(restaurant.businessHours, '일', 15) ? <p>Open</p> : <p>Closed</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                  {
                  restaurant.images.slice(0, 3).map((image, index) => {
                  return (
                    <div className="w-1/4" key={index}>
                      <Image
                        alt="gallery"
                        width={175}
                        height={175}
                        className="rounded-md object-cover object-center aspect-square"
                        src={image.toString()}
                      />
                    </div>
                  );})}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex fixed right-0 bottom-0 z-10 rounded-full bg-secondary m-5 w-10 h-10 hover:bg-primary" onClick={() => handleRegionClick(stringsToRegion(params.region))}>
        <FontAwesomeIcon style={{color: '#ffffff', margin: "auto",}} icon={faMap} size='lg'/>
      </div>
      </>
        ):
        <DetailPage 
          restaurant={tableData[detail]}
          onClose={() => setDetail(-1)}
        />
      }
    
    </div>
  );
}
