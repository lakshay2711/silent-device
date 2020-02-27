import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import {MatInputModule,
  MatCardModule,
   MatButtonModule,
   MatToolbarModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule} from '@angular/material';
    import {createCustomElement} from '@angular/elements';
    import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceComponent } from './device/device.component';

@NgModule({
  declarations: [
    DeviceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatIconModule,
    HttpClientModule
  ],
  entryComponents: [DeviceComponent],
  providers: [],
 // bootstrap: [AppComponent]

})
export class AppModule {
  constructor(injector: Injector) {
    const custom = createCustomElement(DeviceComponent, {injector: injector});
    customElements.define('mps-single-devices', custom);
  }
  ngDoBootstrap() {}
 }
