import renderHtml from './output-html.js';

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

const panelHandler = ({ document }) => {
  const tbody = document.querySelector('tbody');
  document.querySelector('#clear').addEventListener(
    'click',
    () => document.querySelector('tbody').innerHTML = '',
  );

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
};

browser.devtools.panels.create(
  "Savior",
  "icon-512.png",
  "panel/panel.html"
).then(newPanel => {
  newPanel.onShown.addListener(panelHandler);
  newPanel.onHidden.removeListener(panelHandler);
});
