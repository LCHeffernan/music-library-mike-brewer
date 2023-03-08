const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('create album', () => {
  describe('/artists/{id}/albums', () => {
    let artists;
    beforeEach(async () => {
      const responses = await Promise.all([
        db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
          'Kylie Minogue',
          'pop',
        ]),
      ]);

      artists = responses.map(({ rows }) => rows[0]);
      console.log(artists);
    });

    describe('POST', () => {
      it('creates a new album in the database', async () => {
        console.log(artists[0].id);
        const { status, body } = await request(app).post(`/artists/${artists[0].id}/albums`).send({
          name: 'Disco',
          year: 2020,
        });
        expect(status).to.equal(201);
        expect(body.name).to.equal('Disco');
        expect(body.year).to.equal(2020);

        const {
          rows: [artistData],
        } = await db.query(`SELECT * FROM Albums WHERE id = ${body.id}`);
        expect(artistData.name).to.equal('Disco');
        expect(artistData.year).to.equal(2020);
      });
    });
  });
});
