export class Album {

    title: string;
    artistId: string;
    coverUrl: string;
    year: number; // 1909 <= year => 2030
    genre: string;

    constructor(title, artistId, coverUrl, year, genre) {
        this.title = title;
        this.artistId = artistId;
        this.coverUrl = coverUrl;
        this.year = year;
        this.genre = genre;
    }

}