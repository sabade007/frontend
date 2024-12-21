import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  productName = environment.productname;
  
  constructor(private router: Router) { }

  ngOnInit() {}

  login(){
    this.router.navigate([""]);
  }

}
