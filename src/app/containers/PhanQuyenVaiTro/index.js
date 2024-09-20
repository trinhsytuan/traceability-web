import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Col, Form, Input, message, Modal, Popconfirm, Row, Table, Tooltip } from 'antd';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';

import { add, deleteById, getAll, updateById } from '@app/services/phanquyenvaitroService';
import queryString, { stringify } from 'query-string';
import { PAGINATION_CONFIG, ROLE_PAGES_ENDORSER, ROLE_PAGES_PRODUCER, ROLE_PAGES_SYSTEM, TYPE_ORG } from '@constants';
import { useLocation } from 'react-router-dom';
import { formatSTT, validateSpaceNull } from '@app/common/functionCommons';
import './PhanQuyenVaiTro.scss';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function TableEdit({ myPermission, loading, rolePages, typeOrg, ...props }) {
  const history = useHistory();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [dataRes, setDataRes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [_id, setId] = useState("");
  const [toggleModalVaiTro, setToggleModalVaiTro] = useState(false);
  const thisUrl = "phan-quyen-vai-tro";
  const location = useLocation();

  useEffect(() => {
    handleRefresh({}, true);
  }, [page, limit]);
  useEffect(() => {
    getDataFilter();
  }, [location.search]);
  const columns = [
    {
      title: "STT",
      width: 60,
      render: (v1, v2, value) => formatSTT(limit, page, value),
      align: "center",
    },
    {
      title: "Vai trò",
      dataIndex: "tenvaitro",
    },
    {
      title: "Tác vụ",
      render: (value) => formatActionCell(value),
      width: 100,
      align: "center",
    },
  ];
  const columnsSX = [
    {
      title: "STT",
      render: (value, row, index) => (index ? index : ""),
      align: "center",
      width: "70px",
    },
    {
      title: "Tên trang",
      dataIndex: "tentrang",
      width: "300px",
    },
    {
      title: "Tất cả",
      align: "center",
      width: "100px",
      dataIndex: "all",
      render: (value, row, index) => (
        <>
          <Checkbox onChange={(e) => onChange(e.target.checked, row, index, "all")} checked={value} />
        </>
      ),
    },
    {
      // key: "xem",
      title: "Hiển thị",
      align: "center",
      width: "100px",
      dataIndex: "xem",
      render: (value, row, index) => {
        return (
          <Checkbox
            className={row.quyen.indexOf("xem") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "xem")}
            checked={value}
          />
        );
      },
    },
    {
      // key: "them",
      title: "Thêm",
      align: "center",
      width: "100px",
      dataIndex: "them",
      render: (value, row, index) => (
        <Checkbox
          className={row.quyen.indexOf("them") === -1 && "invisible"}
          onChange={(e) => onChange(e.target.checked, row, index, "them")}
          checked={value}
        />
      ),
    },
    {
      // key: "sua",
      title: "Sửa",
      align: "center",
      width: "100px",
      dataIndex: "sua",
      render: (value, row, index) => (
        <Checkbox
          className={row.quyen.indexOf("sua") === -1 && "invisible"}
          onChange={(e) => onChange(e.target.checked, row, index, "sua")}
          checked={value}
        />
      ),
    },
    {
      title: "Xoá",
      align: "center",
      width: "100px",
      dataIndex: "xoa",
      render: (value, row, index) => (
        <>
          <Checkbox
            className={row.quyen.indexOf("xoa") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "xoa")}
            checked={value}
          />
        </>
      ),
    },
    {
      title: "Duyệt",
      align: "center",
      width: "100px",
      dataIndex: "duyet",
      render: (value, row, index) => (
        <>
          <Checkbox
            className={row.quyen.indexOf("duyet") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "duyet")}
            checked={value}
          />
        </>
      ),
    },
    {
      title: "Công khai",
      align: "center",
      width: "100px",
      dataIndex: "congkhai",
      render: (value, row, index) => (
        <>
          <Checkbox
            className={row.quyen.indexOf("congkhai") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "congkhai")}
            checked={value}
          />
        </>
      ),
    },
  ];
  const columnsPQ = [
    {
      title: "STT",
      render: (value, row, index) => (index ? index : ""),
      align: "center",
      width: "70px",
    },
    {
      title: "Tên trang",
      dataIndex: "tentrang",
      width: "300px",
    },
    {
      title: "Tất cả",
      align: "center",
      width: "100px",
      dataIndex: "all",
      render: (value, row, index) => (
        <>
          <Checkbox onChange={(e) => onChange(e.target.checked, row, index, "all")} checked={value} />
        </>
      ),
    },
    {
      // key: "xem",
      title: "Hiển thị",
      align: "center",
      width: "100px",
      dataIndex: "xem",
      render: (value, row, index) => {
        return (
          <Checkbox
            className={row.quyen.indexOf("xem") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "xem")}
            checked={value}
          />
        );
      },
    },
    {
      // key: "them",
      title: "Thêm",
      align: "center",
      width: "100px",
      dataIndex: "them",
      render: (value, row, index) => (
        <Checkbox
          className={row.quyen.indexOf("them") === -1 && "invisible"}
          onChange={(e) => onChange(e.target.checked, row, index, "them")}
          checked={value}
        />
      ),
    },
    {
      // key: "sua",
      title: "Sửa",
      align: "center",
      width: "100px",
      dataIndex: "sua",
      render: (value, row, index) => (
        <Checkbox
          className={row.quyen.indexOf("sua") === -1 && "invisible"}
          onChange={(e) => onChange(e.target.checked, row, index, "sua")}
          checked={value}
        />
      ),
    },
    {
      title: "Xoá",
      align: "center",
      width: "100px",
      dataIndex: "xoa",
      render: (value, row, index) => (
        <>
          <Checkbox
            className={row.quyen.indexOf("xoa") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "xoa")}
            checked={value}
          />
        </>
      ),
    },
    {
      title: "Duyệt",
      align: "center",
      width: "100px",
      dataIndex: "duyet",
      render: (value, row, index) => (
        <>
          <Checkbox
            className={row.quyen.indexOf("duyet") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "duyet")}
            checked={value}
          />
        </>
      ),
    },
    {
      title: "Gửi kết quả",
      align: "center",
      width: "100px",
      dataIndex: "guiketqua",
      render: (value, row, index) => (
        <>
          <Checkbox
            className={row.quyen.indexOf("guiketqua") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "guiketqua")}
            checked={value}
          />
        </>
      ),
    },
  ];
  const columnsAdmin = [
    {
      title: "STT",
      render: (value, row, index) => (index ? index : ""),
      align: "center",
      width: "70px",
    },
    {
      title: "Tên trang",
      dataIndex: "tentrang",
      width: "300px",
    },
    {
      title: "Tất cả",
      align: "center",
      width: "100px",
      dataIndex: "all",
      render: (value, row, index) => (
        <>
          <Checkbox onChange={(e) => onChange(e.target.checked, row, index, "all")} checked={value} />
        </>
      ),
    },
    {
      // key: "xem",
      title: "Hiển thị",
      align: "center",
      width: "100px",
      dataIndex: "xem",
      render: (value, row, index) => {
        return (
          <Checkbox
            className={row.quyen.indexOf("xem") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "xem")}
            checked={value}
          />
        );
      },
    },
    {
      // key: "them",
      title: "Thêm",
      align: "center",
      width: "100px",
      dataIndex: "them",
      render: (value, row, index) => (
        <Checkbox
          className={row.quyen.indexOf("them") === -1 && "invisible"}
          onChange={(e) => onChange(e.target.checked, row, index, "them")}
          checked={value}
        />
      ),
    },
    {
      // key: "sua",
      title: "Sửa",
      align: "center",
      width: "100px",
      dataIndex: "sua",
      render: (value, row, index) => (
        <Checkbox
          className={row.quyen.indexOf("sua") === -1 && "invisible"}
          onChange={(e) => onChange(e.target.checked, row, index, "sua")}
          checked={value}
        />
      ),
    },
    {
      title: "Xoá",
      align: "center",
      width: "100px",
      dataIndex: "xoa",
      render: (value, row, index) => (
        <>
          <Checkbox
            className={row.quyen.indexOf("xoa") === -1 && "invisible"}
            onChange={(e) => onChange(e.target.checked, row, index, "xoa")}
            checked={value}
          />
        </>
      ),
    },
  ];

  const onChange = (value, row1, index, key) => {
    const row = JSON.parse(JSON.stringify(row1));
    let data = JSON.parse(JSON.stringify([...dataSource]));
    if (index === 0) {
      if (key === "all") {
        data = data.map((rowData) => {
          rowData.all = value;
          rowData.quyen.forEach((curr) => {
            rowData[curr] = value;
          });
          return rowData;
        });
      } else {
        data = data.map((rowData) => {
          rowData[key] = value;
          return rowData;
        });
      }
    } else {
      row[key] = value;
      if (!value) {
        row.all = value;
        data[0][key] = value;
        data[0].all = value;
      }
      if (key === "all") {
        row.quyen.forEach((curr) => {
          row[curr] = value;
        });
      }
      data[index] = row;
    }
    setDataSource(data);
  };

  const getDataFilter = async () => {
    const queryStr = "";
    const apiResponse = await getAll(page, limit, queryStr);
    if (apiResponse) {
      setTotalDocs(apiResponse.totalDocs);
      setDataRes(apiResponse.docs);
    }
  };

  const toggleModal = async () => {
    setId("");
    setShowModal(!showModal);
  };

  const toggleModalAdd = async () => {
    form.resetFields();
    setShowModal(true);
    setDataSource(rolePages);
    setId("");
  };

  const edit = (data) => {
    let dataSource = rolePages;
    let fields = data.vaitro || {};

    dataSource = dataSource.map((rowData) => {
      if (fields.hasOwnProperty(rowData.trang)) {
        rowData = { ...rowData, ...fields[rowData.trang] };
      }
      return rowData;
    });
    setShowModal(true);
    setDataSource(dataSource);
    setId(data._id);
    form.setFieldsValue(data);
  };

  const formatActionCell = (value) => {
    if (value?.vaitro?.is_admin) {
      return;
    }
    return (
      <>
        {(myPermission?.[thisUrl]?.sua || myPermission?.is_admin) && (
          <Tooltip placement="left" title="Chỉnh sửa vai trò" color="#FF811E">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              className="mr-1"
              style={{ backgroundColor: "#FF811E", borderColor: "#FF811E" }}
              onClick={() => edit(value)}
            ></Button>
          </Tooltip>
        )}
        {(myPermission?.[thisUrl]?.xoa || myPermission?.is_admin) && (
          <Popconfirm
            key={value._id}
            title="Bạn chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(value)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ type: "danger" }}
          >
            <Tooltip placement="right" title="Xóa dữ liệu" color="#FF0000">
              <Button
                icon={<DeleteOutlined />}
                type="danger"
                style={{ backgroundColor: "#FF0000" }}
                size="small"
                className="mr-1"
              />
            </Tooltip>
          </Popconfirm>
        )}
      </>
    );
  };

  const handleRefresh = (newQuery, changeTable) => {
    const { pathname } = location;
    let objFilterTable = { page, limit };
    if (changeTable) {
      newQuery = queryString.parse(location.search);
      delete newQuery.page;
      delete newQuery.limit;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };

  const onChangeTable = (page) => {
    setLimit(page.pageSize);
    setPage(page.current);
  };

  const saveModal = async (value) => {
    const obj = {};
    dataSource.forEach((rowData, index) => {
      if (index !== 0) {
        const { quyen } = rowData;
        let isCheck = false;
        const objQuyen = {};
        quyen.forEach((curr) => {
          objQuyen[curr] = false;
          if (rowData[curr]) {
            isCheck = true;
            objQuyen[curr] = true;
          }
        });
        if (isCheck) {
          obj[rowData.trang] = objQuyen;
        }
      }
    });
    const data = {
      tenvaitro: value?.tenvaitro,
      vaitro: obj,
    };

    if (_id) {
      const dataResApi = await updateById(_id, data);
      if (dataResApi) {
        message.success("Cập nhật dữ liệu thành công");
        getDataFilter();
      }
    } else {
      const dataResApi = await add(data);
      if (dataResApi) {
        message.success("Thêm mới dữ liệu thành công");
        getDataFilter();
      }
    }
    setShowModal(false);
  };

  const handleDelete = async (value) => {
    const dataRes = [...dataRes];
    const apiRequestDelete = await deleteById(value._id);
    if (apiRequestDelete) {
      message.success("Xoá vai trò thành công");
      getDataFilter();
    }
  };

  return (
    <div className="role-management">
      <div className="role-management__header">
        <div className="header__title">
          <span>Danh sách các vai trò</span>
        </div>

        <div className="header__btn">
          {(myPermission?.[thisUrl]?.them || myPermission?.is_admin) && (
            <Button
              type="primary"
              onClick={toggleModalAdd}
              className="pull-right btn-add-new"
              size="small"
              icon={<PlusOutlined />}
            >
              Thêm vai trò
            </Button>
          )}
        </div>
      </div>

      <div className="role-management__table">
        <Table
          loading={loading}
          bordered
          columns={columns}
          dataSource={dataRes}
          rowKey="_id"
          className="table_pqvt"
          pagination={{
            ...PAGINATION_CONFIG,
            current: page,
            pageSize: limit,
            total: totalDocs,
          }}
          onChange={onChangeTable}
        />
      </div>

      <Modal
        title={<span className="modal-role__tile">Phân quyền vai trò</span>}
        className="modal-width-80"
        style={{ top: " 100px" }}
        visible={showModal}
        forceRender={true}
        onCancel={loading ? () => null : toggleModal}
        footer={[
          <Button size="small" onClick={toggleModal} disabled={loading} type="danger" icon={<CloseOutlined />}>
            Huỷ
          </Button>,
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            loading={loading}
            form="formModal"
            // onClick={() => this.saveModal()}
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="horizontal"
          id="formModal"
          name="form-vaitro"
          onFinish={(value) => saveModal(value)}
          requiredMark={false}
        >
          <Row gutter={10}>
            <Col span={24} className="form-item-vaitro">
              <Form.Item
                label={
                  <span className="lable-tenvaitro">
                    Tên vai trò <span className="lable-tenvaitro-remark">*</span>{" "}
                  </span>
                }
                name="tenvaitro"
                rules={[
                  { required: true, message: "Tên vai trò không được bỏ trống" },
                  { validator: validateSpaceNull },
                ]}
              >
                <Input size="small" placeholder="Nhập tên vai trò" className="input-tenvaitro" />
              </Form.Item>
            </Col>
          </Row>
          <Table
            dataSource={dataSource}
            size="small"
            className="w-full mt-1"
            columns={
              typeOrg === TYPE_ORG.PRODUCER ? columnsSX : typeOrg === TYPE_ORG.ENDORSER ? columnsPQ : columnsAdmin
            }
            bordered
            pagination={false}
            onChange={onChangeTable}
            scroll={{ x: 700 }}
          />
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps(store) {
  const { token } = store.app;
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  let rolePages = [];
  if (myInfo?.type === TYPE_ORG.PRODUCER) {
    rolePages = JSON.parse(JSON.stringify(ROLE_PAGES_PRODUCER));
  } else if (myInfo?.type === TYPE_ORG.ENDORSER) {
    rolePages = JSON.parse(JSON.stringify(ROLE_PAGES_ENDORSER));
  } else {
    rolePages = JSON.parse(JSON.stringify(ROLE_PAGES_SYSTEM));
  }
  return { token, myPermission: myInfo?.userPermissions, loading: isLoading, rolePages, typeOrg: myInfo?.type };
}

const withConnect = connect(mapStateToProps);

export default withConnect(TableEdit);

