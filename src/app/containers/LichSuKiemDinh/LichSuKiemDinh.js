import React from 'react';
import './LichSuKiemDinh.scss';
import BaseContent from '@components/BaseContent';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Steps } from 'antd';
import ClockIcon from '@components/Icons/ClockIcon';
import { formatTimeDate } from '@app/common/functionCommons';

LichSuKiemDinh.propTypes = {};

function LichSuKiemDinh({ isLoading }) {
  const history = useHistory();
  const { Step } = Steps;
  const dataFake = [
    {
      type: 'add',
      title: 'Abc',
      createdAt: new Date(),
    },
    {
      type: 'add',
      title: 'dèf',
      createdAt: new Date(),
    },
  ];
  const goBack = () => {
    history.goBack();
  };
  return (
    <div className="lich-su-kiem-dinh-container">
      <BaseContent>
        <>
          <div className="header_content">
            <LeftOutlined onClick={goBack}/>
            <span className="lskd">Lịch sử kiểm định</span>
          </div>
          <div className="div_hr"></div>
          <Loading active={isLoading}>
            <div className="step-audit">
              <Steps current={dataFake.length} direction="vertical">
                {dataFake.map((datas, index) => {
                  return (
                    <Step
                      key={index}
                      title={datas.title}
                      icon={<ClockIcon/>}
                      description={formatTimeDate(datas.createdAt)}
                    />
                  );
                })}
              </Steps>
            </div>
          </Loading>
        </>
      </BaseContent>
    </div>
  );
}

function mapStatetoProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStatetoProps)(LichSuKiemDinh);

