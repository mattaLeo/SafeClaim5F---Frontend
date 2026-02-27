import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sinistro } from '../models/sinistro.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class Sinistri {

  link = "https://sturdy-space-train-wrrww9x6prwjf9vw9-6000.app.github.dev/"

  obsSinistri!: Observable<sinistro[]>
  obsSinistroId!: Observable<sinistro>
  obsCreateSinistro!: Observable<any>

  sinistri!: sinistro[]
  sinistroById!: sinistro

  constructor(public http: HttpClient){
    
  }

  askSinistri(){
    this.obsSinistri = this.http.get<sinistro[]>(`${this.link}sinistri`)
    this.obsSinistri.subscribe(data => this.getSinistri(data))
  }

  getSinistri(d: sinistro[]){
    this.sinistri = d
    console.log(this.sinistri)
  }

  askSinistroById(id: number){
    this.obsSinistroId = this.http.get<sinistro>(`${this.link}sinistri/${id}`)
    this.obsSinistroId.subscribe(data => this.getSinistroById(data))
  }

  getSinistroById(d: sinistro){
    this.sinistroById = d
    console.log(this.sinistroById)
  }

  createSinistro(automobilista_id: number, targa: string, data_evento: Date, descrizione: string){
    let newSinistro = {
      automobilista_id: automobilista_id,
      targa: targa,
      data_evento: data_evento,
      descrizione: descrizione
    }

    this.obsCreateSinistro = this.http.post(`${this.link}sinistro`, newSinistro)
    this.obsCreateSinistro.subscribe(res => console.log(res))
  }
}
