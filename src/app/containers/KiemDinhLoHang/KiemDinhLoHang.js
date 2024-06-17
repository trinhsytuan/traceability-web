import { LeftOutlined } from "@ant-design/icons";
import { formatDate, toast } from "@app/common/functionCommons";
import { sendResultToProducer } from "@app/services/GuiKetQuaKiemDinh";
import { getHistoryAudit } from "@app/services/NhatKyKiemDinh";
import { getParcelById, getStepByParcel } from "@app/services/TruyXuat";
import ProcedureIcon from "@assets/icons/procedure-step-icon.svg";
import BaseContent from "@components/BaseContent";
import ArrowRightThick from "@components/Icons/ArrowRightThick";
import Editable from "@components/Icons/Editable";
import VisibleIcon from "@components/Icons/VisibleIcon";
import Loading from "@components/Loading";
import UploadImage from "@components/UploadImage/UploadImage";
import VerifyDigitalSignature from "@components/VerifyDigitalSignature/VerifyDigitalSignature";
import {
  BROWSING_COLOR,
  CONSTANTS,
  RESULT_SENDING,
  STATUS_PARCEL,
  STATUS_PARCEL_ENDORSER,
  STATUS_PRODUCER_KD,
  TOAST_MESSAGE,
  VI_STATUS_PARCEL,
} from "@constants";
import QuyTrinhXetDuyetKiemDinh from "@containers/QuyTrinhXetDuyet/QuyTrinhXetDuyetKiemDinh";
import { URL } from "@url";
import { Button, Col, Form, Input, InputNumber, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import GuiDuyetKiemDinh from "./GuiDuyetKiemDinh";
import GuiKetQuaKiemDinh from "./GuiKetQuaKiemDinh";
import "./KiemDinhLoHang.scss";
import ModalKiemDinh from "./ModalKiemDinh";
import QuyTrinhKiemDinh from "./QuyTrinhKiemDinh";
import EndorserIcon from "@components/Icons/EndorserIcon";
import EndorserIconSmall from "@components/Icons/EndorserIconSmall";
import PhanCongKiemDinhStep from "./PhanCongKiemDinhStep";

KiemDinhLoHang.propTypes = {};

function KiemDinhLoHang({ myInfo, myPermission }) {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [onHandleDialogGuiDuyet, setonHandleDialogGuiDuyet] = useState(false);
  const [procedureStep, setProcedureStep] = useState([]);
  const [historyAudit, setHistoryAudit] = useState([]);
  const [visibleDialogD, changeVisibleDialogD] = useState(false);
  const [statusEndorser, setStatusEndorser] = useState({
    status_endorser: null,
  });
  const [showModalParcel, handleCloseParcel] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [handleEdit, setHandleEdit] = useState(false);
  const [update, setUpdate] = useState(null);
  const [dataKiemDinh, setDataKiemDinh] = useState([]);
  const [dataGuiSX, setDataGuiSX] = useState([]);
  const [handlePhanCong, setPhanCong] = useState(false);
  const [dataPhanCong, setDataPhanCong] = useState(null);
  const history = useHistory();
  let { id } = useParams();
  const [handleDialogCheckKey, setHandleDialogConfimKey] = useState(false);
  const [dataPushTemp, setDataPushTemp] = useState([]);
  let tentrang = "kiem-dinh-san-pham";
  useEffect(() => {
    getAPI();
  }, [id, update]);
  const handleClickPhanCong = (data) => {
    setDataPhanCong(data);
    setPhanCong(true);
  };
  const handleClosePhanCong = () => {
    setPhanCong(false);
    getAPI();
  };
  const showModal = () => {
    handleCloseParcel(!showModalParcel);
  };
  const ConvertStatusEndorser = (status) => {
    let viText = status;
    if (status == STATUS_PARCEL.CREATING) viText = VI_STATUS_PARCEL.CREATING;
    else if (status == STATUS_PARCEL.CANCELLED)
      viText = VI_STATUS_PARCEL.CANCELLED;
    else if (status == STATUS_PARCEL.EXPORTED)
      viText = VI_STATUS_PARCEL.EXPORTED;
    else if (status == STATUS_PARCEL.UNEXPORTED)
      viText = VI_STATUS_PARCEL.UNEXPORTED;
    else if (status == STATUS_PARCEL.PUBLISH) viText = VI_STATUS_PARCEL.PUBLISH;
    else if (status == STATUS_PARCEL_ENDORSER.CREATING)
      viText = VI_STATUS_PARCEL.CREATING;
    else if (status == STATUS_PARCEL_ENDORSER.SENDING)
      viText = VI_STATUS_PARCEL.SENDING;
    else if (status == STATUS_PARCEL_ENDORSER.EDORSING)
      viText = VI_STATUS_PARCEL.ENDORSING;
    else if (status == STATUS_PARCEL_ENDORSER.ENDORSED)
      viText = VI_STATUS_PARCEL.ENDORSED;
    else if (status == STATUS_PARCEL_ENDORSER.REJECT)
      viText = VI_STATUS_PARCEL.REJECT;
    return viText;
  };
  const getAPI = async () => {
    setLoading(true);
    const responseStep = await getStepByParcel(id);
    responseStep.sort((a, b) => a.stepIndex - b.stepIndex);
    setProcedureStep(responseStep);
    //Fix button gửi duyệt
    let dataNew = [];
    for (let i = 0; i < responseStep.length; i++) {
      if (
        responseStep[i]?.inspector?._id == myInfo._id &&
        responseStep[i].status == STATUS_PRODUCER_KD.ENDORSING &&
        responseStep[i]?.status_endorser != RESULT_SENDING.ACCEPTED
      ) {
        dataNew.push(responseStep[i]);
      }
    }
    setDataKiemDinh(dataNew);
    //Fix button gửi kiểm định
    let newDataArr = [];
    for (let i = 0; i < responseStep.length; i++) {
      if (
        responseStep[i]?.endorser?._id === myInfo?.org._id &&
        responseStep[i].status == STATUS_PARCEL_ENDORSER.EDORSING &&
        // responseStep[i].status_producer == RESULT_SENDING.ACCEPTED &&
        responseStep[i].status_endorser == RESULT_SENDING.ACCEPTED
      )
        newDataArr.push(responseStep[i]);
    }
    setDataGuiSX(newDataArr);
    const responseParcel = await getParcelById(id);
    // const responseHistoryAudit = await getHistoryAudit(id);
    // setHistoryAudit(responseHistoryAudit);

    form.setFieldsValue({
      name: responseParcel.name,
      nameProduct: responseParcel.product.name,
      num: responseParcel.num,
      status: ConvertStatusEndorser(responseParcel.status),
      procedure: responseParcel.procedure.name,
      nguoipt: responseParcel.user.name,
      nsx: responseParcel.nsx ? formatDate(responseParcel.nsx) : null,
    });
    setStatusEndorser(responseParcel);
    setLoading(false);
  };
  const handleBack = () => {
    history.goBack();
  };

  const onHandleGuiDuyet = () => {
    changeVisibleDialogD(!visibleDialogD);
  };
  const onHandleGuiKD = () => {
    setonHandleDialogGuiDuyet(!onHandleDialogGuiDuyet);
  };
  const handleViewParcel = (data, status) => {
    setDataModal(data);
    setHandleEdit(status);
    showModal();
  };
  const submitKD = async (dataPush) => {
    setDataPushTemp(dataPush);
    handleShowDialogKey();
  };
  const handleShowDialogKey = () => {
    setHandleDialogConfimKey(!handleDialogCheckKey);
  };
  const submitKDOwnerKey = async (key) => {
    setLoading(true);
    if (dataPushTemp.length > 0) {
      const response = await sendResultToProducer(dataPushTemp, key);
      if (response) {
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.SUCCESS.DEFAULT);
        getAPI();
      }
    }
    setDataPushTemp([]);
    handleShowDialogKey();
    setLoading(false);
  };
  return (
    <>
      <div className="btn_duyet_kiemdinh">
        {dataKiemDinh && dataKiemDinh.length > 0 && (
          <Tooltip
            placement="top"
            title="Gửi duyệt quy trình kiểm định tới người quản trị"
            color="#1890FF"
          >
            <Button
              type="primary"
              className="button_reverse"
              icon={<ArrowRightThick />}
              style={{ backgroundColor: "#1890FF" }}
              onClick={onHandleGuiDuyet}
            >
              Gửi duyệt
            </Button>
          </Tooltip>
        )}

        {(myInfo.userPermissions.is_admin == true ||
          myInfo.userPermissions?.[tentrang]?.guiketqua) &&
          dataGuiSX &&
          dataGuiSX.length > 0 && (
            <Tooltip
              placement="top"
              title="Gửi kết quả kiểm định về nhà sản xuất"
              color="#179a6b"
            >
              <Button
                type="primary"
                className="button_reverse"
                icon={<ArrowRightThick />}
                onClick={onHandleGuiKD}
              >
                Gửi kết quả kiểm định
              </Button>
            </Tooltip>
          )}
      </div>
      <Loading active={isLoading}>
        <BaseContent>
          <div className="top--createnewParcel">
            <div className="header-top-parcel">
              <div className="header-top-left">
                <LeftOutlined
                  onClick={handleBack}
                  className="handleBack"
                ></LeftOutlined>
                <span>Thông tin lô sản phẩm</span>
                <div
                  className="status-parcel"
                  style={BROWSING_COLOR[statusEndorser?.status_endorser]}
                >
                  {ConvertStatusEndorser(statusEndorser?.status_endorser)}
                </div>
              </div>
            </div>
            <div className="div_hr"></div>
            <div className="search-bottom-parcel">
              <Form form={form} layout="vertical" id="form">
                <Row gutter={{ xs: 5, sm: 8, md: 12, lg: 20 }}>
                  <Col
                    className="gutter-row"
                    xs={24}
                    sm={12}
                    md={12}
                    lg={6}
                    xl={6}
                  >
                    <Form.Item label="Quy trình sản xuất" name="procedure">
                      <Input placeholder="Quy trình sản xuất" readOnly />
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
                    <Form.Item label="Mã lô sản phẩm" name="name">
                      <Input placeholder="Mã lô sản phẩm" readOnly />
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
                    <Form.Item label="Tên sản phẩm" name="nameProduct">
                      <Input placeholder="Tên sản phẩm" readOnly />
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
                    <Form.Item
                      label="Ngày sản xuất"
                      name="nsx"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập ngày sản xuất",
                        },
                      ]}
                    >
                      <Input placeholder="Ngày sản xuất" readOnly />
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
                    <Form.Item label="Số lượng sản xuất" name="num">
                      <InputNumber
                        min={0}
                        placeholder="Số lượng sản xuất"
                        style={{ width: "100%" }}
                        readOnly
                      ></InputNumber>
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row gutter={{ xs: 5, sm: 8, md: 12, lg: 20 }}>
                  <Col className="gutter-row" xs={24} sm={12} md={12} lg={6} xl={6}>
                    <Form.Item label="Quy trình sản xuất" name="procedure">
                      <Input placeholder="Quy trình sản xuất" readOnly />
                    </Form.Item>
                  </Col>
                </Row> */}
              </Form>
            </div>
          </div>

          <div className="show-procedure--lohang">
            <div className="show-procedure--title">
              <span>Quy trình sản xuất</span>
              {/* <Link to={URL.LICH_SU_KIEM_DINH_ID.format(id)}>
              <Button icon={<ClockCircleOutlined />} type="primary">
                Lịch sử kiểm định
              </Button>
            </Link> */}
            </div>
            <div className="div_hr"></div>
            {procedureStep &&
              procedureStep.map((data, index) => {
                return (
                  <div className="show-procedure--content" key={index}>
                    <div className="show-procedure--content-left">
                      <img src={ProcedureIcon}></img>
                    </div>
                    <div className="show-procedure--content-right">
                      <div className="show-procedure--content--title">
                        <div>
                          <div className="show-procedure---step">
                            Bước {data?.stepIndex}: {data?.name}
                            {data?.status_endorser ==
                            STATUS_PARCEL_ENDORSER.COMPLETED ? (
                              <div className="dakd">
                                Đã được kiểm định bởi: {data.endorser?.name}
                              </div>
                            ) : (
                              <div className="choxm">
                                Thông tin đang chờ xác minh
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="kdlh_btnaction">
                          <Tooltip
                            placement="top"
                            title="Xem chi tiết"
                            color="#179a6b"
                          >
                            <Button
                              icon={<VisibleIcon />}
                              onClick={() => {
                                handleViewParcel(data, false);
                              }}
                              style={{ border: 0 }}
                            />
                          </Tooltip>
                          {data.status_endorser != RESULT_SENDING.ACCEPTED &&
                            data.status_endorser != RESULT_SENDING.COMPLETED &&
                            myInfo._id == data?.inspector?._id &&
                            (myPermission?.[tentrang]?.sua ||
                              myPermission?.is_admin) && (
                              <Tooltip
                                placement="top"
                                title="Ghi nhật ký"
                                color="#FF811E"
                              >
                                <Button
                                  icon={<Editable />}
                                  style={{ border: 0 }}
                                  onClick={() => {
                                    handleViewParcel(data, true);
                                  }}
                                />
                              </Tooltip>
                            )}
                          {data.status_endorser != RESULT_SENDING.ACCEPTED &&
                            data.status_endorser != RESULT_SENDING.COMPLETED &&
                            myInfo?.org?._id == data?.endorser?._id &&
                            myPermission?.is_admin && (
                              <Tooltip
                                placement="topRight"
                                title="Phân công nhân viên kiểm định"
                                color="#1890FF"
                              >
                                <Button
                                  icon={<EndorserIconSmall />}
                                  style={{
                                    border: 0,
                                  }}
                                  onClick={() => {
                                    handleClickPhanCong(data);
                                  }}
                                />
                              </Tooltip>
                            )}
                        </div>
                      </div>
                      <div className="show-procedure--body-right">
                        <span className="describe-show-procedure">
                          Mô tả: {data.describe}
                        </span>
                        {data.from_date && (
                          <span className="describe-show-procedure">
                            Thời gian bắt đầu: {formatDate(data.from_date)}
                          </span>
                        )}
                        {data.to_date && (
                          <span className="describe-show-procedure">
                            Thời gian kết thúc: {formatDate(data.to_date)}
                          </span>
                        )}
                        {Array.isArray(data.image) && data.image.length > 0 && (
                          <span>Hình ảnh, video lô hàng:</span>
                        )}
                        {Array.isArray(data.image) && data.image.length > 0 && (
                          <UploadImage
                            data={data.image}
                            disabled={true}
                          ></UploadImage>
                        )}
                        {data?.inspector?.name && (
                          <span className="green_pc">
                            Phân công cho: {data.inspector.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </BaseContent>
        {statusEndorser._id && (
          <QuyTrinhXetDuyetKiemDinh
            statusEndorser={statusEndorser}
            idParcel={id}
            update={getAPI}
            handleUpdate={update}
            setHotReload={setUpdate}
          />
        )}
        {statusEndorser._id && (
          <QuyTrinhKiemDinh
            statusEndorser={statusEndorser}
            reload={update}
            handleReload={getAPI}
          />
        )}
        <ModalKiemDinh
          onChangeVisible={showModal}
          onVisible={showModalParcel}
          handleEdit={handleEdit}
          data={dataModal}
          setData={setDataModal}
        ></ModalKiemDinh>

        <GuiDuyetKiemDinh
          onVisible={visibleDialogD}
          changeVisible={onHandleGuiDuyet}
          data={dataKiemDinh}
          maLo={statusEndorser.name}
          idParcel={id}
          update={setUpdate}
          handleReload={getAPI}
        />

        {(myInfo.userPermissions.is_admin == true ||
          myInfo.userPermissions?.[tentrang]?.guiketqua) &&
          statusEndorser._id && (
            <>
              <GuiKetQuaKiemDinh
                onVisible={onHandleDialogGuiDuyet}
                setVisible={onHandleGuiKD}
                onSubmit={submitKD}
                infoProduct={statusEndorser}
                newData={dataGuiSX}
              ></GuiKetQuaKiemDinh>
              <VerifyDigitalSignature
                visible={handleDialogCheckKey}
                onSubmit={submitKDOwnerKey}
                handleVisible={handleShowDialogKey}
              />
            </>
          )}
        <PhanCongKiemDinhStep
          data={dataPhanCong}
          visible={handlePhanCong}
          onChangeVisible={handleClosePhanCong}
        ></PhanCongKiemDinhStep>
      </Loading>
    </>
  );
}
function mapStatetoProps(store) {
  const { myInfo } = store.user;
  return { myInfo, myPermission: myInfo?.userPermissions };
}
export default connect(mapStatetoProps)(KiemDinhLoHang);
