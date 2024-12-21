import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  
  constructor(private http: HttpClient) { }

  
}
