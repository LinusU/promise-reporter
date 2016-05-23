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
