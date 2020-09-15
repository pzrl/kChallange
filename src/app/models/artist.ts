export class Artist {

    name: string;
    photoUrl: string;
    birthdate: any; // 1909-01-01T00:00:00.000Z <= year => 2030-12-31T00:00:00.000Z
    deathDate: any; // 1909-01-01T00:00:00.000Z <= year => 2030-12-31T00:00:00.000Z

    constructor(name, photoUrl, birthdate, deathDate) {
        this.name = name;
        this.photoUrl = photoUrl;
        this.birthdate = birthdate;
        this.deathDate = deathDate;
    }

}