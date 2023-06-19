"use client";
import { Restaurant, isOpenNow } from '@/app/restaurant';
import Image from "next/image";
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useRef } from 'react';
import Sheet, { SheetRef } from 'react-modal-sheet';
import { motion, useScroll } from "framer-motion"

interface DetailPageProps {
  restaurant: Restaurant
  onClose: () => void;
}

export default function DetailPage(props: DetailPageProps) {

  const { restaurant, onClose } = props;

  const [isOpen, setOpen] = useState(false);
  const ref = useRef<SheetRef>();
  const open = () => {
    ref.current?.snapTo(0);
    setOpen(true);
  }

  const close = () => {
    ref.current?.snapTo(1);
    setOpen(false);
  }

  const scrollRef = useRef(null);

  return (
    <Sheet isOpen={true} onClose={() => {}} snapPoints={[-52, -200]} initialSnap={1} ref={ref}>
    <Sheet.Container style={{boxShadow: isOpen?"none":"rgba(0, 0, 0, 0.3) 0px -2px 16px 0px",}}>
      <Sheet.Content disableDrag  ref={scrollRef}>
        <div className="flex flex-col items-start flex-nowrap px-6 pt-6 touch-auto gap-5 scroll-smooth snap-y touch-pan-y">
          <motion.div className="flex justify-between items-end w-full flex-wrap snap-start" viewport={{root: scrollRef}} onViewportEnter={close} onViewportLeave={open}>
            <h2 className="text-2xl grow font-bold text-secondary">
              {restaurant.name}
            </h2>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faStar} style={{color: "rgb(var(--primary))",}}/>
              <div className="text-lg text-secondary">
                {restaurant.rating.toString()}
              </div>
              <div className="text-lg font-medium text-primary">
                {isOpenNow(restaurant.businessHours, '일', 15) ? <p>Open</p> : <p>Closed</p>}
              </div>
            </div>
          </motion.div>
          <p className="text-base w-full text-secondary">
            {restaurant.introduction}
          </p>
          <div className="flex w-full touch-pan-x overflow-x-auto scroll-smooth snap-x snap-start">
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
          <h3 className="text-xl font-bold text-secondary snap-start">Menu</h3>
          <div className="flex flex-col">
          {
            Object.keys(restaurant.menus).map((menu, index) => {
              return (
                <div className="flex">
                  <div className="box w-2 h-2">image here</div>
                  <div className="flex flex-col m-3">
                    <h4 className="text-lg font-semibold text-secondary">
                      {menu}
                    </h4>
                    <p className="text-base text-secondary">
                      {restaurant.menus[menu].toString() + " Won"}
                    </p>
                  </div>
                </div>
              );
            })
          }
          </div>
          <h3 className="text-xl font-bold text-secondary snap-start">Reviews</h3>
          {
            restaurant.reviews.map((review, i) => {
              return (
                <div className="flex">
                  <div className="flex flex-col m-3">
                    <h4 className="text-lg font-semibold text-secondary">
                      Author
                    </h4>
                    <p className="text-base text-secondary">
                      blah blah
                    </p>
                  </div>
                </div>
              );
            })
          }
          <h3 className="text-xl font-bold text-secondary snap-start">Information</h3>
        </div>

      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop>
      <div className=" bg-white h-80 flex">
        <Image
            alt="gallery"
            width={200}
            height={200}
            className="object-cover object-center aspect-square"
            src={restaurant.images[0].toString()}
          />
          <div className="flex flex-col">
            <Image
              alt="gallery"
              width={200}
              height={200}
              className="object-cover object-center aspect-square"
              src={restaurant.images[1].toString()}
            />
            <Image
              alt="gallery"
              width={200}
              height={200}
              className="object-cover object-center aspect-square"
              src={restaurant.images[2].toString()}
            />
          </div>
      </div>
      <motion.div className="fixed z-10 h-80 top-0 bg-white w-full" animate={{opacity: isOpen ? 1:0}}></motion.div>
      <div className="fixed z-20 top-3 left-3 flex rounded-full bg-white w-10 h-10 pointer-events-auto" onClick={onClose}>
        <FontAwesomeIcon icon={faArrowLeft} style={{margin: "auto",}}/>
      </div>
    </Sheet.Backdrop>
  </Sheet>
  );
}