import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAQ2T9NlUheP4sB2Dd798AAdCqPxCLsyW4',
  authDomain: 'react-todo-smit.firebaseapp.com',
  projectId: 'react-todo-smit',
  storageBucket: 'react-todo-smit.appspot.com',
  messagingSenderId: '98449954238',
  appId: '1:98449954238:web:6f9f5d9efa145dc81d95ef',
  measurementId: 'G-QBWQTMCP3Q',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { analytics, auth, firestore };
