import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { Artist } from '../models/artist';
import { AlbumService } from '../service/album.service';
import { ArtistService } from '../service/artist.service';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {

  url: string;
  arrNumPages;
  pageSelected;

  arrTotalAlbums;
  arrTotalArtists;
  arrFiveArtists;

  arrBulkLoad;
  data;
  contAlbumsDeleted;
  contAlbumsDeletedFailed;


  constructor(
    private router: Router,
    private albumService: AlbumService,
    private artistService: ArtistService,
    private globalService: GlobalService
  ) {
    this.url = location.pathname;
    this.data = undefined;
    this.pageSelected = 1;
    this.artistService.getAllArtists()
      .then(res => {
        this.arrTotalArtists = res;
        for (let artist of this.arrTotalArtists) {
          artist.displayBirthdate = this.globalService.convertDate(artist.birthdate);
          if (artist.deathDate != null) {
            artist.displayDeathDate = this.globalService.convertDate(artist.deathDate);
          }
        }
        this.arrFiveArtists = this.arrTotalArtists.slice(0, 5);
        var numPages = Math.ceil(this.arrTotalArtists.length / 5);
        this.arrNumPages = [];
        for (let i = 0; i < numPages; i++) {
          this.arrNumPages.push(i);
        }
      }).catch(err => {
        this.arrTotalArtists = null;
      });
    this.albumService.getAllAlbums()
      .then(res => {
        this.arrTotalAlbums = res;
      })
  }


  ngOnInit() {
  }

  newArtist() {
    this.router.navigateByUrl('artists/new');
  }

  onChangeFile(evt) {
    // Cargamos el excel con los nuevos artistas
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

  newArtists() {
    // Convertimos la información del excel al formato necesitado
    this.data.shift();
    this.arrBulkLoad = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].length >= 3) {
        this.arrBulkLoad.push(new Artist('', '', '', ''));
        for (let j = 0; j < this.data[i].length; j++) {
          if (j === 0) this.arrBulkLoad[i].name = this.data[i][j];
          if (j === 1) this.arrBulkLoad[i].photoUrl = this.data[i][j];
          if (j === 2) this.arrBulkLoad[i].birthdate = this.convertExcelDate(this.data[i][j]);
          if (j === 3) this.arrBulkLoad[i].deathDate = this.convertExcelDate(this.data[i][j]);
        }
      }
    }

    // Enviamos la información a guardar
    this.data = undefined;
    this.artistService.saveMultipleArtists(this.arrBulkLoad)
      .then(res => {
        alert('Artists successfully saved.');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate([this.url]));
      }).catch(err => {
        alert('There was an error saving the artists. Please, try again. Be sure that all the excel fields are correctly written.');
      });
  }

  convertExcelDate(excelDate) {
    const exdate = excelDate;
    const e0date = new Date(0);
    const offset = e0date.getTime();
    const convertedDate = new Date(0, 0, exdate - 1, 0, -offset, 0);
    return convertedDate;
  }

  viewArtist(artistId) {
    this.router.navigateByUrl('artists/view/' + artistId);
  }

  editArtist(artistId) {
    this.router.navigateByUrl('artists/edit/' + artistId);
  }

  deleteArtist(artistId) {
    var r = confirm("Are you sure you want to delete this artist?\n All albums by this artist will be deleted.");
    if (r == true) {

      // Borramos los albums del artista
      this.contAlbumsDeleted = 0;
      this.contAlbumsDeletedFailed = 0;

      for (let album of this.arrTotalAlbums) {
        if (album.artistId === artistId) {
          this.albumService.deleteAlbum(album._id)
            .then(res => {
              this.contAlbumsDeleted++;
            }).catch(err => {
              this.contAlbumsDeletedFailed++;
            })
        }
      }
      // Borramos al artista
      this.artistService.deleteArtist(artistId)
        .then(res => {
          if (this.contAlbumsDeletedFailed > 0) alert("There was a mistake when delting " + this.contAlbumsDeletedFailed + " albums.");
          alert("Artist successfully deleted.\n We've also deleted " + this.contAlbumsDeleted + " albums.");
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate([this.url]));
        }).catch(err => {
          alert('There was an error deleting artist. Please, try again.');
        });
    }
  }

  orderUp(key) {
    if (key === 'name') {
      this.arrTotalArtists.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      });
    } else {
      this.arrTotalArtists.sort((a, b) => {
        // A los artistas que no han fallecifo les asignamos una fecha muy lejana para poder ordenar a todos por fecha de muerte
        if (a[key] === undefined || a[key] == null) a[key] = '2100-01-01T00:00:00.000Z';
        if (b[key] === undefined || b[key] == null) b[key] = '2100-01-01T00:00:00.000Z';

        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();

        return dateB - dateA;
      });
    }
    this.arrFiveArtists = this.arrTotalArtists.slice((this.pageSelected * 5 - 5), (this.pageSelected * 5));
  }

  orderDown(key) {
    if (key === 'name') {
      this.arrTotalArtists.sort((a, b) => {
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
        return 0;
      });
    } else {
      this.arrTotalArtists.sort((a, b) => {
        // A los artistas que no han fallecifo les asignamos una fecha muy lejana para poder ordenar a todos por fecha de muerte
        if (a[key] === undefined || a[key] == null) a[key] = '2100-01-01T00:00:00.000Z';
        if (b[key] === undefined || b[key] == null) b[key] = '2100-01-01T00:00:00.000Z';

        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();

        return dateA - dateB;
      });
    }
    this.arrFiveArtists = this.arrTotalArtists.slice((this.pageSelected * 5 - 5), (this.pageSelected * 5));
  }

  changePage(numPage) {
    this.arrFiveArtists = this.arrTotalArtists.slice((numPage * 5 - 5), (numPage * 5));
    this.pageSelected = numPage;
  }

}
