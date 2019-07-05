import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitySelectionComponent } from './city-selection/city-selection.component';
import { WeatherInfoComponent } from './weather-info/weather-info.component';

const routes: Routes = [
  { path: '', component: CitySelectionComponent },
  { path: 'info', component: WeatherInfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
