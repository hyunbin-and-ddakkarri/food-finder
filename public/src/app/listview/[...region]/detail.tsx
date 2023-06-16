"use client";
import { Restaurant } from '@/app/restaurant';
import Image from "next/image";
import { faX, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';

interface DetailPageProps {
  restaurant: Restaurant
  onClose: () => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ restaurant, onClose }) => {
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
    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
      <Card>
      <FontAwesomeIcon 
        icon={faX} 
        size='lg' 
        onClick={onClose} className='absolute' 
        style={{position: 'absolute', left: '20px', top: '20px', zIndex: 10}} 
      />
      <div style={{position: 'relative'}}>
        <FontAwesomeIcon 
          icon={faCaretLeft} 
          size='2xl'
          className='text-white'
          style={{position: 'absolute', left: '20px', top: '50%', zIndex: 10}}
          onClick={onPrevImage} 
        />
        <FontAwesomeIcon 
          icon={faCaretRight} 
          size='2xl' 
          className='text-white'
          style={{position: 'absolute', right: '20px', top: '50%', zIndex: 10}} 
          onClick={onNextImage} 
        />
        <Card.Img alt="main image" src={restaurant.images[imageIndex].toString()} />
      </div>
        <Card.Body>
          <Card.Title>{`${restaurant.name} - ${restaurant.rating} - Open`}</Card.Title>
          <Card.Text>
            {restaurant.introduction}
          </Card.Text>
          {renderContent()}
        </Card.Body>
        <Card.Footer>
          <ButtonGroup style={{position: 'absolute', left: '0%', top: '90%', zIndex: 10}} >
            <Button onClick={() => setView('menu')}>Menu</Button>
            <Button onClick={() => setView('reviews')}>Reviews</Button>
            <Button onClick={() => setView('info')}>Info</Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default DetailPage;