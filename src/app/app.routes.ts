import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { SessionComponent } from './session/session.component';
import { PersonalExpenseComponent } from './dashboard/personal-expense/personal-expense.component';
import { GroupExpenseComponent } from './dashboard/group-expense/group-expense.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '2', component: GroupExpenseComponent },
    { path: '1', component: PersonalExpenseComponent },
    { path: 'register' , component: SessionComponent, data: {showRegister: true} },
    { path: 'signin' , component: SessionComponent, data: {showRegister: false} },
    { path: 'profile' , component: ProfileComponent },
    

];
