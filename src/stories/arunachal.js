const CHAPTERS = [
  ['Arunachal Pradesh', 'A story space for Arunachal Pradesh'],
  ['Preparing the journey', 'Arunachal chapter content coming soon'],
  ['Along the forest edge', 'Arunachal chapter content coming soon'],
  ['Crossing the highlands', 'Arunachal chapter content coming soon'],
  ['Seasonal landscapes', 'Arunachal chapter content coming soon'],
  ['The grazing grounds', 'Arunachal chapter content coming soon'],
  ['The full route', 'Arunachal chapter content coming soon']
];

export const STORY = CHAPTERS.map(([location, title], index) => ({
  id: `arunachal-${index}`,
  eyebrow: index === 0 ? 'Case Study 03 · Eastern Himalaya' : 'Arunachal Story Map',
  title,
  location,
  text: 'This Arunachal Pradesh Story Map is being developed. The landscape, route, and pastoral account for this chapter will be added here.',
  detail: '',
  center: [93.6053, 27.0844],
  zoom: index === 0 ? 5.8 : 7.5,
  pitch: index === 0 ? 0 : 35,
  bearing: 0,
  routeProgress: 0,
  showLegend: false
}));

export const CHAPTER_DIALOGUES = {};
