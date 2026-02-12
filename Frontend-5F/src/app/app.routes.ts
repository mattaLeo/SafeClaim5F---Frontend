import { Routes } from '@angular/router';
import { Automobilista } from './automobilista/automobilista';
import { Perito } from './perito/perito';
import { Assicurazione } from './assicurazione/assicurazione';

export const routes: Routes = [
    {path: "automobilista", component: Automobilista},
    {path: "perito", component: Perito},
    {path: "assicurazione", component: Assicurazione}
];
