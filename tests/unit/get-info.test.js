// tests/unit/get-info.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments/{id}/info', () => {
  let testFragment;
  const fragmentData = 'This is a fragment';
  const fragmentSetup = async () => {
    const postRequest = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send(fragmentData);

      testFragment = postRequest.body.fragment;
  };
  afterEach(async () => {
    if (testFragment) {
      await Fragment.delete(testFragment.ownerId, testFragment.id);
    }
  });

   // If the request is missing the Authorization header, it should be forbidden
   test('unauthenticated requests are denied', async () => {
    await fragmentSetup();
    await request(app)
      .get(`/v1/fragments/${testFragment.id}/info`)
      .expect(401);
  });

   // If the wrong username/password pair are used (no such user), it should be forbidden
   test('incorrect credentials are denied', async () => {
    await fragmentSetup();
    await request(app)
      .get(`/v1/fragments/${testFragment.id}/info`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('get /:id/info request with valid credentials returns 404 when no data found', async () => {
    await fragmentSetup();
    const res = await request(app)
      .get(`/v1/fragments/invalidId/info`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
 
   // Using a valid username/password pair and valid fragment Id should give a success result
   test('get /:id/info request with valid credentials returns fragment with valid fragment Id', async () => {
    await fragmentSetup();
    const res = await request(app)
      .get(`/v1/fragments/${testFragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.fragment).toMatchObject(testFragment);
   });
});
