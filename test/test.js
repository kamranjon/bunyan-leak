var bunyan = require('bunyan')
var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('bunyan logger', () => {
  var sandbox = sinon.createSandbox();
  
  beforeEach(() => {
    sandbox.spy(process.stderr, 'write');
  })

  afterEach(() => {
    process.stderr.write.restore();
  })

  it('does leak env vars', () => {    
    const logger = bunyan.createLogger({name: 'test'});
    const info = logger.info;

    info('Log message which will output `this` to stderr');

    expect(process.stderr.write).to.have.been.calledWithMatch(/env:/);
  });
  it('does not leak env vars if we bind early', () => {
    const logger = bunyan.createLogger({name: 'test'});
    logger.info.bind({reason: 'prevent-leak'})('Log once with a safe `this` value which prevents future output');
    const info = logger.info;

    info('Log message which will output `this` to stderr');

    expect(process.stderr.write).not.to.have.been.calledWithMatch(/env:/);
  })
});
