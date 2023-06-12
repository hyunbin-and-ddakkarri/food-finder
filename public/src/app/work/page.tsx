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
    mapScript.src = `http://dapi.window.kakao.com/v2/maps/sdk.js?appkey=4db502f3df145cbe27c3dbc6376ef4e8&autoload=false`;

    document.head.appendChild(mapScript);
   /*
    const onLoadKakaoMap = () => {
      window.window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.window.kakao.maps.LatLng(33.450701, 126.570667),//36.3629, 127.3568 어은동
          level: 2,
        };
        var map = new window.window.kakao.maps.Map(mapContainer, mapOption);
        var markerPosition = new window.window.kakao.maps.LatLng(36.363169, 127.357197);
        var marker = new window.window.kakao.maps.Marker({
          position: markerPosition,
          clickable: true
        });
        marker.setMap(map);
        // 마커를 표시할 위치와 title 객체 배열입니다 


        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        var map = new window.window.kakao.maps.Map(mapContainer, mapOption);

          mapCenter = new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표
          mapOption = {
            center: mapCenter, // 지도의 중심 좌표
            level: 4 // 지도의 확대 레벨
          };

        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        var map = new window.kakao.maps.Map(mapContainer, mapOption);

        var myPosition = new window.kakao.maps.LatLng(33.450529632322265, 126.57038644763402);

        // 지도에 올릴 마커를 생성합니다.
        var mMarker = new window.kakao.maps.Marker({
          position: myPosition, // 지도의 중심좌표에 올립니다.
          map: map // 생성하면서 지도에 올립니다.
        });

        // 지도에 올릴 장소명 인포윈도우 입니다.
        var mLabel = new window.kakao.maps.InfoWindow({
          position: myPosition, // 지도의 중심좌표에 올립니다.
          content: '내가 일하는 곳' // 인포윈도우 내부에 들어갈 컨텐츠 입니다.
        });
        mLabel.open(map, mMarker); // 지도에 올리면서, 두번째 인자로 들어간 마커 위에 올라가도록 설정합니다.

        var rvContainer = document.getElementById('roadview'); // 로드뷰를 표시할 div

        var rv = new window.kakao.maps.Roadview(rvContainer); // 로드뷰 객체 생성
        var rc = new window.kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성 
        var rvPosition = new window.kakao.maps.LatLng(33.450335213582655, 126.57022069762772);

        rc.getNearestPanoId(rvPosition, 50, function (panoid) {
          rv.setPanoId(panoid, rvPosition);//좌표에 근접한 panoId를 통해 로드뷰를 실행합니다.
        });

        // 로드뷰 초기화 이벤트
        window.kakao.maps.event.addListener(rv, 'init', function () {

          // 로드뷰에 올릴 마커를 생성합니다.
          var rMarker = new window.kakao.maps.Marker({
            position: myPosition,
            map: rv //map 대신 rv(로드뷰 객체)로 설정하면 로드뷰에 올라갑니다.
          });
          rMarker.setAltitude(6); //마커의 높이를 설정합니다. (단위는 m입니다.)
          rMarker.setRange(100); //마커가 보일 수 있는 범위를 설정합니다. (단위는 m입니다.)

          // 로드뷰에 올릴 장소명 인포윈도우를 생성합니다.
          var rLabel = new window.kakao.maps.InfoWindow({
            content: '내가 일하는 곳'
          });
          rLabel.setRange(100); //마커가 보일 수 있는 범위를 설정합니다. (단위는 m입니다.)
          rLabel.open(rv, rMarker); // open시 마커를 넣어주면, 마커의 altitude와 position값을 모두 따라 갑니다.

          // 로드뷰 마커가 중앙에 오도록 로드뷰의 viewpoint 조정합니다.
          var projection = rv.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.

          // 마커의 position과 altitude값을 통해 viewpoint값(화면좌표)를 추출합니다.
          var viewpoint = projection.viewpointFromCoords(rMarker.getPosition(), rMarker.getAltitude());
          rv.setViewpoint(viewpoint); //로드뷰에 뷰포인트를 설정합니다.
        });
      }, []);

      return (
        <div className="Map h-screen relative">
          <div id="map" style={{ position: "absolute", width: "100%", height: "105vh", marginTop: "-75px", zIndex: "-1" }}>

          </div>
        </div>
      );
    };*/
  }
  );
};
    export default Map;