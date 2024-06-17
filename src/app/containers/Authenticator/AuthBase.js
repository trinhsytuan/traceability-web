import React from 'react';

import './AuthBase.scss';

import AuthLogo from '@assets/images/logo/auth-logo.svg';

function AuthBase({ children }) {

  return <>
    <div className="auth-base">
      <div className="logo">
        <img alt="" src={AuthLogo}/>
      </div>
      {children}
    </div>
  </>;
}

export default (AuthBase);
