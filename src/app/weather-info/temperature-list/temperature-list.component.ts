import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from 'src/app/shared/weather.service';

@Component({
  selector: 'app-temperature-list',
  templateUrl: './temperature-list.component.html',
  styleUrls: ['./temperature-list.component.scss']
})
export class TemperatureListComponent implements OnInit, OnDestroy {

  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  unit: string;
  weatherList: any[];
  unitSub: Subscription;
  apiDataSub: Subscription;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.setCurrentUnit();
    const defaultData = JSON.parse(localStorage.getItem('weatherapi')).data[this.weatherService.getUnit().system];
    this.generateWeatherList(defaultData);

    this.unitSub = this.weatherService.getUnitListener().subscribe((toggledUnitData) => {
      this.setCurrentUnit();
      this.generateWeatherList(toggledUnitData);
    });

    this.apiDataSub = this.weatherService.getApiDataListener().subscribe((data) => {
      const updatedData = JSON.parse(localStorage.getItem('weatherapi')).data[this.weatherService.getUnit().system];
      this.generateWeatherList(updatedData);
    });
  }

  private setCurrentUnit() {
    this.unit = this.weatherService.getUnit().unit;
  }

  private generateWeatherList(data: any) {
    const dayOfTheWeek = new Date(data.list[0].dt_txt).getDay();
    const hour = new Date(data.list[0].dt_txt).getHours();
    const days = [];

    for (let i = 0; i < 7; i++) {
      let temperature; let icon;
      const day = this.days[(dayOfTheWeek + i) % 7];
      const timeIndex = this.getTimeIndex(i, hour);

      if (timeIndex >= 0 && timeIndex < 40) {
        temperature = this.getTemperature(data, timeIndex);
        icon = this.getIcon(data, timeIndex);
      } else if (timeIndex >= 40) {
        temperature = 'N/A';
        icon = `wi-na`;
      } else {
        icon = this.getIcon(data, 0);
        temperature = this.getTemperature(data, 0);
      }
      days.push({ day, icon, temperature, timeIndex });
    }
    this.weatherList = days;
  }

  private getTemperature(data: any, timeIndex: number) {
    return Math.round(data.list[timeIndex].main.temp);
  }

  private getIcon(data: any, timeIndex: number) {
    return `wi-owm-${data.list[timeIndex].weather[0].id}`;
  }

  private getTimeIndex(i: number, hour: number) {
    const hours = [0, 3, 6, 9, 12, 15, 18, 21];
    const timeIndeces = [12, 11, 10, 9, 8, 7, 6, 5];
    const index = hours.indexOf(hour);
    if (i === 0) {
      return timeIndeces[index] - 8;
    }
    if (i === 1) {
      return timeIndeces[index];
    }
    if (i > 1) {
      return timeIndeces[index] + (i - 1) * 8;
    }
  }

  ngOnDestroy() {
    this.unitSub.unsubscribe();
    this.apiDataSub.unsubscribe();
  }
}
