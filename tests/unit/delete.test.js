// tests/unit/delete.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('DELETE /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).delete('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
  request(app).delete('/v1/fragments/id').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Delete request with valid credentials returns 404 when no data found
  test('delete/:id request with valid credentials returns 404 when no data found', async () => {
    const res = await request(app).delete('/v1/fragments/id').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // Using a valid username/password pair and valid fragment Id should give a success result
  test('authenticated users can delete valid fragment', async () => {
    const data = 'This is a fragment';
    //create fragment
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user1@email.com', 'password1');
    const fragmentTest = resPost.body.fragment;
    //delete the newly created fragment
    const resDelete = await request(app)
      .delete(`/v1/fragments/${fragmentTest.id}`)
      .auth('user1@email.com', 'password1');
    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body.status).toBe('ok');
    //getting the deleted fragment should be rejected
    await expect(Fragment.byId(fragmentTest.ownerId, fragmentTest.id)).rejects.toThrow();
  });
});
