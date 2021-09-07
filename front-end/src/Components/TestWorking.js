import React from 'react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import ASSET from '../artifacts/contracts/DexAuction.sol/DeXAuction.json';
import AUCTION from '../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json';
import { create as ipfsHttpClient } from 'ipfs-http-client'
require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

// For infura ipfs
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// For local ipfs node
const client = ipfsHttpClient('/ip4/127.0.0.1/tcp/5001/')

export default function TestWorking() {
    const [ipfs, setIpfsHash] = useState()
    const [description, setDescription] = useState()
    const [userAccount, setUserAccount] = useState()

    const requestAccount = async () => await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const mintNFT = async () => {
        if(typeof window.ethereum !== 'undefined'){
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log({ provider })
            const signer = provider.getSigner()
            const contract = new ethers.Contract(asset, ASSET.abi, signer)
            const transaction = await contract.Mint("QmcpMHuMuDnR4jQAtWth8LYJvtTGwrKc4nkM5RcKTusQu7")
            await transaction.wait()
            console.log(transaction);
        }
    }
    const ownerNFT = async () => {
        if(typeof window.ethereum !== 'undefined'){
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log({ provider })
            const signer = provider.getSigner()
            const contract = new ethers.Contract(asset, ASSET.abi, signer)
            const data = await contract.getOwnerAssets();
            let assets = await Promise.all(data.map(async i => {
              const tokenURI = await contract.tokenURI(i.TokenID);
              let asset = {
                tokenId: i.TokenID.toString(),
                owner: i.owner,
                tokenURI
              }
              return asset;
            }))
            console.log(assets);
        }
    }
    const [fileUrl, updateFileUrl] = useState(``)
    async function onChange(e) {
      const file = e.target.files[0]
      try {
        const added = await client.add(file)
        // const url = `https://ipfs.infura.io/ipfs/${added.path}`
        const url = `http://127.0.0.1:8080/ipfs/${added.cid}`
        console.log(`Added Path: ${added.path}`)
        console.log(`Generated url = ${url}`);
        updateFileUrl(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
    return (
        <div>
            <button onClick = {mintNFT}>MintNFT</button>
            <button onClick = {ownerNFT}>get My NFTs</button>
            <h1>IPFS</h1>
      <input
        type="file"
        onChange={onChange}
      />
      {
        fileUrl && (
          <img src={fileUrl} width="600px" />
        )
      }
        </div>
    )
}