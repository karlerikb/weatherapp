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
  private unit = 'metric';

  constructor(private http: HttpClient, private router: Router) { }

  selectCity(API: any) {
    const reqUrl = `${API_URL}/forecast?q=${API.location}&units=${API.units}&APPID=${API_KEY}`;
    this.http.get(reqUrl).subscribe((data) => {
      const weatherAPI = this.generateWeatherData(API, data);
      this.apiDataListener.next({ weatherAPI, valid: true });
      this.storeCityData(weatherAPI);
      this.router.navigate(['/info']);
    }, (error) => {
      this.apiDataListener.next({ error, valid: false });
    });
  }

  selectLocationByCoordinates(API: any) {
    const reqUrl = `${API_URL}/forecast?lat=${API.lat}&lon=${API.lon}&units=${API.units}&APPID=${API_KEY}`;
    this.http.get(reqUrl).subscribe((data) => {
      const weatherAPI = this.generateWeatherData(API, data);
      this.apiDataListener.next({ weatherAPI, valid: true });
      this.storeCityData(weatherAPI);
      this.router.navigate(['/info']);
    }, (error) => {
      this.apiDataListener.next({ error, valid: false });
    });
  }

  getApiDataListener() {
    return this.apiDataListener.asObservable();
  }

  getUnit() {
    return this.unit;
  }

  setUnit(unit: string) {
    this.unit = unit;
  }

  private generateWeatherData(API: any, data: any) {
    return {
      data: {
        metric: (API.units === 'metric') ? data : null,
        imperial: (API.units === 'imperial') ? data : null
      },
      location: (API.location) ? API.location : { lat: API.lat, lon: API.lon }
    };
  }

  private storeCityData(weatherAPI: any) {
    localStorage.setItem('weatherapi', JSON.stringify(weatherAPI));
  }
}
