const request = require('supertest');

const app = require('../../src/app');

describe('test app', () => {
  test('should return HTTP 404 response', () =>
  request(app).get('/notexist').auth('user1@email.com', 'password1').expect(404));
})
