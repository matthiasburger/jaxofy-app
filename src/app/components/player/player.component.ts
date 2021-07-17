import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {AudioService} from '../../services/audio.service';
import {StreamState} from '../../interfaces/stream-state';
import {PlaylistService} from '../../services/playlist.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  seekbar: FormControl = new FormControl('seekbar');
  state: StreamState | null = null;
  onSeekState: boolean;
  loggedIn: boolean;

  seeking = false;

  constructor(
    public audioProvider: AudioService,
    public playlist: PlaylistService,
    public auth: AuthenticationService
  ) {
    this.auth.isAuthenticated.subscribe((isLoggedIn: any) => {
      this.loggedIn = isLoggedIn;
      if (isLoggedIn) {
      }
    });

    this.audioProvider.getState().subscribe(s => {
      this.state = s;
    });

  }

  resetState() {
    this.audioProvider.stop();
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
    this.audioProvider.next();
  }

  previous() {
    this.audioProvider.previous();
  }

  onSeekStart() {
    this.onSeekState = this.state.playing;
    if (this.onSeekState) {
      this.pause();
    }
  }

  onSeekEnd(event) {
    const val = event.target.value;

    if (this.onSeekState) {
      this.audioProvider.seekTo(val);
      this.play();
    } else {
      this.audioProvider.seekTo(val);
    }

    this.seeking = false;
  }

  ngOnInit() {
  }

}
