import { create } from "@wppconnect-team/wppconnect"
import { createReadStream } from 'node:fs'
import { pipeline } from "node:stream/promises"
import csvtojson from 'csvtojson'
import { Transform } from 'node:stream'
import ThrottleRequest from './throttler.js'
import { getMessage } from "./util.js"

const throttlerNew = new ThrottleRequest({
  objectMode: true,
  requestsPerSecond: 1
})
const wppconnect = create()
const dataProc = Transform({
  objectMode: true,
  transform(chunk, enc, callback) {
    const jsonData = chunk.toString()
    const { name, tel } = JSON.parse(jsonData)
    return callback(null, JSON.stringify({ name, tel }))
  }
})

wppconnect.then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client) {
  await pipeline(
    createReadStream('file_tel,csv'),
    csvtojson(),
    dataProc,
    throttlerNew,
    async function* (source_data) {
      const counter = 0
      for await (const data of source_data) {
        const { name, tel } = JSON.parse(data);
        client.sendText(tel, getMessage(name))
        .then((result) => {
        console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
        });
      }
    }
  )
}




// await pipeline(
//   createReadStream('big.csv'),
//   csvtojson(),
//   dataProc,
//   throttlerNew,
//   async function* (source_data) {
//     let count = 0;
//     for await (const data of source_data) {
//       //log(`Processed ${++count} item...`)
//       const { name, tel } = JSON.parse(data);
//       client.sendText('559293028354', '👋 Hello from wppconnect!')
//         .then((result) => {
//           console.log('Result: ', result); //return object success
//         })
//         .catch((erro) => {
//           console.error('Error when sending: ', erro); //return object error
//         });
//       console.log(name, tel)
//     }
//   }
// )