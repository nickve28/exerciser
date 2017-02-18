//todo find out how this actually works client side, seems really awkward :/

//BRUNCH_ENV=development brunch cmd

let configuration = {
  apiHost: 'http://localhost',
  apiPort: 4000
}

if (process.env.NODE_ENV === 'production') { //eslint-disable-line
  configuration = {
    apiHost: 'https://devnix.nl',
    apiPort: 25570
  }
}
export default configuration