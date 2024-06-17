import { CloseOutlined, RollbackOutlined, SearchOutlined } from '@ant-design/icons';
import { queryProductByParcelName, queryProductByParcelNameNotPublic } from '@app/services/TruyXuat';

import NOT_FOUND_PRODUCT from '@assets/icons/not-found-product.svg';
import BaseContent from '@components/BaseContent';
import Loading from '@components/Loading';
import { Button, Col, Form, Input, Row, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ThongTinSanPham from './ThongTinSanPham';
import './TruyXuatSanPham.scss';
import { Link } from 'react-router-dom';
import { URL } from '@url';

function TruyXuatSanPham(props) {
  const history = useHistory();
  const [form] = Form.useForm();
  const [isSubmit, setisSubmit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [fromTo, setFromTo] = useState('');

  const formSubmit = async (e) => {
    setData(undefined);
    setisSubmit(true);
    setIsLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('code', e.parcelCode);
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
    let dataAPI = null;
    dataAPI = await queryProductByParcelName(e.parcelCode);
    if (!dataAPI) {
      dataAPI = await queryProductByParcelNameNotPublic(e.parcelCode);
      setIsPublic(false);
    }
    if (dataAPI) {
      setData(dataAPI);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };
  const resetForm = () => {
    form.resetFields();
    const queryParams = new URLSearchParams();
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
    setisSubmit(false);
  };

  const formSetCode = (data) => {
    form.setFieldsValue({
      parcelCode: data,
    });
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    formSetCode(queryParams.get('code') || '');
    let codeProduct = queryParams.get('code');
    if (codeProduct) {
      formSubmit({ parcelCode: codeProduct });
    }
    let from = queryParams.get('from_to');
    if (from) {
      setFromTo(from);
    }
  }, []);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    let from = queryParams.get('from_to');
    if (from) {
      setFromTo(from);
    }
  }, []);
  const handleBack = () => {
    history.goBack();
  };
  return (
    <BaseContent>
      <Loading active={isLoading}>
        <Row className="rowForm">
          <Form onFinish={formSubmit} className="info_product" form={form}>
            {fromTo && <Col>
              <Tooltip title="Quay lại" color={'orange'}>
                <Link to={URL.CHI_TIET_LO_SAN_PHAM_ID.format(fromTo)}>
                  <Button
                    icon={<RollbackOutlined/>}
                    className="handleBack"
                    type="ghost"
                    style={{ color: '#FF811E', backgroundColor: '#FFE9D8', border: 0, marginRight: '10px' }}
                  ></Button></Link>
              </Tooltip>
            </Col>}
            <Col xxl={13} xl={15} lg={19} md={21} sm={21} xs={21}>
              <Form.Item
                name="parcelCode"
                className="info_product__code"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin mã sản phẩm' }]}
              >
                <Input
                  placeholder="Nhập thông tin mã sản phẩm"
                  prefix={
                    isSubmit ? (
                      <Button
                        onClick={resetForm}
                        className="info_product__iconReset"
                        icon={<CloseOutlined className="info_product__iconClose"/>}
                        type="primary"
                      />
                    ) : (
                      <span/>
                    )
                  }
                ></Input>
              </Form.Item>
            </Col>
            <Col span={2} style={{ display: 'flex', alignItems: 'flex-start', height: '100%' }}>
              <Button type="primary" className="btn_sp" htmlType="submit">
                <SearchOutlined className="btn_sp__icon-search"/>
              </Button>
            </Col>
          </Form>
        </Row>
      </Loading>
      {isSubmit === true && data === null && (
        <div className="show_info_product_notfound">
          <div className="show_info_product__notFound">
            <img src={NOT_FOUND_PRODUCT} alt="Not Found"/>
            <span>Không tìm thấy sản phẩm cần truy xuất</span>
          </div>
        </div>
      )}
      {isSubmit && data && <ThongTinSanPham data={data} isPublic={isPublic}/>}
    </BaseContent>
  );
}

export default TruyXuatSanPham;
