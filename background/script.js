browser.runtime.onMessage.addListener(handleMessage);

function handleMessage({ type, data }) {
  switch (type) {
    case 'exportHtml':
      exportHtml(data);
  }
}

function exportHtml(html) {
  const aFileParts = [html];
  const blob = new Blob(aFileParts, { type : 'text/html' });
  const url = URL.createObjectURL(blob);
  const downloading = this.browser.downloads.download({
    filename: `request.html`,
    url
  });
}
