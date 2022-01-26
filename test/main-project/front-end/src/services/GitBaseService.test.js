/**
 * this test suite will test both the front end services and the backend api
 */
const app = require('../../../../../main-project/app');
const supertest = require('supertest');
const request = supertest(app);
const fetch = require('jest-fetch-mock');
import { getUserList, getUserByName, getRepoList } from '../../../../../main-project/front-end/src/services/GitBaseService';

/**
 * here we have some simple mock data to test against
 */


describe('full test suite', () => {
    /**
     * these tests test the backend by spinning up an instance
     * of the node server and hitting the gitbase/ (GET) endpoint
     * from there we mock the response that the front end service will expect
     * and test the result
     */
    test('testing getUserList response type', async () => {
        const backEndResponse = await request.get('/gitbase');
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(backEndResponse)
        });

        const frontEndResponse = await getUserList();
        const frontEndResponseJson = await frontEndResponse.json();

        let propsValid = true;
        
        for (const user of JSON.parse(frontEndResponseJson.text)) {
            propsValid = 'id' in user && 'username' in user && 'avatar' in user && 'url' in user && 'reposUrl' in user;
        }

        expect(typeof frontEndResponseJson).toBe('object');
        expect(propsValid).toBe(true);
    });

    /**
     * these tests test the backend by spinning up an instance
     * of the node server and hitting the gitbase/:username (GET) endpoint
     * from there we mock the response that the front end service will expect
     * and test the result
     */
    test('testing getUserByName', async () => {
        const backEndResponse = await request.get('/gitbase/test');
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(backEndResponse)
        });

        const frontEndResponse = await getUserList();
        const frontEndResponseJson = await frontEndResponse.json();

        expect(typeof frontEndResponseJson).toBe('object');
        expect(frontEndResponseJson.text).toBe('[{"id":383316,"username":"test","name":"anonymous","avatar":"https://avatars.githubusercontent.com/u/383316?v=4",' +
        '"url":"https://github.com/test","reposUrl":"aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy90ZXN0L3JlcG9z"},{"id":550,"username":"test","name":"test",' + 
        '"avatar":"https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=80&d=identicon","url":"https://gitlab.com/test",' + 
        '"reposUrl":"aHR0cHM6Ly9naXRsYWIuY29tL2FwaS92NC91c2Vycy81NTAvcHJvamVjdHM="}]');
    });

    /**
     * these tests test the backend by spinning up an instance
     * of the node server and hitting the gitbase/repos/:repos_url (GET) endpoint
     * from there we mock the response that the front end service will expect
     * and test the result
     */
    test('testing getReposList', async () => {
        const backEndResponse = await request.get('/gitbase/repos/aHR0cHM6Ly9naXRsYWIuY29tL2FwaS92NC91c2Vycy8xMDcyNzIxNC9wcm9qZWN0cw==');
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(backEndResponse)
        });

        const frontEndResponse = await getUserList();
        const frontEndResponseJson = await frontEndResponse.json();

        expect(typeof frontEndResponseJson).toBe('object');
        expect(frontEndResponseJson.text).toBe('[{"name":"ReeceGibbs/test2","description":"","forks":0,"created":"2022-01-25T21:36:17.956Z","updated":"2022-01-25T21:36:17.956Z",' + 
        '"url":"https://gitlab.com/ReeceGibbs/test2","commits":[{"author":{"name":"Reece Gibbs","date":"2022-01-25T21:36:18.000+00:00"},"message":"Initial commit"}]},' + 
        '{"name":"ReeceGibbs/test","description":"","forks":0,"created":"2022-01-25T19:18:56.192Z","updated":"2022-01-25T19:18:56.192Z","url":"https://gitlab.com/ReeceGibbs/test",' + 
        '"commits":[{"author":{"name":"Reece Gibbs","date":"2022-01-25T19:18:56.000+00:00"},"message":"Initial commit"}]}]');
    });
});