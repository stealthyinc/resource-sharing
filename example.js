const { Resource } = require('./lib/resource.js')
const { StealthyIndex } = require('./lib/stealthyIndex.js')
const { getStealthyPk } = require('./lib/stealthyUtils.js')
const { encryptECIES, decryptECIES } = require('blockstack/lib/encryption')

// Construct a Stealthy Index from resources.
//
const resource1 = new Resource("my_pictures/last_year/feed-01.picture",   // Relative path to resource from index.
                               "My Awesome Picture",                      // Title of resource.
                               Resource.Type.image)
resource1.setDescription('That time I got to have extra fries.')          // Optional description.

const resource2 = new Resource("my_documents/this_year/210210002938a32f",
                               "New document",
                               Resource.Type.browsable)

const resource3 = new Resource("my_encrypted_resources/today/myAvatatar.photo",
                               "My Avatar Picture",
                               Resource.Type.image)
resource3.setEncryption("https://myAwesomeDApp.io", "wenger.id")          // Optional encryption description.


const resource4 = new Resource("status/1",                                // Example for a Travelstack post
                               "Travelstack was launched here.",
                               Resource.Type.browsable)

const stealthyIdx = new StealthyIndex()
stealthyIdx.addResource(resource1)
stealthyIdx.addResource(resource2)
stealthyIdx.addResource(resource3)
stealthyIdx.addResource(resource4)


// Make sure the index is valid before encrypting and writing it
//
if (stealthyIdx.isValid()) {
  console.log('Stealthy Index data is valid.')
  doAsyncWorkSequentially(stealthyIdx)
  stealthyIdx.dumpIndex()
  console.log()
} else {
  console.log('Stealthy Index data is INVALID!')
  console.log('Errors: ', stealthyIdx.getErrors())
}


async function doAsyncWorkSequentially(theStealthyIndex) {
  // Now fetch the user's Stealthy public key
  // (for fun we assume the user is 'relay.id')
  let publicKey = await getStealthyPk('relay.id')
  if (publicKey) {
    const stringifiedIndex = JSON.stringify(theStealthyIndex)
    const cipherObject = encryptECIES(publicKey, stringifiedIndex)
    const stringifiedCipherObject = JSON.stringify(cipherObject)

    console.log(`This stringified cipher object needs to get writen to ${StealthyIndex.getIndexName()}`)
    console.log('\n', stringifiedCipherObject)

    // Note:
    // In addition to writing the encrypted file to StealthyIndex.getIndexName(), 
    // you'll probably want to keep an instance of the index around and/or stringify 
    // it for later use (since you'll want to add / remove posts from it and re-write the
    // encrypted index later for updated sharing).
    //
    // Also, you might want to persist the Stealthy public key somewhere as it's
    // time consuming to fetch.
  }
}
