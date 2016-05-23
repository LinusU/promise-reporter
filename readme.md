# Promise Reporter

Show the progress of multiple promises.

## Installation

```sh
npm install --save promise-reporter
```

## Usage

```js
const Reporter = require('promise-reporter')
const reporter = new Reporter()

reporter.pipe(process.stderr)

reporter.add('Query database', new Promise(/* ... */))
reporter.add('Download S3 file', new Promise(/* ... */))
reporter.add('Start EC2 instance', new Promise(/* ... */))

reporter.end()
```

![Example GIF](/example.gif?raw=true)

## API

### `new Reporter()`

Creates a new reporter, which is a `Readable` stream that you can pipe to e.g.
`process.stderr`.

### `.add(title: string, promise: Promise)`

Adds a promise to the reporter.

### `.end()`

Signal that no more promises will be added. When all the current promises have
settled, the stream will end.
