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
  await Asset.SetAuctionAddress(Auction.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
