import React from "react";
import { NavLink } from "react-router-dom";

function BidOperations() {
  return (
    <div className="wrapper">
      <h1 className="heading">NFT ESCROW</h1>
      <NavLink className="bidOperation" to="/explorebids">
        Explore Bids
      </NavLink>
      <NavLink className="bidOperation" to="/placebid">
        Place Bid
      </NavLink>
      <NavLink className="bidOperation" to="/claimbid">
        Claim Bid
      </NavLink>
      <NavLink className="bidOperation" to="/removebid">
        Remove Bid
      </NavLink>
    </div>
  );
}

export default BidOperations;
