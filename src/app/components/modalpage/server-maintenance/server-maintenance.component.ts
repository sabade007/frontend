import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-server-maintenance',
  templateUrl: './server-maintenance.component.html',
  styleUrls: ['./server-maintenance.component.scss'],
})
export class ServerMaintenanceComponent implements OnInit {
  productName = environment.productname;
  constructor() { }

  ngOnInit() {}

}
