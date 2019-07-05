import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../shared/helper.service';

@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.scss']
})
export class WeatherInfoComponent implements OnInit {

  city = '';
  dateTime = '';
  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];

  constructor(private helper: HelperService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('weatherapi')) {
      const data = JSON.parse(localStorage.getItem('weatherapi'));
      this.displayCurrentCity(data.city.name);
      // this.generateCurrentWeatherInfo(data);
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
