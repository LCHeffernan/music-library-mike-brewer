const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('Update Album', () => {
  let album;
  beforeEach(async () => {
    const { rows } = await db.query('INSERT INTO Albums (name, year) VALUES( $1, $2) RETURNING *', [
      'anything',
      1993,
    ]);

    album = rows[0];
  });

  describe('PATCH /albums/{id}', () => {
    it('updates the album and returns the updated record', async () => {
      const { status, body } = await request(app).patch(`/albums/${album.id}`).send({ name: 'something different', year: 1995 });

      expect(status).to.equal(200);

      expect(body).to.deep.equal({ id: album.id, name: 'something different', year: 1995, artistid: null });
    });

    it('returns a 404 if the artist does not exist', async () => {
      const { status, body } = await request(app).patch('/albums/999999999').send({ name: 'something different', genre: 'rock' });

      expect(status).to.equal(404);
      expect(body.message).to.equal('album 999999999 does not exist');
    });
  });
});
