// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const fs = require('fs')
const path = require('path')
const os = require('os')

let files

let showWebViews = true 
let base64 = false
let log = true

const MICRON = 264.58

const homeDir = os.homedir()
const defaultOutputDir = path.join(homeDir, 'Downloads')

const generateWebviewButton = document.getElementById('webview')
const button = document.getElementById('pdf')
const sampleFilesButton = document.getElementById('samples')
const folderInput = document.getElementById('dir')
folderInput.value = defaultOutputDir

const blobOption = document.getElementById('blob')
blobOption.value = Number(base64)
blobOption.checked = base64

const webviewOption = document.getElementById('webviewVisibility')
webviewOption.value = Number(showWebViews)
webviewOption.checked = showWebViews 

const logOption = document.getElementById('log')
logOption.value = Number(log)
logOption.checked = log

const dropArea = document.getElementById('droparea')
const counter = document.getElementById('counter')

const resetLoadedFiles = () => {
    files = null
}

const round = number => Math.ceil(number)

const generateWebview = (file) => {
    Array.from(document.getElementsByTagName('webview')).forEach((w) => {
        w.remove()
    })
    Array.from(document.getElementsByTagName('table')).forEach((t) => {
        t.remove()
    })
    const filePath = file.path
    const webview = document.createElement('webview')
    webview.src = filePath 
    if (!showWebViews) {
        webview.style.visibility = 'hidden'
    }

    const image = new Image()
    image.src = filePath
    image.onload = () => {
        const imageName = filePath
        const imageWidth = image.naturalWidth
        const imageHeight = image.naturalHeight
        const pdfWidth = round(imageWidth * MICRON)
        const pdfHeight = round(imageHeight * MICRON)

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
    const outDir = folderInput.value

    if (!outDir || !fs.existsSync(outDir)) {
        alert('Enter valid path')
    }

    const url = new URL(webview.src)
    const pathName = url.pathname.split('/')
    const fileName = pathName[pathName.length - 1]
    const name = fileName.replace(/\..*/, '')
    webview.getWebContents().printToPDF({
        pageSize: {
            width: round(webview.clientWidth * MICRON),
            height: round(webview.clientHeight * MICRON)
        },
        marginsType: 1,
        printBackground: false,
    }, (error, data) => {
        if (error) { throw error }
        console.log('data', data)

        fs.writeFile(`${path.join(outDir, name)}.pdf`, data, (error) => {
            if (error) { throw error }
            console.log('Write PDF successfully.')
        })
    })
}

const fetchWebviews = () => {
    return document.getElementsByTagName('webview')
}

const sampleFilenames = [
    'rectangle3.svg',
    'rectangle2.svg',
    'rectangle.svg',
    'square.svg',
    'sketch.svg',
    'circle_png.png',
    'circle.svg',
    'cartman_png.png',
    'cartman.svg',
    'kyle.svg'
]

generateWebviewButton.addEventListener('click', () => {
    if (!files || files.length < 0) {
        alert('Missing files')
        return
    }
    Array.from(files).forEach(generateWebview)
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

sampleFilesButton.addEventListener('click', () => {
    resetLoadedFiles()
    updateCounter()
    sampleFilenames.forEach((fileName) => {
        generateWebview({ path: path.join(__dirname, fileName) })
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

const handleDnd = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

const highlight = () => {
    dropArea.classList.add('highlight')
}

const unhighlight = () => {
    dropArea.classList.remove('highlight')
}

const handleDragEnter = (e) => {
    handleDnd(e)
    highlight()
}

const handleDragOver = (e) => {
    handleDnd(e)
    highlight()
}

const handleDragLeave = (e) => {
    handleDnd(e)
    unhighlight()
}

const handleDrop = (e) => {
    resetLoadedFiles()
    handleDnd(e)
    unhighlight()

    const transfer = e.dataTransfer
    files = transfer.files
    updateCounter()
}

const updateCounter = () => {
    counter.innerHTML = `${files ? files.length : '0'} items`
}

dropArea.addEventListener('dragenter', handleDragEnter, false)
dropArea.addEventListener('dragleave', handleDragLeave, false)
dropArea.addEventListener('dragover', handleDragOver, false)
dropArea.addEventListener('drop', handleDrop, false)