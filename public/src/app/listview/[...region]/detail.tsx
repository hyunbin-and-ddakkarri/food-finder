"use client";
import { Restaurant, isOpenNow } from '@/app/restaurant';
import Image from "next/image";
import { faX, faCaretLeft, faCaretRight, faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useRef } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import Sheet, { SheetRef } from 'react-modal-sheet';

interface DetailPageProps {
  restaurant: Restaurant
  onClose: () => void;
}

export default function DetailPage(props: DetailPageProps) {

  const { restaurant, onClose } = props;

  const ref = useRef<SheetRef>();
  const snapTo = (i: number) => ref.current?.snapTo(i);

  const onSnap = (snapIndex: number) => {

  }



  const modalStyle = {
    position: 'fixed' as 'fixed',
    zIndex: 1000,
    background: '#fff',
    width: '100%',
    height: '100%'
  };
  const [view, setView] = useState<'menu' | 'reviews' | 'info'>('menu');
  const [imageIndex, setImageIndex] = useState(0);

  const onNextImage = () => {
    setImageIndex((imageIndex + 1) % restaurant.images.length);
  };

  const onPrevImage = () => {
    setImageIndex((imageIndex - 1 + restaurant.images.length) % restaurant.images.length);
  };

  const renderContent = () => {
    switch (view) {
      case 'menu':
        return Object.entries(restaurant.menus).map(([key, value]) => (
          <div key={key}>{`${key}: ${value}`}</div>
        ));
      case 'reviews':
        return restaurant.reviews.map((review, index) => (
          <div key={index}>{`${Object.keys(review)[0]}: ${Object.values(review)[0]}`}</div>
        ));
      case 'info':
        return Object.entries(restaurant.businessHours).map(([day, hours]) => (
          <div key={day}>{`${day}: ${hours[0]} - ${hours[1]}`}</div>
        ));
      default:
        return null;
    }
  };

  return (
    <Sheet isOpen={true} onClose={() => {}} disableDrag snapPoints={[-300, 1]}>
    <Sheet.Container>
      <Sheet.Content disableDrag>
        <div className="flex flex-col items-start flex-nowrap px-6 pt-6 touch-auto gap-5">
          <div className="flex justify-between items-end w-full flex-wrap">
            <h2 className="text-2xl grow font-bold text-secondary">
              {restaurant.name}
            </h2>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faStar} style={{color: "rgb(var(--primary))",}}/>
              <div className="text-lg text-secondary text-secondary">
                {restaurant.rating.toString()}
              </div>
              <div className="text-lg font-medium text-primary">
                {isOpenNow(restaurant.businessHours, '일', 15) ? <p>Open</p> : <p>Closed</p>}
              </div>
            </div>
          </div>
          <p className="text-base w-full text-secondary">
            {restaurant.introduction}
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
    <Sheet.Backdrop>
      <div className=" bg-white h-80 flex">
        <Image
            alt="gallery"
            width={300}
            height={300}
            className="object-cover object-center aspect-square"
            src={restaurant.images[0].toString()}
          />
          <div className="flex flex-col">
            <Image
              alt="gallery"
              width={300}
              height={300}
              className="object-cover object-center aspect-square"
              src={restaurant.images[1].toString()}
            />
            <Image
              alt="gallery"
              width={300}
              height={300}
              className="object-cover object-center aspect-square"
              src={restaurant.images[2].toString()}
            />
          </div>
      </div>
      <div className="fixed z-10 top-3 left-3 flex rounded-full bg-transparent w-10 h-10" onClick={onClose}>
        <FontAwesomeIcon icon={faArrowLeft} style={{margin: "auto",}}/>
      </div>
    </Sheet.Backdrop>
  </Sheet>
  );
}