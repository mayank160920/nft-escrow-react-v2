import React, { useState } from "react";
import BidDetails from "../components/BidDetails";
import { NavLink } from "react-router-dom";
import { TiTick } from "react-icons/ti";

import useQuery from "../hooks/useQuery";

import BidSearch from "../components/BidSearch";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDialog from "../components/ErrorDialog";
import {
  fetchBidDetails,
  estimate_remove_bid_call,
  execute_remove_bid_call,
} from "../components/web3Utils";

function RemoveBid(props) {
  const bidNumber = useQuery().get("bid")

  const [error, setError] = useState("");
  const [spinnerText, setSpinnerText] = useState("");
  const [inputValue, setInputValue] = useState(bidNumber || "26737973763");
  const [bidDetails, setBidDetails] = useState();
  const [bidRemoved, setBidRemoved] = useState(false);

  const handleSubmit = async () => {
    try {
      const bidData = await fetchBidDetails(props.escrowContract, inputValue);
      console.log(bidData);
      if (!bidData.status) {
        throw {
          message:
            "Invalid Bid Id ( Recently generated bids may take some time to show )",
        };
      }
      console.log("setBidDetails");
      setBidDetails(bidData);
    } catch (e) {
      setError(e.message);
    }
  };

  const removeBid = async () => {
    try {
      setSpinnerText("Removing Bid");
      await estimate_remove_bid_call(
        props.currentAddress,
        props.escrowContract,
        inputValue
      );
      await execute_remove_bid_call(
        props.currentAddress,
        props.escrowContract,
        inputValue
      );
      setBidRemoved(true);
    } catch (e) {
      console.log(e);
      setSpinnerText("");
      setError(e.message);
    }
  };

  if (bidRemoved) {
    return (
      <div className="wrapper">
        <TiTick style={{ fontSize: "5rem" }} />
        <h3>Bid Removed Successfully</h3>
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

      {bidDetails ? (
        <BidDetails
          bidDetails={bidDetails}
          hideToggle={setBidDetails}
          buttonTitle="Remove Bid"
          functionalToggle={removeBid}
        />
      ) : (
        <BidSearch
          title="Remove Bid"
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          showMyBid={true}
        />
      )}

    </>
  );
}

export default RemoveBid;
