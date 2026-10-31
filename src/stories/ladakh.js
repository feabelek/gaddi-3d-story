const CHAPTERS = [
  ['Ladakh', 'A story space for Ladakh'],
  ['Preparing the journey', 'Ladakh chapter content coming soon'],
  ['Across the valleys', 'Ladakh chapter content coming soon'],
  ['A high mountain crossing', 'Ladakh chapter content coming soon'],
  ['Seasonal pastures', 'Ladakh chapter content coming soon'],
  ['The grazing grounds', 'Ladakh chapter content coming soon'],
  ['The full route', 'Ladakh chapter content coming soon']
];

export const STORY = CHAPTERS.map(([location, title], index) => ({
  id: `ladakh-${index}`,
  eyebrow: index === 0 ? 'Case Study 02 · Trans-Himalaya' : 'Ladakh Story Map',
  title,
  location,
  text: 'This Ladakh Story Map is being developed. The landscape, route, and pastoral account for this chapter will be added here.',
  detail: '',
  center: [77.584, 34.1526],
  zoom: index === 0 ? 5.5 : 7.5,
  pitch: index === 0 ? 0 : 35,
  bearing: 0,
  routeProgress: 0,
  showLegend: false
}));

export const CHAPTER_DIALOGUES = {};
