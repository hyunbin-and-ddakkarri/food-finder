export const filters = ["Price", "Mood", "Rating", "Business Hours"];
export const emptyOptions: { [key: string]: Array<Number> } = {
  "Price": [],
  "Mood": [],
  "Rating": [],
  "Business Hours": [],
}
export const filterOptions: { [key: string]: Array<string> } = {
  "Price": ["$", "$$", "$$$", "$$$$", "$$$$$"],
  "Mood": ["Casual", "Formal", "Romantic", "Family", "Affordable"],
  "Rating": ["~3.5", "3.5~4.0", "4.0~4.5", "4.5~"],
  "Business Hours": ["Open now", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export function optionsToRoute(options: { [key: string]: Array<Number> }) {
  var route = "";
  for (const [key, value] of Object.entries(options)) {
    for (const [index, v] of value.entries()) {
      if (index < value.length - 1) {
        route += `${v}a`;
      } else {
        route += `${v}`;
      }
    }
    route += 'A'
  }
  return route;
}

export function routeToOptions(route: string) {
  const fs = route.split('A')
  const options: { [key: string]: Array<Number> } = { ...emptyOptions}
  for (const [index, f] of filters.entries()) {
    const os = fs[index]?.split('a')
    for (const o of os) {
      options[f].push(Number.parseInt(o))
    }
  }
  return options
}