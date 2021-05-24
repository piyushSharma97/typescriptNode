import app from './app'

import dotenv from "dotenv";
dotenv.config();

const port = process.env.SERVER_PORT;

app.set('port', port)


app.listen(port, () :void=> {
  console.log(`server is listening on ${port}`)
})