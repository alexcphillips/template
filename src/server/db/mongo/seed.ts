import { createCollections, createIndex, find, insertMany } from "./operations";
import { seedData } from "./seedData";

export const seedDb = async () => {
  if (process.env.SKIP_DB_SEEDING) {
    console.log("Skipping db seed");
    return;
  }
  console.log("creating collections");
  await createCollections(Object.keys(seedData));

  for (const collection in seedData) {
    console.log("checking documents for collection:", collection);
    setupDocs(collection);
    setupIndexes(collection);
  }
};

async function setupDocs(collection) {
  if (!seedData[collection]?.docs) {
    return;
  }
  const { docs, filter, projection, comparisonField } = seedData[collection];
  const dbDocs = await find(collection, filter, projection);
  const comparisonValues = dbDocs.map((dbDoc) => dbDoc[comparisonField]);
  // console.log('comparisonValues:', comparisonValues);
  const missingDocs = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    // console.log('doc[comparisonField]:', doc[comparisonField]);
    if (!comparisonValues.includes(doc[comparisonField])) {
      missingDocs.push(doc);
    }
  }

  if (missingDocs.length) {
    console.log("inserting missingDocs:", missingDocs);
    insertMany(collection, missingDocs);
  }
}

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
async function setupIndexes(collection) {
  if (!seedData[collection]?.indexes) {
    return;
  }

  const { indexes } = seedData[collection];

  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];
    createIndex(collection, index);
  }
}
