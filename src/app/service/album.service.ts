import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Album } from '../models/album';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:3000/';
    }

    deleteAlbum(albumId: string) {
        return this.http.delete(this.baseUrl + 'album/' + albumId).toPromise();
    }

    getAlbum(albumId: string) {
        return this.http.get(this.baseUrl + 'album/' + albumId).toPromise();
    }

    getAllAlbums() {
        return this.http.get(this.baseUrl + 'albums/all').toPromise();
    }

    saveEditedAlbum(editedAlbum: Album, albumId: string) {
        return this.http.put(this.baseUrl + 'album/' + albumId, editedAlbum).toPromise();
    }

    saveMultipleAlbums(arrAlbums: []) {
        return this.http.post(this.baseUrl + 'albums', arrAlbums).toPromise();
    }

    saveNewAlbum(newAlbum: Album) {
        return this.http.post(this.baseUrl + 'album', newAlbum).toPromise();
    }


}