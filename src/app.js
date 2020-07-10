const express = require('express')
const app = express()

const { handleParcel } = require('./handlers')
const { handleTurrinator, handleInteractive } = require('./turri-handlers')
const { handleGump, handleGumpInteractive } = require('./gump-handlers')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => res.send('<h1>Gump</h1>'))
// app.get('/_status', (req, res) => res.send('Up and running!!'))

// app.post('/parcel', handleParcel)

// app.post('/turrinator', handleTurrinator)
// app.post('/interactive', handleInteractive)

app.post('/gump', handleGump) // slash command
app.post('/gump-interactive', handleGumpInteractive) // any interactivity

module.exports = app
