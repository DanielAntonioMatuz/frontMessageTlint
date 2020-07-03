import {Component, ElementRef, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/GLOBAL';
import {Message} from '../../models/Message';
import * as io from "socket.io-client";
import {Router} from '@angular/router';
import Push from 'push.js';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

  @ViewChild('scrollMe', {static:false}) private myScrollContainer: ElementRef;

  public data_msm;
  public usuarios;
  public url;
  public user_select;
  public mensajes;
  public identity;
  public token;
  public de;
  public send_message;
  public socket = io('http://localhost:4201');

  constructor(
    private _userService: UserService,
    private _router: Router,
  ) {
    this.url =GLOBAL.url;
    this.identity = _userService.getIdentity();
    this.de = this.identity._id;
    this.token = this._userService.getToken();
    console.log(this.de);
  }

  ngOnInit(): void {

    if(this.identity){
      this.data_msm = new Message('','','','');

      this._userService.get_user().subscribe(
        response=>{
          this.usuarios = response.users;
        }, error => {

        }
      );

      this.socket.on('new-message',function(data) {

        var data_all = {
          de: data.message.de,
          para: data.message.para,
          msm: data.message.msm,
          createAt: data.message.createAt,
        }


        this._userService.get_use(data.message.de).subscribe(
          response => {


            if(response.user._id != this.de){
              Push.Permission.has();
              Push.create(response.user.nombre, {
                body: data.message.msm,
                icon: this.url+'usuario/img/'+response.user.imagen,
                timeout: 4000,
                onClick: function () {
                  window.focus();
                  this.close();
                }
              });
              (document.getElementById('player') as any).load();
              (document.getElementById('player') as any).play();

            }

          }, error => {

          }
        )

        this.mensajes.push(data_all);

      }.bind(this))

      this.socket.on('new-users',function(data) {
        console.log(data.users.users);
        this.usuarios = data.users.users;

      }.bind(this));

    } else {
      this._router.navigate(['/']);
    }

  }

  scrollToBottom():void{
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (e) {

    }
  }

  ngAfterViewChecked():void {
    this.scrollToBottom();
  }

  listar(id){
    this._userService.get_use(id).subscribe(
      response => {
        this.user_select = response.user;

        this._userService.get_message(this.de,id).subscribe(
          response=> {
            this.mensajes = response.messages;
            console.log(this.mensajes)
          }, error => {

          }
        )


      }, error => {

      }
    )
  }

  onSubmit(msmForm){

    if(msmForm.valid){
      this.send_message = {
        de: this.de,
        para: this.user_select._id,
        msm: this.data_msm.msm,
      }
      this._userService.get_send_msm(this.send_message).subscribe(
        response => {
          this.data_msm.msm = '';
          this.socket.emit('save-message',response.message);
          this.scrollToBottom();
        }, error => {

      }
      )
    } else {


    }

  }

  logout(){
    this._userService.desactivar(this.identity._id).subscribe(
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
      },
      error =>{

      }
    );
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.token = null;
    this.identity = null;



    this._router.navigate(['']);
  }

}
