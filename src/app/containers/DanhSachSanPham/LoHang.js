import React from 'react';
import PropTypes from 'prop-types';

import './LoHang.scss';
import { Tag, Tooltip } from 'antd';
import { URL } from '@url';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { BROWSING_COLOR, STATUS_PARCEL_ENDORSER } from '@constants';

LoHang.propTypes = {
  value: PropTypes.object,
};

function LoHang({ value }) {
  const history = useHistory();
  const redirectLoHang = (values) => {
    history.push(`${URL.CHI_TIET_LO_SAN_PHAM_ID.format(values._id)}`);
  };
  return (
    <div className="lo-hang-container">
      {value.parcels?.map((values, index) => {
        return (
          <Tooltip
            placement="top"
            title="Xem chi tiết lô hàng"
            color={
              values.statusEndorser == STATUS_PARCEL_ENDORSER.ENDORSED
                ? "#179a6b"
                : BROWSING_COLOR[values.statusEndorser].color
            }
          >
            <Tag
              className={`lo-hang--pd lo-hang_item`}
              style={BROWSING_COLOR[values.statusEndorser]}
              key={index}
              onClick={() => redirectLoHang(values)}
            >
              {values.name}
            </Tag>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default LoHang;
