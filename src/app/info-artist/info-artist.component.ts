import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

import { Artist } from '../models/artist';
import { ArtistService } from '../service/artist.service';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-info-artist',
  templateUrl: './info-artist.component.html',
  styleUrls: ['./info-artist.component.css']
})
export class InfoArtistComponent implements OnInit {

  action: string;
  artistForm: FormGroup;
  artist: any;
  artistId: string;
  formInitialized: boolean;


  constructor(
    private artistService: ArtistService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formInitialized = false;
    this.action = this.route.url['_value'][1].path;
    this.createForm();
  }

  ngOnInit() {
  }

  changeView(accion) {
    this.router.navigateByUrl('artists/' + accion + '/' + this.artistId);
  }

  createForm() {
    if (this.action == 'new') { // Formulario vacio en caso de nuevo artista
      this.artistForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        photoUrl: new FormControl('', [Validators.required]),
        birthdate: new FormControl('', [Validators.required, this.dateValidator]),
        deathDate: new FormControl('', this.dateValidator),
      });
      this.artist = new Artist(null, null, null, null);
      this.formInitialized = true;

    } else {// Rellenamos el formularo con la informacion del artista, para poder ser visto o editado

      this.artistId = this.route.url[`value`][2].path;
      this.artistService.getArtist(this.artistId)
        .then(res => {
          this.artist = res;
          this.artist._createdAt = this.globalService.convertDate(this.artist._createdAt);
          this.artist._updatedAt = this.globalService.convertDate(this.artist._updatedAt);
          this.artistForm = new FormGroup({
            name: new FormControl({ value: this.artist.name, disabled: this.action === 'view' }, [Validators.required]),
            photoUrl: new FormControl({ value: this.artist.photoUrl, disabled: this.action === 'view' }, [Validators.required]),
            birthdate: new FormControl({ value: this.artist.birthdate, disabled: this.action === 'view' }, [Validators.required, this.dateValidator]),
            deathDate: new FormControl({ value: this.artist.deathDate, disabled: this.action === 'view' }, [this.dateValidator]),
          });
          this.formInitialized = true;
        }).catch(err => {
          this.artist = null;
          console.log('err', err);
        });
    }
  }

  dateValidator(control: FormControl) {
    const minDate = Date.parse('1909-01-01T00:00:00.000Z');
    const maxDate = Date.parse('2030-12-31T00:00:00.000Z');
    if (minDate <= control.value && control.value <= maxDate) {
      return null;
    } else {
      return {
        datevalidator: {
          mindate: minDate,
          maxdate: maxDate
        }
      };
    }
  }

  submitArtist() {
    this.artist = new Artist(
      this.artistForm.value.name,
      this.artistForm.value.photoUrl,
      this.artistForm.value.birthdate,
      this.artistForm.value.deathDate
    );

    this.action === 'new' ? this.handleNewArtist(this.artist) : this.handleEditedArtist(this.artist, this.artistId);
  }

  handleNewArtist(artist: Artist) {
    this.artistService.saveNewArtist(artist)
      .then(res => {
        alert('Artist succesfully saved');
        this.router.navigateByUrl('artists');
      }).catch(err => {
        alert('There was an error while saving the artist. Please, try again.');
      });
  }

  handleEditedArtist(artist: Artist, artistId: string) {
    this.artistService.saveEditedArtist(artist, artistId)
      .then(res => {
        alert('Artist succesfully saved');
        this.router.navigateByUrl('artists');
      }).catch(err => {
        alert('There was an error while editing the artist. Please, try again.');
      });
  }

}
