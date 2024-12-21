import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.prod";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class ActivityServiceService {
  constructor(private readonly http: HttpClient) {}

  getActivitiesList(date): Observable<any> {
    return this.http.post<any>(API_URL + "activities/activity", date);
  }

  getActivitiesCount(countData: any): Observable<any> {
    return this.http.post<any>(API_URL + "activities/activityCount", countData);
  }
}
