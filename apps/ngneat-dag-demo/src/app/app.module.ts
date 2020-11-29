import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedUiComponentsModule } from '@ngneat-dag/shared/ui/components';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedUiComponentsModule,
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () =>
          import('@ngneat-dag/demo/feature/home').then(
            (module) => module.DemoFeatureHomeModule
          ),
      },
      {
        path: 'demo',
        loadChildren: () =>
          import('@ngneat-dag/demo/feature/builder-demo').then(
            (module) => module.DemoFeatureBuilderDemoModule
          ),
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
