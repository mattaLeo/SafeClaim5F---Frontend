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

  sinistri: sinistro[] = [];
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
      id_automobilista: automobilista_id,
      targa: targa,
      data_evento: data_evento,
      descrizione: descrizione
    }

    this.sinistri.push(newSinistro as sinistro) // add to local list for immediate UI update, backend will assign an ID


    // keep a reference to the observable for debugging, but also return it
    this.obsCreateSinistro = this.http.post(`${this.link}sinistro`, newSinistro);
    // subscribe here just to log the result, callers can still subscribe on the return value
    this.obsCreateSinistro.subscribe(res => console.log(res));
    console.log(this.sinistri); 
    return this.obsCreateSinistro;
  }

}
