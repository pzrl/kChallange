import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Artist } from '../models/artist';

@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:3000/';
    }

    deleteArtist(artistId: string) {
        return this.http.delete(this.baseUrl + 'artist/' + artistId).toPromise();
    }

    getAllArtists() {
        return this.http.get(this.baseUrl + 'artists/all').toPromise();
    }

    getArtist(artistId: string) {
        return this.http.get(this.baseUrl + 'artist/' + artistId).toPromise();
    }

    saveEditedArtist(editedArtist: Artist, artistId: string) {
        return this.http.put(this.baseUrl + 'artist/' + artistId, editedArtist).toPromise();
    }

    saveMultipleArtists(arrArtists: []) {
        return this.http.post(this.baseUrl + 'artists', arrArtists).toPromise();
    }

    saveNewArtist(newArtist: Artist) {
        return this.http.post(this.baseUrl + 'artist', newArtist).toPromise();
    }
}