import app from './app';
import request from 'supertest';

describe('testing express routes', () => {
    it('GET /test', async () => {
        expect.assertions(1);

        let { body } = await request(app()).get('/test');

        expect(body).toEqual({ test: 'hello' })
    })
})