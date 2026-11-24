export const HIMACHAL_ELEVATION_PROFILE = {
  width: 320,
  height: 90,
  chartBottom: 64,
  plotLeft: 38,
  plotRight: 318,
  plotHeight: 48,
  distanceDomain: [-100, 237],
  elevationDomain: [400, 4800],
  ticks: [400, 1000, 2000, 3000, 4000, 4800],
  defaultDataset: 'summer',
  colors: {
    summer: '#f18700',
    winter: '#55aadd'
  },
  chapterAliases: {
    'hadsar-autumn': 'hadsar'
  },
  datasets: {
    summer: [
      { id: 'darcha', label: 'Darcha', distance: -100, elevation: 3400 },
      { id: 'tandi', label: 'Tandi', distance: -67, elevation: 2900 },
      { id: 'kugti-jot', label: 'Kugti Pass', distance: -39, elevation: 4800 },
      { id: 'kartik-swami-temple', label: 'Kartik Swami Temple', distance: -27, elevation: 3100 },
      { id: 'kugti', label: 'Kugti', distance: -23, elevation: 2500 },
      { id: 'hadsar', label: 'Hadsar', distance: -11, elevation: 2100 },
      { id: 'bharmour', label: 'Bharmour', distance: 0, elevation: 2000 }
    ],
    winter: [
      { id: 'bharmour', label: 'Bharmour', distance: 0, elevation: 2000 },
      { id: 'jalsu-pass', label: 'Jalsu Pass', distance: 65, elevation: 3400 },
      { id: 'sokhru-galua-tikkar', label: 'Sokhru', distance: 77, elevation: 1600 },
      { id: 'sokhru-galua-tikkar', label: 'Galua Tikkar', distance: 83, elevation: 1600 },
      { id: 'sullah-dheeral-thural', label: 'Sullah', distance: 102, elevation: 1500 },
      { id: 'sullah-dheeral-thural', label: 'Dheera', distance: 108, elevation: 1500 },
      { id: 'sullah-dheeral-thural', label: 'Thural', distance: 116, elevation: 1500 },
      { id: 'kalapani', label: 'Kalapani', distance: 146, elevation: 700 },
      { id: 'dehra-gopipur', label: 'Dehra Gopipur', distance: 167, elevation: 500 },
      { id: 'ambota-shiv-bari', label: 'Ambota', distance: 203, elevation: 475, range: [450, 500] },
      { id: 'ambota-shiv-bari', label: 'Shiv Bari', distance: 226, elevation: 475, range: [450, 500] },
      { id: 'ispur', label: 'Ispur', distance: 237, elevation: 400 }
    ]
  }
};
