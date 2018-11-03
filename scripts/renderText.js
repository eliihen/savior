#!/usr/bin/env node

const testFixture = require('./test-request.json');
const renderTemplate = require('../devtools/output-text.js').default;

const output = renderTemplate({
  request: testFixture.request,
  response: testFixture.response,
  serverIPAddress: testFixture.serverIPAddress,
  startedDateTime: testFixture.startedDateTime,
  time: testFixture.time,
  timings: testFixture.timings,
  contentType: 'text/html; charset=utf-8',
  body: `<!DOCTYPE html>
    <html>
    <body>

    <h1 class="amazing">This is heading 1</h1>
    <h2>This is heading 2</h2>
    <h3>This is heading 3</h3>
    <h4>This is heading 4</h4>
    <h5>This is heading 5</h5>
    <h6>This is heading 6</h6>

    </body>
    </html>
  `,
});
console.log(output);
