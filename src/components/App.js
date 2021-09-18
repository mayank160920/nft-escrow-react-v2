import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
// import {Web3} from 'web3';

import {getContract} from './web3Utils';
import Navbar from './Navbar';
import BidOperations from './BidOperations';
import ErrorDialog from '../components/ErrorDialog';
import PlaceBid from '../pages/PlaceBid';
import ClaimBid from '../pages/ClaimBid';
import RemoveBid from '../pages/RemoveBid';
import ExploreBids from '../pages/ExploreBids';

// styles
import '../style.css';

function App() {
  const [error, setError] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [escrowContract, setEscrowContract] = useState();
  const [contractsData, setContractsData] = useState();

  async function fetchContractsInfo() {
    // const _url = 'https://cors-bypass.jmethew76.workers.dev/https://nft-escrow-tombhead.vercel.app/api/data';
    const _url = 'https://cors-bypass.jmethew76.workers.dev/https://jsonkeeper.com/b/J8WV';
    const response = await fetch(_url);
    const data = await response.json();
    return data;
  }

  async function onPageLoad() {
    console.log("onPageLoad")
    const data = await fetchContractsInfo();
    setContractsData(data);
    
    const contract = getContract(data.abi.escrow_contract, data.address.escrow_contract)
    console.log("escrowContract Saved : ",contract);
    setEscrowContract(contract);
  }

  useEffect(() => {
    onPageLoad();
  }, []);

  return (
    <div>
      <Navbar address={currentAddress} setCurrentAddress={setCurrentAddress} />
      {error ? <ErrorDialog error={error} setError={setError} /> : ''}
      <Switch>

        <Route path="/" exact>
          <h1 className="heading">NFT ESCROW</h1>
          <BidOperations />
        </Route>

        <Route path="/placebid">
          <PlaceBid
            escrowContract={escrowContract}
            currentAddress={currentAddress}
            contractsData={contractsData}
          />
        </Route>

        <Route path="/claimbid">
          <ClaimBid
            escrowContract={escrowContract}
            currentAddress={currentAddress}
            contractsData={contractsData}          
          />
        </Route>

        <Route path="/removebid">
          <RemoveBid
            escrowContract={escrowContract}
            currentAddress={currentAddress}
            contractsData={contractsData}          
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
