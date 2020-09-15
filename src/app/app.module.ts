import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsComponent } from './albums/albums.component';
import { NavegadorComponent } from './navegador/navegador.component';
import { ArtistsComponent } from './artists/artists.component';
import { InfoArtistComponent } from './info-artist/info-artist.component';
import { InfoAlbumComponent } from './info-album/info-album.component';


@NgModule({
  declarations: [
    AppComponent,
    AlbumsComponent,
    NavegadorComponent,
    ArtistsComponent,
    InfoArtistComponent,
    InfoAlbumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
