import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  LeftOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  formatDate,
  formatDatetrike,
  toast,
} from "@app/common/functionCommons";
import { sendToEndorser } from "@app/services/GuiDuyet";
import {
  getAllTempleteStepByID,
  getAllUserByOrg,
  getListProcedure,
} from "@app/services/Manager";
import { deleteParcel, updateParcelAll } from "@app/services/ThemMoiQuyTrinh";
import { getInfoProduct } from "@app/services/ThemMoiSanPham";
import { getParcelById, getStepByParcel } from "@app/services/TruyXuat";
import ProcedureIcon from "@assets/icons/procedure-step-icon.svg";
import BaseContent from "@components/BaseContent";
import DialogDeleteConfim from "@components/DialogDeleteConfim/DialogDeleteConfim";
import ArrowRightThick from "@components/Icons/ArrowRightThick";
import DeleteIcon from "@components/Icons/DeleteIcon";
import Editable from "@components/Icons/Editable";
import IconEditHistory from "@components/Icons/IconEditHistory";
import Loading from "@components/Loading";
import UploadImage from "@components/UploadImage/UploadImage";
import VerifyDigitalSignature from "@components/VerifyDigitalSignature/VerifyDigitalSignature";
import {
  BROWSING_COLOR,
  CONSTANTS,
  RESULT_SENDING,
  SITE_URL,
  STATUS_PARCEL,
  STATUS_PARCEL_ENDORSER,
  STATUS_STEP,
  TOAST_MESSAGE,
  VI_STATUS_PARCEL,
} from "@constants";
import CongKhaiSanPham from "@containers/CongKhaiSanPham/CongKhaiSanPham";
import { URL } from "@url";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
} from "antd";
import moment from "moment";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import DialogChinhSua from "./DialogChinhSua";
import GuiDuyet from "./GuiDuyet";
import GuiKiemDinh from "./GuiKiemDinh";
import QuyTrinhKiemDinhSX from "./QuyTrinhKiemDinhSX";
import "./ThemMoiLoHang.scss";
import DialogGhiNhatKySX from "./DialogGhiNhatKySX";

ChinhSuaLoHang.propTypes = {};

function ChinhSuaLoHang({ myInfo, myPermission }) {
  const [form] = Form.useForm();
  const [procedureOrg, setProcedureOrg] = useState(null);
  const [dataSP, setDataSP] = useState(null);
  const [enableForm, setEnableForm] = useState(false);
  const [dialogDelete, setVisibleDelete] = useState(false);
  const [showDialogGhiNhatKy, setShowDialogGhiNhatKy] = useState(false);
  const [dataUser, setUser] = useState(null);
  const [viewDialog, handleViewDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [updateSubComponent, setUpdateSubComponent] = useState(false);
  const [onHandleDialogGuiDuyet, setonHandleDialogGuiDuyet] = useState(false);
  const [procedureStep, setProcedureStep] = useState([]);
  const { id } = useParams();
  const [idProduct, setIdProduct] = useState(null);
  const [idParcel, setIDParcel] = useState(null);
  const [visibleDialogD, changeVisibleDialogD] = useState(false);
  const [statusEndorser, setStatusEndorser] = useState({
    status_endorser: null,
  });
  const [showPublic, setShowPublic] = useState(false);
  const [modalConfimKey, setModalConfimKey] = useState(false);
  const [dataPushKDTemp, setdataPushKDTemp] = useState(null);
  const [stepBackup, setStepBackup] = useState(null);
  const [idBefore, setIDBefore] = useState(null);
  const [dataKiemDinh, setDataKiemDinh] = useState([]);
  const tentrang = "quan-ly-san-pham";
  const [qr, setQr] = useState(null);
  const history = useHistory();
  useEffect(() => {
    handleGetID();
  }, [id]);
  const GenerateQRCode = (infoParcel, parcel) => {
    // let data = `${SITE_URL.URL}${URL.MENU.TRUY_XUAT_SAN_PHAM}/?code=${infoParcel.name}`;
    let data =
      parcel.status_endorser === STATUS_PARCEL.PUBLISH
        ? `${SITE_URL.URL}${URL.TRUY_XUAT_SAN_PHAM_FOR_GUEST}?code=${infoParcel.name}`
        : `${SITE_URL.URL}${URL.MENU.TRUY_XUAT_SAN_PHAM}?code=${infoParcel.name}`;

    const options = {
      margin: 0, // Đặt giá trị âm để loại bỏ viền
      width: 100,
      height: 100,
    };
    QRCode.toDataURL(data, options, (err, url) => {
      if (err) {
        console.error("Lỗi khi tạo mã QR:", err);
      } else {
        setQr(url);
      }
    });
  };
  const showDialogChinhSua = () => {
    setShowDialog(!showDialog);
    setDialogData(null);
    handleViewDialog(false);
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
    else if (status == STATUS_PARCEL_ENDORSER.BROWSING)
      viText = VI_STATUS_PARCEL.BROWSING;
    return viText;
  };
  const enableForms = () => {
    setEnableForm(!enableForm);
  };
  const handleDelete = () => {
    setVisibleDelete(!dialogDelete);
  };
  const handleGetID = async (notSet = true) => {
    setLoading(true);
    const pathname = window.location.pathname;
    const segments = pathname.split("/");
    const segment = "/" + segments[1] + "/";
    if (segment == URL.THEM_LO_SAN_PHAM_ID.format("")) {
      setIdProduct(id);
      await getAPI(id);
    } else if (segment == URL.CHI_TIET_LO_SAN_PHAM_ID.format("")) {
      if (notSet) setEnableForm(true);
      setUpdateSubComponent(new Date());
      const responseParcel = await getParcelById(id);
      setIDParcel(id);
      setIdProduct(responseParcel.product._id);
      await getAPI(responseParcel.product._id, id, responseParcel);
    }
    setLoading(false);
  };
  const getAPI = async (
    idProduct = null,
    idParcel = null,
    dataResponse = null
  ) => {
    if (!idProduct && !idParcel) return;
    const responsePrOrg = await getListProcedure("limit=0");
    setProcedureOrg(responsePrOrg.docs);
    const responseUser = await getAllUserByOrg();
    setUser(responseUser);
    if (!idParcel) {
      const responseProduct = await getInfoProduct(idProduct);
      setDataSP(responseProduct);
      let responseStep = null;
      if (responseProduct.procedure) {
        responseStep = await getAllTempleteStepByID(responseProduct.procedure);
        responseStep.sort((a, b) => a.stepIndex - b.stepIndex);
        setProcedureStep(responseStep);
      }
      form.setFieldsValue({
        nameProduct: responseProduct.name,
        procedure: responseProduct.procedure,
        nguoipt: responseProduct.userId,
        status: STATUS_PARCEL.UNEXPORTED,
      });
    } else {
      const responseStep = await getStepByParcel(idParcel);
      setDataSP(dataResponse.product);
      responseStep.sort((a, b) => a.stepIndex - b.stepIndex);
      setProcedureStep(responseStep);
      let defaultStatus = true;
      for (let res of responseStep) {
        if (res?.status !== RESULT_SENDING.ENDORSED) {
          defaultStatus = false;
          break;
        }
      }
      if (responseStep && responseStep.length == 0) {
        defaultStatus = false;
      }
      if (dataResponse?.product?.require_inspect === false) {
        defaultStatus = true;
      }

      setShowPublic(defaultStatus);

      const responseParcel = await getParcelById(idParcel);
      form.setFieldsValue({
        name: responseParcel?.name,
        nameProduct: dataResponse.product?.name,
        num: responseParcel?.num,
        status: responseParcel?.status,
        procedure: responseParcel?.procedure._id,
        nguoipt: responseParcel?.user._id,
        nsx: responseParcel?.nsx
          ? moment(responseParcel.nsx, "YYYY-MM-DD")
          : null,
      });
      setStatusEndorser(responseParcel);
      GenerateQRCode(responseParcel, responseParcel);
      //Phần xử lý thằng Button Gửi kiểm định ẩn đi nếu chưa có gì
      const dataNew = [];
      for (let i = 0; i < responseStep.length; i++) {
        if (
          !responseStep[i].status ||
          responseStep[i]?.status == STATUS_PARCEL_ENDORSER.CREATING ||
          responseStep[i]?.status == RESULT_SENDING.DENIED ||
          responseStep[i]?.status == RESULT_SENDING.REFUSED ||
          responseStep[i]?.status == STATUS_PARCEL_ENDORSER.REJECT ||
          responseStep[i]?.status == STATUS_PARCEL_ENDORSER.BROWSING ||
          responseStep[i]?.status == STATUS_PARCEL_ENDORSER.SENDING
        )
          dataNew.push(responseStep[i]);
      }
      setDataKiemDinh(dataNew);
    }
  };
  const handleBack = () => {
    history.goBack();
  };

  const checkBackupStep = (e) => {
    if (!idParcel) return false;
    let stepCurrent = procedureStep;

    if (idBefore == statusEndorser?.procedure?._id) {
      setStepBackup(stepCurrent);
    }
    setIDBefore(e);
    if (!stepBackup) {
      setStepBackup(stepCurrent);
    }
    if (e == statusEndorser.procedure._id && stepBackup) {
      let getChangeStep = stepBackup;
      stepBackup.sort((a, b) => a.stepIndex - b.stepIndex);
      setProcedureStep(getChangeStep);
    }
    return true;
  };

  const onChangeParcel = async (e) => {
    setLoading(true);

    const response = checkBackupStep(e);
    if (!idParcel) {
      const responseStep = await getAllTempleteStepByID(e);
      responseStep.sort((a, b) => a.stepIndex - b.stepIndex);
      setProcedureStep(responseStep);
    }
    if (idParcel && e != statusEndorser.procedure._id) {
      const responseStep = await getAllTempleteStepByID(e);
      responseStep.sort((a, b) => a.stepIndex - b.stepIndex);
      setProcedureStep(responseStep);
    }
    setLoading(false);
  };

  const handleViewParcel = (data, status) => {
    setShowDialog(true);
    setDialogData(data);
    handleViewDialog(status);
  };
  const handleForm = async (e) => {
    setLoading(true);
    const dataLoHang = {
      name: e?.name,
      nsx: formatDatetrike(e.nsx),
      num: e?.num,
      status: e?.status,
      user: e?.nguoipt,
      procedure: e?.procedure,
      product: idProduct,
    };

    const response = await updateParcelAll(idParcel, dataLoHang);
    await handleGetID();
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PARCEL.EDIT_SUCCESS);
    }
    setLoading(false);
    setEnableForm(true);
  };

  const deleteConfim = async () => {
    const response = await deleteParcel(idParcel);
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PARCEL.DELETE);
    }
    handleDelete();
    history.push(`${URL.CHI_TIET_SAN_PHAM_ID.format(idProduct)}`);
  };
  const onHandleGuiDuyet = () => {
    changeVisibleDialogD(!visibleDialogD);
  };
  const onHandleGuiKD = () => {
    setonHandleDialogGuiDuyet(!onHandleDialogGuiDuyet);
  };
  const onSubmitKiemDinh = async (dataPush) => {
    setdataPushKDTemp(dataPush);
    handleVisibileDialogKD();
  };
  const handleVisibileDialogKD = () => {
    setModalConfimKey(!modalConfimKey);
  };
  const submitOwnerKey = async (private_key) => {
    const response = await sendToEndorser(
      dataPushKDTemp,
      idParcel,
      private_key
    );
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PARCEL.SENT_TO_BROWSER);
      setUpdateSubComponent(new Date());
    }
    handleGetID();
  };
  const cancelEdit = () => {
    handleGetID(false);
    setEnableForm(true);
  };
  const handleEditStep = (values) => {
    if (values.status_producer === STATUS_STEP.UPDATING) return true;
    switch (values.status) {
      case STATUS_STEP.CREATING:
        return true;
      case STATUS_STEP.SENDING:
        return true;
      case STATUS_STEP.REFUSED:
        return true;
      case STATUS_STEP.REJECT:
        return true;
      case null:
        return true;
      case undefined:
        return true;
    }
    return false;
  };
  const checkStatusDisabledEditAudit = (values) => {
    switch (values.status) {
      case STATUS_STEP.CREATING:
        return true;
      case STATUS_STEP.SENDING:
        return false;
      case STATUS_STEP.REFUSED:
        return true;
      case STATUS_STEP.REJECT:
        return true;
      case null:
        return true;
      case undefined:
        return true;
    }
    return false;
  };
  const showDialogNhatKy = (data, status) => {
    setShowDialogGhiNhatKy(true);
    setDialogData(data);
    handleViewDialog(status);
  };
  const closeDialogNhatKy = () => {
    setShowDialogGhiNhatKy(false);
    setDialogData(null);
    handleViewDialog(null);
  };
  return (
    <>
      {enableForm && procedureStep && (
        <div className="btn_duyet_kiemdinh">
          {myInfo._id && (
            <>
              {/* {(form.getFieldValue("nguoipt") == myInfo._id ||
                dataSP?.procedure == myInfo._id ||
                myInfo.userPermissions.is_admin == true) &&
                showGuiDuyet && (
                  <Button
                    type="primary"
                    className="button_reverse"
                    icon={<ArrowRightThick />}
                    onClick={onHandleGuiDuyet}
                    style={{ backgroundColor: "#1890FF" }}
                  >
                    Gửi duyệt
                  </Button>
                )} */}
              {(form.getFieldValue("nguoipt") == myInfo._id ||
                dataSP?.procedure == myInfo._id ||
                myInfo.userPermissions.is_admin == true) &&
                dataKiemDinh &&
                dataKiemDinh.length > 0 &&
                dataSP?.require_inspect && (
                  <Tooltip
                    placement="top"
                    title="Gửi thông tin lô hàng đến nhà kiểm định"
                    color="#179a6b"
                  >
                    <Button
                      type="primary"
                      className="button_reverse"
                      icon={<ArrowRightThick />}
                      onClick={onHandleGuiKD}
                    >
                      Gửi kiểm định
                    </Button>
                  </Tooltip>
                )}
            </>
          )}
        </div>
      )}
      <Loading active={isLoading}>
        <BaseContent>
          <div className="top--createnewParcel">
            <div className="header-top-parcel">
              <div className="header-top-left">
                <Link to={URL.CHI_TIET_SAN_PHAM_ID.format(idProduct)}>
                  <LeftOutlined className="handleBack"></LeftOutlined>
                </Link>
                <span>Thông tin lô sản phẩm</span>
                <div
                  className="status-parcel"
                  style={BROWSING_COLOR[statusEndorser?.status_endorser]}
                >
                  {ConvertStatusEndorser(statusEndorser?.status_endorser)}
                </div>
              </div>
              {idParcel && (
                <div className="header-top-right">
                  {enableForm &&
                    dataSP &&
                    statusEndorser &&
                    (myPermission?.[tentrang]?.sua || myPermission?.is_admin) &&
                    statusEndorser?.status_endorser !=
                      STATUS_PARCEL_ENDORSER.PUBLISH &&
                    statusEndorser?.status_endorser !=
                      STATUS_PARCEL_ENDORSER.PUBLISH && (
                      <Button
                        icon={<EditOutlined />}
                        type="ghost"
                        onClick={enableForms}
                        style={{
                          color: "#FF811E",
                          backgroundColor: "#FFE9D8",
                          border: 0,
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                  {!enableForm &&
                    (myPermission?.[tentrang]?.sua ||
                      myPermission?.is_admin) && (
                      <>
                        <Button
                          icon={<CloseOutlined />}
                          type="ghost"
                          onClick={cancelEdit}
                          style={{
                            color: "#FF811E",
                            backgroundColor: "#FFE9D8",
                            border: 0,
                          }}
                        >
                          Huỷ chỉnh sửa
                        </Button>

                        <Button
                          icon={<SaveOutlined />}
                          type="ghost"
                          htmlType="submit"
                          form="form"
                          loading={isLoading}
                          style={{
                            color: "#179a6b",
                            backgroundColor: "#f0fcf8",
                            border: 0,
                            marginLeft: "10px",
                          }}
                        >
                          Lưu
                        </Button>
                      </>
                    )}
                  {(myPermission?.[tentrang]?.xoa || myPermission?.is_admin) &&
                    enableForm && (
                      <Button
                        className="btn_delete"
                        icon={<DeleteIcon />}
                        type="ghost"
                        onClick={handleDelete}
                        style={{
                          color: "red",
                          backgroundColor: "#FFEFEF",
                          border: 0,
                        }}
                      >
                        Xoá
                      </Button>
                    )}
                </div>
              )}
            </div>
            <div className="div_hr"></div>
            <div className="search-bottom-parcel-tm">
              {qr && (
                <Col
                  className="gutter-row qr-mobile"
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  xl={4}
                >
                  <div className="div_left_qr">
                    <div className="div_img_qr">
                      <img src={qr} />
                    </div>
                    <div className="btn_action_out">
                      <div className="btn_action">
                        <Tooltip
                          placement="bottom"
                          title="Tải tem về máy của bạn"
                          color="#179a6b"
                        >
                          <Button
                            type="primary"
                            icon={<DownloadOutlined style={{ fontSize: 18 }} />}
                            href={qr}
                            download={`${form.getFieldValue("name")}.png`}
                            className="btn_download"
                          >
                            Tải xuống tem
                          </Button>
                        </Tooltip>

                        <Link
                          to={`${URL.MENU.TRUY_XUAT_SAN_PHAM}?code=${statusEndorser?.name}&from_to=${id}`}
                        >
                          <Tooltip
                            placement="top"
                            title="Tra cứu thông tin lô hàng"
                            color="#FF811E"
                          >
                            <Button
                              type="primary"
                              icon={<SearchOutlined style={{ fontSize: 18 }} />}
                              className="btn_search"
                            >
                              Tra cứu
                            </Button>
                          </Tooltip>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              )}
              <Col
                className="gutter-row"
                xs={24}
                sm={24}
                md={qr ? 16 : 24}
                lg={qr ? 18 : 24}
                xl={qr ? 20 : 24}
              >
                <Form
                  form={form}
                  layout="vertical"
                  id="form"
                  onFinish={handleForm}
                  disabled={enableForm}
                >
                  <Row gutter={{ xs: 5, sm: 8, md: 12, lg: 20 }}>
                    {idParcel && (
                      <Col
                        className="gutter-row"
                        xs={24}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={6}
                      >
                        <Form.Item label="Mã lô sản phẩm" name="name">
                          <Input placeholder="Mã lô sản phẩm" disabled />
                        </Form.Item>
                      </Col>
                    )}
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={12}
                      lg={12}
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
                        <DatePicker
                          picker="day"
                          style={{ width: "100%" }}
                          placeholder="Chọn ngày sản xuất"
                          format="DD/MM/YYYY"
                          disabled={idParcel}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={6}
                    >
                      <Form.Item
                        label="Số lượng sản xuất"
                        name="num"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Vui lòng nhập số lượng sản phẩm",
                        //   },
                        // ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="Số lượng sản xuất"
                          style={{ width: "100%" }}
                        ></InputNumber>
                      </Form.Item>
                    </Col>
                    <Form.Item
                      name="status"
                      label="Tình trạng lô hàng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn tình trạng lô hàng",
                        },
                      ]}
                      initialValue={STATUS_PARCEL.UNEXPORTED}
                      hidden={true}
                    >
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

                    {idParcel && (
                      <Col
                        className="gutter-row"
                        xs={24}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={6}
                      >
                        <Form.Item label="Tên sản phẩm" name="nameProduct">
                          <Input placeholder="Tên sản phẩm" readOnly />
                        </Form.Item>
                      </Col>
                    )}
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={6}
                    >
                      <Form.Item
                        label="Quy trình sản xuất"
                        name="procedure"
                        rules={[
                          {
                            required: true,
                            message: "Quy trình không thể để trống!",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Chọn quy trình sản xuất"
                          onChange={onChangeParcel}
                          filterOption={(inputValue, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) !== -1
                          }
                        >
                          {procedureOrg &&
                            procedureOrg.map((option) => (
                              <Select.Option
                                key={option._id}
                                value={option._id}
                                label={option.name}
                              >
                                {option.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col
                      className="gutter-row"
                      xs={24}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={6}
                    >
                      <Form.Item name="nguoipt" label="Người phụ trách">
                        <Select readOnly>
                          {dataUser &&
                            dataUser.map((data) => {
                              return (
                                <Select.Option key={data._id} value={data._id}>
                                  {data?.name || data?.email}
                                </Select.Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </div>
          </div>
          {procedureStep && (
            <div className="show-procedure--lohang">
              <div className="show-procedure--title">
                <span>Quy trình sản xuất</span>
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
                            Bước {data.stepIndex}: {data.name}
                          </div>
                          <div>
                            {/* <Button
                                // icon={<Editable />}
                                style={{ border: 0 }}
                                onClick={() => {
                                  handleViewParcel(data, true);
                                }}
                                type="primary"
                              >Ghi nhật ký</Button> */}

                            <Tooltip title="Sửa thông tin" color={"orange"}>
                              <Button
                                icon={<Editable />}
                                style={{ border: 0 }}
                                onClick={() => {
                                  handleViewParcel(data, handleEditStep(data));
                                }}
                              />
                            </Tooltip>
                            {data.status != STATUS_PARCEL_ENDORSER.PUBLISH && (
                              <Tooltip title="Ghi nhật ký" color={"#00C2FF"}>
                                <Button
                                  icon={<IconEditHistory />}
                                  onClick={() => {
                                    showDialogNhatKy(
                                      data,
                                      checkStatusDisabledEditAudit(data)
                                    );
                                  }}
                                  style={{ border: 0 }}
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
                          {Array.isArray(data.image) &&
                            data.image.length > 0 && (
                              <span>Hình ảnh, video lô hàng:</span>
                            )}
                          {Array.isArray(data.image) &&
                            data.image.length > 0 && (
                              <UploadImage
                                data={data.image}
                                disabled={true}
                              ></UploadImage>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              <DialogChinhSua
                visible={showDialog}
                onCancel={showDialogChinhSua}
                data={procedureStep}
                dialogData={dialogData}
                disabled={enableForm}
                viewDialog={viewDialog}
                getData={handleGetID}
              ></DialogChinhSua>
              <DialogDeleteConfim
                visible={dialogDelete}
                onCancel={handleDelete}
                onOK={deleteConfim}
              />
            </div>
          )}
        </BaseContent>
        {/* {idParcel && statusEndorser?._id && (
          <QuyTrinhXetDuyet
            idParcel={idParcel}
            update={handleGetID}
            updateCP={updateSubComponent}
            statusEndorser={statusEndorser}
            enableStatus={myInfo.userPermissions.is_admin}
          />
        )} */}
        {idParcel && statusEndorser?._id && (
          <QuyTrinhKiemDinhSX
            statusProps={false}
            statusEndorser={statusEndorser}
            updateCP={updateSubComponent}
          />
        )}
        {idParcel &&
          procedureStep &&
          statusEndorser &&
          showPublic &&
          (myPermission?.[tentrang]?.congkhai || myPermission?.is_admin) && (
            <CongKhaiSanPham
              idParcel={idParcel}
              infoStep={procedureStep}
              updateCP={updateSubComponent}
              infoParcel={statusEndorser}
            />
          )}
      </Loading>
      <DialogGhiNhatKySX
        visible={showDialogGhiNhatKy}
        dialogData={dialogData}
        onClose={closeDialogNhatKy}
        disabled={viewDialog}
      />
      {procedureStep && (
        <>
          <GuiDuyet
            onVisible={visibleDialogD}
            changeVisible={onHandleGuiDuyet}
            data={procedureStep}
            updateCP={updateSubComponent}
            update={handleGetID}
            maLo={form.getFieldValue("name")}
            idParcel={idParcel}
          ></GuiDuyet>
          <GuiKiemDinh
            onVisible={onHandleDialogGuiDuyet}
            changeVisible={onHandleGuiKD}
            data={dataKiemDinh}
            update={handleGetID}
            updateCP={updateSubComponent}
            submitProp={onSubmitKiemDinh}
            maLo={form.getFieldValue("name")}
            idParcel={idParcel}
          ></GuiKiemDinh>
          <VerifyDigitalSignature
            visible={modalConfimKey}
            handleVisible={handleVisibileDialogKD}
            onSubmit={submitOwnerKey}
          />
        </>
      )}
    </>
  );
}

function mapStatetoProps(store) {
  const { myInfo } = store.user;
  return { myInfo, myPermission: myInfo?.userPermissions };
}

export default connect(mapStatetoProps)(ChinhSuaLoHang);
