import styles from './output-styles.js';

const escape = string => string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mood = status => {
  if (status >= 200 && status < 300) return 'green,happy';
  if (status >= 500 && status < 600) return 'red';
  return 'gray';
}

const className = status => {
  if (status >= 200 && status < 300) return 'ok';
  if (status >= 500 && status < 600) return 'failed';
  return 'other';
}

const Headers = headers => `
<details>
  <summary>
    <h3 class="ui sub header">Headers</h3>
  </summary>
  <table class="ui celled table">
    <thead>
      <tr>
        <th>Header</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      ${headers.map(({ name, value }) => `
        <tr>
          <td>${name}</td>
          <td>${value}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</details>`;

const Cookies = cookies => `
<details>
  <summary>
    <h3 class="ui sub header">Cookies</h3>
  </summary>
  <table class="ui celled table">
    <thead>
      <tr>
        <th>Cookie</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      ${cookies.map(({ name, value }) => `
        <tr>
          <td>${name}</td>
          <td>${value}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</details>`;

const Query = parameters => `
<details>
  <summary>
    <h3 class="ui sub header">Query parameters</h3>
  </summary>
  <table class="ui celled table">
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      ${parameters.map(({ name, value }) => `
        <tr>
          <td>${name}</td>
          <td>${value}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</details>`;

const Timings = timings => `
<details>
  <summary>
    <h3 class="ui sub header">Timings</h3>
  </summary>
  <table class="ui celled table">
    <thead>
      <tr>
        <th>Phase</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Blocked</td>
        <td>
          ${timings.blocked === -1
            ? 'N/A'
            : `${timings.blocked} ms`
          }
        </td>
      </tr>
      <tr>
        <td>DNS</td>
        <td>
          ${timings.dns === -1
            ? 'N/A'
            : `${timings.dns} ms`
          }
        </td>
      </tr>
      <tr>
        <td>Connect</td>
        <td>
          ${timings.connect === -1
            ? 'N/A'
            : `${timings.connect} ms`
          }
        </td>
      </tr>
      <tr>
        <td>Send</td>
        <td>${timings.send} ms</td>
      </tr>
      <tr>
        <td>Wait</td>
        <td>${timings.wait} ms</td>
      </tr>
      <tr>
        <td>Recieve</td>
        <td>${timings.receive} ms</td>
      </tr>
      <tr>
        <td>SSL/TLS</td>
        <td>
          ${timings.ssl === -1
            ? 'N/A'
            : `${timings.ssl} ms`
          }
        </td>
      </tr>
    </tbody>
  </table>
</details>`;

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
  `<!DOCTYPE html>
  <!--
    Generated with the Savior extension
    https://github.com/esphen/savior
  -->
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" integrity="sha256-9mbkOfVho3ZPXfM7W8sV2SndrGDuh7wuyLjtsWeTI1Q=" crossorigin="anonymous" />
      <title>Request preview</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="ui container">
          <div class="ui fluid card summary">
            <div class="image">
              <img
                src="https://source.unsplash.com/random?${mood(response.status)}"
                importance="high"
                crossorigin="anonymous"
              />
            </div>
            <div class="content">
              <div class="header">
                <h1>Summary</h1>
              </div>
              <p class="status ${className(response.status)}">
                ${response.status} ${response.statusText}
              </p>
              <table class="ui celled definition table">
                <tbody>
                  <tr>
                    <td class="collapsing">Request URL</td>
                    <td>${request.url}</td>
                  </tr>
                  <tr>
                    <td class="single line">Request method</td>
                    <td>${request.method}</td>
                  </tr>
                  <tr>
                    <td class="single line">Response content type</td>
                    <td>${contentType}</td>
                  </tr>
                  <tr>
                    <td>Sent</td>
                    <td>
                      <time
                        id="startedTime"
                        datetime="${startedDateTime}"
                        title="${startedDateTime}"
                      >
                        ${startedDateTime}
                      </time>
                    </td>
                  </tr>
                  <tr>
                    <td>Time</td>
                    <td>${time} ms</td>
                  </tr>
                  <tr>
                    <td>Remote address</td>
                    <td>${serverIPAddress}</td>
                  </tr>
                  <tr>
                    <td>Protocol</td>
                    <td>${request.httpVersion}</td>
                  </tr>
                </tbody>
              </table>

              <div class="header">
                <h2 class="ui header">
                  Request
                </h2>
              </div>
              <p class="meta">
                Headers: ${request.headersSize / 1000} KB
                Body: ${request.bodySize / 1000} KB,
              </p>

              ${Headers(request.headers)}
              ${Cookies(request.cookies)}
              ${Query(request.queryString)}
            </div>
          </div>

          <div class="ui fluid card response">
            <div class="content">
              <div class="header">
                <h2 class="ui header">Response</h2>
              </div>
              <p class="meta">
                Headers: ${response.headersSize / 1000} KB
                Body: ${response.bodySize / 1000} KB,
              </p>
              ${response.redirectURL && `
                <p>Redirect: ${response.redirectURL}</p>
              `}
              ${Headers(response.headers)}
              ${Cookies(response.cookies)}
              ${Timings(timings)}
              <details open>
                <summary>
                  <h3 class="ui sub header">Response</h3>
                </summary>
                <h4>Response payload</h4>
                <pre>
                  ${escape(body)}
                </pre>
                ${contentType.includes('html') && `
                  <h4>Preview</h4>
                  <iframe
                    sandbox=""
                    srcdoc="${body.replace(/"/g, '&quot;')}"
                    importance="low"
                    title="Response preview"
                  ></iframe>
                ` || ''}
              </details>
            </div>
        </div>
      </div>

      <script>
        /* Runtime formatting to use */
        const startedTime = document.querySelector('#startedTime');
        startedTime.innerText = new Date(startedTime.innerText).toLocaleString(navigator.languages);
      </script>
    </body>
  </html>`;
