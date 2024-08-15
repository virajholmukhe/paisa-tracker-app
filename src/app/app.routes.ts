import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { SessionComponent } from './session/session.component';
import { PersonalExpenseComponent } from './dashboard/personal-expense/personal-expense.component';
import { GroupExpenseComponent } from './dashboard/group-expense/group-expense.component';
import { ProfileComponent } from './profile/profile.component';
import { EmiExpenseComponent } from './dashboard/emi-expense/emi-expense.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainScreenComponent } from './dashboard/main-screen/main-screen.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

    { path: 'dashboard', component: MainScreenComponent },
    { path: 'account', component: PersonalExpenseComponent },
    { path: 'groups', component: GroupExpenseComponent },
    { path: 'emis', component: EmiExpenseComponent },
    { path: 'profile' , component: ProfileComponent },

    { path: 'register' , component: SessionComponent, data: {showRegister: true} },
    { path: 'signin' , component: SessionComponent, data: {showRegister: false} },
    
    { path: '**', component: PageNotFoundComponent } // Optional: 404 page

];
