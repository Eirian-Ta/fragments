const request = require('supertest');

const app = require('../../src/app');

describe('GET /doesnt_exist', () => {
  test('unable to find what was requested', () =>
  request(app).get('/notexist').auth('user1@email.com', 'password1').expect(404));
})
