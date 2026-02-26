import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sinistro } from '../models/sinistro.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class Sinistri {

  obs!: Observable<sinistro[]>
  sinistri!: sinistro[]

  constructor(public http: HttpClient){
    
  }

  getSinistri(){
    
  }
}
