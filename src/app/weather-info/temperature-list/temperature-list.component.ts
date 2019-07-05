import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-temperature-list',
  templateUrl: './temperature-list.component.html',
  styleUrls: ['./temperature-list.component.scss']
})
export class TemperatureListComponent implements OnInit {

  @Input() weatherList: any[];

  constructor() { }

  ngOnInit() {
  }

}
