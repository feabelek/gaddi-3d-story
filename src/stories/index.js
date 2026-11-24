import {
  CASE_STUDIES,
  CHAPTER_DIALOGUES,
  IMAGES,
  STORY
} from './himachal.js';
import {
  CHAPTER_DIALOGUES as ARUNACHAL_DIALOGUES,
  STORY as ARUNACHAL_STORY
} from './arunachal.js';
import {
  CHAPTER_DIALOGUES as LADAKH_DIALOGUES,
  STORY as LADAKH_STORY
} from './ladakh.js';
import {
  ELEVATION_RANGES,
  SEASON_COLORS,
  SEASON_CYCLES
} from './seasons.js';
import { HIMACHAL_ELEVATION_PROFILE } from './himachal-profile.js';
import { MAP_ASSETS } from '../atlas/map-assets.js';


export const STORY_REGISTRY = {
  himachal: {
    id: 'himachal',
    caseStudies: CASE_STUDIES,
    chapters: STORY,
    dialogues: CHAPTER_DIALOGUES,
    images: IMAGES,
    seasons: SEASON_CYCLES.himachal,
    elevationRange: ELEVATION_RANGES.himachal,
    miniMap: {
      ...MAP_ASSETS.himachal.miniMap,
      enabled: true,
      journeyStartChapterId: 'bharmour'
    },
    elevationProfile: {
      enabled: true,
      data: HIMACHAL_ELEVATION_PROFILE
    }
  },
  ladakh: {
    id: 'ladakh',
    chapters: LADAKH_STORY,
    dialogues: LADAKH_DIALOGUES,
    images: {},
    seasons: SEASON_CYCLES.ladakh,
    elevationRange: ELEVATION_RANGES.ladakh,
    miniMap: {
      ...MAP_ASSETS.ladakh.miniMap,
      enabled: true,
      journeyStartChapterId: 'ladakh-korzok'
    },
    elevationProfile: {
      enabled: false,
      data: null
    }
  },
  arunachal: {
    id: 'arunachal',
    chapters: ARUNACHAL_STORY,
    dialogues: ARUNACHAL_DIALOGUES,
    images: {},
    seasons: SEASON_CYCLES.arunachal,
    elevationRange: ELEVATION_RANGES.arunachal,
    miniMap: {
      ...MAP_ASSETS.arunachal.miniMap,
      enabled: false
    },
    elevationProfile: {
      enabled: false,
      data: null
    }
  }
};


export {
  CASE_STUDIES,
  CHAPTER_DIALOGUES,
  IMAGES,
  STORY,
  SEASON_COLORS,
  SEASON_CYCLES,
  ELEVATION_RANGES
};
