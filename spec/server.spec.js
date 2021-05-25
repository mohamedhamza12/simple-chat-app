const fetch = require('node-fetch');

//const url = "http://localhost:3000";
const url = "https://nodejs-chat-app-demo.herokuapp.com";

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
            .finally(() => done());
    });

});

describe('get user messages', () => {
    it('should return 200', (done) => {
        fetch(`${url}/messages/mohamed`)
            .then(res => expect(res.status).toBe(200))
            .catch(err => console.log("error: ", err))
            .finally(done);
    });

    it('should get an array of user messages', (done) => {
        fetch(`${url}/messages/Mohamed`)
            .then(res => res.json())
            .then(data => {
                expect(data).toBeInstanceOf(Array);
                expect(data.length).toBeGreaterThan(0);
                for (message of data) {
                    expect(message.sender).toBe('Mohamed');
                }
            })
            .catch(err => console.log("error: ", err))
            .finally(done);
    });
})