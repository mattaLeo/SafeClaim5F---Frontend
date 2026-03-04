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
    // build payload – the server will normally add other fields (id, stato, data_creazione)
    const newSinistro: sinistro = {
      id_automobilista: automobilista_id,
      targa: targa,
      data_evento: data_evento,
      descrizione: descrizione,
      stato: 'APERTO',
      data_creazione: new Date()
    } as any; // cast because server normally returns additional fields

    // **BUG FIX**: push immediately so UI can render even if HTTP fails/offline
    // earlier this was done inside the subscribe callback, which caused a
    // TypeError when sinistri was undefined at startup. the array is already
    // initialized above (`sinistri: sinistro[] = []`) so this is safe.
    this.sinistri.push(newSinistro);

    // perform the HTTP call as before, log response/errors, but do not wait for
    // it before mutating the local collection.
    this.obsCreateSinistro = this.http.post(`${this.link}sinistro`, newSinistro);

    this.obsCreateSinistro.subscribe(
      res => console.log('create sinistro response', res),
      err => console.error('create sinistro failed', err)
    );

    console.log('local sinistri', this.sinistri);
    return this.obsCreateSinistro;
  }

}
