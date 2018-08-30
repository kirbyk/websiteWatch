
// # Direct Interactions

// New User
//   - Login
//   - Define a time limit
//   - Optionally, add entries to blacklist
//   - Insert a new config document
// Returning User
// - Add or remove from blacklist

// # Indirect Interactions

// Page opens
//   - Check if it's on the blacklist
//   - if blacklisted:
//     - Check if time is available
//     - Start a timer
// Page closes
//   - if blacklisted:
//     - Stop timer
//     - Submit usage to Stitch

// - Insert/Update website tracker documents // Kirby

// Things to figure out
//   - How do we know when a page opens/closes
//     - likely a chrome event system
//   - How to time things


const client = stitch.Stitch.initializeDefaultAppClient("websitewatch-sypjl");

const db = client
  .getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas")
  .db("websiteWatch");

const websites = db.collection("websites");
const config = db.collection("config");

function getCurrentDate() {
  const now = Date.now()
  return {
    day: now.getDay(),
    month: now.getMonth(),
    year: now.getFullYear()
  }
}

// New User

function loginAnonymously() {
  return client.auth.loginWithCredential(new stitch.AnonymousCredential());
}

// Form
async function createNewUserConfig(formData) {
  const { timeLimit, blacklist } = formData;
  const user = await loginAnonymously()
  await config.insertOne({
    owner_id: user.id,
    blacklist: blacklist,
    timeLimit: timeLimit
  })
}
function changeTimeLimit(newTimeLimit) {
  return config.updateOne(
    { owner_id: client.auth.user.id },
    { $set: { timeLimit: newTimeLimit } }
  )
}
function addToBlacklist(newBlacklistItem) {
  return config.updateOne(
    { owner_id: client.auth.user.id },
    { $push: { blacklist: newBlacklistItem } }
  )
}
function removeFromBlacklist(removeBlacklistItem) {
  return config.updateOne(
    { owner_id: client.auth.user.id },
    { $pull: { blacklist: removeBlacklistItem } }
  )
}






// db
//   .collection("websites")
//   .insertOne({
//     owner_id: user.id,
//     url: "",
//     timeSpent: 0, // minutes
//     date: getCurrentDate()
//   })

function login() {
  return client.auth.loginWithCredential(new stitch.AnonymousCredential())
}


login().then(user => {
  return db.collection("websites").insertOne({
    owner_id: user.id,
    url: "",
    timeSpent: 0, // minutes
    date: getCurrentDate()
  })
).then(() => db
  .collection("websites")
  .find({ owner_id: client.auth.user.id }, { limit: 100 })
  .asArray()
)
  .then(docs => {
    console.log("Found docs", docs);
    console.log("[MongoDB Stitch] Connected to Stitch");
  })
  .catch(err => {
    console.error(err);
  });
