import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CitySelectionComponent } from './city-selection/city-selection.component';
import { WeatherInfoComponent } from './weather-info/weather-info.component';

@NgModule({
  declarations: [
    AppComponent,
    CitySelectionComponent,
    WeatherInfoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
