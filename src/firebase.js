require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = process.env.FIREBASE_CONFIG;

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
