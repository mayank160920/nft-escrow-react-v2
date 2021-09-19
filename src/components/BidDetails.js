import React, { useState, useEffect } from "react";
import {parseImageUri} from "./web3Utils"
import {
  getContract,
  fetchNFTImage,
  fetchNFTName,
  fetchNFTSymbol,
} from "./web3Utils";

// json
const contractData = require("../contract/contractData.json");

function BidDetails(props) {
  const [nftImage, setNftImage] = useState("");
  const [nftName, setNftName] = useState("...");
  const [nftSymbol, setNftSymbol] = useState("...");

  const nftId = props.bidDetails.nft_id;
  const nftAddress = props.bidDetails.nft_address;
  const nftBuyer = props.bidDetails.nft_buyer;
  const nftSeller = props.bidDetails.nft_seller;
  const nftPrice = props.bidDetails.weth_expected;

  const erc721Abi = contractData.abi.erc721_contract;

  const fetchTokenImageUrl = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data["image"];
  };

  const onLoad = async () => {
    const nftContract = getContract(erc721Abi, nftAddress);
    const _nftName = await fetchNFTName(nftContract);
    const _nftSymbol = await fetchNFTSymbol(nftContract);
    const imageUrlApi = await fetchNFTImage(nftContract, nftId);
    console.log(imageUrlApi);
    const imageURL = await fetchTokenImageUrl(parseImageUri(imageUrlApi));
    console.log(imageURL);

    setNftImage(parseImageUri(imageURL));
    setNftSymbol(_nftSymbol);
    setNftName(_nftName);
  };

  useEffect(() => onLoad(), []);

  return (
    <div className="wrapper">
      <h1 className="heading">Bid details</h1>

      <div className="nft-img">
        <img
          className="skeleton"
          src={nftImage || "#"}
          width="300px"
          height="300px"
        />
      </div>

      <div className="nft-details">
        <h4 className="bidKey">NFT Name</h4>
        <p className="bidValue">{nftName}</p>
        <h4 className="bidKey">NFT Symbol</h4>
        <p className="bidValue">{nftSymbol}</p>
        <h4 className="bidKey">NFT Id</h4>
        <p className="bidValue">{nftId}</p>
        <h4 className="bidKey">NFT Address</h4>
        <p className="bidValue">{nftAddress}</p>
        <h4 className="bidKey">NFT Seller</h4>
        <p className="bidValue">{nftSeller}</p>

        {nftBuyer != "0x0000000000000000000000000000000000000000" ? (
          <>
            <h4 className="bidKey">NFT Buyer</h4>
            <p className="bidValue">{nftBuyer}</p>
          </>
        ) : (
          ""
        )}

        <h4 className="bidKey">NFT Price</h4>
        <p className="bidValue">
          {nftPrice
            ? `${Web3.utils.fromWei(Web3.utils.toBN(nftPrice))} FTM`
            : ""}
        </p>
      </div>
      <a className="bidOperation" onClick={() => props.functionalToggle()}>
        {props.buttonTitle}
      </a>
      <a className="bidOperation" onClick={() => props.hideToggle("")}>
        Back
      </a>
    </div>
  );
}

export default BidDetails;
