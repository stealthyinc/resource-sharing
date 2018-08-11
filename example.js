const { Resource } = require('./lib/resource.js')
const { StealthyIndex } = require('./lib/stealthyIndex.js')
const { getStealthyPk } = require('./lib/stealthyUtils.js')
const { encryptECIES, decryptECIES } = require('blockstack/lib/encryption')

// Construct a Stealthy Index from resources.
//
const resource1 = new Resource("my_pictures/last_year/feed-01.picture",   // Relative path to resource from index.
                               "My Awesome Picture")                      // Title of resource.
resource1.setDescription('That time I got to have extra fries.')          // Optional description.

const resource2 = new Resource("my_documents/this_year/210210002938a32f",
                               "New document",
                               "0.1")                                     // Optional resource version.

const resource3 = new Resource("my_encrypted_resources/today/myAvatatar.photo",
                               "My Avatar Picture",
                               "1.1")
resource3.setEncryption("https://myAwesomeDApp.io", "wenger.id")          // Optional encryption description.

const stealthyIdx = new StealthyIndex()
stealthyIdx.addResource(resource1)
stealthyIdx.addResource(resource2)
stealthyIdx.addResource(resource3)


// Make sure the index is valid before encrypting and writing it
//
if (stealthyIdx.isValid()) {
  console.log('Stealthy Index data is valid.')
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
  }
}

doAsyncWorkSequentially(stealthyIdx)
