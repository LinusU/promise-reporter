const Reporter = require('./')
const reporter = new Reporter()

reporter.add('Query database', new Promise(resolve => setTimeout(resolve, 4000)))
reporter.add('Download S3 file', new Promise((resolve, reject) => setTimeout(reject, 2200, new Error('Network error'))))
reporter.add('Start EC2 instance', new Promise(resolve => setTimeout(resolve, 400)))

reporter.pipe(process.stderr)
