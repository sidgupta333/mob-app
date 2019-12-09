import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  SERVER: string = "https://evening-chamber-14219.herokuapp.com";

  LOGIN: string = "/users/login";
  REGISTER: string = "/users/createUser";
  OUTLETS: string = "/outlet";
  GET_TYPES: string = "/type/getAllTypes";
  GET_DRINKS: string = "/products/getAllProducts";
  QUANTITY_MASTER: string = "/quantities";
  MIXERS: string = "/mixer/getAllMixer";
  ORDER: string = "/order/createOrder";
  NOTIF_GET: string = "/notification/getNotificationById/";
  ORDER_LIST: string = "/order/getOrderByEmailID/";
  CHECK_TABLE: string = "/table/getTableByUserId/";
  GET_ALl_TABLES = "/table/getAllTable";
  

  constructor(private http: HttpClient) { }

  // -----------------ALL HTTPS METHODS DEFINED BELOW_-----------------------------

  public getServer() {
    return this.SERVER;
  }

  public loginUser(dto: any) {
    let url = this.SERVER.concat(this.LOGIN);
    return this.http.post(url, dto);
  }

  public registerUser(dto: any) {
    let url = this.SERVER.concat(this.REGISTER);
    return this.http.post(url, dto);
  }

  public getOutlets() {
    let url = this.SERVER.concat(this.OUTLETS);
    return this.http.get(url);
  }

  public getTypes() {
    let url = this.SERVER.concat(this.GET_TYPES);
    return this.http.get(url);
  }

  public getDrinks() {
    let url = this.SERVER.concat(this.GET_DRINKS);
    return this.http.get(url);
  }

  public getQuantities() {
    let url = this.SERVER.concat(this.QUANTITY_MASTER);
    return this.http.get(url);
  }

  public getMixers() {
    let url = this.SERVER.concat(this.MIXERS);
    return this.http.get(url);
  }

  public createOrder(dto: any) {
    let url = this.SERVER.concat(this.ORDER);
    return this.http.post(url, dto);
  }

  public getNotif(outletId) {
    let url = this.SERVER.concat(this.NOTIF_GET, outletId);
    return this.http.get(url);
  }

  public getOrdersList(id) {
    let url = this.SERVER.concat(this.ORDER_LIST, id);
    return this.http.get(url);
  }

  public getTableStatus(id) {
    let url = this.SERVER.concat(this.CHECK_TABLE, id);
    return this.http.get(url);
  }

  public getAllTables() {
    let url = this.SERVER.concat(this.GET_ALl_TABLES);
    return this.http.get(url);
  }
}
