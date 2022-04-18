import {authOptions} from '../db/auth.js'
console.log(authOptions)
// query and return based on date / citations
export async function getEntries (apiUrl) {
  const myHeaders = new Headers();
  const baseEncodedAuth = btoa(`${authOptions.user}:`);
  console.log(baseEncodedAuth);
  myHeaders.append('Authorization', `Basic ${baseEncodedAuth}`);

  let entries = await fetch(apiUrl, {
    method: 'GET',
    headers: myHeaders
  })
    .then(response => response.json())
    .then((response) => {
      console.log(response)
      console.log("message from server: "+response.error.message)
      return response;
    })
    .catch(err => console.log(err))

  return entries;
}
