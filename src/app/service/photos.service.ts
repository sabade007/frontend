import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private readonly http: HttpClient,
    private router: Router) {
  }

  //Show all photos
  showAllPhots(data) {
    let headers:any = new Headers();
    let favorite: any = false;
    let params = new HttpParams().set('favorite', favorite);
    return this.http.post<any>(API_URL + 'file/getPhotos' ,data, {headers: headers, params: params});
  }

  //Show all Favotites photos
  allFavotitesPhoto(data) {
    let headers:any = new Headers();
    let favorite: any = true;
    let params = new HttpParams().set('favorite', favorite);
    return this.http.post<any>(API_URL + 'file/getPhotos' ,data, {headers: headers, params: params});
  }

}
