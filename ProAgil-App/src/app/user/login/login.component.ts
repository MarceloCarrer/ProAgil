import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  titulo: 'Login';
  model: any = {};

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    console.log();
  }

}
