"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { stringsToRegion, region } from "@/app/region";

const loaderProp = ({ src }: { src: string }) => {
  return src;
};
import { gql, useQuery } from "@apollo/client";
import SearchBar from "@/app/searchbar";
import { emptyOptions, routeToOptions } from "@/app/filters";

const rest_query = gql`
  query getData($region: String!) {
    restaurant(region: $region) {
      id
      name
      introduction
      address
      locationX
      locationY
      region
      phone
      price
      businessHours
      moods
      characteristics
      images
      menus
      rating
    }
  }
`

const review_query = gql`
  query getData($rid: String!) {
    reviews(restaurantId: $rid) {
      id
      username
      rating
      context
    }
  }
`;

export default function DataMap({ params }: { params: { region: string[] } }) {
  const { error, data } = useQuery(rest_query, {
    variables: { region: params.region[2] },
  });
  const [tableData, setTableData] = useState<{ [key: string]: any }[]>([{}]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [options, setOptions] = useState<{ [key: string]: Array<Number> }>(routeToOptions(params.region[3]));

  useEffect(() => {
    console.log(data)
    if (data) {
      console.log(data)
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

  const [h, setHeight] = useState(0);
  const [w, setWidth] = useState(0);
  const [baseX, setBaseX] = useState(0);
  const [baseY, setBaseY] = useState(0);

  const ref = useRef(null);

  //const images = ['img/Korean.jpg', 'img/Japanese.jpg', 'img/Chinese.jpg', 'img/Italian.jpg']
  //const subImages = ['img/1.jpeg', 'img/2.jpeg', 'img/3.jpeg', 'img/4.jpeg']

  useEffect(() => {
    if (ref.current != null) {
      setHeight(ref.current["clientHeight"]);
      setWidth(ref.current["clientWidth"]);
    }
  }, []);

  var lvl = 0;
  var cnt = [];
  var coords: [number, number][] = [];

  var categories: { category: string; elements: string[] }[] = [
    {
      category: "Korean",
      elements: ["Bulgogi", "Ddeokbokki", "Bibimbap", "Jokbal"],
    },
    { category: "Japanese", elements: ["Ramen", "Sushi", "Donburi"] },
    { category: "Chinese", elements: ["Malatang"] },
    { category: "Italian", elements: ["Pizza", "Spaghetti"] },
  ];

  var images: string[] = [];
  var subImages: string[][] = [];
  var n = categories.length;

  for (const [i, { category, elements }] of categories.entries()) {
    images.push("/img/" + category + ".jpg");
    n = Math.max(n, elements.length + 1);

    subImages.push([]);
    for (var index = 0; index < elements.length; index++) {
      subImages[i].push("/img/" + category + "/" + elements[index] + ".jpg");
    }
  }

  for (var i = 1; lvl < n; i++) {
    cnt.push(lvl);
    lvl += 6 * i;
  }

  lvl = 0;
  var k = 0;

  for (var i = 0; i < n; i++) {
    const deg60 = Math.PI / 3;
    var r, theta;
    var x, y;

    if (lvl == 0) {
      x = 0;
      y = 0;
    } else {
      r = lvl;
      var theta1 = deg60 * Math.floor(k / lvl);
      var theta2 = theta1 + deg60;

      x =
        (r / lvl) *
        (Math.cos(theta1) * (lvl - (k % lvl)) + Math.cos(theta2) * (k % lvl));
      y =
        (r / lvl) *
        (Math.sin(theta1) * (lvl - (k % lvl)) + Math.sin(theta2) * (k % lvl));

      k++;
    }

    coords.push([x, y]);
    //console.log(x, y);

    if (i >= cnt[lvl]) {
      lvl++;
      k = 0;
    }
  }

  const [buttonState, clickButton] = useState(-1);

  function hideOtherButtons(e: any, i: number, bottom: number, left: number) {
    setBaseX(left);
    setBaseY(bottom);
    // console.log(i)
    if (buttonState == -1) clickButton(i);
    else clickButton(-1);
  }

  //console.log(w, h);
  var size = Math.min(w, h) / 5;

  let categoryButtons = [];
  let menuButtons = [];

  const minDiameter = 0.6;
  const maxDiameter = 0.85;
  const unit = 0.05;

  for (var i = 0; i < categories.length; i++) {
    // for (const [index, [x, y]] of coords.entries()){
    const index = i;
    const [x, y] = coords[index];
    const diameter =
      size *
      (minDiameter +
        unit *
        Math.min(
          (maxDiameter - minDiameter) / unit,
          categories[index].elements.length
        ));

    categoryButtons.push(
      <Image
        key={index}
        src={images[index]}
        alt={"categoryName"}
        width={size}
        height={size}
        style={{
          position: "absolute",
          width: diameter + "px",
          height: diameter + "px",
          bottom: y * size - diameter / 2 + h / 2 + "px",
          left: x * size - diameter / 2 + w / 2 + "px",
        }}
        onClick={(e) =>
          hideOtherButtons(e, index, y * size + h / 2, x * size + w / 2)
        }
        className="rounded-full"
        loader={loaderProp}
      />
    );
  }

  if (buttonState >= 0) {
    categoryButtons = [categoryButtons[buttonState]];
    menuButtons = [];

    for (var i = 0; i < subImages[buttonState].length; i++) {
      const index = i;
      let [x, y] = coords[index + 1];
      const menuSize = 0.5 * size;

      menuButtons.push(
        <Image
          key={index}
          src={subImages[buttonState][index]}
          alt={"menuName"}
          width={menuSize}
          height={menuSize}
          style={{
            position: "absolute",
            width: menuSize + "px",
            height: menuSize + "px",
            bottom: baseY + y * size - menuSize / 2 + "px",
            left: baseX + x * size - menuSize / 2 + "px",
          }}
          className="rounded-full"
          loader={loaderProp}
          onClick={() => handleRegionClick(stringsToRegion(params.region))}
        />
      );
    }
  }

  return (
    <div className="h-screen bg-gray">
      <SearchBar options={options} setOptions={setOptions} link/>
      <div>
        <div
          ref={ref}
          className="h-screen negativeZIndex"
          onClick={() => clickButton(-1)}
        >
          <div onClick={(e) => e.stopPropagation()}>{categoryButtons}</div>
          {menuButtons}
        </div>
      </div>
    </div>
  );
}
