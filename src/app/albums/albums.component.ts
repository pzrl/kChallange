import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { Album } from '../models/album';
import { AlbumService } from '../service/album.service';
import { ArtistService } from '../service/artist.service';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  url: string;
  pageSelected: number;
  arrNumPages;
  arrArtist;

  arrTotalAlbums;
  arrFiveAlbums;
  arrBulkLoad;
  data;

  constructor(
    private router: Router,
    private albumService: AlbumService,
    private artistService: ArtistService,
    private globalService: GlobalService
  ) {
    this.pageSelected = 1;
    this.url = location.pathname;
    this.data = undefined;
    this.albumService.getAllAlbums()
      .then(res => {
        this.arrTotalAlbums = res;
        this.arrFiveAlbums = this.arrTotalAlbums.slice(0, 5);
        var numPages = Math.ceil(this.arrTotalAlbums.length / 5);
        this.arrNumPages = [];
        for (let i = 0; i < numPages; i++) {
          this.arrNumPages.push(i);
        }
        // Una vez tenemos los albums, cogemos los artistas y añadimos el nombre de cada artista a sus correspondioentes albums, en base a su id
        this.getArtists();
      }).catch(err => {
        this.arrTotalAlbums = null;
      });
  }

  ngOnInit() {
  }

  getArtists() {
    this.artistService.getAllArtists()
      .then(res => {
        this.arrArtist = res;
        for (let album of this.arrTotalAlbums) {
          for (let artist of this.arrArtist) {
            if (album.artistId === artist['_id']) {
              album.artistName = artist['name'];
            }
          }
        }
      }).catch(err => {
        console.log('Err', err);
      });
  }

  newAlbum() {
    this.router.navigateByUrl('albums/new');
  }

  onChangeFile(evt) {
    // Cargamos el archivo excel
    const target: DataTransfer = <DataTransfer>(evt.target);
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsBinaryString(target.files[0]);
  }

  newAlbums() {
    // Convertimos la info del excel al formato necesitado
    this.data.shift();
    this.arrBulkLoad = [];

    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].length >= 4) {
        this.arrBulkLoad.push(new Album('', '', '', '', ''));
        for (let j = 0; j < this.data[i].length; j++) {
          if (j === 0) this.arrBulkLoad[i].title = this.data[i][j];
          if (j === 1) {
            for (let artist of this.arrArtist) {
              if (artist.name === this.data[i][j]) this.arrBulkLoad[i].artistId = artist._id;
            }
          }
          if (j === 2) this.arrBulkLoad[i].coverUrl = this.data[i][j];
          if (j === 3) this.arrBulkLoad[i].year = this.data[i][j];
          if (j === 4) this.arrBulkLoad[i].genre = this.data[i][j];
        }
      }
    }

    // Enviamos la informacion a guardar
    this.data = undefined;
    this.albumService.saveMultipleAlbums(this.arrBulkLoad)
      .then(res => {
        alert('Albums successfully saved.')
        this.router.navigateByUrl('artists', { skipLocationChange: true }).then(() =>
          this.router.navigate([this.url]));
      }).catch(err => {
        alert('There was an error saving the albums. Please, try again. Be sure that all the excel fields are correctly written.');
      })
  }

  viewAlbum(albumId: string) {
    this.router.navigateByUrl('albums/view/' + albumId);
  }

  editAlbum(albumId: string) {
    this.router.navigateByUrl('albums/edit/' + albumId);
  }

  deleteAlbum(albumId: string) {
    this.albumService.deleteAlbum(albumId)
      .then(res => {
        alert('Album succsesfully deleted.');
        this.router.navigateByUrl('artists', { skipLocationChange: true }).then(() =>
          this.router.navigate([this.url]));
      }).catch(err => {
        alert('There was an error deleting album. Please, try again.');
      });
  }

  changePage(numPage) {
    this.arrFiveAlbums = this.arrTotalAlbums.slice((numPage * 5 - 5), (numPage * 5));
    this.pageSelected = numPage;
  }

  orderUp(key) {
    if (key === 'year') {
      this.arrTotalAlbums.sort((a, b) => a[key] - b[key]);
    } else {
      this.arrTotalAlbums.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      });
    }
    this.arrFiveAlbums = this.arrTotalAlbums.slice((this.pageSelected * 5 - 5), (this.pageSelected * 5));
  }

  orderDown(key) {
    if (key === 'year') {
      this.arrTotalAlbums.sort((a, b) => b[key] - a[key]);
    } else {
      this.arrTotalAlbums.sort((a, b) => {
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
        return 0;
      });
    }
    this.arrFiveAlbums = this.arrTotalAlbums.slice((this.pageSelected * 5 - 5), (this.pageSelected * 5));
  }

}
