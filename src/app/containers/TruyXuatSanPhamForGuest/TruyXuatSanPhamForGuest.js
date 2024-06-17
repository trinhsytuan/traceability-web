import React from 'react';
import HeaderMenuForGuest from '@components/HeaderMenuForGuest/HeaderMenuForGuest';
import TruyXuatSanPham from '@containers/TruyXuatSanPham/TruyXuatSanPham';
import BaseContent from '@components/BaseContent';
import './TruyXuatSanPhamForGuest.scss';

TruyXuatSanPhamForGuest.propTypes = {};

function TruyXuatSanPhamForGuest(props) {
  return (
    <BaseContent>
      <HeaderMenuForGuest/>
      <div className="txsp-container">
        <TruyXuatSanPham/>
      </div>
    </BaseContent>
  );
}

export default TruyXuatSanPhamForGuest;




