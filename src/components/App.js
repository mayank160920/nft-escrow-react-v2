import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import {getContract} from './web3Utils';
import Navbar from './Navbar';

import ErrorDialog from '../components/ErrorDialog';
import Banner from '../components/Banner';
import PlaceBid from '../pages/PlaceBid';
import ClaimBid from '../pages/ClaimBid';
import RemoveBid from '../pages/RemoveBid';
import ExploreBids from '../pages/ExploreBids';
import Home from '../pages/Home';
import MyBids from '../pages/MyBids';

// styles
import '../style.css';

// json
const contractData = require("../contract/contractData.json");

function App() {
  const [error, setError] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [escrowContract, setEscrowContract] = useState();

  async function fetchContractsInfo() {
    // const _url = 'https://cors-bypass.jmethew76.workers.dev/https://nft-escrow-tombhead.vercel.app/api/data';
    const _url = 'https://cors-bypass.jmethew76.workers.dev/https://jsonkeeper.com/b/Z3FX';
    const response = await fetch(_url);
    const data = await response.json();
    return data;
  }

  async function onPageLoad() {
    // const data = await fetchContractsInfo();
    // setContractsData(data);
    // console.log('fetchContractsInfo Executed',data)
    
    const contract = getContract(contractData.abi.escrow_contract, contractData.address.escrow_contract)
    setEscrowContract(contract);
  }

  useEffect(() => {
    onPageLoad();
  }, []);

  return (
    <div>
      <Navbar address={currentAddress} setCurrentAddress={setCurrentAddress} />
      <Banner/>
      {error ? <ErrorDialog error={error} setError={setError} /> : ''}
      <Switch>

        <Route path="/" exact>
          <Home />
        </Route>

        <Route path="/placebid">
          <PlaceBid
            escrowContract={escrowContract}
            currentAddress={currentAddress}
          />
        </Route>

        <Route path="/claimbid">
          <ClaimBid
            escrowContract={escrowContract}
            currentAddress={currentAddress}          
          />
        </Route>

        <Route path="/removebid">
          <RemoveBid
            escrowContract={escrowContract}
            currentAddress={currentAddress}          
          />
        </Route>

        <Route path="/removebid">
          <RemoveBid
            escrowContract={escrowContract}
            currentAddress={currentAddress}          
          />
        </Route>

        <Route path="/mybids">
          <MyBids
            currentAddress={currentAddress}          
          />
        </Route>

        <Route path="/explorebids">
          <ExploreBids />
        </Route>

      </Switch>
    </div>
  );
}

export default App;
