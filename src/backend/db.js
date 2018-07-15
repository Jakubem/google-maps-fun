const { Client } = require('pg')

require('dotenv').config()

const connectionString = process.env.PG_URL

const client = new Client({
  connectionString: connectionString,
})

client.connect()

const insert = `
  INSERT INTO pins (name, lat, lng, srid, geom)
    VALUES ('arbuz', '53.3658', '53.3658', '4326', ST_GeomFromText('POINT(14.6499 53.3655)', 4326))
`
const query = `
  SELECT * FROM pins
`

client.query(query, (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err)
  }
  client.end()
})