import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GLOBAL} from './GLOBAL'
import {User} from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url;
  public token;
  public identity;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  registrar(user):Observable<any> {
    var obj = {
      nombre: user.nombre,
      email: user.email,
      password: user.password,
    }

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'registrar', obj, {headers:headers});

  }

  login(user, gettoken = null):Observable<any>{
    let json = user;
    if(gettoken != null){
      user.gettoken = true;
    }

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'login',json,{headers:headers});
  }

  getToken():Observable<any>{
    let token = localStorage.getItem('token');
    if(token){
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

  get_send_msm(msm):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'mensaje/enviar', msm,{headers:headers});

  }

  desactivar(id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.put(this.url+'usuario/desactivar/'+id,{headers:headers});

  }

  activar(id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.put(this.url+'usuario/activar/'+id,{headers:headers});

  }



  getIdentity():Observable<any>{
    let identity = JSON.parse(localStorage.getItem('identity'));
    if(identity){
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  get_user():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url+'usuarios',{headers:headers});

  }

  get_message(de,para):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url+'mensajes/'+de +'/'+para,{headers:headers});

  }

  get_use(id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url+'usuario/'+id,{headers:headers});
  }

  update_config(data):Observable<any>{
    console.log(data.tlint);

    const fd = new FormData();
    fd.append('nombre',data.nombre);
    fd.append('telefono',data.telefono);
    fd.append('imagen',data.imagen);
    if(data.password){
      fd.append('password',data.password);
    }
    fd.append('bio',data.bio);
    fd.append('twitter',data.twitter);
    fd.append('facebook',data.facebook);
    fd.append('tlint',data.tlint);
    fd.append('notificacion',data.notificacion);
    fd.append('estado',data.estado);
    fd.append('sonido',data.sonido);

    return this._http.put(this.url+'usuario/editar/'+data._id,fd);
  }

  listar(buscar):Observable<any>{
    let search;
    if(buscar ==  undefined){
      search = "";
    }
    else{
      search = buscar;
    }

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'usuarios/'+search,{headers:headers});
  }


}
