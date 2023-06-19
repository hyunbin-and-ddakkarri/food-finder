export interface region {
  city: string, 
  district: string,
  dong: string
}

export const Regions: Array<region> = [
  {city: "Dajeon", district: "Yuseong-gu", dong: "Eoeun-dong"},
  {city: "Dajeon", district: "Yuseong-gu", dong: "Gung-dong"},
  {city: "Dajeon", district: "Yuseong-gu", dong: "Bongmyeong-dong"},
  {city: "Seoul", district: "Seocho-gu", dong: "Seocho-dong"},
  {city: "Seoul", district: "Gagnam-gu", dong: "Apgujeong-dong"},
  {city: "Seoul", district: "Gagnam-gu", dong: "Sinsa-dong"},
  {city: "Seoul", district: "Gagnam-gu", dong: "Yeoksam-dong"},
];

export const stringsToRegion = (strings: Array<string>) => {
  const region: region = {city: strings[0], district: strings[1], dong: strings[2]}
  return region
}

export const regionToString = (region: region) => {
  return `${region.city} ${region.district} ${region.dong}`
}