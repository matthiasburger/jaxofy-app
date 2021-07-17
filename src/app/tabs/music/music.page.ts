import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {CloudService} from '../../services/cloud.service';
import {AudioService} from '../../services/audio.service';
import {PlaylistService} from '../../services/playlist.service';
import {AudioFile} from '../../interfaces/audio-file';

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {
  files: AudioFile[] = [];
  state: any = {};
  loggedIn: boolean;

  constructor(
    public audioProvider: AudioService,
    public cloudProvider: CloudService,
    public auth: AuthenticationService,
    public playlistService: PlaylistService
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

  openFile(file, index) {
    this.playlistService.files = this.files;
    this.playlistService.init(index);
    this.playPlaylist();
  }

  resetState() {
    this.audioProvider.stop();
  }

  playPlaylist() {
    if(this.playlistService.current === null) {
      console.warn('you didnt initialize playlist service, so I did it... go, do it now!!');

      this.playlistService.init(0);
    }

    this.resetState();
    this.audioProvider.startCurrentPlaylist();
  }

  ngOnInit() {
  }
}
