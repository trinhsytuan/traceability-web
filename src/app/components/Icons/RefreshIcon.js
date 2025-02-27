import React from 'react';

RefreshIcon.propTypes = {};

function RefreshIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="14px"
      height="14px"
      style={{ marginBottom: "-2px", cursor: "pointer" }}
    >
      <path fill="#7cb342" d="M24 3A21 21 0 1 0 24 45A21 21 0 1 0 24 3Z" />
      <path
        fill="#dcedc8"
        d="M24,36.1c-6.6,0-12-5.4-12-12c0-3.6,1.6-7,4.4-9.3l2.5,3.1c-1.8,1.5-2.9,3.8-2.9,6.2c0,4.4,3.6,8,8,8 s8-3.6,8-8c0-2.1-0.8-4-2.2-5.5l2.9-2.7C34.8,18,36,21,36,24.1C36,30.7,30.6,36.1,24,36.1z"
      />
      <path fill="#dcedc8" d="M12 13L21 13 21 22z" />
    </svg>
  );
}

export default RefreshIcon;

