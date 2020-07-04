import { Component, OnInit } from '@angular/core';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import * as io from "socket.io-client";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user;
  public token;
  public identity;
  public data_user;
  public usuarios;
  public socket = io('http://localhost:4201');


  constructor(
    private _userService : UserService,
    private _router: Router,
  ) {
    this.data_user = this._userService.getIdentity();
  }

  ngOnInit(): void {
    this.user = new User('','','','','','','','', '', '', '', '','', false);

    if(this.data_user){
      this._router.navigate(['messenger']);
    }

  }

  onSubmit(loginForm){
    if(loginForm.valid){
      this._userService.login(this.user).subscribe(
        response => {
          this.token = response.jwt;
          this.identity =  JSON.stringify(response.user);
          localStorage.setItem('token', this.token);
          this._userService.login(this.user, true).subscribe(
            response => {
              localStorage.setItem('identity', this.identity);
              this._userService.activar(response.user._id).subscribe(
                response => {
                  this._userService.listar('').subscribe(
                    response =>{
                      this.usuarios = response.users;
                      console.log(response.users);
                      this.socket.emit('save-users', {users: this.usuarios});


                    },
                    error =>{

                    }
                  );
                }, error => {

                }
              )
              this._router.navigate(['messenger']);

            }, error => {

            }
          )
        } , error => {
        }
      )
    } else {
      console.log('No se pudo validar');
    }
  }


}
