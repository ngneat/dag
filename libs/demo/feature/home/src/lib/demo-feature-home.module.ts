import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([{ path: '', component: LandingComponent }]),
  ],
  declarations: [LandingComponent],
})
export class DemoFeatureHomeModule {}
