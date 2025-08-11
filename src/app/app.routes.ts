
import { Routes } from '@angular/router';
import { TraderPlanGeneratorComponent } from './trader-plan-generator/trader-plan-generator.component';

export const routes: Routes = [
	{ path: 'plan', component: TraderPlanGeneratorComponent },
	{ path: '', redirectTo: 'plan', pathMatch: 'full' }
];
