import React, { useContext, useState, Fragment } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { NFT } from "./AssetView";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";
import { UserAccount } from "../../App";
import placeHolder from "../../img/PlaceHolder.svg";
import { Dialog, Transition } from "@headlessui/react";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTassetView = (props) => {
  const history = useHistory();

  const nfts = useContext(NFT);

  const { id, index } = useParams();

  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);

  const [auctionInput, updateAuctionInput] = useState({
    price: "",
    duration: "",
  });
  let decimal = 1;

  const [check, setCheck] = useState(0);

  const Bvalid = "border-gray-200 placeholder-gray-400";
  const Binvalid = "border-red-600 placeholder-red-600";
  const Ovalid = "ring-black";
  const Oinvalid = "ring-red-400";

  const [isApprovalOpen, setApprovalModal] = useState(false);
  const [isCreateOpen, setCreateModal] = useState(false);

  const changeStatus = () => {
    props.status();
  };

  const openApproval = () => {
    setApprovalModal(true);
  };

  const closeApproval = () => {
    setApprovalModal(false);
  };

  const closeAndApprove = async () => {
    const { price, duration } = auctionInput;
    await approveAsset(nfts[index].tokenId);
    setApprovalModal(false);
    setCreateModal(true);
  };

  const closeCreate = () => {};

  const closeAndCreate = async () => {
    const { price, duration } = auctionInput;
    await createAuction(nfts[index].tokenId, price, duration);
    setCreateModal(false);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const balance = await contract.balanceOf(Account.toString());
    if (balance.toNumber() === 0) {
      history.push("/MyAssets");
      changeStatus();
    } else {
      history.push("/MyAssets/AssetView");
      props.viewState();
    }
  };

  async function BurnAsset() {
    const signer = provider.getSigner();

    /* next, create the item */
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const transaction = await contract.Burn(id);
    const tx = await transaction.wait();
    const balance = await contract.balanceOf(Account.toString());
    if (balance.toNumber() === 0) {
      history.push("/MyAssets");
      changeStatus();
    } else {
      history.push("/MyAssets/AssetView");
      props.viewState();
    }
  }

  async function approveAsset(tokenId) {
    const signer = provider.getSigner();

    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Approve(tokenId);
    let tx = await transaction.wait();
  }

  async function createAuction(tokenId, price, duration) {
    const signer = provider.getSigner();
    // console.log(parseInt(duration));
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    let transaction = await contract.CreateAuction(
      tokenId,
      ethers.utils.parseEther(price),
      parseInt(duration)
    );
    let tx = await transaction.wait();
  }

  async function approveAndCreate() {
    const { price, duration } = auctionInput;
    if (!price || !duration) {
      if (!price && !duration) {
        setCheck(3);
      } else if (!price) {
        setCheck(1);
      } else {
        setCheck(2);
      }
      return;
    }
    openApproval();
  }

  return (
    <Router>
      <GoBack change={() => props.viewState()} url={"/MyAssets/AssetView"} />
      <Route exact path={`/MyAssets/Asset/${id}/${index}`}>
        <div className="flex pt-36 pl-32 pr-32 pb-14 min-h-screen justify-center">
          <div className="w-full flex justify-center border h-max p-4">
            <img src={placeHolder} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full border">
            <div className="flex w-full h-full flex-col border items-center ">
              <div className="pt-10 pb-10 text-2xl">Asset Name</div>
              <div className="self-start pl-5 mb-4 border">
                Asset Id- {nfts[index].tokenId}
              </div>
              <div className="self-start pl-5 w-full h-2/5 border">
                Asset description
              </div>
              <div className="flex justify-evenly w-full mt-14 pl-8 pr-8 border">
                <button
                  onClick={BurnAsset}
                  className="flex items-center p-2 pl-4 pr-4  transition ease-in duration-200 uppercase rounded-full hover:bg-red-600 hover:text-white border-2 border-gray-900 focus:outline-none"
                >
                  Burn Asset
                </button>
                <Link to={`/MyAssets/Asset/Create/${id}/${index}`}>
                  <button className="flex items-center p-2 pl-4 pr-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
                    Create Auction
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Route>
      <Route path="/MyAssets/Asset/Create/:id/:index">
        <div className="pt-32 min-w-full">
          <div className=" w-1/2 mx-auto pt-20 flex flex-col justify-center pb-12">
            <input
              placeholder="Auction Price (ETH)"
              value={auctionInput.price}
              className={`mt-8 border ${
                check === 0 || check === 2 ? Bvalid : Binvalid
              } rounded p-4 placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
                check === 1 || check === 3 ? Oinvalid : Ovalid
              }`}
              onChange={(e) => {
                if (!isNaN(+e.target.value)) {
                  const temp = e.target.value.indexOf(".");
                  if (temp) {
                    if (e.target.value.substring(temp + 1).length <= 18) {
                      updateAuctionInput({
                        ...auctionInput,
                        price: e.target.value,
                      });
                    }
                  } else {
                    updateAuctionInput({
                      ...auctionInput,
                      price: e.target.value,
                    });
                  }
                } else {
                  return;
                }
                if (
                  auctionInput.price.length === 1 &&
                  e.nativeEvent.data === null
                ) {
                  setCheck(check === 2 ? 3 : 1);
                }
                if (!auctionInput.price) {
                  setCheck(check === 3 ? 2 : 0);
                }
              }}
            />
            <textarea
              placeholder="Auction Duration"
              className={`mt-2 border ${
                check === 0 || check === 1 ? Bvalid : Binvalid
              } rounded p-4 resize-none h-52 overflow-y-auto placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
                check === 2 || check === 3 ? Oinvalid : Ovalid
              }`}
              onChange={(e) => {
                if (
                  auctionInput.duration.length === 1 &&
                  e.nativeEvent.data === null
                ) {
                  setCheck(check === 1 ? 3 : 2);
                }
                if (!auctionInput.duration) {
                  setCheck(check === 3 ? 1 : 0);
                }
                updateAuctionInput({
                  ...auctionInput,
                  duration: e.target.value,
                });
              }}
            />
            <button
              onClick={approveAndCreate}
              className="font-bold mt-4 p-4 shadow-lg transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
            >
              Approve And Create Auction
            </button>
          </div>
        </div>
        <Transition appear show={isApprovalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeApproval}
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
                    Approve NFT
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Explain all rules and regulations here.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeAndApprove}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={isCreateOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeCreate}
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
                    NFT Approved Successfully
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Continue to Create Auction
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeAndCreate}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </Route>
    </Router>
  );
};
