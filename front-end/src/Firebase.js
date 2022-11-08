import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyD3rh8fOYOK0dGV_-XYRZWmNJ3FeUpXH-A",
  authDomain: "dex-auction.firebaseapp.com",
  projectId: "dex-auction",
  storageBucket: "dex-auction.appspot.com",
  messagingSenderId: "135654677912",
  appId: "1:135654677912:web:340098f8f80a06e5969fed",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const upload = async (dataToUpload, bucket, setProgress) => {
  const storageRef = ref(storage, `${bucket}/${uuid()}`);
  const uploadTask = uploadBytesResumable(storageRef, dataToUpload);
  let URL = new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const currProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(currProgress);
        console.log(`${currProgress}% uploaded`);
      },
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          resolve(downloadURL);
          setProgress(null);
        });
      }
    );
  });
  return URL;
};
