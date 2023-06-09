"use client";

import Image from 'next/image'
import Link from 'next/link';

import React, {useState, useEffect, useRef, useLayoutEffect} from "react"

//console.log(data().data[0].name)

const loaderProp = ({ src }: { src: string }) => {
    return src;
}

const Datamap2: React.FC = () => {
    const [h, setHeight] = useState(0)
    const [w, setWidth] = useState(0)
    const [baseX, setBaseX] = useState(0);
    const [baseY, setBaseY] = useState(0);

    const ref = useRef(null)

    //const images = ['img/Korean.jpg', 'img/Japanese.jpg', 'img/Chinese.jpg', 'img/Italian.jpg']
    //const subImages = ['img/1.jpeg', 'img/2.jpeg', 'img/3.jpeg', 'img/4.jpeg']

    useEffect(() => {
        if(ref.current != null) {
            setHeight(ref.current['clientHeight'])
            setWidth(ref.current['clientWidth'])
        }
    }, [])


    var lvl = 0;
    var cnt = [];
    var coords:[number, number, string][] = [];

    var categories:{name: string, elements: string[]}[] = [
        { name: "Korean", elements: ["Bulgogi", "Ddeokbokki", "Bibimbap", "Jokbal"] },
        { name: "Japanese", elements: ["Ramen", "Sushi", "Donburi"] },
        { name: "Chinese", elements: ["Malatang"] },
        { name: "Italian", elements: ["Pizza", "Spaghetti"] }
    ]

    var images: string[] = [];
    var subImages: string[][] = [];

    for(const [i, {name, elements}] of categories.entries()){
        images.push('img/'+name+'.jpg')
        var menus: string[] = [];
        for(const [index, menu] of elements.entries()){
            menus.push('img/'+name+'/'+menu+'.jpeg')
        }
        subImages.push(menus)
    }

    var n=categories.length;

    for(var i=1;lvl<n;i++){
        cnt.push(lvl);
        lvl+=6*i;
    }

    lvl=0;
    var k=0;

    for(var i=0;i<n;i++){
        const deg60 = Math.PI/3;
        var r, theta;
        var x, y;

        if(lvl==0){
            x=0;
            y=0;
        }

        else{
            r=lvl;
            var theta1 = deg60*(Math.floor(k/lvl));
            var theta2 = theta1+deg60;

            x=r/lvl*(Math.cos(theta1)*(lvl-k%lvl)+Math.cos(theta2)*(k%lvl));
            y=r/lvl*(Math.sin(theta1)*(lvl-k%lvl)+Math.sin(theta2)*(k%lvl));

            k++;
        }

        coords.push([x, y, categories[i].name]);
        //console.log(x, y);

        if(i>=cnt[lvl]){
            lvl++;
            k=0;
        }
    }

    const [buttonState, clickButton] = useState(-1);

    function hideOtherButtons(e: any, i: number, bottom: number, left: number){
        setBaseX(left)
        setBaseY(bottom)
        console.log(baseX, baseY)
        clickButton(i);
    }


    //console.log(w, h);
    var size = Math.min(w, h)/5;

    let buttons = [];
    let restaurants = [];
    let restaurantButtons = [];

    for (const [index, [x, y, name]] of coords.entries()){
        buttons.push(
            <Image
            src={images[index]}
            alt={name}
            width={0.8*size}
            height={0.8*size}
            style={{position: "absolute", width: 1.0*size+"px", height: 1.0*size+"px", bottom: (((y-1/2)*size*1.1)+(h/2))+"px", left: (((x-1/2)*size*1.1)+(w/2))+"px"}} onClick={e => hideOtherButtons(e, index, (((y-1/2)*size*1.1)+(h/2)), (((x-1/2)*size*1.1)+(w/2)))}
            className='rounded-full'
            loader={loaderProp}/>
        )
    }

    if (buttonState >= 0) {
        buttons = [buttons[buttonState]]

        restaurants = categories[buttonState].elements
        for(const [index, restaurant] of restaurants.entries()){
            let [x, y, name] = coords[index+1]
            restaurantButtons.push(
                <Link href='/map'>
                    <Image
                    src={subImages[buttonState][index]} alt={name}
                    width={0.7*size}
                    height={0.7*size}
                    style={{position: "absolute", width: 0.7*size+"px", height: 0.7*size+"px", bottom: (((y+0.15)*size))+baseY+"px", left: (((x+0.15)*size))+baseX+"px"}} onClick={e => hideOtherButtons(e, index, (((y-1/2)*size)+(h/2)), (((x-1/2)*size)+(w/2)))}
                    className='rounded-full'
                    loader={loaderProp}
                    />
                </Link>
            )
        }
    }

    return(
        <div ref={ref} className="h-screen">
            <div>{buttons}</div>
            {restaurantButtons}
        </div>
    )
};

export default Datamap2;
