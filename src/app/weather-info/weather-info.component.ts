import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../shared/weather.service';

@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.scss']
})
export class WeatherInfoComponent implements OnInit {

  city = '';

  constructor(
    private weatherService: WeatherService,
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('weatherapi')) {
      const data = JSON.parse(localStorage.getItem('weatherapi')).data[this.weatherService.getUnit().system];
      this.displayCurrentCity(data.city.name);
    } else {
      this.router.navigate(['/']);
    }
  }

  onNavigateToCitySelection() {
    this.router.navigate(['']);
  }

  private displayCurrentCity(city: string) {
    this.city = city;
  }

}
