import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { NodeComponent } from './node/node.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LandingComponent }]),
    FormsModule,
  ],
  declarations: [LandingComponent, NodeComponent],
})
export class DemoFeatureBuilderDemoModule {}
