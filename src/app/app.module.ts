import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CitySelectionComponent } from './city-selection/city-selection.component';
import { WeatherInfoComponent } from './weather-info/weather-info.component';
import { CurrentWeatherComponent } from './weather-info/current-weather/current-weather.component';
import { TemperatureListComponent } from './weather-info/temperature-list/temperature-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CitySelectionComponent,
    WeatherInfoComponent,
    CurrentWeatherComponent,
    TemperatureListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
