import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsComponent } from './albums/albums.component';
import { ArtistsComponent } from './artists/artists.component';
import { InfoAlbumComponent } from './info-album/info-album.component';
import { InfoArtistComponent } from './info-artist/info-artist.component';


const routes: Routes = [
  { path: '', redirectTo: 'albums', pathMatch: 'full' },
  { path: 'albums', component: AlbumsComponent },
  { path: 'albums/new', component: InfoAlbumComponent },
  { path: 'albums/view/:albumId', component: InfoAlbumComponent },
  { path: 'albums/edit/:albumId', component: InfoAlbumComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'artists/new', component: InfoArtistComponent },
  { path: 'artists/view/:artistId', component: InfoArtistComponent },
  { path: 'artists/edit/:artistId', component: InfoArtistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
