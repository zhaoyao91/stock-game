import MongoClient from 'mongodb';

import settings from '../settings';

let mongodb = null;

export default async function () {
  if (!mongodb) {
    const {mongodb: {url: mongodbUrl}} = settings;
    mongodb = await new Promise((resolve, reject) => {
      MongoClient.connect(mongodbUrl, (err, db) => {
        if (err) reject(err);
        else resolve(db);
      })
    })
  }
  return mongodb;
}