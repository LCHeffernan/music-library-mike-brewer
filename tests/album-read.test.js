const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('GET /albums/:id', () => {
  it('returns the album with the correct id', async () => {
    const { status, body } = await request(app).get('/albums/:id').send();

    expect(status).to.equal(200);
    expect(body).to.deep.equal();
  });

  it('returns a 404 if the artist does not exist', async () => {
    const { status, body } = await request(app).get('/albums/999999999').send();

    expect(status).to.equal(404);
    expect(body.message).to.equal('artist 999999999 does not exist');
  });
});
