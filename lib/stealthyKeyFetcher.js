const apisauce = require('apisauce')

const gaiaUrlGrabber = (baseURL = 'https://core.blockstack.org') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache'
    },
    timeout: 10000
  })


  // getUserGaia 
  // Notes:
  //   - Given aUserName and anAppUrl (optional), this method attempts to
  //     fetch the user's GAIA app bucket URL. Failing that, it throws!
  //   - This method is not affected by the caching that makes results not
  //     found in other profile search endpoints.
  const getUserGaia = async (aUserName, anAppUrl = 'https://www.stealthy.im') => {
    const methodName = 'getUserGaiaS'
    let profileData = undefined
    try {
      profileData = await getProfileFromNameSearch(aUserName, anAppUrl)
      const appUrl = profileData.apps[anAppUrl]
      return appUrl
    } catch(err) {
      throw `ERROR(${methodName}): failed to get profile data from name search.\n${err}`
    }
  }

  // getProfileFromNameSearch
  // Notes:
  //   - The name search endpoint handles fully qualified user ids so no need to strip the ends off.
  //   - It returns a data blob containing a link to a user's profile.
  //   - The link to the user's profile is not cached so it will have up to date
  //     settings for multi-player
  //   - The contents of the blob is not consistent. For example, compare the
  //     "zonefile" property for three different ids: alexc.id, alex.stealthy.id,
  //     and prabhaav.id.blockstack.  The url is different so you can't rely on
  //     the "address" field to construct the url from a pattern--you have to parse
  //     for it.
  //   - The zonefile URL seems to be consistently delimited with \". However some
  //     ids, like stealthy.id, return a pile of other strings delimited with \", so
  //     we include https://gaia in our search.
  //   - The profile returned by this endpoint is different than the one returned by
  //     the profile search endpoint. Specifically the app properties use '.' instead
  //     of '_', i.e. 'www.stealthy.im' instead of 'www_stealthy_im'.
  //
  const getProfileFromNameSearch = async (aUserName) => {
    const methodName = 'getProfileFromNameSearch'

    let nameResult= undefined
    try {
      nameResult = await api.get(`v1/names/${aUserName}`)
    } catch (err1) {
      // Three attempts.  TODO: something more elegant (exponential back off
      // with jitter)
      try {
        nameResult = await api.get(`v1/names/${aUserName}`)
      } catch (err2) {
        try {
          nameResult = await api.get(`v1/names/${aUserName}`)
        } catch (err3) {
          throw `ERROR(${methodName}): request for data from name endpoint failed.\n${err3}`
        }
      }
    }

    let zonefileUrlMess = undefined
    try {
      zonefileUrlMess = nameResult.data.zonefile
    } catch (err) {
      console.log('Zonefile not in nameResult')
      throw `ERROR(${methodName}): failed to get zonefile data in request returned from name endpoint.\n${err}`
    }

    const zoneFileUrlReResult = /\"https:\/\/.*\"/.exec(zonefileUrlMess)
    let profileUrl = String(zoneFileUrlReResult).replace(/"/g, '')
    if (!profileUrl) {
      throw `ERROR(${methodName}): unable to parse profile URL from zonefile data.`
    }

    let profileUrlResult = undefined
    try {
      profileUrlResult = await api.get(profileUrl)
    } catch (err1) {
      // Three attempts.  TODO: something more elegant (exponential back off
      // with jitter)
      try {
        profileUrlResult = await api.get(profileUrl)
      } catch (err2) {
        try {
          profileUrlResult = await api.get(profileUrl)
        } catch (err3) {
          throw `ERROR(${methodName}): request for profile data from profile URL (${profileUrl}) failed.\n${err3}`
        }
      }
    }

    let profileData = undefined
    try {
      profileData = profileUrlResult.data[0].decodedToken.payload.claim
    } catch (err) {
      throw `ERROR(${methodName}): failed to get profile data in request returned from profile URL (${profileUrl}).\n${err}`
    }

    return profileData
  }

  return {
    getUserGaia
  }
}

const stealthyPublicKeyGrabber = (keyUrl) => {
  const api = apisauce.create({
    baseURL: keyUrl,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    timeout: 10000
  })

  const getStealthyPublicKey = async () => {
    const methodName = 'getStealthyPublicKey'

    let publicKeyResult = undefined
    try {
      publicKeyResult = await api.get()
    } catch (err1) {
      // Three attempts.  TODO: something more elegant (exponential back off
      // with jitter)
      try {
        publicKeyResult = await api.get()
      } catch (err2) {
        try {
          publicKeyResult = await api.get()
        } catch (err3) {
          throw `ERROR(${methodName}): failed to get public key.\n${err3}`
        }
      }
    }

    const publicKey = (publicKeyResult && publicKeyResult.data) ?
      publicKeyResult.data : undefined
    return publicKey
  }

  return {
    getStealthyPublicKey
  }
}


module.exports = { gaiaUrlGrabber, stealthyPublicKeyGrabber }
