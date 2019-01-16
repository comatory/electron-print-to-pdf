// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const fs = require('fs')
const path = require('path')

let showWebViews = true 
let base64 = false
let log = true

const MICRON = 264.58

const generateWebviewButton = document.createElement('button')
generateWebviewButton.innerText = 'Generate webviews'

const button = document.createElement('button')
button.innerText = 'Generate PDFs'

const blobOption = document.createElement('input')
blobOption.id = 'blob'
blobOption.type = 'checkbox'
blobOption.value = Number(base64)
blobOption.checked = base64
const blobLabel = document.createElement('label')
blobLabel.htmlFor = blobOption.id 
blobLabel.innerHTML = 'Base 64'

const webviewOption = document.createElement('input')
webviewOption.id = 'webviewVisibility'
webviewOption.type = 'checkbox'
webviewOption.value = Number(showWebViews)
webviewOption.checked = showWebViews 
const webviewLabel = document.createElement('label')
webviewLabel.htmlFor = webviewOption.id 
webviewLabel.innerText = 'Webviews visible' 

const logOption = document.createElement('input')
logOption.id = 'log'
logOption.type = 'checkbox'
logOption.value = Number(log)
logOption.checked = log
const logLabel = document.createElement('label')
logLabel.htmlFor = logOption.id
logLabel.innerHTML = 'Logs'

const generateWebview = (inPath) => {
    Array.from(document.getElementsByTagName('webview')).forEach((w) => {
        w.remove()
    })
    Array.from(document.getElementsByTagName('table')).forEach((t) => {
        t.remove()
    })
    const webview = document.createElement('webview')
    webview.src = inPath
    if (!showWebViews) {
        webview.style.visibility = 'hidden'
    }

    const image = new Image()
    image.src = inPath
    image.onload = () => {
        const imageName = inPath
        const imageWidth = image.naturalWidth
        const imageHeight = image.naturalHeight
        const pdfWidth = imageWidth * MICRON
        const pdfHeight = imageHeight * MICRON

        webview.style.width = `${imageWidth}px`
        webview.style.height = `${imageHeight}px`
        webview.style.padding = '0px'
        webview.style.margin = '0px'

        document.body.appendChild(webview)

        if (log && showWebViews) {
            const logTable = document.createElement('table')
            logTable.innerHTML = `
            <tr>
              <td>Image path</td><td>${imageName}</td>
            </tr>
            <tr>
              <td>Image width</td><td>${imageWidth}px</td>
            </tr>
            <tr>
              <td>Image height</td><td>${imageHeight}px</td>
            </tr>
            <tr>
              <td>PDF width</td><td>${pdfWidth} microns</td>
            </tr>
            <tr>
              <td>PDF height</td><td>${pdfHeight} microns</td>
            </tr>
            `

            webview.parentNode.insertBefore(logTable, webview)
        }

	    if (base64) {
		    let base64data
            const fileReader = new FileReader()
            fileReader.onloadstart = () => {
                console.info('starting base64 conversion')
            }
		    fileReader.onloadend = () => {
			    base64data = reader.readAsDataURL(image)
			    console.info(`using base64 data: ${base64data}`)
			    webview.src = base64data
		    }
        }
    }
}

const generatePdf = (webview) => {
    const url = new URL(webview.src)
    const pathName = url.pathname.split('/')
    const fileName = pathName[pathName.length - 1]
    const name = fileName.replace(/\..*/, '')
    console.log(`SIZES -> width: ${webview.clientWidth * MICRON}; height: ${webview.clientHeight * MICRON}`)
    webview.getWebContents().printToPDF({
        pageSize: {
            width: webview.clientWidth * MICRON,
            height: webview.clientHeight * MICRON
        },
        marginsType: 1,
        printBackground: false,
    }, (error, data) => {
        if (error) { throw error }
        console.log('data', data)

        fs.writeFile(`${path.join('/', 'private', 'tmp', name)}.pdf`, data, (error) => {
            if (error) { throw error }
            console.log('Write PDF successfully.')
        })
    })
}

const fetchWebviews = () => {
    return document.getElementsByTagName('webview')
}

const paths = [
    './rectangle3.svg',
    './rectangle2.svg',
    './rectangle.svg',
    './square.svg',
    './sketch.svg',
    './circle_png.png',
    './circle.svg',
    './cartman_png.png',
    './cartman.svg',
    './kyle.svg'
]

generateWebviewButton.addEventListener('click', () => {
    paths.forEach(generateWebview)
})

button.addEventListener('click', () => {
    const webviews = fetchWebviews()
    if (webviews.length < 1) {
        alert('Generate webviews first!')
        return
    }

    Array.from(webviews).forEach((webview) => {
        generatePdf(webview)
    })
})

blobOption.addEventListener('click', (el) => {
    base64 = !base64
    el.value = Number(base64)
    el.checked = base64
})

webviewOption.addEventListener('click', (el) => {
    showWebViews = !showWebViews
    el.value = Number(showWebViews)
    el.checked = showWebViews
})

logOption.addEventListener('click', (el) => {
    log = !log
    el.value = Number(log)
    el.checked = log 
})


document.body.appendChild(document.createElement('br'))
document.body.appendChild(generateWebviewButton)
document.body.appendChild(button)
document.body.appendChild(blobOption)
document.body.appendChild(blobLabel)
document.body.appendChild(webviewOption)
document.body.appendChild(webviewLabel)
document.body.appendChild(logOption)
document.body.appendChild(logLabel)
document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))
