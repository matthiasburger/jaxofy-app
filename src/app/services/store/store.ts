import {Action} from '@ngrx/store';

export interface MediaAction extends Action {
  type: string;
  payload?: any;
}

export const CANPLAY = 'CANPLAY';
export const LOADEDMETADATA = 'LOADEDMETADATA';
export const PLAYING = 'PLAYING';
export const TIMEUPDATE = 'TIMEUPDATE';
export const LOADSTART = 'LOADSTART';
export const RESET = 'RESET';


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function mediaStateReducer(state: any, action: MediaAction) {

  const payload = action.payload;
  switch (action.type) {
    case CANPLAY:
      state = Object.assign({}, state);
      state.media.canplay = payload.value;
      return state;
    case LOADEDMETADATA:
      state = Object.assign({}, state);
      state.media.loadedmetadata = payload.value;
      state.media.duration = payload.data.time;
      state.media.durationSec = payload.data.timeSec;
      state.media.mediaType = payload.data.mediaType;
      return state;
    case PLAYING:
      state = Object.assign({}, state);
      state.media.playing = payload.value;
      return state;
    case TIMEUPDATE:
      state = Object.assign({}, state);
      state.media.time = payload.time;
      state.media.timeSec = payload.timeSec;
      return state;
    case LOADSTART:
      state.media.loadstart = payload.value;
      return Object.assign({}, state);
    case RESET:
      state = Object.assign({}, state);
      state.media = {
        canplay: undefined,
        duration: undefined,
        durationSec: undefined,
        loadedmetadata: undefined,
        loadstart: undefined,
        mediaType: undefined,
        playing: undefined,
        time: undefined,
        timeSec: undefined
      };
      return state;
    default:
      state = {media: {
          canplay: undefined,
          duration: undefined,
          durationSec: undefined,
          loadedmetadata: undefined,
          loadstart: undefined,
          mediaType: undefined,
          playing: undefined,
          time: undefined,
          timeSec: undefined
        }};
      return state;
  }
}
