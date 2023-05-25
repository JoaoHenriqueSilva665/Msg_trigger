import readline from 'node:readline'

function log(message){
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(message)
}

export const getMessage = (name) => {
  return `Olá, ${name}!\n\nÉ calma, esse é o terceiro ou quarto teste sei la, finge que não é importante essa mensagem! =)`;
};



/** async function makeResquest(data) {
  const request = await fetch('http://localhost:3000', {
    body: data, 
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
}) 
return request.status
}
*/


export {
  log,
}