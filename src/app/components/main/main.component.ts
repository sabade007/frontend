import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  constructor(private commonService:CommonService) {
    this.commonService.disableBack();
   }

  ngOnInit() {}

}
