'use strict'

const path = require('path')
const mockery = require('mockery')

const ChildProcessMock = require('../fixtures/child_process')

describe('Environment', () => {
  let passedArgs
  let passedProcess

  const cpMock = {
    spawn(_process, _args) {
      passedProcess = _process
      passedArgs = _args

      return new ChildProcessMock()
    }
  }

  afterEach(() => {
    mockery.deregisterAll()
    passedArgs = undefined
    passedProcess = undefined
  })

  it('should attempt to lauch the environment script', (done) => {
    mockery.registerMock('child_process', cpMock)
    require('../../lib/environment')().should.be.fulfilled
      .then(() => {
        const expectedScriptPath = path.join(__dirname, '..', '..', 'ps1', 'set-environment.ps1')
        const expectedPsArgs = `& {& '${expectedScriptPath}'}`
        const expectedArgs = ['-NoProfile', '-NoLogo', expectedPsArgs]

        passedProcess.should.equal('powershell.exe')
        passedArgs.should.deep.equal(expectedArgs)
      })
      .should.notify(done)
  })
})
