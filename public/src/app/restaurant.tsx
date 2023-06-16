type day = '월' | '화' | '수' | '목' | '금' | '토' | '일'

export interface Restaurant {
  name: string;
  introduction: string;
  address: string;
  location: Array<Number>;
  phone: string;
  price: Number;
  businessHours: { [key in day]: Array<Number> };
  moods: Array<String>;
  characteristics: Array<String>;
  images: Array<String>;
  menus: { [key: string]: Number };
  reviews: Array<{ [key: string]: string }>;
  rating: Number;
}


export function resultsToRestaurants(dataT: Array<any>) {
  return dataT.map((d: any) => ({
    name: d.name as string,
    introduction: d.introduction as string,
    address: d.address as string,
    location: [d.location[0] as Number, d.location[1] as Number],
    phone: d.phone as string,
    price: d.price as Number,
    businessHours: d.businessHours as { [key in day]: Array<Number> },
    moods: d.moods as Array<String>,
    characteristics: d.characteristics as Array<String>,
    images: d.images as Array<String>,
    menus: d.menus as { [key: string]: Number },
    reviews: d.reviews as Array<{ [key: string]: string }>,
    rating: d.rating as Number,
  } as Restaurant));
}

export function isOpenNow(businessHours: { [key in day]: Array<Number> }, currentDay: day, currentTime: Number) {
  return businessHours[currentDay][0] <= currentTime && currentTime <= businessHours[currentDay][1]; 
}