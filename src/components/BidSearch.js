import React from 'react';

function BidSearch(props) {
  return (
    <div className="wrapper">
      <h1 className="heading">{props.title || 'Title Not Specified'}</h1>
      <input
        type="number"
        className="input-field"
        placeholder="Bid Number"
        value={props.inputValue}
        onChange={(event) => {
          props.setInputValue(event.target.value);
        }}
      />
      <a
        className="bidOperation"
        onClick={() => {
          props.handleSubmit();
        }}
      >
        Search Bid
      </a>
    </div>
  );
}

export default BidSearch;
