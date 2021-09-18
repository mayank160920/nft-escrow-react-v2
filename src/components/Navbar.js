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
      setCurrentAddress(accounts[0]);
    });
    window.ethereum.on("chainChanged", (newChainId) => {
      console.log("Network Changed to Chain Id : ", newChainId);
      window.location.reload();
    });
    console.log("MetaMask Event Handlers Registered");
  }

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAddress(accounts[0]);

      if (!eventsRegistered) {
        registerEvents();
        setEventsRegistered(true);
      }
    } catch (e) {
      console.log(e);
      setError(e.message);
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
