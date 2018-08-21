const Ajv = require('ajv')

const { stealthyResourceSharingSchema } = require('./resource-sharing.schema.js')

const INDEX_VERSION = "0.2"

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

  dumpIndex() {
    console.log('StealthyIndex Dump:')
    console.log('--------------------------------------------------------------------------------')
    for (const property in this.indexData) {
      if (property !== 'resources') {
        console.log(`${property}: ${this.indexData[property]}`)
      } else {
        console.log(`${property}: {`)
        for (const resource of this.indexData[property]) {
          console.log('  {')
          console.log(`    relativePath: ${resource['relativePath']}`)
          console.log(`    title: ${resource['title']}`)
          console.log(`    resourceType: ${resource['resourceType']}`)
          console.log(`    utcTime: ${resource['utcTime']}`)
          console.log(`    version: ${resource['version']}`)
          console.log('  }')
        }
        console.log('}')
      }
    }
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
