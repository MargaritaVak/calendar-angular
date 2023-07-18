import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule,registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { ChunkPipe } from './chunk.pipe';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

registerLocaleData(localeRu);

// @ts-ignore
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    ChunkPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'ru'}]
})
export class AppModule { }
