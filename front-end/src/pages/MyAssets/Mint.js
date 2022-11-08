import React, { useState, useContext, Fragment, useRef } from "react";
import { ethers } from "ethers";
import { useHistory } from "react-router";
import { Dialog, Transition } from "@headlessui/react";
import { upload } from "../../Firebase";
import { MetamaskProvider } from "../../App";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { GoBack } from "../../Components/Buttons/GoBack";
import warning from "../../img/warning.svg";
import UseTitle from "../../Components/Title/UseTitle";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

const Mint = (props) => {
  let history = useHistory();

  // Set Title
  UseTitle("Mint NFT");

  const [isNameFilled, checkName] = useState(true);
  const [isDescriptionFilled, checkDescription] = useState(true);
  const [isFileSelected, checkFile] = useState(true);
  const [assetInput, updateAssetInput] = useState({
    name: "",
    description: "",
  });
  const [file, setFile] = useState("");
  const [fileError, setFileError] = useState("");
  const [progress, setProgress] = useState(null);
  const [minting, setMinting] = useState(false);

  const [isOpen, setModal] = useState(false);
  const [errorcode, setErrorcode] = useState(0);
  const refFileInput = useRef(null);
  const provider = useContext(MetamaskProvider);
  const Bvalid = "border-gray-200 placeholder-gray-400";
  const Binvalid = "border-red-600 placeholder-red-600";
  const Ovalid = "ring-black";
  const Oinvalid = "ring-red-400";

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    console.log(file);
    var reader = new FileReader();
    // Read the cotents of Image File.
    reader.readAsDataURL(file);
    reader.onload = async function (e) {
      //Initiate the JavaScript Image object.
      var image = new Image();
      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;
      image.onload = () => {
        setFile(file);
        checkFile(true);
        setFileError("");
        console.log("Loaded Successfully");
        console.log("Height: " + image.height);
        console.log("Width: " + image.width);
        console.log("File Name: " + file.name);
        console.log("File Size: " + formatBytes(file.size));
      };
      image.onerror = () => {
        console.log("Error Occurred on Loading");
        setFile("");
        setFileError("Image File Don't contain Image");
      };
    };
  };

  const changeStatus = () => {
    props.status();
  };

  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  async function MintAsset(url) {
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Mint(url);
    let tx = await transaction.wait();

    console.log("---Mint---");
    console.log("Mint Successful");
    console.log("Token ID: " + tx.events[0].args[2].toNumber());
    console.log("Block no.: " + tx.blockNumber);
  }

  async function createAsset() {
    const { name, description } = assetInput;
    let temp = false;
    if (!name) {
      temp = true;
      checkName(false);
    }
    if (!description) {
      temp = true;
      checkDescription(false);
    }
    if (!file) {
      temp = true;
      checkFile(false);
    }
    if (temp || progress != null || minting) {
      return;
    }
    let URL;
    try {
      console.log(file);

      // FireBase
      const NFTHash = await upload(file, "NFT", setProgress);
      console.log("NFT URL", NFTHash);

      const metaData = JSON.stringify({
        name,
        description,
        NFTHash,
      });

      console.log("Meta Data To Be Submitted: ", metaData);
      const metaBlob = new Blob([metaData], { type: "application/json" });
      const metaURL = await upload(metaBlob, "meta", setProgress);
      console.log("Meta URL", metaURL);

      URL = metaURL;

      // LOCAL IPFS
      /*
      // upload NFT to ipfs
      const nftAdded = await client.add(file);

      const NFTHash = nftAdded.path;
      console.log(nftAdded);
      // Prepare to upload all data to ipfs
      const data = JSON.stringify({
        name,
        description,
        NFTHash,
      });
      console.log(data);
      // upload data to ipfs
      const dataAdded = await client.add(data);
      URI = dataAdded.path;
      console.log(dataAdded);
      // For local IPFS node
      // const url = `http://127.0.0.1:8080/ipfs/${added.path}`;
      // console.log(added);
      // console.log(`Added Path: ${added.path}`);
      // console.log(`Generated url = ${url}`);
      */
    } catch (error) {
      console.log("Error uploading file: ", error);
      return;
    }
    try {
      setMinting(true);
      await MintAsset(URL);
      setMinting(false);
    } catch (error) {
      console.log(error);
      setMinting(false);
      setErrorcode(error.code);
      openModal();
      return;
    }
    changeStatus();
    history.push("/MyAssets");
  }

  return (
    <>
      <div className=" flex pl-auto border min-h-screen pr-auto justify-center">
        <GoBack url="/MyAssets" change={changeStatus} />
        <div className="flex w-1/2 mt-36 p-4 flex-col ">
          <input
            placeholder="Asset Name"
            className={`mt-8 border ${
              isNameFilled ? Bvalid : Binvalid
            } rounded p-4 placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
              isNameFilled ? Ovalid : Oinvalid
            }`}
            onChange={(e) => {
              if (assetInput.name.length === 1 && e.nativeEvent.data === null) {
                checkName(false);
              }
              if (!assetInput.name) {
                checkName(true);
              }
              updateAssetInput({ ...assetInput, name: e.target.value });
            }}
          />
          <textarea
            placeholder="Asset Description"
            className={`mt-2 border ${
              isDescriptionFilled ? Bvalid : Binvalid
            } rounded p-4 resize-none h-52 overflow-y-auto placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
              isDescriptionFilled ? Ovalid : Oinvalid
            }`}
            onChange={(e) => {
              if (
                assetInput.description.length === 1 &&
                e.nativeEvent.data === null
              ) {
                checkDescription(false);
              }
              if (!assetInput.description) {
                checkDescription(true);
              }
              updateAssetInput({ ...assetInput, description: e.target.value });
            }}
          />
          <div
            className={`mt-2 relative border rounded p-4 h-28 mb-3 ${
              isFileSelected ? "border-gray-200" : "border-red-600"
            } ${
              isFileSelected ? "text-gray-400" : "text-red-500"
            } text-center cursor-pointer`}
            onClick={() => {
              refFileInput.current.click();
            }}>
            {!file
              ? "Click to Select file"
              : `${file.name} - ${formatBytes(file.size)}`}
            {!fileError ? null : (
              <div className="absolute opacity-80 flex bottom-2 right-2 animate-pulse">
                <img className="h-4 self-end" src={warning} alt="Warning" />
                <div className="ml-1 text-xs">{fileError}</div>
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handleFile}
            ref={refFileInput}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={createAsset}
            className={`p-4 mt-auto mb-20 relative overflow-hidden font-semibold uppercase rounded-full border-2 border-gray-900 ${
              progress != null || minting
                ? "cursor-not-allowed"
                : "transition cursor-pointer ease-in duration-200 hover:bg-gray-800 hover:text-white  focus:outline-none"
            }`}>
            <div
              className="absolute h-full top-0 left-0 rounded-full bg-gray-200"
              style={{
                width: progress === null ? `0%` : `${progress}%`,
              }}></div>
            <span className="relative">
              {progress === null && minting === true
                ? "Waiting Approval..."
                : progress === null
                ? "Create Digital Asset"
                : "Uploading..."}
            </span>
          </button>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-gray-900">
                  {errorcode === 4001
                    ? "Transaction Denied"
                    : errorcode === -32603
                    ? "Nonce Too High"
                    : "Opps an unexpected Error occurred"}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {errorcode === 4001
                      ? `Looks like You denied transaction signature. Minting NFT is not free and requires Ether.`
                      : errorcode === -32603
                      ? "This can be easily resolved by reseting your Metamask Account. Go to Settings > Advanced > Reset Account to reset your account. NO, Your Ether won't be lost only account settings will reset."
                      : `${errorcode}: An Unknown error Occurred and has been reported. Sorry for inconvinience.`}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}>
                    OK
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Mint;
