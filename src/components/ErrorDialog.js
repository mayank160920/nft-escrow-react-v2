import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

function ErrorDialog(props) {
  const reload = props.reload || false;
  const error = props.error;
  const setError = props.setError;
  const title = props.title;
  const description = props.description;

  const clickHandler = () => {
    if (!reload) {
      setError('');
    }
  };

  return (
    <div className="errorDialog" onClick={() => clickHandler()}>
      <div className="errorDialog-card">
        <h1>{title || <FiAlertTriangle />}</h1>
        <h4>{error}</h4>
        <h6>{description}</h6>
        {reload ? (
          <button
            className="bidOperation"
            style={{ width: '50%' }}
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default ErrorDialog;
