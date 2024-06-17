import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './DanhSachLoHang.scss';
import BaseContent from '@components/BaseContent';
import { Button, Col, DatePicker, Form, Input, Row, Select, Table, Tooltip } from 'antd';
import { DownOutlined, PlusOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { URL } from '@url';
import { STATUS_PARCEL, STATUS_PARCEL_ENDORSER, VI_STATUS_PARCEL } from '@constants';
import VisibleIcon from '@components/Icons/VisibleIcon';
import queryString from 'query-string';
import { getAllParcelPagination } from '@app/services/TruyXuat';
import { formatDate, formatDatetrike } from '@app/common/functionCommons';
import { connect } from 'react-redux';

DanhSachLoHang.propTypes = {
  id: PropTypes.string,
};

function DanhSachLoHang({ id, myPermission }) {
  const [filter, setFilter] = useState(false);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const history = useHistory();
  const [pagination, setPagination] = useState(null);
  const tentrang = 'quan-ly-san-pham';
  const handleFilter = () => {
    setFilter(!filter);
  };

  useEffect(() => {
    if (id) {
      const params = queryString.extract(location.search);
      const paramsParseString = queryString.parse(params);
      const page = parseInt(paramsParseString.page) || 1;
      const limit = parseInt(paramsParseString.limit) || 10;
      const name = paramsParseString.name || null;
      const startDate = paramsParseString.startDate || null;
      const endDate = paramsParseString.endDate || null;
      const status = paramsParseString.status || null;
      const endorser = paramsParseString.endorser || null;
      setPagination({ ...pagination, page: page, limit: limit });
      callAPI(
        page,
        limit,
        name,
        startDate,
        endDate,
        status,
        endorser,
      ).then((dataResponse) => setData(dataResponse));
    }
  }, [location.search]);
  const callAPI = async (
    page,
    limit,
    name,
    startDate,
    endDate,
    status,
    endorser,
  ) => {
    const dataResponse = await getAllParcelPagination(
      name,
      status,
      page,
      limit,
      startDate,
      endDate,
      endorser,
      id,
    );
    const dataWithIndex = dataResponse.docs.map((item, index) => {
      return { ...item, index: index + 1 + (page - 1) * limit };
    });
    return { ...dataResponse, docs: dataWithIndex };
  };
  const resetForm = () => {
    form.resetFields();
    const queryParamsNew = new URLSearchParams();
    queryParamsNew.set('page', 1);
    queryParamsNew.set('limit', 10);
    const queryString = queryParamsNew.toString();
    history.push(`?${queryString}`);
  };
  const onSubmit = (e) => {
    const queryParams = new URLSearchParams(window.location.search);
    if (e.name) queryParams.set('name', e.name);
    if (e.startDate) queryParams.set('startDate', formatDatetrike(e.startDate));
    if (e.endDate) queryParams.set('endDate', formatDatetrike(e.endDate));
    if (e.status) queryParams.set('status', e.status);
    if (e.status_endorser) queryParams.set('endorser', e.status_endorser);
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
  };
  const ColumnsDanhSachLoHang = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 80,
      className: 'titleTable',
    },
    {
      title: 'Mã lô hàng',
      dataIndex: 'name',
      key: 'name',
      className: 'titleTable',
      width: 200,
    },

    {
      title: 'Ngày sản xuất',
      dataIndex: 'nsx',
      align: 'center',
      key: 'nsx',
      width: 200,
      className: 'titleTable',
      render: (_, value) => {
        const dateValidate = formatDate(value.nsx);
        return (
          <>
            <span>{dateValidate}</span>
          </>
        );
      },
    },
    {
      title: 'Số lượng sản xuất',
      dataIndex: 'num',
      key: 'num',
      className: 'titleTable',
      width: 230,
      align: 'center',
    },
    {
      title: 'Trạng thái kiểm định',
      dataIndex: 'status_endorser',
      key: 'status_endorser',
      align: 'center',
      width: 200,
      className: 'titleContentProcedure',
      render: (_, value) => {
        let viText = value.statusEndorser;
        if (value.statusEndorser == STATUS_PARCEL_ENDORSER.CREATING)
          viText = VI_STATUS_PARCEL.CREATING;
        else if (value.statusEndorser == STATUS_PARCEL_ENDORSER.ENDORSED)
          viText = VI_STATUS_PARCEL.ENDORSED;
        else if (value.statusEndorser == STATUS_PARCEL_ENDORSER.ENDORSING)
          viText = VI_STATUS_PARCEL.ENDORSING;
        else if (value.statusEndorser == STATUS_PARCEL_ENDORSER.PUBLISH)
          viText = VI_STATUS_PARCEL.PUBLISH;
        else if (value.statusEndorser == STATUS_PARCEL_ENDORSER.REJECT)
          viText = VI_STATUS_PARCEL.REJECT;
        else if (value.statusEndorser == STATUS_PARCEL_ENDORSER.SENDING)
          viText = VI_STATUS_PARCEL.SENDING;
        return (
          <div className="tag-procedure-parrent">
            <div
              className={`tag-procedure tag-procedure--${value.statusEndorser}`}
            >
              <span>{viText}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Tác vụ',
      key: 'action',
      align: 'center',
      className: 'titleTable',
      width: 80,
      render: (_, value) => (
        <>
          <Tooltip
            placement="top"
            title="Xem chi tiết lô hàng"
            color="#179a6b"
          >
            <Button
              type="primary"
              icon={<VisibleIcon/>}
              style={{ borderRadius: 0 }}
              onClick={() => handleViewEdit(value._id)}
            />
          </Tooltip>
        </>
      ),
    },
  ];
  const handleViewEdit = (idParcel) => {
    history.push(`${URL.CHI_TIET_LO_SAN_PHAM_ID.format(idParcel)}`);
  };
  const handleCreateNew = () => {
    history.push(`${URL.THEM_LO_SAN_PHAM_ID.format(id)}`);
  };
  const paginationChange = (page, limit) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', page);
    queryParams.set('limit', limit);
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
  };
  return (
    <BaseContent>
      <div className="list-procedure-container">
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <div className="list-procedure-title">
            <span>Danh sách lô sản phẩm</span>
          </div>
          <div className="btn-search">
            <Button
              type="primary"
              className="btn_reverse"
              icon={filter ? <UpOutlined/> : <DownOutlined/>}
              onClick={handleFilter}
            >
              Bộ lọc
            </Button>
            {(myPermission?.[tentrang]?.them || myPermission?.is_admin) && (
              <Button
                type="primary"
                className="btn_reverse"
                icon={<PlusOutlined/>}
                onClick={handleCreateNew}
              >
                Thêm lô sản phẩm
              </Button>
            )}
          </div>
          {filter && (
            <div className="box-search">
              <Row gutter={{ xs: 5, sm: 8, md: 12, lg: 20 }}>
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <Form.Item label="Mã lô sản phẩm" name="name">
                    <Input placeholder="Tên sản phẩm"/>
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <Form.Item label="Từ ngày" name="startDate">
                    <DatePicker
                      picker="day"
                      style={{ width: '100%' }}
                      placeholder="Chọn ngày"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <Form.Item label="Đến ngày" name="endDate">
                    <DatePicker
                      picker="day"
                      style={{ width: '100%' }}
                      placeholder="Chọn ngày"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <Form.Item name="status" label="Tình trạng lô hàng">
                    <Select placeholder="Tình trạng lô hàng" allowClear>
                      <Select.Option value={STATUS_PARCEL.EXPORTED}>
                        Đã xuất xưởng
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL.UNEXPORTED}>
                        Chưa xuất xưởng
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL.CANCELLED}>
                        Đã huỷ
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 5, sm: 8, md: 12, lg: 20 }}>
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <Form.Item
                    label="Trạng thái kiểm định"
                    name="status_endorser"
                  >
                    <Select placeholder="Trạng thái" allowClear>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.CREATING}>
                        Đang tạo
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.SENDING}>
                        Gửi thông tin cho ĐVKD
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.ENDORSING}>
                        Chờ kiểm định
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.REJECT}>
                        Từ chối kiểm định
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.ENDORSED}>
                        Hoàn tất kiểm định
                      </Select.Option>
                      <Select.Option value={STATUS_PARCEL_ENDORSER.PUBLISH}>
                        Công khai
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row filterSearch"
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                >
                  <Button
                    icon={<SearchOutlined style={{ fontSize: 16 }}/>}
                    type="primary"
                    htmlType="submit"
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    className="btn_clearFilter"
                    style={{
                      backgroundColor: '#FFE9D8',
                      borderColor: '#FFE9D8',
                      color: '#FF5C00',
                    }}
                    onClick={resetForm}
                  >
                    Bỏ lọc
                  </Button>
                </Col>
              </Row>
            </div>
          )}
          <div className="table_show_content_produre">
            {data && (
              <Table
                bordered
                showHeader={true}
                columns={ColumnsDanhSachLoHang}
                dataSource={data?.docs}
                scroll={{ x: 700 }}
                pagination={{
                  defaultPageSize: pagination?.limit || 10,
                  defaultCurrent: pagination?.page || 1,
                  total: data?.totalDocs,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total}`,
                  onChange: paginationChange,
                  showSizeChanger: true,
                }}
              />
            )}
          </div>
        </Form>
      </div>
    </BaseContent>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;

  return { myPermission: myInfo?.userPermissions };
}

export default connect(mapStateToProps)(DanhSachLoHang);
