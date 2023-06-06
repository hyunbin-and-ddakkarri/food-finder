"use client";

import React, { useEffect, useState } from 'react';

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
                        center: new window.kakao.maps.LatLng(36.3629, 127.3568),
                        level: 2,
                    };
                    var map = new window.kakao.maps.Map(mapContainer, mapOption);
                    var markerPosition = new window.kakao.maps.LatLng(36.363169, 127.357197); 
                    var marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                        clickable: true
                    });
                    marker.setMap(map);

                });
          };
          mapScript.addEventListener("load", onLoadKakaoMap);
    }, []);

    return (
        <div className="Map h-screen relative">
            <div id="map" style={{ position: "absolute", width: "100%", height: "105vh", marginTop: "-75px", zIndex: "-1"}}></div>
        </div>
    );
};

export default Map;