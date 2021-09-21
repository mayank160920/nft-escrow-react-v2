import React,{useState,useEffect} from 'react';

import BidCard from '../components/BidCard';

function MyBids(props) {

    const [Bids,setBids] = useState([]);

    async function fetchBids(address) {
        const _url = "https://cors-bypass.jmethew76.workers.dev/https://nft-escrow-react-v2.vercel.app/api/fetchBid"
        const response = await fetch(_url)
        const resJson = await response.json()
        console.log(resJson['result'])
        setBids(resJson['result']);
    }

    useEffect(() => fetchBids(),[])

    return (
        <div className="myBids-container">
            { Bids.length != 0 
                ? Bids.map((bid) => (
                    <BidCard key={bid._id} bid={bid}/>
                    )) 
                : (<h3>No Bids Found !</h3>)
            }
        </div>
    )
}

export default MyBids;