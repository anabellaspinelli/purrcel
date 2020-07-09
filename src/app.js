const express = require('express')
const app = express()

const { handleParcel } = require('./handlers')
const { handleTurrinator, handleInteractive } = require('./turri-handlers')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('<h1>Parcel</h1>'))
app.get('/_status', (req, res) => res.send('Up and running!!'))
// app.get('/_status', (req, res) => res.send('Up and running!!'))

// app.post('/parcel', handleParcel)

// app.post('/turrinator', handleTurrinator)
// app.post('/interactive', handleInteractive)

module.exports = app
