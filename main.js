// Connect to MongoDB Stitch
const client = stitch.Stitch.initializeDefaultAppClient("websitewatch-sypjl");

// Connect to the Stitch MongoDB Atlas Service
const mongodb = client.getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas")
const db = mongodb.db("websiteWatch");
const websites = db.collection("websites");
const config = db.collection("config");

// Add an onClick listener to our submit button
document.getElementById("submit-button").addEventListener("click", (e) => {
  handleFormSubmission();
  if(e.preventDefault) { e.preventDefault() } else { e.returnValue = false }
});

async function handleFormSubmission() {
  const blacklist = document.getElementById("blacklist").value;
  const timeLimit = document.getElementById("time-limit").value;
  const formData = { blacklist, timeLimit };
  const user = await loginAnonymously();
  await createNewUserConfig(formData, user);
}

// Log an anonymous user in
function loginAnonymously() {
  if (client.auth.isLoggedIn) {
    return Promise.resolve(client.auth.user)
  }
  return client.auth.loginWithCredential(new stitch.AnonymousCredential());
}

// Add a new user configuration document to MongoDB
function createNewUserConfig(formData, user) {
  const { blacklist, timeLimit } = formData;
  return config.insertOne({
    owner_id: user.id,
    blacklist: blacklist,
    timeLimit: timeLimit
  })
}




// Config setters
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

// Helper functions
function getCurrentDate() {
  const now = Date.now();
  return {
    day: now.getDay(),
    month: now.getMonth(),
    year: now.getFullYear()
  };
}
