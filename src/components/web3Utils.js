export const parseImageUri = (url) => {
  const _proxy = 'https://cors-bypass.jmethew76.workers.dev/'
  if (url.match(/https?:\/\//)) {
    return _proxy + url;
  } 
  const ipfsMatch = url.match(/ipfs?:\/\/(.*)/)
  if (ipfsMatch) {
    return _proxy + "https://ipfs.io/ipfs/"+ipfsMatch[1]
  }
  return _proxy + url;
}

export const fetchTokenImageUrl = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data["image"];
};


export const getContract = (abi, address) => {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(abi, address);
};

export const fetchBidDetails = async (contract, bidNumber) => {
  const details = await contract.methods.ledger(bidNumber).call();
  return details;
};

export const fetchNFTImage = async (nftContract, nftId) => {
  const details = await nftContract.methods.tokenURI(nftId).call();
  return details;
};

export const fetchNFTName = async (nftContract) => {
  const details = await nftContract.methods.name().call();
  return details;
};

export const fetchNFTSymbol = async (nftContract) => {
  const details = await nftContract.methods.symbol().call();
  return details;
};

export async function check_approval_status(
  account,
  nftContract,
  nftAddress,
  nftId,
  escrowAddress
) {
  try {
    await nftContract.methods
      .transferFrom(account, nftAddress, nftId)
      .estimateGas({ from: escrowAddress, value: 0 });
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function approve(account, nftContract, nftId, escrowAddress) {
  try {
    await nftContract.methods
      .approve(escrowAddress, nftId)
      .estimateGas({ from: account, value: 0 });
    await nftContract.methods
      .approve(escrowAddress, nftId)
      .send({ from: account, value: 0 });
  } catch (error) {
    var error_message = error.message;
    if (
      error.message.includes(
        "ERC721: approve caller is not owner nor approved for all"
      )
    ) {
      error_message = "You need to be the NFT Owner to place the Bid.";
    }
    throw { message: error_message, title: "ERROR !" };
  }
}

export async function estimate_claim_bid_call(
  account,
  escrowContract,
  bidNumber,
  price
) {
  try {
    await escrowContract.methods
      .claim_bid(bidNumber)
      .estimateGas({ from: account, value: price });
  } catch (error) {
    console.log(error);
    var error_message = error.message;
    if (error.message.includes("execution reverted: Wrong Buyer")) {
      error_message = `Buyer Address Does Not Match`;
    } else if (
      error.message.includes(
        "execution reverted: ERC721: transfer caller is not owner nor approved"
      )
    ) {
      error_message = `Looks like seller revoked the permission to transfer NFT`;
    } else if (
      error.message.includes(
        "insufficient balance for transfer"
      )
    ) {
      error_message = `Insufficient balance for transfer`;
    }
    throw { message: error_message };
  }
}

export async function execute_claim_bid_call(
  account,
  escrowContract,
  bidNumber,
  price
) {
  try {
    await escrowContract.methods
      .claim_bid(bidNumber)
      .send({ from: account, value: price });
  } catch (error) {
    console.log(error);
    var error_message = error.message;
    if (error.code == -32603) {
      throw { message: "txn underpriced" };
    }
    throw { message: error_message };
  }
}

export async function estimate_remove_bid_call(
  account,
  escrowContract,
  bidNumber
) {
  try {
    await escrowContract.methods
      .remove_bid(bidNumber)
      .estimateGas({ from: account, value: 0 });
  } catch (error) {
    console.log(error);
    var error_message = error.message;
    if (error.message.includes("execution reverted: Invalid Key")) {
      error_message = `Invalid Key`;
    }
    if (error.message.includes("execution reverted: Wrong Buyer")) {
      error_message = `Buyer Address Does Not Match`;
    }
    if (
      error.message.includes("Transaction Issuer and Seller Address Mismatch")
    ) {
      error_message = `Only Creator can remove the Bid`;
    }
    if (
      error.message.includes(
        "execution reverted: ERC721: transfer caller is not owner nor approved"
      )
    ) {
      error_message = `Looks like seller revoked the permission to transfer NFT`;
    }
    throw { message: error_message, title: "ERROR !" };
  }
}

export async function execute_remove_bid_call(
  account,
  escrowContract,
  bidNumber
) {
  try {
    await escrowContract.methods
      .remove_bid(bidNumber)
      .send({ from: account, value: 0 });
  } catch (error) {
    console.log(error);
    var error_message = error.message;
    if (error.code == -32603) {
      throw { message: "txn underpriced", title: "ERROR !" };
    }
    throw { message: error_message, title: "ERROR !" };
  }
}

export async function estimate_place_bid_call(
  account,
  escrowContract,
  bidNumber,
  nftId,
  nftAddress,
  buyerAddress,
  nftPrice
) {
  try {
    return await escrowContract.methods
      .place_bid(bidNumber, nftId, nftAddress, account, buyerAddress, nftPrice)
      .estimateGas({ from: account, value: 0 });
  } catch (error) {
    console.log(error);
    var error_message = error.message;
    // var error_message = 'Looks like NFT Address Is Not Supported';
    throw { message: error_message, title: "ERROR !" };
  }
}

export async function execute_place_bid_call(
  account,
  escrowContract,
  bidNumber,
  nftId,
  nftAddress,
  buyerAddress,
  nftPrice,
  gas=null
) {
  try {
    var txnDict = { from: account, value: 0 }
    gas ? txnDict.gas = gas : null
    const txn = await escrowContract.methods
      .place_bid(bidNumber, nftId, nftAddress, account, buyerAddress, nftPrice)
      .send(txnDict);
    console.log(txn);
  } catch (error) {
    console.log(error);
    if (error.code == -32603) {
      throw { message: "txn underpriced", title: "ERROR !" };
    }
    throw { message: error.message, title: "ERROR !" };
  }
}
