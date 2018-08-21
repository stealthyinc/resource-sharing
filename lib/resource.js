const CURRENT_VERSION = "0.1"
//
// Version 0.1:
//   - Remvoes the ability to set the version. (This will be used to process and
//     make things backward compatible.
//   - Adds new required argument:
//       aType  (image | browsable | other  -  see static definition of Resource.Type)
//
// Version 0.0:
//   - initial release.
//   - features the following required arguments
//       aRelativePath
//       aTitle
//   - features the following optional arguments
//       aVersion
//       aDescription
//       encryption(anAppUrl, aUserId)
// 
class Resource {
  constructor(aRelativePath,
              aTitle,
              aType) {
    this.relativePath= aRelativePath
    this.title = aTitle
    this.resourceType = aType
    this.utcTime = Date.now()
    this.version = CURRENT_VERSION
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

  static get Type() {
    return {
      image: 'image',
      browsable: 'browsable',
      other: 'other'
    }
  }
}

module.exports = { Resource }
