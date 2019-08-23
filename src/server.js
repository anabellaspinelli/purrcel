const express = require('express')
const app = express()

const { handleParcel } = require('./handlers')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('<h1>Parcel</h1>'))
app.get('/_status', (req, res) => res.send('Up and running!!'))

app.post('/parcel', handleParcel)

const PORT = process.env.PORT || 9010

app.listen(PORT, () => console.log(`Listening on ${PORT}!`))
