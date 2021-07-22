// src/app/services/audio.service.ts
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';
import {StreamState} from '../interfaces/stream-state';
import {PlaylistService} from './playlist.service';
import {environment} from '../../environments/environment';
import {Path} from '../core/path';

@Injectable({
  providedIn: 'root'
})
export class AudioService {


  audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart'
  ];

  private stop$ = new Subject();
  private audioObj = new Audio();

  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );

  constructor(public playlistService: PlaylistService) {

  }

  startCurrentPlaylist() {
    this.playPlaylist().subscribe(x => {
    });
  }

  public playPlaylist(): Observable<any> {
    const currentAudio = this.playlistService.current;
    return this.streamObservable(currentAudio.url).pipe(takeUntil(this.stop$));
  }

  play(): Promise<void> {
    return this.audioObj.play();
  }

  pause(): void {
    this.audioObj.pause();
  }

  stop(): void {
    this.stop$.next();
  }

  seekTo(seconds: number): void {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss'): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  public next() {
    this.resetState();
    this.playlistService.next();
    this.playPlaylist().subscribe();
  }

  public previous() {
    this.resetState();
    this.playlistService.previous();
    this.playPlaylist().subscribe();
  }

  private onEndFunction() {
    this.next();
  }

  private addEvents(obj: any, events: any[], handler: any): void {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: any, events: any[], handler: any): void {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        console.log('canplay');
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        console.log('playing');

        this.state.playing = true;
        break;
      case 'pause':
        console.log('pause');
        this.state.playing = false;
        break;
      case 'timeupdate':
        console.log('timeupdate');

        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
      case 'ended':
        this.stop();
        this.resetState();

        console.log('end');
        this.onEndFunction();
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState(): void {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false
    };
  }

  private streamObservable(url: string): Observable<any> {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = Path.join(environment.apiUrl, url);
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }
}
