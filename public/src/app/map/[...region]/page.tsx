"use client";
import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from 'next/navigation'
import { stringsToRegion, regionToString, region } from "@/app/region";
import SearchBar from "@/app/searchbar";
import { faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DetailPage from "../../listview/[...region]/detail";
import { Restaurant } from "../../restaurant";
import { motion, AnimatePresence } from "framer-motion"
import { emptyOptions } from "@/app/filters";


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
  const [dataKeys, setDataKeys] = useState<string[]>([]);

  const [isOpen, setOpen] = useState(false);
  const [options, setOptions] = useState<{ [key: string]: Array<Number> }>(emptyOptions);


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
      } as Restaurant));
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
          draggable: true,
          scrollwheel: true,
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

        window.kakao.maps.event.addListener(marker, "click", () => {
          setOpen(true);
        });

        window.kakao.maps.event.addListener(map, "click", () => {
          setOpen(false);
        });

      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);
  }, []);

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-0 top-0 z-10">
        <SearchBar text={regionToString(stringsToRegion(params.region))} options={options} setOptions={setOptions} link backButton/>
      </div>
      <motion.div className="flex absolute z-10 rounded-full bg-secondary bottom-0 right-0 m-5 w-10 h-10 hover:bg-primary" onClick={() => handleRegionClick(stringsToRegion(params.region))}
      animate={{bottom: isOpen? [0, 0, 70]: 0}}>
        <FontAwesomeIcon style={{color: '#ffffff', margin: "auto",}} icon={faList} size='lg'/>
      </motion.div>
      <div id="map" className="w-screen h-screen z-0"></div>

      <AnimatePresence initial={false}>
        {
          isOpen && (
            <DetailPage restaurant={tableData[0]} onClose={() => {}} isMap></DetailPage>
          )
        }
      </AnimatePresence>
    </div>
  );
}
