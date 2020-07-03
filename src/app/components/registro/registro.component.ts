import { Component, OnInit } from '@angular/core';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public user;
  public socket = ('http://localhost:4201');
  constructor(
    private _userService : UserService,
    private _router : Router,
  ) { }

  ngOnInit(): void {
    this.user = new User('','','','','','','','', '', '',false);
  }

  onSubmit(registroForm) {
    if (registroForm.valid) {
      this._userService.registrar(this.user).subscribe(
        response => {
          this._router.navigate(['']);
        },
        error => {

        }
      );
    }
  }

}
