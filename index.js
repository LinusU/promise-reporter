'use strict'

const chalk = require('chalk')
const figures = require('figures')
const Readable = require('stream').Readable
const ansiEscapes = require('ansi-escapes')
const cliSpinners = require('cli-spinners')
const removeFromArray = require('remove-from-array')

class PromiseReporter extends Readable {
  constructor (options) {
    super()

    const sp = options && options.spinner
    const defaultSpinner = process.platform === 'win32' ? cliSpinners.line : cliSpinners.dots
    const spinner = (typeof sp === 'object' ? sp : cliSpinners[sp]) || defaultSpinner

    if (!spinner.frames) throw new Error("spinner must define 'frames'")

    this._settled = []
    this._pending = []
    this._running = false
    this._prevLineCount = 0
    this._spinner = (function () {
      let i = 0
      return {
        frame: () => spinner.frames[++i % spinner.frames.length],
        interval: spinner.interval || 50
      }
    }())
    this._allQueued = false
  }

  add (name, promise) {
    if (this._allQueued) {
      throw new Error('Cannot add another promise after .end() has been called')
    }

    let item = { name, promise, status: 'pending' }

    this._pending.push(item)

    const update = (props) => {
      removeFromArray(this._pending, item)
      Object.assign(item, props)
      this._settled.push(item)
    }

    promise.then(
      () => update({ status: 'resolved' }),
      (err) => update({ status: 'rejected', err })
    ).catch(err => {
      this.emit('error', err)
    })

    return promise
  }

  _renderFrame () {
    const frame = this._spinner.frame()

    const settled = this._settled.map(item => {
      if (item.status === 'resolved') {
        return chalk.green(` ${figures.tick} ${item.name}`)
      } else {
        return chalk.red(` ${figures.cross} ${item.name} - ${item.err.message}`)
      }
    })

    const pending = this._pending.map(item => {
      return chalk.cyan(` ${frame} ${item.name}`)
    })

    const separator = (settled.length > 0 && pending.length > 0) ? '\n\n' : ''

    const text = settled.join('\n') + separator + pending.join('\n') + '\n'
    const prevLineCount = this._prevLineCount

    this._prevLineCount = text.split('\n').length

    return (ansiEscapes.eraseLines(prevLineCount) + text)
  }

  _read () {
    if (this._running) return

    this._running = true

    const pushFrame = () => {
      const wantMore = this.push(this._renderFrame())

      if (this._pending.length === 0 && this._allQueued) {
        this.push(null)
      } else if (wantMore) {
        setTimeout(pushFrame, this._spinner.interval)
      } else {
        this._running = false
      }
    }

    pushFrame()
  }

  end () {
    this._allQueued = true
  }
}

module.exports = PromiseReporter
