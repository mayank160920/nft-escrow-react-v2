import React, { useEffect, useState } from 'react'
import { fetchNFTImage,getContract,parseImageUri,fetchTokenImageUrl } from './web3Utils';

// json
const contractData = require("../contract/contractData.json");

function BidCard(props) {
    const [nftImage,setNftImage] = useState('');
    const erc721Abi = contractData.abi.erc721_contract;

    async function onLoad() {
        const nftContract = getContract(erc721Abi, props.bid.nft_address);
        const imageUrlApi = await fetchNFTImage(nftContract, props.bid.nft_id);
        const imageURL = await fetchTokenImageUrl(parseImageUri(imageUrlApi));
        setNftImage(parseImageUri(imageURL));
    } 

    useEffect(() => onLoad());

    return (
        <div className="bidCard">
            <div className="nft-img">
                {
                    nftImage.split(".").pop() == ('mp3','mp4')
                    ? (
                        <video
                        className="skeleton"
                        src={nftImage || "#"}
                        width="300px"
                        height="300px"
                        />
                    ) : (
                        <img
                        className="skeleton"
                        src={nftImage || "#"}
                        width="300px"
                        height="300px"
                        />
                    )
                }
            </div>            
            <h4 className="bidKey">Bid No :</h4>
            <h4 className="bidValue">{props.bid._id}</h4>
            <h4 className="bidKey">Bid Price :</h4>
            <h4 className="bidValue">{props.bid.weth_expected} FTM</h4>
        </div>
    )
}

export default BidCard;
