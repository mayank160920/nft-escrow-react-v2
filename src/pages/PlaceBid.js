import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { TiTick } from "react-icons/ti";

// import { Web3 } from 'web3';

import ErrorDialog from "../components/ErrorDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getContract,
  check_approval_status,
  approve,
  estimate_place_bid_call,
  execute_place_bid_call,
} from "../components/web3Utils";

// json
const contractData = require("../contract/contractData.json");

function PlaceBid(props) {
  const [error, setError] = useState("");
  const [spinnerText, setSpinnerText] = useState("");
  const [bidNumber, setBidNumber] = useState("");
  const [buyerAddressProvided, setBuyerAddressProvided] = useState(false);

  const [nftId, setNftId] = useState("263");
  const [nftAddress, setNftAddress] = useState(
    "0x41a7cf08157c9900689163a4a9930f8684aa58b7"
  );
  const [nftBuyer, setNftBuyer] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [nftPrice, setNftPrice] = useState("1000000000000000000");

  const erc721Abi = contractData.abi.erc721_contract;
  const escrowAddress = contractData.address.escrow_contract;
  const currentAddress = props.currentAddress;
  const escrowContract = props.escrowContract;

  const validateInput = () => {
    if (!Web3.utils.isAddress(nftAddress)) {
      throw { message: "Invalid NFT Address" };
    }
    if (!Web3.utils.isAddress(nftBuyer)) {
      throw { message: "Invalid Buyer Address" };
    }
    try {
      Web3.utils.toWei(nftPrice);
    } catch (e) {
      throw { message: "Invalid NFT Price" };
    }
    try {
      Web3.utils.toWei(nftId);
    } catch (e) {
      throw { message: "Invalid NFT Id" };
    }
  };

  const placeBid = async () => {
    try {
      setSpinnerText("Validating Input");
      validateInput();
      const _bidNumber = Math.floor(Math.random() * 100000000000);
      const nftContract = getContract(erc721Abi, nftAddress);

      const is_approved = await check_approval_status(
        currentAddress,
        nftContract,
        nftAddress,
        nftId,
        contractData.address.escrow_contract
      );
      if (!is_approved) {
        setSpinnerText("Approving NFT");
        await approve(currentAddress, nftContract, nftId, escrowAddress);
      }

      setSpinnerText("Placing Bid");
      await estimate_place_bid_call(
        currentAddress,
        escrowContract,
        _bidNumber,
        nftId,
        nftAddress,
        nftBuyer,
        Web3.utils.toWei(nftPrice)
      );
      await execute_place_bid_call(
        currentAddress,
        escrowContract,
        _bidNumber,
        nftId,
        nftAddress,
        nftBuyer,
        Web3.utils.toWei(nftPrice)
      );
      setSpinnerText("");
      setBidNumber(_bidNumber);
    } catch (e) {
      console.log(e);
      setSpinnerText("");
      setError(e.message);
    }
  };

  if (bidNumber) {
    return (
      <div className="wrapper">
        <TiTick style={{ fontSize: "5rem" }} />
        <h3>Bid Placed Successfully</h3>
        <h4 className="bidKey">Bid Number</h4>
        <h4 className="bidValue">{bidNumber}</h4>
        <h4 className="bidKey">Claim Link</h4>
        <a className="bidValue">{window.location.origin + `/claimbid?bid=${bidNumber}`}</a>
        <NavLink className="bidOperation" to="/" exact>
          Home
        </NavLink>
      </div>
    );
  }

  return (
    <>
      {error ? <ErrorDialog error={error} setError={setError} /> : ""}
      {spinnerText ? <LoadingSpinner text={spinnerText} /> : ""}
      <div className="wrapper">
        <h1 className="heading">Place Bid</h1>

        <input
          type="text"
          className="input-field"
          placeholder="NFT Address"
          value={nftAddress}
          onChange={(event) => setNftAddress(event.target.value)}
        />
        <input
          type="number"
          className="input-field"
          placeholder="NFT Id"
          value={nftId}
          onChange={(event) => setNftId(event.target.value)}
        />
        <input
          type="number"
          className="input-field"
          placeholder="NFT Price"
          value={nftPrice}
          onChange={(event) => setNftPrice(event.target.value)}
        />

        <div className="checkBox-container">
          <input
            id="bidType"
            type="checkbox"
            checked={buyerAddressProvided}
            onChange={() => {
              if (buyerAddressProvided) {
                setNftBuyer("0x0000000000000000000000000000000000000000");
              }
              setBuyerAddressProvided(!buyerAddressProvided);
            }}
          />
          <label htmlFor="bidType">Specify Buyer Address</label>
        </div>

        {buyerAddressProvided ? (
          <input
            type="text"
            className="input-field"
            placeholder="Buyer Address"
            value={nftBuyer}
            onChange={(event) => setNftBuyer(event.target.value)}
          />
        ) : (
          ""
        )}

        <a className="bidOperation" onClick={() => placeBid()}>
          Place Bid
        </a>
        <NavLink className="bidOperation" to="/" exact>
          Back
        </NavLink>
      </div>
    </>
  );
}

export default PlaceBid;
