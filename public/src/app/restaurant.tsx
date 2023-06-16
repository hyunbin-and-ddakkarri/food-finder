export interface Restaurant {
    name: string,
    introduction: string, 
    address: string, 
    location: Array<Number>,
    phone: string,
    price: Number, 
    businessHours: { [key: string]: Array<Number> },
    moods: Array<String>,
    characteristics: Array<String>,
    images: Array<String>, 
    menus: { [key: string]: Number },
    reviews: Array<{ [key: string]: string }>,
    rating: Number
}