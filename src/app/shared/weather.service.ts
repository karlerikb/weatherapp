import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const API_KEY = environment.API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiDataListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { }

  selectCity(API: any) {
    const reqUrl = `${API_URL}/forecast?q=${API.location}&units=${API.units}&APPID=${API_KEY}`;
    this.http.get(reqUrl).subscribe((data) => {
      this.apiDataListener.next({ data, valid: true });
      this.storeCityData(data);
      this.router.navigate(['/info']);
    }, (error) => {
      this.apiDataListener.next({ error, valid: false });
    });
  }

  getApiDataListener() {
    return this.apiDataListener.asObservable();
  }

  private storeCityData(data: any) {
    localStorage.setItem('weatherapi', JSON.stringify(data));
  }
}
