const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('Read Albums', () => {
  let albums;
  beforeEach(async () => {
    const responses = await Promise.all([
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Impala',
        'rock',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Kylie Minogue',
        'pop',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Antelope',
        'jazz',
      ]),
    ]);

    albums = responses.map(({ rows }) => rows[0]);
  });

  describe('GET /artists', () => {
    it('returns all album records in the database', async () => {
      const { status, body } = await request(app).get('/albums/:id').send();

      expect(status).to.equal(200);
      expect(body.length).to.equal(0);

      body.forEach((albumRecord) => {
        const expected = albums.find((a) => a.id === albumRecord.id);

        expect(albumRecord).to.deep.equal(expected);
      });
    });
  });

  describe('GET /artists/{id}', () => {
    it('returns the album with the correct id', async () => {
      const { status, body } = await request(app).get(`/artists/${albums[0].id}`).send();

      expect(status).to.equal(200);
      expect(body).to.deep.equal(albums[0]);
    });

    it('returns a 404 if the album does not exist', async () => {
      const { status, body } = await request(app).get('/artists/999999999').send();

      expect(status).to.equal(404);
      expect(body.message).to.equal('artist 999999999 does not exist');
    });
  });
});

// describe('GET /albums/:id', () => {
//   it('returns the album with the correct id', async () => {
//     const { status, body } = await request(app).get('/albums/:id').send();

//     expect(status).to.equal(200);
//     expect(body).to.deep.equal();
//   });

//   it('returns a 404 if the album does not exist', async () => {
//     const { status, body } = await request(app).get('/albums/999999999').send();

//     expect(status).to.equal(404);
//     expect(body.message).to.equal('album 999999999 does not exist');
//   });
// });
