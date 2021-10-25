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
    total: 0,
    days: 0,
    hours: 0,
  });
  // const [time, setTime] = useState({ total: 0, days: 0, hours: 0 });

  const [check, setCheck] = useState(0);

  const Bvalid = "border-gray-200 placeholder-gray-600";
  const Binvalid = "border-red-600 placeholder-red-600";
  const Ovalid = "ring-black";
  const Oinvalid = "ring-red-400";

  const [isApprovalOpen, setApprovalModal] = useState(false);
  const [isCreateOpen, setCreateModal] = useState(false);
  const [isScrollActive, setScroll] = useState(false);
  const [isBurnOpen, setBurnModal] = useState(false);

  const changeStatus = () => {
    props.status();
  };

  const activateScroll = () => {
    setScroll(true);
    console.log("Scroll Activated");
  };

  const deactivateScroll = () => {
    setScroll(false);
    console.log("Scroll Deactivated");
  };

  const openApproval = () => {
    setApprovalModal(true);
  };

  const closeApproval = () => {
    setApprovalModal(false);
  };

  const closeAndApprove = async () => {
    await approveAsset(nfts[index].tokenId);

    setApprovalModal(false);
    setCreateModal(true);
  };

  const closeCreate = () => {};

  const incrementDay = () => {
    // console.log(newTime);
    if (auctionInput.total === 720) {
      return;
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        total: prevState.total + 24,
        days: prevState.days + 1,
        hours: prevState.hours,
      }));
    }
  };

  const decrementDay = () => {
    if (auctionInput.days === 0) {
      return;
    } else if (auctionInput.total === 24) {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        total: prevState.total - 23,
        days: prevState.days - 1,
        hours: prevState.hours + 1,
      }));
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        total: prevState.total - 24,
        days: prevState.days - 1,
        hours: prevState.hours,
      }));
    }
    // setTime((prevState) => ({
    //   total: prevState.total,
    //   days: prevState.days - 1,
    //   hours: prevState.hours,
    // }));
  };

  const incrementHour = () => {
    if (auctionInput.total === 720) {
      return;
    } else if (auctionInput.hours === 23) {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        total: prevState.total + 1,
        days: prevState.days + 1,
        hours: 0,
      }));
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        total: prevState.total + 1,
        days: prevState.days,
        hours: prevState.hours + 1,
      }));
    }
    console.log("Hour incremeted");
  };

  const decrementHour = () => {
    if (auctionInput.hours === 0 || auctionInput.total === 1) {
      return;
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        total: prevState.total - 1,
        days: prevState.days,
        hours: prevState.hours - 1,
      }));
    }
  };

  const openBurn = () => {
    setBurnModal(true);
  };

  const CloseBurn = () => {
    setBurnModal(false);
  };

  const CloseAndBurn = async () => {
    await BurnAsset();
    setBurnModal(false);
  };

  // error handling below
  const closeAndCreate = async () => {
    const { price, total } = auctionInput;
    await createAuction(nfts[index].tokenId, price, total * 3600);
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
    const { price, total } = auctionInput;
    console.log(price + "    " + total);
    if (!price || total === 0) {
      if (!price && total === 0) {
        setCheck(3);
      } else if (!price) {
        setCheck(1);
      } else {
        setCheck(2);
      }
      return;
    }
    const signer = provider.getSigner();
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    if ((await contract.getApproved(nfts[index].tokenId)) === auction) {
      setCreateModal(true);
    } else openApproval();
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
                  onClick={openBurn}
                  className="flex items-center p-2 pl-4 pr-4  transition ease-in duration-200 uppercase rounded-full hover:bg-red-600 hover:text-white border-2 border-gray-900 hover:border-red-600 focus:outline-none"
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
        <Transition appear show={isBurnOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={CloseBurn}
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
                    Burn
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure You want to burn the NFT?
                    </p>
                  </div>

                  <div className=" flex mt-4">
                    <div className="flex-1  flex justify-center">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-red-300 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={CloseAndBurn}
                      >
                        Yes
                      </button>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-green-300 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={CloseBurn}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </Route>
      <Route path="/MyAssets/Asset/Create/:id/:index">
        <div className="pt-10 min-w-full h-screen">
          <div className=" w-1/2 mx-auto pt-20 flex flex-col justify-center pb-12">
            <input
              placeholder="Auction Price (ETH)"
              value={auctionInput.price}
              className={`mt-8 border select-none ${
                check === 0 || check === 2 ? Bvalid : Binvalid
              } rounded p-4 placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
                check === 1 || check === 3 ? Oinvalid : Ovalid
              } font-semibold`}
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
            <div
              className={`mt-2 border border-gray-200 rounded p-4 pt-2`}
              onMouseEnter={activateScroll}
              onMouseLeave={deactivateScroll}
            >
              <p
                className={`select-none ${
                  check === 0 || check === 1 ? "text-gray-600" : "text-red-600"
                } font-semibold`}
              >
                Auction Duration
              </p>
              <div className="flex p-4 pt-1">
                <div className="flex-1 flex flex-col">
                  <div className="text-2xl text-gray-600 font-semibold ml-auto mr-auto mb-2 select-none">
                    Days
                  </div>
                  <div className="flex justify-arround items-center">
                    <div
                      className={`h-10 w-10 ml-20 mr-auto ${
                        isScrollActive
                          ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                          : "transition-all delay-100 ease-out opacity-0"
                      }`}
                      onClick={incrementDay}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        class="icon icon-chevron-top"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z" />
                      </svg>
                    </div>
                    <div className="text-6xl w-24 text-center text-gray-600 font-semibold ml-auto mr-auto pb-1 select-none">
                      {auctionInput.days}
                    </div>
                    <div
                      className={`h-10 w-10 ml-auto mr-20 ${
                        isScrollActive
                          ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                          : "transition-all delay-100 ease-out opacity-0"
                      }`}
                      onClick={decrementDay}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        class="icon icon-chevron-bottom"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-2xl text-gray-600 font-semibold ml-auto mr-auto mb-2 select-none">
                    Hours
                  </div>
                  <div className="flex justify-arround items-center">
                    <div
                      className={`h-10 w-10 ml-20 mr-auto ${
                        isScrollActive
                          ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                          : "transition-all delay-100 ease-out opacity-0"
                      }`}
                      onClick={incrementHour}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        class="icon icon-chevron-top"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z" />
                      </svg>
                    </div>
                    <div className="text-6xl w-24 text-center text-gray-600 font-semibold ml-auto mr-auto pb-1 select-none">
                      {auctionInput.hours}
                    </div>
                    <div
                      className={`h-10 w-10 ml-auto mr-20 ${
                        isScrollActive
                          ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                          : "transition-all delay-100 ease-out opacity-0"
                      }`}
                      onClick={decrementHour}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        class="icon icon-chevron-bottom"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={approveAndCreate}
              className="font-bold relative top-64 p-4 select-none shadow-lg transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
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
                      Terms and conditions:
                      <br />
                      1. NFT will be escrowed till the end of auction.
                      <br />
                      2. Auction will be started as soon as it receives first
                      bid.
                      <br />
                      3. DexAuction's cut is the 2% of winning bid.
                      <br />
                      4. No charges if auction cancelled before it is over.
                      <br />
                      5. If auction cancelled NFT will be returned.
                      <br />
                      6. Seller's cut will be transferred as soon as NFT is
                      Claimed.
                      <br />
                      7. If NFT is not claimed within the claiming period. NFT
                      can be reclaimed by seller, with 25% bid amount as
                      compensation.
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

// <svg viewBox="0 0 32 32" class="icon icon-chevron-top" viewBox="0 0 32 32" aria-hidden="true"><path d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"/></svg>
// <svg viewBox="0 0 32 32" class="icon icon-chevron-bottom" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>
