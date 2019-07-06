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
  unitListener = new Subject<any>();
  private units = [
    {
      system: 'metric',
      unit: 'C',
      checked: false
    },
    {
      system: 'imperial',
      unit: 'F',
      checked: true
    }
  ];
  private unit;

  constructor(private http: HttpClient, private router: Router) { }

  selectCity(conf: any) {
    const weatherAPI = {
      data: {
        metric: null,
        imperial: null,
      },
      location: conf.location
    };
    const locationParams = `q=${conf.location}`;
    this.getMetricUnitData(weatherAPI, locationParams);
  }

  selectLocationByCoordinates(conf: any) {
    const weatherAPI = {
      data: {
        metric: null,
        imperial: null,
      },
      location: conf.location
    };
    const locationParams = `lat=${conf.location.lat}&lon=${conf.location.lon}`;
    this.getMetricUnitData(weatherAPI, locationParams);
  }

  private getMetricUnitData(weatherAPI: any, locationParams: string) {
    const units = 'metric';
    const reqUrl = `${API_URL}/forecast?${locationParams}&units=${units}&APPID=${API_KEY}`;
    this.http.get(reqUrl).subscribe((metricData) => {
      weatherAPI.data.metric = metricData;
      this.getImperialUnitData(weatherAPI, locationParams);
    }, (error) => {
      this.apiDataListener.next({ error, valid: false });
    });
  }

  private getImperialUnitData(weatherAPI: any, locationParams: string) {
    const units = 'imperial';
    const reqUrl = `${API_URL}/forecast?${locationParams}&units=${units}&APPID=${API_KEY}`;
    this.http.get(reqUrl).subscribe((imperialData) => {
      weatherAPI.data.imperial = imperialData;
      this.storeLocationWeatherData(weatherAPI);
      this.apiDataListener.next({ weatherAPI, valid: true });
      this.router.navigate(['/info']);
    }, (error) => {
      this.apiDataListener.next({ error, valid: false });
    });
  }

  private storeLocationWeatherData(weatherAPI: any) {
    localStorage.setItem('weatherapi', JSON.stringify(weatherAPI));
  }

  getApiDataListener() {
    return this.apiDataListener.asObservable();
  }

  getUnitListener() {
    return this.unitListener.asObservable();
  }

  getUnit() {
    if (!localStorage.getItem('unit')) {
      localStorage.setItem('unit', JSON.stringify(this.units[0]));
    }
    this.unit = JSON.parse(localStorage.getItem('unit'));
    return this.unit;
  }

  toggleUnit() {
    const currentUnit = this.getUnit();
    const toggledUnit = this.units.filter(unitObj => unitObj.system !== currentUnit.system)[0];
    localStorage.setItem('unit', JSON.stringify(toggledUnit));
    const data = JSON.parse(localStorage.getItem('weatherapi')).data[toggledUnit.system];
    this.unitListener.next(data);
  }

}
