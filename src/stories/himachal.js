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
    subtitle: 'Changpas of Korzok',
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
  'summer-route-overview': {
    speaker: 'Mohanlal',
    role: 'Looking back on the annual cycle',
    quote: 'When we return, the path is changed by the time we have spent on it.',
    conversation: [
      'Mohanlal: When we return, the path is changed by the time we have spent on it.',
      'Mohanlal: We carry the mountain home with us, even when the flock comes down.'
    ]
  },
  'hadsar-autumn': {
    speaker: 'Mohanlal',
    role: 'On the autumn return',
    quote: 'The return follows the same mountains, but the flock is moving with the season now.',
    conversation: [
      'Mohanlal: The return follows the same mountains, but the flock is moving with the season now.',
      'Interviewer: Does the route feel different on the way down?',
      'Mohanlal: The valleys open differently when we are carrying summer back toward home.'
    ]
  },
  'gadderan-belt': {
    speaker: 'Mohanlal',
    role: 'At the Gadderan Belt',
    quote: 'Deol is a stopping point, but the whole belt is part of the passage home.',
    conversation: [
      'Mohanlal: From Bharmour through Holi and Deol, the route connects villages, markets, and pasture edges.',
      'Interviewer: So the marker is only one point in a wider landscape?',
      'Mohanlal: Exactly. The flock stops at Deol, but the journey belongs to the Gadderan Belt.'
    ]
  },
  'jalsu-pass': {
    speaker: 'Mohanlal',
    role: 'At Jalsu Pass',
    quote: 'Every pass is a negotiation between the flock, the weather, and the road ahead.',
    conversation: [
      'Mohanlal: Jalsu is a high crossing on the winter route.',
      'Mohanlal: We watch the animals closely here because the descent changes their pace.'
    ]
  },
  'sokhru-galua-tikkar': {
    speaker: 'Mohanlal',
    role: 'At the trade crossings',
    quote: 'The trade markets are part of the migration too; movement carries wool, animals, and news.',
    conversation: [
      'Mohanlal: Sokhru and Galua Tikkar are connected by the movement of people and goods.',
      'Interviewer: Is Galua Tikkar where the flock stops?',
      'Mohanlal: Yes, but the market story belongs to both places together.'
    ]
  },
  'sullah-dheeral-thural': {
    speaker: 'Mohanlal',
    role: 'On the lower transit route',
    quote: 'Some places are remembered as a short rest between longer days of walking.',
    conversation: [
      'Mohanlal: Sullah, Dheeral, and Thural are brief transit stops on the way down.',
      'Mohanlal: The flock settles at Thural before we continue toward the river crossing.'
    ]
  },
  'dehra-gopipur': {
    speaker: 'Mohanlal',
    role: 'At the river crossing',
    quote: 'At Dehra Gopipur, the river marks a change in the journey.',
    conversation: [
      'Mohanlal: We cross here together, keeping the flock close as the route changes direction.',
      'Mohanlal: Water is part of the journey even when the destination is still far away.'
    ]
  },
  'ambota-shiv-bari': {
    speaker: 'Mohanlal',
    role: 'On the final winter approach',
    quote: 'Ambota and Shiv Bari bring the flock closer to the winter destination.',
    conversation: [
      'Mohanlal: These two places belong to one stretch of the return journey.',
      'Mohanlal: By Shiv Bari, the animals know the long descent is almost complete.'
    ]
  },
  ispur: {
    speaker: 'Mohanlal',
    role: 'At Ispur',
    quote: 'The winter destination is a place to rest, repair, and wait for the cycle to turn again.',
    conversation: [
      'Mohanlal: Ispur is where the flock settles after the long return from the high pastures.',
      'Interviewer: And when does the journey begin again?',
      'Mohanlal: When the next season calls us back toward the mountains.'
    ]
  },
  'full-route': {
    speaker: 'Mohanlal',
    role: 'Looking back across the annual cycle',
    quote: 'The full route is not a line between two places; it is a year lived across many landscapes.',
    conversation: [
      'Mohanlal: From Ispur to Darcha and back again, every stop is part of the same cycle.',
      'Mohanlal: The flock remembers the route through the seasons, and so do we.'
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
    id: 'summer-route-overview',
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


  // WINTER RETURN
  {
    id: 'hadsar-autumn',
    migrationPhase: 'autumn-return',
    eyebrow: 'Autumn Return · Retracing the Route',
    title: 'Back through Hadsar',
    location: 'Hadsar',
    text: `As summer draws to a close, the shepherds begin
      their return from the high-altitude grazing grounds
      of Lahaul. The route is familiar, but the flock and
      the landscape are moving into a different season.`,
    detail: `From Hadsar onward, the story turns toward the
      winter migration and the lower valleys.`,
    center: [76.61323, 32.450849],
    zoom: 14.119,
    pitch: 54.5,
    bearing: -85.73,
    routeStop: [76.61125696114797, 32.4548878877319],
    showLegend: true
  },
  {
    id: 'gadderan-belt',
    migrationPhase: 'autumn-return',
    eyebrow: 'Winter Migration · Gadderan Belt',
    title: 'A belt of villages and passage',
    location: 'Gadderan Belt · Bharmour · Holi · Deol',
    text: `At Deol, the flock pauses within the wider Gadderan
      Belt, a connected landscape that brings Bharmour, Holi,
      and Deol into the winter return route.`,
    detail: `The marker rests at Deol, while the camera opens out
      to show the three places together as one connected belt.`,
    center: [76.50124, 32.398823],
    zoom: 11.823,
    pitch: 49,
    bearing: 105.61,
    routeStop: [76.5871364, 32.3045906],
    showLegend: true
  },
  {
    id: 'jalsu-pass',
    migrationPhase: 'autumn-return',
    eyebrow: 'Winter Migration · High Crossing',
    title: 'Jalsu Pass',
    location: 'Jalsu Pass',
    text: `The return continues through Jalsu Pass, where the
      flock crosses another high section before descending
      toward the winter routes.`,
    detail: `The pass is both a physical crossing and a seasonal
      threshold between the higher summer landscape and the
      lower winter journey.`,
    center: [76.682568, 32.204868],
    zoom: 13.105,
    pitch: 64.5,
    bearing: 154.76,
    routeStop: [76.68357, 32.184],
    showLegend: true
  },
  {
    id: 'sokhru-galua-tikkar',
    migrationPhase: 'autumn-return',
    eyebrow: 'Winter Migration · Trade Markets',
    title: 'Routes of exchange',
    location: 'Sokhru · Galua Tikkar',
    text: `Sokhru and Galua Tikkar form one narrative of trade
      markets, where pastoral movement meets the exchange of
      wool, animals, provisions, and news.`,
    detail: `The flock stops at Galua Tikkar, while the camera
      holds both locations in the same field of view.`,
    center: [76.626734, 32.10866],
    zoom: 13.595,
    pitch: 68,
    bearing: 66.56,
    routeStop: [76.61249719132908, 32.10622440376333],
    showLegend: true
  },
  {
    id: 'sullah-dheeral-thural',
    migrationPhase: 'autumn-return',
    eyebrow: 'Winter Migration · Transit Stops',
    title: 'A short passage through the lowlands',
    location: 'Sullah · Dheeral · Thural',
    text: `Sullah, Dheeral, and Thural are brief transit stops
      along the lower route. Together they describe the small
      pauses that carry the flock toward the plains.`,
    detail: `The flock marker stops at Thural, while the camera
      gathers all three places into one view.`,
    center: [76.440984, 32.005587],
    zoom: 12.48,
    pitch: 22.48,
    bearing: -104.32,
    routeStop: [76.44270766632877, 31.94162869120387],
    showLegend: true
  },
  {
    id: 'dehra-gopipur',
    migrationPhase: 'autumn-return',
    eyebrow: 'Winter Migration · River Crossing',
    title: 'Crossing the river',
    location: 'Dehra Gopipur',
    text: `At Dehra Gopipur, the route reaches a river crossing.
      The flock moves through one focused point in the winter
      journey before continuing toward the lower valleys.`,
    detail: `A single stop, but an important change in the route.`,
    center: [76.218881, 31.879169],
    zoom: 14.698,
    pitch: 68,
    bearing: -8.03,
    routeStop: [76.21485615145284, 31.881720353402354],
    showLegend: true
  },
  {
    id: 'ambota-shiv-bari',
    migrationPhase: 'autumn-return',
    eyebrow: 'Winter Migration · Final Approach',
    title: 'Toward the winter destination',
    location: 'Ambota · Shiv Bari',
    text: `Ambota and Shiv Bari belong to the final approach of
      the winter migration, when the flock has left the high
      country far behind.`,
    detail: `The marker rests at Shiv Bari while the camera holds
      both points together as one narrative stop.`,
    center: [76.071902, 31.655893],
    zoom: 13.9,
    pitch: 47.95,
    bearing: 0,
    routeStop: [76.08379387974247, 31.639537307180802],
    showLegend: true
  },
  {
    id: 'ispur',
    migrationPhase: 'autumn-return',
    eyebrow: 'Winter Migration · Destination',
    title: 'Arrival at Ispur',
    location: 'Ispur',
    text: `Ispur is the final winter destination in this route.
      Here the flock settles after the long return from the
      summer pastures and the annual cycle reaches its pause.`,
    detail: `The next movement will begin when the season turns
      again toward the mountains.`,
    center: [76.189298, 31.503704],
    zoom: 15.994,
    pitch: 68,
    bearing: 141,
    routeStop: [76.18753, 31.5061],
    showLegend: true
  },
  {
    id: 'full-route',
    eyebrow: 'The Annual Cycle',
    title: 'The full route, across the seasons',
    location: 'Darcha → Hadsar → Ispur → Darcha',
    text: `From the high summer pastures to the winter destination
      and back again, the route is a seasonal cycle rather than
      a single journey in one direction.`,
    detail: `The overview returns the story to the scale of the
      whole migration, connecting every stop across the year.`,
    center: [76.742734, 32.02601],
    zoom: 8.868,
    pitch: 24.01,
    bearing: 0,
    routeProgress: 1,
    showLegend: true
  },



];
