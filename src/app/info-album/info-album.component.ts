import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Album } from '../models/album';
import { AlbumService } from '../service/album.service';
import { ArtistService } from '../service/artist.service';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-info-album',
  templateUrl: './info-album.component.html',
  styleUrls: ['./info-album.component.css']
})
export class InfoAlbumComponent implements OnInit {

  action: string;
  albumForm: FormGroup;
  album: any;
  arrArtist;
  arrDisplayArtists: any;
  albumId: string;
  showSearchList: boolean;
  showArtistAlert: boolean;
  formInitialized: boolean;

  constructor(
    private albumService: AlbumService,
    private artistService: ArtistService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formInitialized = false;
    this.action = this.route.url['_value'][1].path;
    this.showSearchList = false;
    this.showArtistAlert = false;

    this.getArtists();
  }

  ngOnInit() {
  }

  initForm() {
    this.albumForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      artistId: new FormControl('', [Validators.required]),
      artistName: new FormControl('', [Validators.required]),
      coverUrl: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required, this.yearValidator]),
      genre: new FormControl('', [Validators.required]),
    });
    this.formInitialized = true;
  }

  fillForm() {
    this.albumForm = new FormGroup({
      title: new FormControl({ value: this.album.title, disabled: this.action === 'view' }, [Validators.required]),
      artistId: new FormControl({ value: this.album.artistId, disabled: this.action === 'view' }, [Validators.required]),
      artistName: new FormControl({ value: '', disabled: this.action === 'view' }, [Validators.required]),
      coverUrl: new FormControl({ value: this.album.coverUrl, disabled: this.action === 'view' }, [Validators.required]),
      year: new FormControl({ value: this.album.year, disabled: this.action === 'view' }, [Validators.required, this.yearValidator]),
      genre: new FormControl({ value: this.album.genre, disabled: this.action === 'view' }),
    });
    for (let artist of this.arrArtist) {
      if (artist._id === this.albumForm.value.artistId) this.albumForm.patchValue({ artistName: artist.name });
    }
    this.formInitialized = true;
  }

  getArtists() {
    this.artistService.getAllArtists()
      .then(res => {
        this.arrArtist = res;

        if (this.action === 'new') { // En caso de guardar un nuevo album iniciamos el formulario vacio
          this.initForm();
          this.album = new Album(null, null, null, null, null);

        } else { // En caso de ver o editar un album ya guardado, iniciamos el formulario una vez hemos recibido la informacion requerida (album + artista)

          this.albumId = this.route.url['value'][2].path;
          this.albumService.getAlbum(this.albumId)
            .then(res => {
              this.album = res;
              this.album._createdAt = this.globalService.convertDate(this.album._createdAt);
              this.album._updatedAt = this.globalService.convertDate(this.album._updatedAt);
              console.log('Antes de llamar al fill', this.album.title)
              this.fillForm();
            }).catch(err => {
              console.log('err', err);
            });
        }

      }).catch(err => {
        this.album = null;
        console.log('err', err)
      })
  }

  yearValidator(control: FormControl) {
    const minYear = 1909;
    const maxYear = 2030;
    if (minYear <= control.value && control.value <= maxYear) {
      return null;
    } else {
      return {
        yearvalidator: {
          minyear: minYear,
          maxyear: maxYear
        }
      };
    }
  }

  changeView(accion) {
    this.router.navigateByUrl('albums/' + accion + '/' + this.albumId);
  }

  onFocus() {
    this.showSearchList = true;
    this.arrDisplayArtists = this.arrArtist;
  }

  onBlur() {
    this.showSearchList = false;
  }

  searchArtist(search: string) {
    // Buscamos entre los artistas disponibles para asignarselo al album (no puede guardarse un album si el artista no se ha guardado previamente)

    this.arrDisplayArtists = [];
    search = search.toLowerCase();
    var artistMatchs = 0;
    for (let artist of this.arrArtist) {
      if (artist.name.toLowerCase().includes(search)) {
        this.arrDisplayArtists.push(artist);
      }
      if (artist.name.toLowerCase() === search) artistMatchs++;
    }
    artistMatchs > 0 ? this.showArtistAlert = false : this.showArtistAlert = true;
  }

  selectArtist(artistId: string, artistName: string) {
    // Se asigna el artistId al album, y el artist name al formulario para que se visualice correctamente

    this.albumForm.patchValue({
      'artistId': artistId,
      'artistName': artistName
    });
    this.showSearchList = false;
  }

  submitAlbum() {

    this.album = new Album(
      this.albumForm.value.title,
      this.albumForm.value.artistId,
      this.albumForm.value.coverUrl,
      this.albumForm.value.year,
      this.albumForm.value.genre
    );

    this.action === 'new' ? this.handleNewAlbum(this.album) : this.handleEditedAlbum(this.album, this.albumId);
  }

  handleNewAlbum(album: Album) {
    this.albumService.saveNewAlbum(album)
      .then(res => {
        alert('Album succesfully saved');
        this.router.navigateByUrl('albums');
      }).catch(err => {
        alert('There was an error while saving the album. Please, try again.');
      });
  }

  handleEditedAlbum(album: Album, albumId: string) {
    this.albumService.saveEditedAlbum(album, albumId)
      .then(res => {
        alert('Album succesfully modified');
        this.router.navigateByUrl('albums');
      }).catch(err => {
        alert('There was an error while editing the album. Please, try again.');
      });
  }

}
