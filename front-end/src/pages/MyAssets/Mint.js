import React, { useState, useContext, Fragment } from "react";
import { ethers } from "ethers";
import { Dialog, Transition } from "@headlessui/react";
import { MetamaskProvider } from "../../App";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { useHistory } from "react-router";
import { GoBack } from "../../Components/Buttons/GoBack";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

const Mint = (props) => {
  let history = useHistory();
  const [check, setCheck] = useState(0);
  const [isOpen, setModal] = useState(false);
  const [errorcode, setErrorcode] = useState(0);

  const changeStatus = () => {
    props.status();
  };

  const [assetInput, updateAssetInput] = useState({
    name: "",
    description: "",
  });

  const provider = useContext(MetamaskProvider);

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
    console.log(tx);
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
  }

  async function createAsset() {
    const { name, description } = assetInput;
    if (!name || !description) {
      if (!name && !description) {
        setCheck(3);
      } else if (!name) {
        setCheck(1);
      } else {
        setCheck(2);
      }
      return;
    }

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
    });
    try {
      await MintAsset("Test");
    } catch (error) {
      console.log(error);
      setErrorcode(error.code);
      openModal();
      return;
    }
    changeStatus();
    history.push("/MyAssets");
  }

  const Bvalid = "border-gray-200 placeholder-gray-400";
  const Binvalid = "border-red-600 placeholder-red-600";
  const Ovalid = "ring-black";
  const Oinvalid = "ring-red-400";

  return (
    <>
      <div className=" pt-32 min-w-full">
        <GoBack url="/MyAssets" change={changeStatus} />
        <div className=" w-1/2 mx-auto pt-20 flex flex-col justify-center pb-12">
          <input
            placeholder="Asset Name"
            className={`mt-8 border ${
              check === 0 || check === 2 ? Bvalid : Binvalid
            } rounded p-4 placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
              check === 1 || check === 3 ? Oinvalid : Ovalid
            }`}
            onChange={(e) => {
              if (assetInput.name.length === 1 && e.nativeEvent.data === null) {
                setCheck(check === 2 ? 3 : 1);
              }
              if (!assetInput.name) {
                setCheck(check === 3 ? 2 : 0);
              }
              updateAssetInput({ ...assetInput, name: e.target.value });
            }}
          />
          <textarea
            placeholder="Asset Description"
            className={`mt-2 border ${
              check === 0 || check === 1 ? Bvalid : Binvalid
            } rounded p-4 resize-none h-52 overflow-y-auto placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
              check === 2 || check === 3 ? Oinvalid : Ovalid
            }`}
            onChange={(e) => {
              if (
                assetInput.description.length === 1 &&
                e.nativeEvent.data === null
              ) {
                setCheck(check === 1 ? 3 : 2);
              }
              if (!assetInput.description) {
                setCheck(check === 3 ? 1 : 0);
              }
              updateAssetInput({ ...assetInput, description: e.target.value });
            }}
          />
          <button
            onClick={createAsset}
            className="font-bold mt-4 p-4 shadow-lg transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
          >
            Create Digital Asset
          </button>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-gray-900"
                >
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
                    onClick={closeModal}
                  >
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
// -32603 nonce error
// 4001   Transaction denied
