import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { SessionComponent } from './session/session.component';
import { PersonalExpenseComponent } from './dashboard/personal-expense/personal-expense.component';
import { GroupExpenseComponent } from './dashboard/group-expense/group-expense.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'group-expenses', component: GroupExpenseComponent },
    { path: 'register' , component: SessionComponent, data: {showRegister: true} },
    { path: 'signin' , component: SessionComponent, data: {showRegister: false} },
    

];
