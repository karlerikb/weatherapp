import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}

// testing with cityID
// http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=cdfeee94950a0614a3646d60c7a10c29

// testing with cityName
// http://api.openweathermap.org/data/2.5/forecast?q=Tallinn&units=metric&APPID=cdfeee94950a0614a3646d60c7a10c29

// testing units
// http://api.openweathermap.org/data/2.5/forecast?id=524901&units=metric&APPID=cdfeee94950a0614a3646d60c7a10c29
// http://api.openweathermap.org/data/2.5/forecast?id=524901&units=imperial&APPID=cdfeee94950a0614a3646d60c7a10c29

// api.openweathermap.org/data/2.5/weather?q=Tallinn&units=metric&APPID=cdfeee94950a0614a3646d60c7a10c29
