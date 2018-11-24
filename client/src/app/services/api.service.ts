import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getRestaurant(location: MapLocation): Restaurant {
    // return this.get<Restaurant>('/restaurant', location).ToPromise();
    return <Restaurant>{
      image: 'https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyCzR4NI8Bfo-Vbj_X5wOK7uBhxAyKPwtZ4&photoreference=CmRaAAAAOB58PcgLuKw_824yU6GeyM0LERQ0DR59FXmDXGGkRMUYJOev_WXbHszCIiHl-_KPlZrUvVG8p3Mm8vNkxGwA9ptYRO8HJl7-Ld0rWYa8rpOkFc449uxcBojAJlg_v-ZoEhAsbN0YpLd_Gay_yIusv2IfGhSUycu5-DI6PrzxAZP9fRziwAdbXw&maxwidth=250',
      location: {
        lat: 52.9564424,
        lng: -1.153329
      },
      name: 'Demo Restaurant'
    };
  }

  private get<T>(endpoint: string, queryParams: any): Observable<any> {
    console.log('GET: ' + endpoint);
    const params = new HttpParams();
    Object.keys(queryParams).forEach(key => params.set(key, queryParams[key]));
    return this.http.get<T>(this.getUrl(endpoint), {params: queryParams})
      .pipe(catchError(this.handleError));
  }

  private getUrl(endpoint: string) {
    return environment.baseApiUrl + endpoint;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Exception occured: ', error.error.message);
    } else {
      console.error(`Server responded with ${error.status}`);
    }
    return throwError(error.error);
  }


}
