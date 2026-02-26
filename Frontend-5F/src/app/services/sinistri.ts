import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sinistro } from '../models/sinistro.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class Sinistri {

  link = "https://sturdy-space-train-wrrww9x6prwjf9vw9-6000.app.github.dev/"
  obs!: Observable<sinistro[]>
  sinistri!: sinistro[]

  constructor(public http: HttpClient){
    
  }

  askSinistri(){
    this.obs = this.http.get<sinistro[]>(`${this.link}/`)
    this.obs.subscribe(data => this.getSinistri(data))
  }

  getSinistri(d: sinistro[]){
    this.sinistri = d
    console.log(this.sinistri)
  }
}
