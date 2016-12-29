//todo find out how this actually works client side, seems really awkward :/

//BRUNCH_ENV=development brunch cmd

let configuration = {
  apiHost: 'http://localhost',
  apiPort: 4000
}

if (process.env.BRUNCH_ENV === 'production') {
  configuration = {
    apiHost: 'http://192.168.0.11',
    apiPort: 4000
  }
}
export default configuration