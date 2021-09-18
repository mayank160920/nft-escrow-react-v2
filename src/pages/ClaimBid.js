import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { TiTick } from 'react-icons/ti';

import BidSearch from '../components/BidSearch';
import ErrorDialog from '../components/ErrorDialog';
import BidDetails from '../components/BidDetails';
import {
  fetchBidDetails,
  estimate_claim_bid_call,
  execute_claim_bid_call,
} from '../components/web3Utils';

function ClaimBid(props) {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('26737973763');
  const [bidDetails, setBidDetails] = useState();
  const [bidClaimed, setBidClaimed] = useState(false);

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
      setBidDetails(bidData);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const claimBid = async () => {
    try {
      await estimate_claim_bid_call(
        props.currentAddress,
        props.escrowContract,
        inputValue,
        bidDetails.weth_expected
      );
      await execute_claim_bid_call(
        props.currentAddress,
        props.escrowContract,
        inputValue,
        bidDetails.weth_expected
      );
      setBidClaimed(true);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  if (bidClaimed) {
    return (
      <div className="wrapper">
        <TiTick style={{ fontSize: '5rem' }} />
        <h3>Bid Claimed Successfully</h3>
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
          contractsData={props.contractsData}
          hideToggle={setBidDetails}
          buttonTitle={'Claim Bid'}
          functionalToggle={claimBid}
        />
      ) : (
        <BidSearch
          title="Claim Bid"
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default ClaimBid;
