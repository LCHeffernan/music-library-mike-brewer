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
