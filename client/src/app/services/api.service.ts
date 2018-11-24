import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  notts = {lat: 52.9531876, lng: -1.1492799};

  constructor(private http: HttpClient) { }

  public getRestaurant(location: MapLocation): Restaurant {
    const response = this.get<Restaurant>('/restaurant', location).toPromise();
    console.log(response);
    return response;
  }

  public getResidence(location: MapLocation): Residence {
    return <Residence>{

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
