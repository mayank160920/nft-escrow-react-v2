import React,{useState,useEffect} from 'react';

function ListBids(props) {

    const [Bids,setBids] = useState([]);

    async function fetchBids(address) {
        const _url = "https://cors-bypass.jmethew76.workers.dev/https://nft-escrow-react-v2.vercel.app/api/fetchBid"
        const response = await fetch(_url)
        const resJson = await response.json()
        console.log(resJson)
        return resJson;
    }

    useEffect(() => fetchBids())

    return (
        <div className="wrapper">
            {props.address}
        </div>
    )
}

export default ListBids;