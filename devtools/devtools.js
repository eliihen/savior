import { escapeAttribute, className } from './utils.js';
import renderHtml from './output-html.js';
import renderText from './output-text.js';

function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

const Row = ({ status, statusText, url }) => htmlToElement(`
  <tr>
    <td class="status ${className(status)}" title="${statusText}">
      <span class="status-bubble">${status}</span>
    </td>
    <td class="url" title="${escapeAttribute(url)}">
      ${url}
    </td>
    <td class="buttons">
      <button class="copy">
        Copy text
      </button>
      <button class="export">
        Export
      </button>
    </td>
  </tr>
`);

browser.devtools.panels.create(
  "Savior",
  "icon-512.png",
  "/devtools/panel/panel.html"
).then(newPanel => {
  function panelHandler({ document }) {
    const tbody = document.querySelector('tbody');
    document.querySelector('#clear').addEventListener(
      'click',
      () => document.querySelector('tbody').innerHTML = '',
    );

    browser.devtools.network.onRequestFinished.addListener(request => {
      const { url } = request.request;
      const { status, statusText } = request.response;

      // TODO a lot of responses come through with status 0 and missing data.
      // Filter them out until we can figure out what is going on
      // Probably caused by https://bugzilla.mozilla.org/show_bug.cgi?id=1472653
      if (!status) return;

      const row = Row({ url, status, statusText });

      row
        .querySelector('.copy')
        .addEventListener('click', async () => {
          const [ body, contentType ] = await request.getContent();
          browser.runtime.sendMessage({
            type: 'copyText',
            data: renderText({
              ...request,
              contentType,
              body,
            }),
          });
        })

      row
        .querySelector('.export')
        .addEventListener('click', async () => {
          const [ body, contentType ] = await request.getContent();
          browser.runtime.sendMessage({
            type: 'exportHtml',
            data: renderHtml({
              ...request,
              contentType,
              body,
            }),
          });
        })

      tbody.appendChild(row);
    });
  };

  newPanel.onShown.addListener(panelHandler);
  newPanel.onHidden.removeListener(panelHandler);
});
