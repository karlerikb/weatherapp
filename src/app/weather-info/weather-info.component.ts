import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../shared/weather.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.scss']
})
export class WeatherInfoComponent implements OnInit, OnDestroy {

  city = '';
  isLoading = false;
  apiDataSub: Subscription;

  constructor(private weatherService: WeatherService, private router: Router) { }

  @HostListener('window:load') onPageRefresh() {
    this.isLoading = true;
    const data = JSON.parse(localStorage.getItem('weatherapi')).data[this.weatherService.getUnit().system];
    const conf = { location: data.city.coord };
    this.weatherService.selectLocationByCoordinates(conf);
  }

  ngOnInit() {
    this.apiDataSub = this.weatherService.getApiDataListener().subscribe((data) => {
      this.isLoading = false;
    });

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

  ngOnDestroy() {
    this.apiDataSub.unsubscribe();
  }
}
