const CHAPTERS = [
  ['Arunachal Pradesh', 'A seasonal landscape shaped by movement'],
  ['Preparing the journey', 'Arunachal chapter content coming soon'],
  ['Along the forest edge', 'Arunachal chapter content coming soon'],
  ['Crossing the highlands', 'Arunachal chapter content coming soon'],
  ['Seasonal landscapes', 'Arunachal chapter content coming soon'],
  ['The grazing grounds', 'Arunachal chapter content coming soon'],
  ['The full route', 'Arunachal chapter content coming soon']
];

export const STORY = CHAPTERS.map(([location, title], index) => ({
  id: index === 0 ? 'arunachal' : `arunachal-${index}`,
  eyebrow: index === 0 ? 'Case Study 03 · Eastern Himalaya' : 'Arunachal Story Map',
  title,
  location,
  text: index === 0
    ? 'Arunachal Pradesh contains a diverse pastoral landscape shaped by forests, highlands, seasonal movement, and community knowledge. This opening view introduces the state before the route story begins.'
    : 'This Arunachal Pradesh Story Map is being developed. The landscape, route, and pastoral account for this chapter will be added here.',
  detail: index === 0
    ? 'The state boundary remains visible as the story prepares to enter the route.'
    : '',
  center: [93.6053, 27.0844],
  zoom: index === 0 ? 5.8 : 7.5,
  pitch: index === 0 ? 0 : 35,
  bearing: 0,
  routeProgress: 0,
  showLegend: false
}));

export const CHAPTER_DIALOGUES = {};
