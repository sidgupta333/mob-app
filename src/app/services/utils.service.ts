import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  mixerEmitter = new BehaviorSubject(false);
  tableEmitter = new BehaviorSubject(false);
 
  constructor() {

  }


  emitMixture() {
    this.mixerEmitter.next(true);
  }

  emitTable() {
    this.tableEmitter.next(true);
  }

}
