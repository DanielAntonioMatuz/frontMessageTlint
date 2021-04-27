import {Component, ElementRef, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/GLOBAL';
import {Message} from '../../models/Message';
import * as io from "socket.io-client";
import {Router} from '@angular/router';
import Push from 'push.js';
import * as $ from 'jquery';


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
  public para;
  public send_message;
  public socket = io('http://localhost:4201');
  public typing=false;
  public timeout=undefined;
  public user;
  public userAlfabet = [];
  public A = []; public B = []; public C = []; public D = []; public E = [];
  public F = []; public G = []; public H = []; public I = []; public J = [];
  public K = []; public L = []; public M = []; public N = []; public nn = [];
  public O = []; public P = []; public Q = []; public R = []; public S = [];
  public T = []; public U = []; public V = []; public W = []; public X = [];
  public Y = []; public Z = []; public noneUser = [];


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
          this.userAlfabet = this.usuarios;
          this.userAlfabet.sort(function(a, b) {

            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();

            if (nameA < nameB) {     return -1;   }      if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
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
              Push.create(response.user.name, {
                body: data.message.msm,
                icon: this.url+'usuario/img/'+response.user.image,
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
