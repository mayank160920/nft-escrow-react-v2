import React from 'react';
import {NavLink} from 'react-router-dom';

function ExploreBids() {
  return (
    <div className="wrapper">
      <h1 className="heading">Explore Bids</h1>
      <h4 className="heading">Coming Soon !</h4>
      <NavLink className="bidOperation" to="/" exact>
        Back
      </NavLink>
    </div>
  );
}

export default ExploreBids;
