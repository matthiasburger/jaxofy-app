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
    default:
      console.log(action.type);
      return state;
  }
}
