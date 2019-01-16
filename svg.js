
const fs = require('fs')
const remote = require('electron').remote

setTimeout(() => {
    const win = remote.getCurrentWindow()
    const contents = remote.getCurrentWebContents()
    contents.printToPDF({}, (error, data) => {
        if (error) throw error
        fs.writeFile('/tmp/print.pdf', data, (error) => {
          if (error) throw error
          console.log('Write PDF successfully.')
        })
        win.close()
      })

}, 300)