export const IMAGES = {
  bharmour: '/data/states/himachal/images/Bharmour.png',
  dipping: '/data/states/himachal/images/Bharmour_goat_dipping.png',
  jalsu: '/data/states/himachal/images/jalsu_pass.png',
  temple: '/data/states/himachal/images/kartik_swami_temple.png',
  darcha: '/data/states/himachal/images/Darcha.jpg'
};


export const CASE_STUDIES = [
  {
    id: 'himachal',
    state: 'Himachal Pradesh',
    subtitle: 'Gaddi pastoralists',
    center: [76.5326151804133, 32.4444683599394],
    active: true,
    storyId: 'himachal',
    labelOffset: [14, 30]
  },
  {
    id: 'ladakh',
    state: 'Ladakh',
    subtitle: 'Individual route study',
    center: [77.584, 34.1526],
    markerCenter: [77.6621398626827, 34.7165113373715],
    labelOffset: [15, -10],
    //Label offset determines the position of the label,
    // first value is X (adjusts left and right, increase moves it to the right, decrease moves it to the left)
    // second value is Y (adjusts top and down values, increasing it moves it upwards, decreasing it moves it down)
    active: false,
    overviewOnly: true,
    storyId: 'ladakh'
  },
  {
    id: 'arunachal',
    state: 'Arunachal Pradesh',
    subtitle: 'Pastoral landscape study',
    center: [93.6053, 27.0844],
    markerCenter: [94.7, 28.6],
    labelOffset: [10, -30],
    active: false,
    overviewOnly: true,
    storyId: 'arunachal'
  }
];


export const CHAPTER_DIALOGUES = {
  himachal: {
    speaker: 'Mohanlal',
    role: 'Gaddi shepherd',
    quote: 'The route is not one road. It is the season changing under our feet.',
    conversation: [
      'Mohanlal: The route is not one road. It is the season changing under our feet.',
      'Interviewer: And the flock knows when it is time to move?',
      'Mohanlal: Before we do. They feel the grass, the cold, and the distance ahead.'
    ]
  },
  bharmour: {
    speaker: 'Mohanlal',
    role: 'Shepherd from Bharmour',
    quote: 'Before we climb, every animal has to be ready for the mountain.',
    conversation: [
      'Mohanlal: Before we climb, every animal has to be ready for the mountain.',
      'Mohanlal: We shear them, wash them, and check the flock one by one.'
    ]
  },
  kugti: {
    speaker: 'Mohanlal',
    role: 'On the route to the high pastures',
    quote: 'A familiar pass can still ask a new question every year.',
    conversation: [
      'Mohanlal: A familiar pass can still ask a new question every year.',
      'Mohanlal: The snow, the water, and the animals are never exactly the same.'
    ]
  },
  'kartik-swami-temple': {
    speaker: 'Mohanlal',
    role: 'At Kartik Swami Temple',
    quote: 'We pause here before the route opens toward the higher valleys.',
    conversation: [
      'Mohanlal: We pause here before the route opens toward the higher valleys.',
      'Mohanlal: A journey also needs prayer, not only provisions.'
    ]
  },
  tandi: {
    speaker: 'Mohanlal',
    role: 'At the valley crossing',
    quote: 'Here the flock can rest. The next climb will take everything from them again.',
    conversation: [
      'Mohanlal: Here the flock can rest. The next climb will take everything from them again.',
      'Interviewer: Is this where the landscape begins to feel different?',
      'Mohanlal: The land becomes wider, but the work becomes no lighter.'
    ]
  },
  darcha: {
    speaker: 'Mohanlal',
    role: 'In the summer pastures',
    quote: 'The flock spreads out here, but we still keep each other in sight.',
    conversation: [
      'Mohanlal: The flock spreads out here, but we still keep each other in sight.',
      'Mohanlal: These weeks are for grazing, lambing, and repairing what the journey has worn down.'
    ]
  },
  'full-route': {
    speaker: 'Mohanlal',
    role: 'Looking back on the annual cycle',
    quote: 'When we return, the path is changed by the time we have spent on it.',
    conversation: [
      'Mohanlal: When we return, the path is changed by the time we have spent on it.',
      'Mohanlal: We carry the mountain home with us, even when the flock comes down.'
    ]
  }
};


export const STORY = [
  {
    id: 'himachal',
    eyebrow: 'Case Study 01 · Western Himalaya',
    title: 'A landscape shaped by movement',
    location: 'Himachal Pradesh',
    text: `The Gaddi are a traditional agro-pastoralist community
      whose life revolves around rearing sheep and goats in the Western Himalaya.
      During summer, they move their flocks to high-altitude pastures while in winter,
      they descend toward the lower hills and plains. `,
    center: [77.15, 31.82],
    zoom: 7.25,
    pitch: 34,
    bearing: -8,
    routeProgress: 0,
    image: null,
    showLegend: false
  },
  {
    id: 'bharmour',
    eyebrow: 'Home Village',
    title: 'Preparing for the climb',
    location: 'Bharmour',
    text: `Our journey follows Mohanlal, a shepherd from Bharmour, for whom returning to Bharmour is both a pause
     and a flurry of activity before the long climb to the summer
      pastures. The flock is sheared, supplies are gathered,
      and the animals are prepared for the migration ahead.`,
    detail: `Before departure, the sheep and goats are taken to the
      village dipping site and washed in a medicated solution
      to help protect the herd during the months of migration.`,
    center: [76.547306, 32.440468],
    zoom: 13.5,
    pitch: 68,
    bearing: 128.7,
    routeProgress: 0.035,
    routeStop: [76.5326151804133, 32.4444683599394],
    image: IMAGES.bharmour,
    secondImage: IMAGES.dipping,
    showLegend: true
  },
  // ----------------------------------------------------------
// 2 — HADSAR
// ----------------------------------------------------------

{
  id: 'hadsar',

  eyebrow: 'Summer Migration · The Ascent',

  title: 'The journey into the mountains begins',

  location: 'Hadsar',

  text: `Leaving Bharmour, Mohanlal and his flock begin
    their ascent towards the summer grazing grounds.
    Hadsar marks an early halt along the journey
    through the mountainous landscape.`,

  detail: `The journey continues through the valleys
    and mountain routes leading towards Kugti
    and the higher summer pastures.`,

  center: [
  76.618179,
  32.447575
],

zoom: 14.136,

pitch: 63,

bearing: 161.45,

  routeStop: [
    76.61126,
    32.45489
  ],

  routeProgressMin: 0,

  image: null,

  secondImage: null,

  showLegend: true
},



//KUGTI
  {
    id: 'kugti',
    eyebrow: 'Wildlife and Conservation',
    title: 'Co-existence',
    location: 'Kugti',
    text: `As Mohanlal and his flock move towards Kugti,
  they enter a landscape of forests, alpine meadows,
  and rugged mountain slopes.

  This region is part of the Kugti Wildlife Sanctuary,
  a protected landscape that provides habitat for
  Himalayan wildlife alongside the seasonal grazing
  routes used by pastoral communities.`,
    detail: `The mountains surrounding Kugti support a
  diversity of wildlife, including species adapted
  to the challenging conditions of the Western Himalaya.

  Here, pastoral movement and wildlife conservation
  intersect, raising important questions about how
  traditional grazing practices, biodiversity,
  and protected-areas coexist.`,
    center: [
  76.696903,
  32.470653
],

zoom: 14.01,

pitch: 53,

bearing: -59.46,
    routeProgress: 0.30,
    routeStop: [76.70291390105247, 32.46933363515453],
    showKugtiContext: true,
    image: IMAGES.jalsu,
    secondImage: null,
    showLegend: true
  },

  //KARTIK SWAMI TEMPLE
  {
    id: 'kartik-swami-temple',
    eyebrow: 'Cultural Site',
    title: 'A pause along the route',
    location: 'Kartik Swami Temple',
    text: `Along Mohanlal’s route, the Kartik Swami Temple stands as both a spiritual stop and a cultural anchor.
      Here, animal sacrifices, prayers, and seasonal festivals
      like Lohri ki Sankranti and Veeru ki Sankranti mark an important moment in the
      pastoralists’ annual migration cycle.
.`,
    detail: '',
    center: [76.733215, 32.478799],
    zoom: 15.156,
    pitch: 50,
    bearing: 7.99,
    routeProgress: 0.34,
    routeStop: [76.73502, 32.47985],
    showKugtiContext: true,
    image: IMAGES.temple,
    secondImage: null,
    showLegend: true
  },


  // KUGTI-JOT
  {
  id: 'kugti-jot',

  eyebrow: 'High Mountain Crossing',

  title: 'Across the mountain pass',

  location: 'Kugti Jot',

  text: `Beyond Kugti, Mohanlal and his flock approach
    Kugti Jot, a high-altitude mountain pass that
    connects the valleys of Chamba and Lahaul.

    The ascent takes them through increasingly
    rugged terrain, where steep slopes, exposed
    mountain paths, and unpredictable weather
    make the crossing particularly challenging.`,

  detail: `At nearly 5,000 metres above sea level,
    Kugti Jot marks one of the most demanding
    sections of the summer migration.

    Crossing the pass allows the flock to continue
    towards the grazing grounds of Lahaul,
    illustrating how pastoral migration connects
    landscapes separated by formidable
    mountain barriers.`,

  center: [
  76.831513,
  32.532916
],

zoom: 13.613,

pitch: 68,

bearing: -101.59,

  routeStop: [
    76.83334,
    32.52980
  ],

  showKugtiContext: true,

  image: null,

  secondImage: null,

  showLegend: true
},

// TANDI
  {
    id: 'tandi',
    eyebrow: 'Ecological Transition',
    title: 'The landscape opens',
    location: 'Tandi',
    text: `Beyond the alpine meadows, the migration enters the
      higher elevations of Lahaul. The landscape becomes
      increasingly open and sparse, with grasses, herbs,
      stunted blue pines and low shrubs across the slopes.`,
    detail: `Tandi, at the confluence of the Chandra and Bhaga rivers forming the Chenab,
      has historically been an important tri-junction on the migration route connecting Leh, Killar, and Kaza.
      The gentle slopes here give Mohanlal and his flock a chance to rest and graze before the final journey into the higher summer pastures
    `,
    center: [76.983644, 32.557597],
    zoom: 13.2,
    pitch: 50,
    bearing: 74.76,
    routeProgress: 0.72,
    routeStop: [76.98164016179844, 32.55070214186458],
    showKugtiContext: true,
    image: null,
    secondImage: null,
    showLegend: true
  },

  //DARCHA
  {
    id: 'darcha',
    eyebrow: 'Summer Grazing Grounds',
    title: 'Arrival in the high pastures',
    location: 'Darcha',
    text: `At last, Mohanlal reaches the wide valleys of the
      high-altitude summer pastures. The broad basins allow the
      flock to spread out and graze while the shepherd rests,
      repairs equipment and prepares for the weeks ahead.`,
    detail: `From June to August, the flock grazes these alpine
      meadows. It is also lambing season, when Mohanlal tends
      to newborn animals while making the most of the rich
      summer pastures.`,
    center: [77.198028, 32.671213],
    zoom: 13.5,
    pitch: 52,
    bearing: -71.24,
    routeProgress: 1,
    routeStop: [77.19755939568283, 32.67493238488826],
    showKugtiContext: true,
    image: IMAGES.darcha,
    secondImage: null,
    showLegend: true
  },

  // SUMMER ROUTE OVERVIEW
  {
    id: 'full-route',
    eyebrow: 'The Migration',
    title: 'A journey across landscapes',
    location: 'Bharmour → Darcha',
    text: `After the summer grazing, Mohanlal begins his journey back to the home village and then to the winter pastures,
      moving through the high and low elevations during September and October to complete his annual cycle.
      Viewing the full route highlights how a single community’s migration shapes its entire way of life.`,
    detail: `For the Gaddi pastoralists, transhumance is a living connection between people, animals,
      landscapes, and traditions. Through their seasonal movements, shepherds sustain local economies,
      maintain cultural heritage, and care for fragile mountain ecosystems.
  `,
    center: [76.923171, 32.542367],
    zoom: 10.042,
    pitch: 30.5,
    bearing: -68.06,
    routeProgress: 1,
    showKugtiContext: true,
    image: null,
    secondImage: null,
    showLegend: true
  },


  // RETURN TO HADSAR - BHARMOUR
{
  id: 'hadsar-autumn',
  migrationPhase: 'autumn-return',

  title: 'The Autumn Return',

  center: [76.61323, 32.450849],
  zoom: 14.119,
  pitch: 54.5,
  bearing: -85.73,

  // Use the Hadsar location from the existing chapter.
  routeStop: [76.61126,
    32.45489],

  text: `

      As summer draws to a close, the shepherds begin
      their return from the high-altitude grazing grounds
      of Lahaul.



      Retracing their journey through the mountains,
      they make their way toward Bharmour. Along the
      return route, seasonal activities such as wool
      shearing form part of the pastoral calendar.

  `
},



];
