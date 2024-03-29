// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('Unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('Incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Incorrect content type should return 415
  test('Not supported Content-type should return 415', async () => {
    const postRequest = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'notvalid/type')
      .send('This is a fragment');

    expect(postRequest.statusCode).toBe(415);
    expect(postRequest.body.status).toBe('error');
  });

  // Using a valid username/password pair should give a success result
  test('Authenticated users can create a plain text fragment', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('This is a fragment');

    const fragmentInPostResponse = resPost.body.fragment;
    const newFragment = await Fragment.byId(fragmentInPostResponse.ownerId, fragmentInPostResponse.id);
    console.log(fragmentInPostResponse)
    console.log(newFragment)
    expect(newFragment.ownerId).toBe(fragmentInPostResponse.ownerId);
    expect(newFragment.id).toBe(fragmentInPostResponse.id);
    expect(newFragment.created).toBe(fragmentInPostResponse.created);
    expect(newFragment.updated).toBe(fragmentInPostResponse.updated);
    expect(newFragment.type).toBe('text/plain');
    expect(newFragment.size).toBe(18);
  });
});
