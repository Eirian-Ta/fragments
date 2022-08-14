// tests/unit/put.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('Unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('Incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Unmatched content type should return 400
  test('Update fagment with unmatched content type should return 400', async () => {
    const data = 'This is a fragment';
    const postRequest = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user1@email.com', 'password1');
    const testFragment = postRequest.body.fragment;

    const putRequest = await request(app)
      .put(`/v1/fragments/${testFragment.id}`)
      .set('Content-type', 'application/json')
      .send('This is updated data')
      .auth('user1@email.com', 'password1');

    expect(putRequest.statusCode).toBe(400);
  });

  // Invalid fragment should return 404
  test('Update fragment with invalid id should return 404', async () => {
    const res = await request(app)
      .put('/v1/fragments/id')
      .set('Content-type', 'text/plain')
      .send('This is a fragment')
      .auth('user1@email.com', 'password1');
      
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // Using a valid username/password pair should give a success result
  test('Authenticated users can update a plain text fragment', async () => {
    const postRequest = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('This is a fragment');
    const testFragment = postRequest.body.fragment;

    const updatedContent = 'This is updated data';
    const putRequest = await request(app)
    .put(`/v1/fragments/${testFragment.id}`)
    .set('Content-type', 'text/plain')
    .send(updatedContent)
    .auth('user1@email.com', 'password1');
    expect(putRequest.statusCode).toBe(201);

    let getRequest = await request(app)
    .get(`/v1/fragments/${testFragment.id}`)
    .auth('user1@email.com', 'password1');
    expect(getRequest.text).toBe(updatedContent);
  });

});
