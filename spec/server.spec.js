const fetch = require('node-fetch');

const url = "http://localhost:3004";

describe('get messages', () => {
    it('should return 200', (done) => {
        fetch(`${url}/messages`)
            .then(res => {
                expect(res.status).toBe(200);
            })
            .catch(err => console.log("error: ", err))
            .finally(() => done())
    });

    it('should return messages list', (done) => {
        fetch(`${url}/messages`)
            .then(res => res.json())
            .then(data => {
                expect(data).toBeInstanceOf(Array);
            })
            .catch(err => console.log("error: ", err))
            .finally(() => done())
    });

})