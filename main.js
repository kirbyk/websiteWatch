console.log("hello");
const client = stitch.Stitch.initializeDefaultAppClient("websitewatch-sypjl");

const db = client
  .getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas")
  .db("websiteWatch");

client.auth
  .loginWithCredential(new stitch.AnonymousCredential())
  .then(user =>
    db
      .collection("websites")
      .updateOne(
        { owner_id: client.auth.user.id },
        { $set: { number: 42 } },
        { upsert: true }
      )
  )
  .then(() =>
    db
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
