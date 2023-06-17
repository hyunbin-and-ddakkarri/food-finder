export const filterOptions: { [key: string]: Array<string> } = {
  price: ["0~10K", "10K~20K", "20K~50K", "50K~"],
  mood: ["a", "b", "c"],
  rating: ["~3.5", "3.5~4.0", "4.0~4.5", "4.5~"],
  businessHours: ["Open now", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export function optionsToRoute(options: { [key: string]: Array<Number> }) {
  var route = "";
  for (const [key, value] of Object.entries(options)) {
    route += `${key}=`;
    for (const [index, v] of value.entries()) {
      if (index < value.length - 1) {
        route += `${v}?`;
      } else {
        route += `${v}`;
      }
    }
    route += '$'
  }
  return route;
}
