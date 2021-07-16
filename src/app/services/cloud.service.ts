// src/app/services/cloud.service.ts
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AudioFile} from '../interfaces/audio-file';

@Injectable({
  providedIn: 'root'
})
export class CloudService {
  constructor(public http: HttpClient) {
  }

  getFiles(): Observable<AudioFile[]> {
    const url = 'http://localhost:8000/api/v1/tracks';
    return this.http.get<AudioFile[]>(url);
  }
}
