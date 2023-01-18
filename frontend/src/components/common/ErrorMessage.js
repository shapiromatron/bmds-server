import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({error})=>{
    if (!error){
        return null;
    }
    return <p className="text-danger mb-1">{error}</p>
}
ErrorMessage.propTypes = {
    error: PropTypes.string,
};

export default ErrorMessage;
