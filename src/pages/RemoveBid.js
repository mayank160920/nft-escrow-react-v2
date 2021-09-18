import React, { useState } from 'react';
import BidDetails from '../components/BidDetails';
import { NavLink } from 'react-router-dom';
import { TiTick } from 'react-icons/ti';

import BidSearch from '../components/BidSearch';
import ErrorDialog from '../components/ErrorDialog';
import {
  fetchBidDetails,
  estimate_remove_bid_call,
  execute_remove_bid_call,
} from '../components/web3Utils';

function RemoveBid(props) {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('26737973763');
  const [bidDetails, setBidDetails] = useState();
  const [bidRemoved, setBidRemoved] = useState(false);

  const handleSubmit = async () => {
    try {
      const bidData = await fetchBidDetails(props.escrowContract, inputValue);
      console.log(bidData);
      if (!bidData.status) {
        throw {
          message:
            'Invalid Bid Id ( Recently generated bids may take some time to show )',
        };
      }
      console.log('setBidDetails');
      setBidDetails(bidData);
    } catch (e) {
      setError(e.message);
    }
  };

  const removeBid = async () => {
    try {
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
      setError(e.message);
    }
  };

  if (bidRemoved) {
    return (
      <div className="wrapper">
        <TiTick style={{ fontSize: '5rem' }} />
        <h3>Bid Removed Successfully</h3>
        <NavLink className="bidOperation" to="/" exact>
          Home
        </NavLink>
      </div>
    );
  }

  return (
    <>
      {error ? <ErrorDialog error={error} setError={setError} /> : ''}

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
        />
      )}
    </>
  );
}

export default RemoveBid;
