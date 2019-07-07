import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slider-toggle',
  templateUrl: './slider-toggle.component.html',
  styleUrls: ['./slider-toggle.component.scss']
})
export class SliderToggleComponent implements OnInit, OnDestroy {

  constructor(private weatherService: WeatherService) { }

  unit = 'C';
  checked = false;
  private unitSub: Subscription;

  ngOnInit() {
    this.unit = this.weatherService.getUnit().unit;
    this.checked = this.weatherService.getUnit().checked;

    this.unitSub = this.weatherService.getUnitListener().subscribe(() => {
      this.unit = this.weatherService.getUnit().unit;
      this.checked = !this.weatherService.getUnit().checked;
    });
  }

  onToggleUnit() {
    this.weatherService.toggleUnit();
  }

  ngOnDestroy() {
    this.unitSub.unsubscribe();
  }
}
