import {Injectable} from '@angular/core';
import {AudioFile} from '../interfaces/audio-file';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  current: AudioFile | null = null;
  index: number;
  files: AudioFile[] = [];

  constructor() {
  }

  init(index: number){
    this.index = index;
    this.current = this.files[this.index];
  }

  actualPlaylist(): Observable<AudioFile[]> {
    return of(this.files);
  }

  next(): AudioFile {
    let newIndex = this.index + 1;

    if (newIndex >= this.files.length) {
      newIndex = 0;
    }

    try {
      this.current = this.files[newIndex];
      return this.current;
    } finally {
      this.index = newIndex;
    }
  }

  previous(): AudioFile {
    let newIndex = this.index - 1;

    if (newIndex < 0) {
      newIndex = this.files.length - 1;
    }

    try {
      this.current = this.files[newIndex];
      return this.current;
    } finally {
      this.index = newIndex;
    }
  }
}
