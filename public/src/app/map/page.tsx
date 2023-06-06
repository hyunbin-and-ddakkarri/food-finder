"use client";

import React, { useEffect } from 'react';

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
                        center: new window.kakao.maps.LatLng(36.37306, 127.36056),
                        level: 3,
                    };
                    new window.kakao.maps.Map(mapContainer, mapOption);
                });
          };
          mapScript.addEventListener("load", onLoadKakaoMap);
    }, []);

    return (
        <div className="Map">
            <div id="map" style={{ position: "absolute", width: "100%", height: "100vh", marginTop: "-75px", zIndex: "-1"}}></div>
        </div>
    );
};

export default Map;