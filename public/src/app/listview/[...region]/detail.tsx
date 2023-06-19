"use client";
import { Restaurant, isOpenNow } from '@/app/restaurant';
import Image from "next/image";
import { faStar, faArrowLeft, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useRef } from 'react';
import Sheet, { SheetRef } from 'react-modal-sheet';
import { motion, AnimatePresence } from "framer-motion"

interface DetailPageProps {
  restaurant: Restaurant
  onClose: () => void;
  isMap?: boolean;
}

export default function DetailPage(props: DetailPageProps) {

  const { restaurant, onClose, isMap } = props;

  const [isOpen, setOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(!isMap);
  const ref = useRef<SheetRef>();
  const open = () => {
    if (!fullOpen && isMap) return;
    ref.current?.snapTo(0);
    setOpen(true);
  }

  const close = () => {
    if (!fullOpen && isMap) return;
    ref.current?.snapTo(1);
    setOpen(false);
  }

  const fullClose = () => {
    if (!isMap) return;
    ref.current?.snapTo(2);
    setFullOpen(false);
    setTabHeight(-40);
  }

  const fullyOpen = () => {
    if (!isMap) return;
    ref.current?.snapTo(1);
    setFullOpen(true); 
    setTabHeight(40);
  }

  const scrollRef = useRef(null);
  const menuScroll = useRef(null);
  const reviewScroll = useRef(null);
  const infoScroll = useRef(null);


  const [tabHeight, setTabHeight] = useState(isMap ? -40 : 40);


  return (
    <>
      <Sheet isOpen={true} onClose={() => {}} snapPoints={[-52, -200, 80]} initialSnap={isMap ? 2:0} ref={ref} style={{zIndex: 30}} disableDrag 
      initial={{opacity: 0}} animate={{opacity: [0, 0, 1]}} exit={{ opacity: 0 }}>
      <Sheet.Container style={{boxShadow: isOpen?"none":"rgba(0, 0, 0, 0.3) 0px -2px 16px 0px",}}>
        <Sheet.Content disableDrag  ref={scrollRef} animate={{overflowY:fullOpen?"scroll":"hidden"}} initial={false}>
          <div className="flex flex-col items-start flex-nowrap px-6 pt-6 pb-8 touch-auto gap-5 scroll-smooth snap-y touch-pan-y">
            <motion.div className="flex justify-between items-end w-full flex-wrap snap-start" viewport={{root: scrollRef}} onViewportEnter={close} onViewportLeave={open}
            onClick={fullyOpen}>
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
            <h3 className="text-xl font-bold text-secondary snap-start" ref={menuScroll}>Menu</h3>
            <div className="flex flex-col">
            {
              Object.keys(restaurant.menus).map((menu, index) => {
                return (
                  <div className="flex justify-start">
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
            <h3 className="text-xl font-bold text-secondary snap-start" ref={reviewScroll}>Reviews</h3>
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
            <h3 className="text-xl font-bold text-secondary snap-start" ref={infoScroll}>Information</h3>
            <p className="text-base text-secondary">
              Address: {restaurant.address} <br/>
              Phone: {restaurant.phone} <br/>
              Hours: add this please
            </p>
            <motion.div viewport={{root: scrollRef}} onViewportEnter={() => setTabHeight(-40)} onViewportLeave={() => setTabHeight(40)}></motion.div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <AnimatePresence>
        {
          fullOpen && (
          <Sheet.Backdrop>
          <div className=" bg-white h-80 flex">
            <Image
                alt="gallery"
                width={250}
                height={250}
                className="object-cover object-center aspect-square"
                src={restaurant.images[0].toString()}
              />
              <div className="flex flex-col">
                <Image
                  alt="gallery"
                  width={250}
                  height={250}
                  className="object-cover object-center aspect-square"
                  src={restaurant.images[1].toString()}
                />
                <Image
                  alt="gallery"
                  width={250}
                  height={250}
                  className="object-cover object-center aspect-square"
                  src={restaurant.images[2].toString()}
                />
              </div>
          </div>
          <motion.div className="fixed z-10 h-80 top-0 bg-white w-full" animate={{opacity: isOpen ? 1:0}}></motion.div>
          <div className="fixed z-20 top-3 left-3 flex rounded-full bg-white w-10 h-10 pointer-events-auto" onClick={() => {isMap ? fullClose():onClose()}}>
            {
              isMap ?<FontAwesomeIcon icon={faArrowDown} style={{margin: "auto",}}/>:<FontAwesomeIcon icon={faArrowLeft} style={{margin: "auto",}}/>
            }
          </div>
        </Sheet.Backdrop>
          )
        }
      </AnimatePresence>
      
    </Sheet>
    <motion.div className="fixed flex left-0 bottom-10 px-10 bg-transparent w-full max-w-xl z-40 justify-between box-border "
    animate={{bottom: tabHeight, opacity: [0, 0, 0, 1]}}>
      <div className="rounded-full bg-neutral h-10 px-3 text-secondary font-semibold pt-2 text-base" onClick={() => menuScroll.current?.scrollIntoView()}>
        Menu
      </div>
      <div className="rounded-full bg-neutral h-10 px-3 text-secondary font-semibold pt-2 text-base" onClick={() => reviewScroll.current?.scrollIntoView()}>
        Reviews
      </div>
      <div className="rounded-full bg-neutral h-10 px-3 text-secondary font-semibold pt-2 text-base" onClick={() => infoScroll.current?.scrollIntoView()}>
        Info
      </div>
    </motion.div>
  </>
  
  );
}

DetailPage.defaultProps = {
  isMap: false,
}