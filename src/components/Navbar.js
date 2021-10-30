import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import ErrorDialog from "./ErrorDialog";

function Navbar(props) {
  const [error, setError] = useState("");
  const [eventsRegistered, setEventsRegistered] = useState(false);
  const address = props.address
  const setCurrentAddress = props.setCurrentAddress

  function parseAddress(address) {
    return address.slice(0, 4) + "..." + address.slice(-4);
  }
  
  function registerEvents() {
    window.ethereum.on("accountsChanged", (accounts) => {
      setCurrentAddress(Web3.utils.toChecksumAddress(accounts[0]));
      if (!accounts.length) {
        setError('Connect Your Wallet to access the site')
      }
    });
    window.ethereum.on("chainChanged", (newChainId) => {
      console.log("Network Changed to Chain Id : ", parseInt(newChainId));
      window.location.reload();
    });
    console.log("MetaMask Event Handlers Registered");
  }

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAddress(Web3.utils.toChecksumAddress(accounts[0]));

      if (!eventsRegistered) {
        registerEvents();
        setEventsRegistered(true);
      }

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId) != 250) {
        return setError("Please select FTM Network in your wallet")
      }

      setError("");
    } catch (e) {
      console.log(e);
      setError("Connect Your Wallet to access the site");
    }
  }

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <>
      <div className="navBar">
        <NavLink to="/" exact>
          <FaHome className="homeIcon" />
        </NavLink>

        <div className="navItem-container">
          <a href onClick={() => connectWallet()}>
            {address ? parseAddress(address) : "Connect"}
          </a>
        </div>
      </div>

      {error ? (
        <ErrorDialog error={error} setError={setError} reload={true} />
      ) : (
          ""
        )}
    </>
  );
}

export default Navbar;
