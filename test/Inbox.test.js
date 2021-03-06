// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!'

beforeEach(async ()=>{ 
    // get a list of all accounts 
    accounts = await web3.eth.getAccounts();        

    // use one of those accounts to deploy the contract
    // need the contract bytecode
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        // this is constructing the contract object
        .deploy({ 
            data: bytecode, 
            arguments: [INITIAL_STRING]})
        // deploying is happening here
        .send({ from: accounts[0], gas: '1000000'});
});


describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});