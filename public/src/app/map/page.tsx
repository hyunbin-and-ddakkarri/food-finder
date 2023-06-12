"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { markerdata } from '../markerdata';

declare global {
    interface Window {
        kakao: any;
    }
}

function Map() {
    useEffect(() => {
        const mapScript = document.createElement('script');

        mapScript.async = true;
        mapScript.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=4db502f3df145cbe27c3dbc6376ef4e8&autoload=false`;

        document.head.appendChild(mapScript);

        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById("map");
                const mapOption = {
                    center: new window.kakao.maps.LatLng(36.3629, 127.3584),//36.3629, 127.3568 어은동
                    level: 2,
                };
                var map = new window.kakao.maps.Map(mapContainer, mapOption);
                var markerPosition = new window.kakao.maps.LatLng(36.363169, 127.357197);
                var marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    clickable: true
                });
                marker.setMap(map);
                // 마커를 표시할 위치와 title 객체 배열입니다 

                var map = new window.kakao.maps.Map(mapContainer, mapOption);

                var positions = [
                    {
                        title: '버기즈',
                        latlng: new window.kakao.maps.LatLng(36.3597, 127.3526)
                    },
                    {
                        title: '아소부',
                        latlng: new window.kakao.maps.LatLng(36.3628, 127.3578)
                    },
                    {
                        title: '모티프',
                        latlng: new window.kakao.maps.LatLng(36.3628, 127.3587)
                    },
                ];

                // 마커 이미지의 이미지 주소입니다
                var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

                for (var i = 0; i < positions.length; i++) {

                    // 마커 이미지의 이미지 크기 입니다
                    var imageSize = new window.kakao.maps.Size(24, 35);

                    // 마커 이미지를 생성합니다    
                    var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

                    // 마커를 생성합니다
                    var marker = new window.kakao.maps.Marker({
                        map: map, // 마커를 표시할 지도
                        position: positions[i].latlng, // 마커를 표시할 위치
                        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                        image: markerImage // 마커 이미지 
                    });
                }
            });

        };
        mapScript.addEventListener("load", onLoadKakaoMap);

    }, []);

    return (
        <div className="Map h-screen relative">
            <div id="map" style={{ position: "absolute", width: "100%", height: "105vh", marginTop: "-75px", zIndex: "-1" }}>

            </div>
        </div>
    );
};

export default Map;