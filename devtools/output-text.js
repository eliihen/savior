const renderTuples = values => (
  values.map(({ name, value }) => `${name}: ${value}`).join('\n')
);

const renderTimings = timings =>
`Blocked: ${timings.blocked === -1
  ? 'N/A'
  : `${timings.blocked} ms`}
DNS: ${timings.dns === -1
  ? 'N/A'
  : `${timings.dns} ms`}
Connect: ${timings.connect === -1
  ? 'N/A'
  : `${timings.connect} ms`}
Send: ${timings.send} ms
Wait: ${timings.wait} ms
Recieve: ${timings.receive} ms
SSL/TLS: ${timings.ssl === -1
  ? 'N/A'
  : `${timings.ssl} ms`}`;

export default ({
  request,
  response,
  body,
  serverIPAddress,
  startedDateTime,
  contentType,
  time,
  timings,
}) =>
`Summary
-------
${request.method} ${request.url}
${response.status} ${response.statusText}
Sent: ${startedDateTime}
Time taken: ${time} ms
Remote address: ${serverIPAddress}
Protocol ${request.httpVersion}

Request
-------
Headers: ${request.headersSize / 1000} KB
Body: ${request.bodySize / 1000} KB

Request headers
---------------
${renderTuples(request.headers)}

Request cookies
---------------
${renderTuples(request.cookies)}

Request query
-------------
${renderTuples(request.queryString)}

Response
--------
Headers: ${response.headersSize / 1000} KB
Body: ${response.bodySize / 1000} KB
Content-Type: ${contentType}
${response.redirectURL && `Redirect: ${response.redirectURL}`}

Response headers
----------------
${renderTuples(response.headers)}

Response cookies
----------------
${renderTuples(response.cookies)}

Timings
-------
${renderTimings(timings)}`;
