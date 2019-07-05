import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WeatherService } from '../shared/weather.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../shared/helper.service';

@Component({
  selector: 'app-city-selection',
  templateUrl: './city-selection.component.html',
  styleUrls: ['./city-selection.component.scss']
})
export class CitySelectionComponent implements OnInit, OnDestroy {

  isLoading = false;
  displayMessage = false;
  cityInputField = '';
  msgObj: any;
  apiDataSub: Subscription;

  constructor(private helper: HelperService, private weatherService: WeatherService) { }

  ngOnInit() {
    this.apiDataSub = this.weatherService.getApiDataListener().subscribe((response) => {
      if (!response.valid) {
        this.displayMessage = true;
        this.msgObj = {
          type: 'error',
          body: `${this.helper.upperCaseFirstLetter(response.error.error.message)}`
        };
      }
      console.log(response);
      this.isLoading = false;
    });
  }

  onSelectCity(form: NgForm) {
    const validForm = this.formValidation(form);
    if (validForm) {
      const apiConf = {
        location: form.value.city,
        units: 'metric'
      };
      this.isLoading = true;
      this.weatherService.selectCity(apiConf);
    }
  }

  private formValidation(form: NgForm) {
    if (form.invalid) {
      this.cityInputField = 'invalid';
      this.displayMessage = true;
      this.msgObj = {
        type: 'error',
        body: 'Please enter a city!'
      };
      return false;
    }
    this.cityInputField = '';
    this.displayMessage = false;
    return true;
  }

  ngOnDestroy() {
    this.apiDataSub.unsubscribe();
  }
}
