import React from "react";
import { FaSpinner } from 'react-icons/fa';

function LoadingSpinner(props) {
  return (
      <div className="errorDialog" onClick={()=>{}}>
          <div className="spinnerCard">
            <FaSpinner className="rotate spinner"/>
            <h4>{props.text}</h4>
          </div>
      </div>
  )
}

export default LoadingSpinner;
