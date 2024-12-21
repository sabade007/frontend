import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-public-share-expired',
  templateUrl: './public-share-expired.component.html',
  styleUrls: ['./public-share-expired.component.scss'],
})
export class PublicShareExpiredComponent implements OnInit {

  productName = environment.productname;
  constructor(private router: Router) { }

  ngOnInit() {}

  signup(){
    this.router.navigate(["/create-account"]);
  }

}
