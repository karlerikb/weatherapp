import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../shared/helper.service';
import { WeatherService } from '../shared/weather.service';

@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.scss']
})
export class WeatherInfoComponent implements OnInit {

  city = '';
  dateTime = '';
  currentWeatherInfo: any;
  weatherList: any[];
  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];

  constructor(
    private helper: HelperService,
    private weatherService: WeatherService,
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('weatherapi')) {
      const data = JSON.parse(localStorage.getItem('weatherapi')).data[this.weatherService.getUnit()];
      this.displayCurrentCity(data.city.name);
      this.generateCurrentWeatherInfo(data);
      this.generateWeatherList(data);
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

  private generateCurrentWeatherInfo(data: any) {
    this.currentWeatherInfo = {
      date: this.constructDateTime(new Date(data.list[0].dt_txt)),
      description: this.helper.upperCaseFirstLetter(data.list[0].weather[0].description),
      temp: Math.round(data.list[0].main.temp),
      icon: this.getCurrentWeatherIcon(data.list[0]),
      fullDayTemps: this.getFullDayTemps(data)
    };
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

  private getCurrentWeatherIcon(snapshot: any) {
    const dayOrNight = (snapshot.sys.pod) === 'd' ? 'day' : 'night';
    const iconId = snapshot.weather[0].id;
    return `wi-owm-${dayOrNight}-${iconId}`;
  }

  private insertDaySuffix(day: number) {
    switch (day) {
      case 1: return day + 'st';
      case 2: return day + 'nd';
      case 3: return day + 'rd';
      default: return day + 'th';
    }
  }

  private constructDateTime(date: Date) {
    const dayOfTheWeek = this.days[date.getDay()];
    const month = this.months[date.getMonth()];
    const day = this.insertDaySuffix(date.getDate());
    const year = date.getFullYear();
    const dateString = `${dayOfTheWeek}, ${month} ${day}, ${year}`;
    return dateString;
  }
}
