var bunyan = require('bunyan')
var chai = require('chai')
var sinon = require('sinon')
var sandbox = sinon.createSandbox();
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('bunyan logger', () => {
  it('does not leak env vars', () => {
    sandbox.spy(process.stderr, 'write');

    const logger = bunyan.createLogger({name: 'test'});
    const info = logger.info;

    info('Log message which will output `this` to stderr');

    expect(process.stderr.write).not.to.have.been.calledWithMatch(/env:/);
  });
});
