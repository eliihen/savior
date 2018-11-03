import renderHtml from './output-template.js';

function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

const Row = ({ url }) => htmlToElement(`
  <tr>
    <td class="url">
      ${url}
    </td>
    <td class="buttons">
      <button class="export">
        Export
      </button>
    </td>
  </tr>
`);

async function buildHtml(request) {
  const result = await fetch('output-template.html');
  const text = await result.text();
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const [ responseBody, contentType ] = await request.getContent();
  doc.querySelector('#root').appendChild(
    Preview({
      url: ['span', request.request.url],
      requestHeaders: ['div', buildHeadersTable(request.request.headers)],
      responseStatus: ['span', request.response.status],
      responseStatusText: ['span', request.response.statusText],
      responseBody: ['pre', escape(responseBody)],
    })
  );
  return doc.documentElement.outerHTML;
}

browser.devtools.panels.create(
  "Export",
  "icons/star.png",
  "panel/panel.html"
).then(newPanel => {
  newPanel.onShown.addListener(e => {
    const tbody = e.document.querySelector('tbody');

    browser.devtools.network.onRequestFinished.addListener(request => {
      const { url } = request.request;
      const row = Row({ url });
      row
        .querySelector('.export')
        .addEventListener('click', async () => {
          const [ body, contentType ] = await request.getContent();
          browser.runtime.sendMessage({
            type: 'exportHtml',
            data: renderHtml({
              request: request.request,
              response: request.response,
              serverIPAddress: request.serverIPAddress,
              time: request.time,
              timings: request.timings,
              contentType,
              body,
            }),
          });
        })

      tbody.appendChild(row);
    });
  });

  //newPanel.onHidden.addListener(unInitialisePanel);
});
