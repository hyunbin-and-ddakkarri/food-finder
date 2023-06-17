"use client";
import { Restaurant, isOpenNow } from '@/app/restaurant';
import Image from "next/image";
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useRef } from 'react';
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
        <div className="flex flex-col items-start flex-nowrap px-6 pt-6 touch-auto gap-5 scroll-smooth snap-y touch-pan-y">
          <div className="flex justify-between items-end w-full flex-wrap snap-start">
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
          <p className="text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia ultricies dolor, eu fringilla metus laoreet ornare. Integer posuere arcu ut magna accumsan, nec pretium metus aliquam. Etiam in ipsum eu augue elementum iaculis tincidunt at velit. Praesent neque sapien, vehicula in sagittis sit amet, ultricies vel nulla. Cras viverra pharetra lacus vitae bibendum. Etiam sed libero eget libero maximus placerat vel eget tellus. Vestibulum fringilla nulla sed leo vestibulum, ut aliquam neque pharetra.

            Fusce nec elit ac lorem iaculis viverra. Mauris at lacus condimentum, lacinia quam id, sodales magna. Nunc id velit posuere, viverra dolor vitae, commodo eros. Etiam bibendum sem in consequat molestie. Etiam pellentesque velit sit amet blandit mattis. Ut non consequat nisi, id gravida leo. Maecenas vulputate a nisl eu faucibus. Donec mi sem, eleifend varius nulla a, eleifend tincidunt turpis. Nam tincidunt turpis felis, et sollicitudin felis rhoncus vitae.

            Suspendisse volutpat gravida ligula, id luctus magna euismod porta. Suspendisse sollicitudin mi sed lacus interdum maximus. Sed egestas finibus tortor, vitae aliquet enim fringilla vitae. Aenean vehicula eget augue eget egestas. Nullam malesuada, est dignissim vulputate rhoncus, lacus odio malesuada magna, in ornare dolor elit a ipsum. Suspendisse tristique, felis et lacinia gravida, arcu dolor sodales ante, eget mattis odio sem et mi. Suspendisse libero lacus, consequat id lectus quis, mollis aliquam eros. Donec pulvinar nulla ut felis gravida semper. Suspendisse volutpat elit nec enim gravida efficitur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam id tellus aliquet mi rutrum scelerisque sollicitudin nec diam.

            Sed mollis metus sed nulla tristique fringilla. Aenean viverra lorem nisl, in sagittis mi tempus ut. Pellentesque orci dolor, accumsan at nisl sit amet, egestas mollis tellus. Ut lorem ex, lobortis eget turpis vitae, accumsan auctor nulla. Pellentesque consequat mattis est, id malesuada libero euismod et. Nunc quis diam in dolor finibus consequat vitae a nibh. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer a elit nec ex porttitor vehicula vitae sed urna. Vivamus vulputate dolor eget mauris aliquet, nec vehicula lacus cursus.

            Nam vestibulum dapibus quam. Mauris sit amet metus condimentum justo scelerisque dictum et non tortor. Nullam sed iaculis sapien. Quisque blandit, sem sed porta imperdiet, nulla velit ultricies dui, eu blandit metus turpis quis erat. Aenean nec neque vel sapien ultrices elementum ut sit amet metus. Praesent condimentum turpis sapien, id tincidunt nunc aliquam non. Duis tempor eget eros et scelerisque. Suspendisse vitae commodo mauris. In bibendum lectus id felis eleifend cursus. Suspendisse nulla nulla, bibendum nec mi ac, lobortis tincidunt augue.

            Sed quis lacus id turpis consectetur convallis. Sed in mauris pulvinar arcu dapibus dapibus sit amet at sapien. Nunc scelerisque dapibus est id tempor. Donec tempor euismod porta. Fusce vitae ligula maximus, imperdiet velit vitae, interdum diam. Fusce at nibh ultricies nunc tincidunt imperdiet ac nec mi. Nulla facilisis ex eget fringilla sollicitudin. Integer eget sapien ac est sagittis tristique sit amet sit amet dolor. Vivamus nibh turpis, gravida id tempor efficitur, mattis sed purus. Mauris non nibh et purus dapibus faucibus. Proin dapibus nisi ac dictum tincidunt. Curabitur hendrerit dapibus arcu, non tincidunt elit molestie vitae. Maecenas facilisis dapibus turpis non tincidunt.

            Proin quis tortor pharetra, varius sem sit amet, tristique orci. Quisque pellentesque in mi a semper. Nam nec arcu interdum metus scelerisque aliquam sit amet in erat. Nunc vitae nisl ornare, euismod dui in, malesuada mi. Phasellus pretium magna ullamcorper ligula commodo, vel dignissim risus convallis. Suspendisse erat eros, tristique eget consequat eget, hendrerit ultrices nibh. Nullam volutpat lectus non pellentesque iaculis. Morbi a dolor vitae risus aliquet efficitur consequat ut neque. Nunc elit est, convallis eget tempor ac, imperdiet in dolor. Sed id feugiat enim. Ut ac sapien tempor, iaculis felis id, scelerisque augue. Maecenas ac leo ullamcorper felis porta posuere at non felis.

            Sed sit amet elit sed lorem gravida vehicula. Nullam vel malesuada augue, in hendrerit urna. Quisque porta lectus tellus, sit amet elementum urna finibus nec. Morbi porta est quis nisi congue auctor. Praesent maximus ante eget dictum fermentum. Pellentesque eget dui turpis. Aliquam a viverra ligula, maximus iaculis turpis. Suspendisse aliquet in nulla sed venenatis. Aenean metus purus, tincidunt sed tellus tempus, tristique lacinia ipsum. Praesent at nunc felis. Integer consectetur, risus et sodales hendrerit, nunc quam ultrices ex, eget eleifend dolor enim vulputate nunc.
          </p>
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
      <div className="fixed z-10 top-3 left-3 flex rounded-full bg-transparent w-10 h-10 pointer-events-auto" onClick={onClose}>
        <FontAwesomeIcon icon={faArrowLeft} style={{margin: "auto",}}/>
      </div>
    </Sheet.Backdrop>
  </Sheet>
  );
}