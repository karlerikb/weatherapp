import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CitySelectionComponent } from './city-selection/city-selection.component';
import { WeatherInfoComponent } from './weather-info/weather-info.component';
import { CurrentWeatherComponent } from './weather-info/current-weather/current-weather.component';
import { TemperatureListComponent } from './weather-info/temperature-list/temperature-list.component';
import { SliderToggleComponent } from './shared/slider-toggle/slider-toggle.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { MessageComponent } from './shared/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    CitySelectionComponent,
    WeatherInfoComponent,
    CurrentWeatherComponent,
    TemperatureListComponent,
    SliderToggleComponent,
    LoadingSpinnerComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
