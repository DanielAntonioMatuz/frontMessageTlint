import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {GLOBAL} from 'src/app/services/GLOBAL';
import * as io from 'socket.io-client';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public socket = io('http://localhost:4201');
  public identity;
  public url;
  public de;
  public datos_config: any = {};
  public datos_user: any = {};
  public data: any = {};
  public data_send: any = {};
  public password;
  public confirm_pass;
  public msm_confirm_pass;
  public msm_success;
  public usuarios;

  public file: File;
  public imgselected: String | ArrayBuffer;
  confirm_passText: any;
  passwordText: any;

  constructor(
    private _userService: UserService,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
    this.url = GLOBAL.url;
    this.de = this.identity._id;
  }

  ngOnInit() {

    if (!this.identity) {
      this._router.navigate(['']);
    } else {
      this._userService.get_use(this.de).subscribe(
        response => {

          this.datos_config = response.config;
          this.datos_user = response.user;

          this.data = {
            _id: this.datos_user._id,
            name: this.datos_user.name,
            surname: this.datos_user.surname,
            cellphone: this.datos_user.cellphone,
            image: this.file,
            description: this.datos_user.description,
            imageBackground: this.datos_user.imageBackground,
            nick: this.datos_user.nick,
            role: this.datos_user.role,
            estado: this.datos_user.estado,
            location: this.datos_user.location,
            date: this.datos_user.date,
            email: this.datos_user.email
          };
          console.log(this.data._id);


        },
        error => {

        }
      );
    }

  }

  public files;

  imgSelected(event: Event) {
    if (event.target.files && event.target.files[0]) {
      this.file = <File> event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imgselected = reader.result;
      reader.readAsDataURL(this.file);

    }
  }

  onSubmit(configForm) {
    if (configForm.valid) {

      if (configForm.value.password != undefined) {


        if (configForm.value.password != configForm.value.confirm_pass) {
          this.msm_confirm_pass = 'Las contraseñas no coinciden';
        } else {

          this.msm_confirm_pass = '';
          this.data_send = {
            _id: this.datos_user._id,
            name: configForm.value.name,
            surname: configForm.value.surname,
            cellphone: configForm.value.cellphone,
            image: this.file,
            description: configForm.value.description,
            estado: configForm.value.estado,
            location: configForm.value.location,
            date: configForm.value.date,
            password: configForm.value.password,

          };

          this.socket.emit('save-identity', {identity: this.data_send});

          this._userService.update_config(this.data_send).subscribe(
            response => {
              this.msm_success = 'Se actualizó su perfil con exito';
              this._userService.listar('').subscribe(
                response => {
                  this.usuarios = response.users;
                  this.socket.emit('save-users', {users: this.usuarios});


                },
                errorr => {

                }
              );
            },
            error => {

            }
          );
        }
      } else {

        this.msm_confirm_pass = '';
        this.data_send = {
          _id: this.datos_user._id,
          name: configForm.value.name,
          surname: configForm.value.surname,
          cellphone: configForm.value.cellphone,
          image: this.file,
          description: configForm.value.description,
          estado: configForm.value.estado,
          location: configForm.value.location,
          date: configForm.value.date,

        };
        this._userService.update_config(this.data_send).subscribe(
          response => {
            this.msm_success = 'Se actualizó su perfil con exito';
            this._userService.listar('').subscribe(
              response => {
                this.usuarios = response.users;
                this.socket.emit('save-users', {users: this.usuarios});


              },
              errorr => {

              }
            );
          },
          error => {

          }
        );

      }
      this.msm_success = '';

    }

  }

}
