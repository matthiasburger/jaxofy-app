import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Store} from '@ngrx/store';
import {CloudService} from '../../services/cloud.service';
import {AudioService} from '../../services/audio.service';
import {distinctUntilChanged, filter, map, pluck} from 'rxjs/operators';
import {CANPLAY, LOADEDMETADATA, LOADSTART, PLAYING, RESET, TIMEUPDATE} from '../../services/store/store';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  files: any = [];
  seekbar: FormControl = new FormControl('seekbar');
  state: any = {};
  onSeekState: boolean;
  currentFile: any = {};
  displayFooter = 'inactive';
  loggedIn: boolean;
  
  constructor(
    public audioProvider: AudioService,
    public cloudProvider: CloudService,
    private store: Store<any>,
    public auth: AuthenticationService
  ) {
    this.auth.isAuthenticated.subscribe((isLoggedIn: any) => {
      this.loggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.getDocuments();

      }
    });
  }

  getDocuments() {
    this.cloudProvider.getFiles().subscribe(files => {
      this.files = files;
    });
  }

  presentLoading() {
    console.log('loading');
  }

  ionViewWillLoad() {
    this.store.select('appState').subscribe((value: any) => {
      this.state = value.media;
    });

    // Resize the Content Screen so that Ionic is aware of the footer
    this.store
      .select('appState')
      .pipe(pluck('media', 'canplay'), filter(value => value === true))
      .subscribe(() => {
        this.displayFooter = 'active';
      });

    // Updating the Seekbar based on currentTime
    this.store
      .select('appState')
      .pipe(
        pluck('media', 'timeSec'),
        filter(value => value !== undefined),
        map((value: any) => Number.parseInt(value, 10)),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.seekbar.setValue(value);
      });
  }

  openFile(file, index) {
    this.currentFile = {index, file};
    this.playStream(file.url);
  }

  resetState() {
    this.audioProvider.stop();
    this.store.dispatch({type: RESET});
  }

  playStream(url) {
    this.resetState();
    this.audioProvider.playStream(url).subscribe(event => {
      const audioObj = event.target;

      switch (event.type) {
        case 'canplay':
          return this.store.dispatch({type: CANPLAY, payload: {value: true}});

        case 'loadedmetadata':
          return this.store.dispatch({
            type: LOADEDMETADATA,
            payload: {
              value: true,
              data: {
                time: this.audioProvider.formatTime(
                  audioObj.duration * 1000,
                  'HH:mm:ss'
                ),
                timeSec: audioObj.duration,
                mediaType: 'mp3'
              }
            }
          });

        case 'playing':
          return this.store.dispatch({type: PLAYING, payload: {value: true}});

        case 'pause':
          return this.store.dispatch({type: PLAYING, payload: {value: false}});

        case 'timeupdate':
          return this.store.dispatch({
            type: TIMEUPDATE,
            payload: {
              timeSec: audioObj.currentTime,
              time: this.audioProvider.formatTime(
                audioObj.currentTime * 1000,
                'HH:mm:ss'
              )
            }
          });

        case 'loadstart':
          return this.store.dispatch({type: LOADSTART, payload: {value: true}});
      }
    });
  }

  pause() {
    this.audioProvider.pause();
  }

  play() {
    this.audioProvider.play();
  }

  stop() {
    this.audioProvider.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSeekStart() {
    this.onSeekState = this.state.playing;
    if (this.onSeekState) {
      this.pause();
    }
  }

  onSeekEnd(event) {
    if (this.onSeekState) {
      this.audioProvider.seekTo(event.value);
      this.play();
    } else {
      this.audioProvider.seekTo(event.value);
    }
  }

  ngOnInit() {
  }

}
