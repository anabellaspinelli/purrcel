const app = require('./app')
const PORT = process.env.PORT || 9010

app.listen(PORT, () => console.info(`Listening on ${PORT}!`))
