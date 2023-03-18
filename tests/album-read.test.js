const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('Read Albums', () => {
  let albums;
  beforeEach(async () => {
    const {
      rows: [artist],
    } = await db.query(
      'INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *',
      ['Metallica', 'Rock'],
    );
    const responses = await Promise.all([
      db.query(
        'INSERT INTO Albums (name, year, artistId) VALUES( $1, $2, $3) RETURNING *',
        ['The Black Album', 1991, artist.id],
      ),
      db.query(
        'INSERT INTO Albums (name, year, artistId) VALUES( $1, $2, $3) RETURNING *',
        ['Let Go', 2002, artist.id],
      ),
      db.query(
        'INSERT INTO Albums (name, year, artistId) VALUES( $1, $2, $3) RETURNING *',
        ['Riot', 2007, artist.id],
      ),
    ]);
    albums = responses.map(({ rows }) => rows[0]);
  });

  describe('GET /albums', () => {
    it('returns all albums records in the database', async () => {
      const { status, body } = await request(app).get('/albums').send();

      expect(status).to.equal(200);
      expect(body.length).to.equal(3);

      body.forEach((albumRecord) => {
        const expected = albums.find((a) => a.id === albumRecord.id);

        expect(albumRecord).to.deep.equal(expected);
      });
    });
  });

  describe('GET /albums/{id}', () => {
    it('returns the album with the correct id', async () => {
      const { status, body } = await request(app)
        .get(`/albums/${albums[0].id}`)
        .send();

      expect(status).to.equal(200);
      expect(body).to.deep.equal(albums[0]);
    });

    it('returns a 404 if the album does not exist', async () => {
      const { status, body } = await request(app)
        .get('/albums/999999999')
        .send();

      expect(status).to.equal(404);
      expect(body.message).to.equal('The album ID: 999999999 does not exist');
    });
  });
});



// describe('Read Albums', () => {
//   let albums;
//   beforeEach(async () => {
//     const responses = await Promise.all([
//       db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
//         'Tame Impala',
//         'rock',
//       ]),
//       db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
//         'Kylie Minogue',
//         'pop',
//       ]),
//       db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
//         'Tame Antelope',
//         'jazz',
//       ]),
//     ]);

//     albums = responses.map(({ rows }) => rows[0]);
//   });
// describe('Read Albums', () => {
//   let artists;
//   let album;
//   beforeEach(async () => {
//     let artistData;
//     let albumData;

//     artistData = await Promise.all([
//       db.query(
//         'INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *',
//         ['The Smiths', 'Indie'],
//       ),
//     ]);
//     artists = artistData.map(({ rows }) => rows[0]);
//     const artistId = artists[0].id;

//     albumData = await Promise.all([
//       db.query(
//         'INSERT INTO Albums (name, year, artistId) VALUES ($1, $2, $3) RETURNING *',
//         ['Riot', 2008, artistId],
//       ),
//       db.query(
//         'INSERT INTO Albums (name, year, artistId) VALUES ($1, $2, $3) RETURNING *',
//         ['The Queen Is Dead', 1989, artistId],
//       ),
//       db.query(
//         'INSERT INTO Albums (name, year, artistId) VALUES ($1, $2, $3) RETURNING *',
//         ['Louder Than Bombs', 1990, artistId],
//       ),
//     ]);

//     album = albumData.map(({ rows }) => rows[0]);
//   });

//   describe('GET /artists', () => {
//     it('returns all album records in the database', async () => {
//       const { status, body } = await request(app).get('/albums/:id').send();

//       expect(status).to.equal(200);
//       expect(body.length).to.equal(3);

//       body.forEach((albumRecord) => {
//         const expected = album.find((a) => a.id === albumRecord.id);

//         expect(albumRecord).to.deep.equal(expected);
//       });
//     });
//   });

//   describe('GET /albums', () => {
//     it('returns all album records in the database', async () => {
//       const { status, body } = await request(app).get('/albums/:id').send();

//       expect(status).to.equal(200);
//       expect(body.length).to.equal(3);

//       body.forEach((albumRecord) => {
//         const expected = album.find((a) => a.id === albumRecord.id);

//         expect(albumRecord).to.deep.equal(expected);
//       });
//     });
//   });

//   describe('GET /albums/{id}', () => {
//     it('returns the album with the correct id', async () => {
//       const { status, body } = await request(app).get(`/albums/${album[0].id}`).send();

//       expect(status).to.equal(200);
//       expect(body).to.deep.equal(album[0]);
//     });
//     it('returns a 404 if the album does not exist', async () => {
//       const { status } = await request(app).get('/albums/999999999').send();

//       expect(status).to.equal(404);
//     });
//   });
// });

//   describe('GET /albums/{id}', () => {
//     it('returns the album with the correct id', async () => {
//       const { status, body } = await request(app).get(`/albums/${album[0].id}`).send();

//       expect(status).to.equal(200);
//       expect(body).to.deep.equal(albumData);
//     });

//     it('returns a 404 if the album does not exist', async () => {
//       const { status, body } = await request(app).get('/artists/999999999').send();

//       expect(status).to.equal(404);
//       expect(body.message).to.equal('artist 999999999 does not exist');
//     });
//   });
// });
