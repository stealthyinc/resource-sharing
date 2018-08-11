// JSON-Schema for Stealthy IM Resource Sharing
// See:
//   - http://json-schema.org
//   - https://github.com/epoberezkin/ajv
//
// Note:
//   This schema describes a file called stealthyIndex.json that is encrypted
//   with the user's Stealthy public key and stored in the root of a
//   partner App's GAIA bucket. All resources described in this index are
//   uniquely identified by their relativePath property, which is relative to
//   the stealthyIndex.json file.
//
// TODO:
//   - Deploy this properly as a JSON file on Stealthy and for bundles
//   - Refactor and use $ref to grab sub-components
//   - 0.2
//       - Introduce MIME types or other appropriate type identification
//       - Introduce type hanlders, ability to reference partner App JS to 
//         perform operations on the files (e.g. Travel-stack image conversions
//         from separated chunks to complete photo files)
//       - Consider handling resource collections (i.e. chunked files)
//         The schema would be extend to handle collectionPath with an absolute
//         or relative root and an array of resource names.
//
const stealthyResourceSharingSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://www.stealthy.im/resource-sharing.schema.json",
  "title": "Stealthy IM Resource Sharing Schema",
  "description": "A description of application resources that can be shared across Stealthy IM.",
  "type": "object",
  "required": [ "version", "resources" ],
  "properties": {
    "version" : {
      "$ref": "#/definitions/version"
    },
    "resources": {
      "description": "An array of resources available for Resource Sharing across Stealthy IM.",
      "type": "array",
      "items": { 
        "$ref" : "#/definitions/resource"
      }
    }
  },
  "additionalProperties": false,
  "definitions" : {
    "resource": {
      "type": "object",
      "properties": {
        "title": {
          "description": "A title for this resource (displayed to user).",
          "type": "string"
        },
        "description": {
          "description": "A description of the resource",
          "type": "string"
        },
        "relativePath" : {
          "description": "The relative path to this resource (relative to this index file), e.g.  subpath1/subpath2/<this.resource>. Note .. is not supported at this time.",
          "type": "string"
        },
        "encryption": {
          "$ref" : "#/definitions/encryption"
        },
        "utcTime": {
          "description": "The UTC time in ms corresponding to this resource being listed.",
          "type": "integer",
          "minimum": 0
        },
        "version": {
          "$ref": "#/definitions/version"
        },
        "app-specific-meta-data": {
          "description": "Custom data specific to the app sharing this resource.",
          "type": "object"
        }
      },
      "additionalProperties": false,
      "oneOf" : [
        { "required": [ "title", "relativePath", "utcTime", "version" ] },
      ]
    },
    "encryption": {
      "description": "Describes how a resource is encrypted.",
      "type": "object",
      "properties": {
        "appUrl": {
          "description": "The URL of the application whose Blockstack key was used to encrypt this file (e.g. https:://app.travelstack.club).",
          "type": "string"
        },
        "userId": {
          "description" : "The Blockstack user ID of the person whose Blockstack application key was used to encrypt this file (e.g. wenger.id).",
          "type": "string"
        }
      },
      "additionalProperties": false,
      "required": [ "appUrl", "userId" ]
    },
    "version": {
      "description": "A simple string type for major.minor version number schemes, i.e. 0.1",
      "type": "string",
      "pattern": "^[0-9]+\.[0-9]+$"
    }
  }
}

module.exports = { stealthyResourceSharingSchema }
