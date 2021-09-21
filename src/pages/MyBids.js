import React,{useState,useEffect} from 'react';

import BidCard from '../components/BidCard';
import LoadingSpinner from "../components/LoadingSpinner";

function MyBids(props) {

    const [Bids,setBids] = useState([]);
    const [spinnerText, setSpinnerText] = useState("");

    async function fetchBids(address) {
      try {
        setSpinnerText("Fetching Bids")
        const _url = `https://cors-bypass.jmethew76.workers.dev/https://nft-escrow-react-v2.vercel.app/api/fetchBid?address=${address}`
        const response = await fetch(_url)
        const resJson = await response.json()
        console.log(resJson['result'])
        setBids(resJson['result']);
      } catch (error) {
        console.log(error);
      } finally {
        setSpinnerText("")
      }
    }
    
    useEffect(() => fetchBids(props.currentAddress),[])

    if (spinnerText) {
        return (<LoadingSpinner text={spinnerText} />);
    }

    return (
      <>
        <div className="myBids-container">
            { Bids.length != 0 
                ? Bids.map((bid) => (
                    <BidCard key={bid._id} bid={bid}/>
                    )) 
                : (<h3>No Bids Found !</h3>)
            }
        </div>
      </>
    )
}

export default MyBids;