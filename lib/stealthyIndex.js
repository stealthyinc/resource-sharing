const Ajv = require('ajv')

const { stealthyResourceSharingSchema } = require('./resource-sharing.schema.js')

const INDEX_VERSION = "0.1"

class StealthyIndex {
  constructor() {
    const ajvInst = new Ajv()
    this.ajvValidator = ajvInst.compile(stealthyResourceSharingSchema)
    this.indexData = this._getEmptyIndexData()
  }

  isValid() {
    return this.ajvValidator(this.indexData)
  }

  getErrors() {
    return this.ajvValidator.errors
  }

  clear() {
    this.indexData = this._getEmptyIndexData()
  }

  addResource(aResource) {
    this.indexData.resources.unshift(aResource)
  }

  // Returns the resource uniquely identified by aRelativePath if it
  // exists, returns undefined otherwise.
  //
  getResource(aRelativePath) {
    const idx = this._getIndexOfResource(aRelativePath)
    return (idx) ? this.indexData.resources[idx] : undefined
  }

  // Returns true if able to remove the resource uniquely identified by 
  // aRelativePath from the index data, false otherwise.
  //
  removeResource(aRelativePath) {
    const idx = this._getIndexOfResource(aRelativePath)
    if (idx) {
      this.indexData.resources.splice(idx, 1)
      return true
    }

    return false
  }

  initFromStringifiedObj(aStringifiedObj) {
    const obj = JSON.parse(aStringifiedObj)
    this.indexData = obj.indexData
  }

  static getIndexName() {
    return "stealthyIndex.json"
  }

  //
  // Private:
  ////////////////////////////////////////////////////////////////////////////////

  _getEmptyIndexData() {
    return {
      "version": INDEX_VERSION,
      "resources": []
    }
  }

  _getIndexOfResource(aRelativePath) {
    const resources = this.indexData.resources
    for (const index in resources) {
      if (resources[index].relative_path === aRelativePath) {
        return index
      }
    }

    return undefined
  }
}

module.exports = { StealthyIndex }
