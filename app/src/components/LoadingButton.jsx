import React, { useState } from "react";

function LoadingButton({ onClick, children, loadingText = "Loading...", ...props }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            await onClick();
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleClick} disabled={loading} {...props}>
            {loading ? loadingText : children}
        </button>
    );
}

export default LoadingButton;
