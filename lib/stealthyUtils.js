const ApiRequests = require('./stealthyKeyFetcher.js')

// Suppresses caught errors (logging them) and returning undefined if
// unable to get the Stealthy public key of a user.
//
getStealthyPk = async (aUserId) => {
  // Get the Stealthy Public Key for the current user
  //
  const gaiaUrlApi = ApiRequests.gaiaUrlGrabber()
  let gaiaUrl = undefined
  try {
    gaiaUrl = await gaiaUrlApi.getUserGaia(aUserId)
  } catch (error) {
    console.log(error)
    return undefined
  }

  if (!gaiaUrl) {
    return undefined
  }

  const stealthyPkUrl = `${gaiaUrl}pk.txt`
  const stealthyPkUrlApi = ApiRequests.stealthyPublicKeyGrabber(stealthyPkUrl)
  let stealthyPk = undefined
  try {
    stealthyPk = await stealthyPkUrlApi.getStealthyPublicKey()
  } catch (error) {
    console.log(error)
  }
  console.log(`stealthyPk: ${stealthyPk}`)
  return stealthyPk
}

module.exports = { getStealthyPk }
