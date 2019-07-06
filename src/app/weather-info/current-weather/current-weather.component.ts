import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from 'src/app/shared/weather.service';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {

  weatherInfo: any;
  unit: string;
  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];

  unitSub: Subscription;
  apiDataSub: Subscription;

  constructor(private weatherService: WeatherService, private helper: HelperService) { }

  ngOnInit() {
    this.setCurrentUnit();
    const defaultData = JSON.parse(localStorage.getItem('weatherapi')).data[this.weatherService.getUnit().system];
    this.generateCurrentWeatherInfo(defaultData);

    this.unitSub = this.weatherService.getUnitListener().subscribe((toggledUnitData) => {
      this.setCurrentUnit();
      this.generateCurrentWeatherInfo(toggledUnitData);
    });

    this.apiDataSub = this.weatherService.getApiDataListener().subscribe((data) => {
      const updatedData = JSON.parse(localStorage.getItem('weatherapi')).data[this.weatherService.getUnit().system];
      this.generateCurrentWeatherInfo(updatedData);
    });
  }

  private setCurrentUnit() {
    this.unit = this.weatherService.getUnit().unit;
  }

  private generateCurrentWeatherInfo(data: any) {
    this.weatherInfo = {
      date: this.constructDateTime(new Date(data.list[0].dt_txt)),
      description: this.helper.upperCaseFirstLetter(data.list[0].weather[0].description),
      temp: Math.round(data.list[0].main.temp),
      icon: this.getCurrentWeatherIcon(data.list[0]),
      fullDayTemps: this.getFullDayTemps(data)
    };
  }

  private constructDateTime(date: Date) {
    const dayOfTheWeek = this.days[date.getDay()];
    const month = this.months[date.getMonth()];
    const day = this.insertDaySuffix(date.getDate());
    const year = date.getFullYear();
    const dateString = `${dayOfTheWeek}, ${month} ${day}, ${year}`;
    return dateString;
  }

  private insertDaySuffix(day: number) {
    switch (day) {
      case 1: return day + 'st';
      case 2: return day + 'nd';
      case 3: return day + 'rd';
      default: return day + 'th';
    }
  }

  private getCurrentWeatherIcon(snapshot: any) {
    const dayOrNight = (snapshot.sys.pod) === 'd' ? 'day' : 'night';
    const iconId = snapshot.weather[0].id;
    return `wi-owm-${dayOrNight}-${iconId}`;
  }

  private getFullDayTemps(data: any) {
    const hours = new Date(data.list[0].dt_txt).getHours();
    if (hours === 6 || hours === 9) { // morning (6:00, 9:00)
      return this.getTemperatureDataFromMorning(hours, data);
    }
    if (hours === 12 || hours === 15) { // midday (12:00, 15:00)
      return this.getTemperatureDataFromMidday(hours, data);
    }
    if (hours === 18 || hours === 21) { // evening (18:00, 21:00)
      return this.getTemperatureDataFromEvening(hours, data);
    }
    if (hours === 0 || hours === 3) { // night (00:00, 3:00)
      return this.getTemperatureDataFromNight(hours, data);
    }
  }

  private getTemperatureDataFromNight(hours: number, data: any) {
    return {
      morning: (hours === 0) ? Math.round(data.list[2].main.temp) : Math.round(data.list[1].main.temp),
      day: (hours === 0) ? Math.round(data.list[4].main.temp) : Math.round(data.list[3].main.temp),
      evening: (hours === 0) ? Math.round(data.list[6].main.temp) : Math.round(data.list[5].main.temp),
      night: Math.round(data.list[0].main.temp)
    };
  }

  private getTemperatureDataFromEvening(hours: number, data: any) {
    return {
      morning: this.mockPastTemperatureData(),
      day: this.mockPastTemperatureData(),
      evening: Math.round(data.list[0].main.temp),
      night: (hours === 18) ? Math.round(data.list[2].main.temp) : Math.round(data.list[1].main.temp)
    };
  }

  private getTemperatureDataFromMorning(hours: number, data: any) {
    return {
      morning: Math.round(data.list[0].main.temp),
      day: (hours === 6) ? Math.round(data.list[2].main.temp) : Math.round(data.list[1].main.temp),
      evening: (hours === 6) ? Math.round(data.list[4].main.temp) : Math.round(data.list[3].main.temp),
      night: (hours === 6) ? Math.round(data.list[6].main.temp) : Math.round(data.list[5].main.temp)
    };
  }

  private getTemperatureDataFromMidday(hours: number, data: any) {
    return {
      morning: this.mockPastTemperatureData(),
      day: Math.round(data.list[0].main.temp),
      evening: (hours === 12) ? Math.round(data.list[2].main.temp) : Math.round(data.list[1].main.temp),
      night: (hours === 12) ? Math.round(data.list[4].main.temp) : Math.round(data.list[3].main.temp)
    };
  }

  private mockPastTemperatureData() {
    return (Math.floor(Math.random() * 10) + 1) - (Math.floor(Math.random() * 10) + 1);
  }

  ngOnDestroy() {
    this.unitSub.unsubscribe();
    this.apiDataSub.unsubscribe();
  }

}
