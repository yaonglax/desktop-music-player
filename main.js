const path = require('path');
const { app, BrowserWindow, Menu, session  } = require('electron');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'prob',
        width: 400,
        height: 250,
        frame: false, 
        transparent: true,
        resizable: false,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        },
        show: false
    });
    mainWindow.loadFile('./renderer/index.html');
mainWindow.once('ready-to-show', () => {
  mainWindow.show()
})

mainWindow.setAlwaysOnTop(true, 'screen')
mainWindow.isMovable()
}
//app is ready

app.on('ready', () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['User-Agent'] = 'Chrome';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
          responseHeaders: Object.fromEntries(
              Object.entries(details.responseHeaders).filter(header => !header[0].match(/^x-/i))
          )
      });
  });

  createMainWindow();
  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })




