import { Routes } from '@angular/router';
import { Automobilista } from './automobilista/automobilista';
import { Perito } from './perito/perito';
import { Assicurazione } from './assicurazione/assicurazione';
import { Login } from './login/login';
import { Signup } from './signup/signup';

export const routes: Routes = [
    {path: "automobilista", component: Automobilista},
    {path: "perito", component: Perito},
    {path: "assicurazione", component: Assicurazione},
    {path: "signin", component: Login},
    {path: "signup", component: Signup}
];
