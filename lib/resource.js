class Resource {
  constructor(aRelativePath,
              aTitle,
              aVersion="0.0") {
    this.relativePath= aRelativePath
    this.title = aTitle
    this.utcTime = Date.now()
    this.version = aVersion
  }

  //
  // Optional settings
  ////////////////////////////////////////////////////////////////////////////////

  setDescription(aDescription) {
    this.description = aDescription
  }
  
  setEncryption(anAppUrl, aUserId) {
    this.encryption = {
      appUrl: anAppUrl,
      userId: aUserId
    }
  }
}

module.exports = { Resource }
