const hre = require("hardhat");

async function main() {
  const asset = await hre.ethers.getContractFactory("DeXAuction");
  const Asset = await asset.deploy();
  await Asset.deployed();
  const auction = await hre.ethers.getContractFactory("AuctionBase");
  const Auction = await auction.deploy(Asset.address);
  await Auction.deployed();
  console.log("DeX-Auction deployed to:", Asset.address);
  console.log("AuctionBase deployed to:", Auction.address);
  await Asset.SetAuctionAddress(Auction.address);

  const NFTmetas = [
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F0eb2b289-be96-4a27-87fb-9bcdfea4a32d?alt=media&token=3097da0e-beef-44ea-89d4-dbed77b99d0c",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F157f3db5-9e1c-4aa0-b254-36e9bce87b6a?alt=media&token=ea925802-9110-483a-ba34-9b52f74f7575",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F18767da3-5ab4-4172-96ac-b958eb6cd58d?alt=media&token=d336f648-31c4-43e7-b70a-1d4321f055c6",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F1923eaee-754d-4f13-aec4-09bd99c35289?alt=media&token=0058899e-d459-4699-ae7f-90e3fbe578f9",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F35ddc7a2-cda4-4bd5-a6f4-55ea38f04fbb?alt=media&token=68f50692-88e0-4749-b248-da623a8e9254",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F3ddfed0f-5068-4b1a-8b2c-244cb246c88c?alt=media&token=81800e54-1133-403b-ad62-9ceb0832884a",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F62870a72-dab1-40e1-b8e2-d8f2b101d6f5?alt=media&token=a345f4b0-7893-4b5b-884a-1c2a36f366e9",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F635c26ca-2401-49ec-b1b8-171fe7d4e02d?alt=media&token=46c95d6d-f410-43db-a630-5ab108d4c8ce",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F67e19fae-71b1-4150-89a8-73910f89e5b6?alt=media&token=08494731-688c-429d-926f-9e5806c6fe83",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F69dd398d-0fcb-49c5-90b9-7c7e717f6574?alt=media&token=7080424d-e638-4756-bef8-d269e8c0e905",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F6acfe36f-516a-45bd-bf1d-9a25ae2535b8?alt=media&token=7e1ec8a7-a10c-4cf8-a617-50199e2cdcbf",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F8dabe5a1-4bf3-48a6-8b65-6ad7d403f987?alt=media&token=3a560198-5f4d-4ffa-a89b-ad1c373b88c0",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F97761670-c54e-4cf5-a0de-f144928cfea3?alt=media&token=d3e9f0f5-0c88-4967-8606-1e29b816b505",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2F9f447e89-bc03-46e5-a941-859757f14ddf?alt=media&token=3e2147f8-44dc-4f9d-9de0-a8441586416d",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2Fb093d3a7-e418-4529-a6b6-db2c36518c30?alt=media&token=8e207d00-9afa-42fb-8fba-ceef981d0c56",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2Fb2cc7a92-3dff-485f-b5a1-7dfa9c1f2f98?alt=media&token=a6e93c80-e7a2-4f7f-981d-5c11893c6baa",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2Fb9632055-b6e5-4c52-a907-700b768c2627?alt=media&token=2ef14ab8-82e3-4cb4-858a-a12e797fc20e",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2Fbd5ae597-6fc0-4b86-b3f8-70db279b44d2?alt=media&token=d6a6c431-bf8f-4aa0-b5a8-24ba29c22080",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2Fc1cd83c0-a37a-43b8-9dfa-2190b2fb2678?alt=media&token=43fec010-3a5d-4f24-bbbb-ba9eae543165",
    "https://firebasestorage.googleapis.com/v0/b/dex-auction.appspot.com/o/meta%2Fda8a4ff2-1a8b-441e-8896-03426b94f88c?alt=media&token=d699c64e-6619-4703-b54b-a5cc139c9f6d",
  ];
  for (let i = 0; i < 20; ++i) {
    await Asset.Mint(NFTmetas[i]);
    console.log("Minted NFT: ", i + 1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
