import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SessionComponent } from './session/session.component';
import { PersonalExpenseComponent } from './dashboard/personal-expense/personal-expense.component';
import { GroupExpenseComponent } from './dashboard/group-expense/group-expense.component';
import { ProfileComponent } from './profile/profile.component';
import { EmiExpenseComponent } from './dashboard/emi-expense/emi-expense.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainScreenComponent } from './dashboard/main-screen/main-screen.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

    { path: 'dashboard', component: MainScreenComponent, canActivate: [AuthGuard] },
    { path: 'account', component: PersonalExpenseComponent, canActivate: [AuthGuard] },
    { path: 'groups', component: GroupExpenseComponent, canActivate: [AuthGuard] },
    { path: 'emis', component: EmiExpenseComponent, canActivate: [AuthGuard] },
    { path: 'profile' , component: ProfileComponent, canActivate: [AuthGuard] },

    { path: 'register' , component: SessionComponent, data: {showRegister: true} },
    { path: 'signin' , component: SessionComponent, data: {showRegister: false} },
    
    { path: '**', component: PageNotFoundComponent } // Optional: 404 page

];
