"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from 'next/navigation'
import { stringsToRegion, regionToString, region } from "@/app/region";
import Link from "next/link";
import SearchBar from "@/app/searchbar";
import { faStar, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Sheet, { SheetRef } from 'react-modal-sheet';


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

  const [isOpen, setOpen] = useState(false);
  const snapPoints = [100, 0.8];

  const ref = useRef<SheetRef>();
  const snapTo = (i: number) => ref.current?.snapTo(i);

  const onSnap = (snapIndex: number) => {

  }


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

      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);
  }, []);

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-0 top-0 z-10">
        <SearchBar text={regionToString(stringsToRegion(params.region))} link backButton/>
      </div>
      <div className="flex absolute z-10 rounded-full bg-secondary bottom-0 right-0 m-5 w-10 h-10 hover:bg-primary" onClick={() => handleRegionClick(stringsToRegion(params.region))}>
        <FontAwesomeIcon style={{color: '#ffffff', margin: "auto",}} icon={faList} size='lg'/>
      </div>
      <div id="map" className="w-screen h-screen z-0"></div>
      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content disableDrag>
            <div className="flex flex-col items-start flex-nowrap px-6 touch-auto gap-5">
              <div className="flex justify-between items-end w-full flex-wrap">
                <h2 className="text-2xl grow font-bold text-secondary">In My Thai</h2>
                <div className="flex gap-2 items-center">
                  <FontAwesomeIcon icon={faStar} style={{color: "rgb(var(--primary))",}}/>
                  <div className="text-lg text-secondary text-secondary">
                    4.8
                  </div>
                  <div className="text-lg font-medium text-primary">
                    Open
                  </div>
                </div>
              </div>
              <p className="text-base w-full text-secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus dui, pretium quis posuere varius, dignissim vitae diam. Proin maximus malesuada pharetra. Integer consequat turpis maximus bibendum mollis. Nulla sed libero pharetra, suscipit orci eu, dignissim urna. Vivamus vestibulum massa sit amet augue feugiat vehicula. In ornare, ipsum at condimentum rhoncus, ex lacus pellentesque est, ac tristique nunc lectus et ex. Suspendisse maximus, eros sit amet pulvinar posuere, libero neque laoreet nunc, congue vulputate tellus mauris non metus. Vivamus mattis tempor egestas.
              </p>
              <div className="flex w-full touch-pan-x overflow-x-auto scroll-smooth snap-x">
                <div className="box">1</div>
                <div className="box">2</div>
                <div className="box">3</div>
                <div className="box">4</div>
                <div className="box">5</div>
                <div className="box">6</div>
                <div className="box">2</div>
                <div className="box">3</div>
                <div className="box">4</div>
                <div className="box">5</div>
                <div className="box">6</div>
              </div>
              <h3 className="text-xl font-bold text-secondary">Menu</h3>
            </div>

          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => {setOpen(false)}}/>
      </Sheet>
    </div>
  );
}
