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
  SEASON_COLORS,
  SEASON_CYCLES
} from './seasons.js';


export const STORY_REGISTRY = {
  himachal: {
    id: 'himachal',
    caseStudies: CASE_STUDIES,
    chapters: STORY,
    dialogues: CHAPTER_DIALOGUES,
    images: IMAGES,
    seasons: SEASON_CYCLES.himachal
  },
  ladakh: {
    id: 'ladakh',
    chapters: LADAKH_STORY,
    dialogues: LADAKH_DIALOGUES,
    images: {},
    seasons: SEASON_CYCLES.ladakh
  },
  arunachal: {
    id: 'arunachal',
    chapters: ARUNACHAL_STORY,
    dialogues: ARUNACHAL_DIALOGUES,
    images: {},
    seasons: SEASON_CYCLES.arunachal
  }
};


export {
  CASE_STUDIES,
  CHAPTER_DIALOGUES,
  IMAGES,
  STORY,
  SEASON_COLORS,
  SEASON_CYCLES
};
