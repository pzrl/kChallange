import { Component, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { AlbumService } from '../service/album.service';
import { ArtistService } from '../service/artist.service';

@Component({
  selector: 'app-navegador',
  templateUrl: './navegador.component.html',
  styleUrls: ['./navegador.component.css']
})
export class NavegadorComponent implements OnInit {

  url: string;
  linkAlbums: boolean;
  linkArtists: boolean;
  search: string;
  showSearchList: boolean;
  arrTotalArtists;
  arrDisplayArtists;
  arrTotalAlbums;
  arrDisplayAlbums;

  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService,
    private router: Router
  ) {
    this.showSearchList = false;
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.updateNav(event.url);
      }
    });
    this.linkAlbums = true;
    this.linkArtists = false;
    this.getAlbums();
    this.getArtists();
  }

  ngOnInit() {
  }

  getArtists() {
    this.artistService.getAllArtists()
      .then(res => {
        this.arrTotalArtists = res;
      }).catch(err => {
        console.log('err', err);
      });
  }

  getAlbums() {
    this.albumService.getAllAlbums()
      .then(res => {
        this.arrTotalAlbums = res;
      }).catch(err => {
        console.log('err', err);
      });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  updateNav(url: string) {
    this.url = url;
    if (this.url.includes('artists')) {
      this.linkAlbums = false;
      this.linkArtists = true;
      this.search = 'artist';
    } else {
      this.linkAlbums = true;
      this.linkArtists = false;
      this.search = 'album';
    }
    if (this.url === '/artists') {
      this.getArtists();
    } else if (this.url === '/albums') {
      this.getAlbums();
    }
  }

  onFocus() {
    this.showSearchList = true;
    this.arrDisplayArtists = this.arrTotalArtists;
    this.arrDisplayAlbums = this.arrTotalAlbums;
  }

  onBlur() {
    this.showSearchList = false;
  }

  searchItem(text: string) {
    this.url = location.pathname;
    var busqueda = text.toLowerCase();
    if (this.url.includes('artists')) {
      this.arrDisplayArtists = [];
      for (let artist of this.arrTotalArtists) {
        if (artist.name.toLowerCase().includes(busqueda)) {
          this.arrDisplayArtists.push(artist);
        }
      }
    } else {
      this.arrDisplayAlbums = [];
      for (let album of this.arrTotalAlbums) {
        if (album.title.toLowerCase().includes(busqueda)) {
          this.arrDisplayAlbums.push(album);
        }
      }
    }
  }

  selectItem(type: string, id: string) {
    this.router.navigateByUrl(type + '/view/' + id);
    this.showSearchList = false;
  }

}
