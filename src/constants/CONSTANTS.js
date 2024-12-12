import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';


export const WEB_VERSION = "2021/22/11/13/42";

export const SIDER_WIDTH = 270;

export const CONSTANTS = {
  USER_NAME_ADDON: "1npt\\",
  LANG_VI: "vi",
  LANG_EN: "en",
  IN: "IN",
  OUT: "OUT",
  TERRAIN: "TERRAIN",
  SATELLITE: "SATELLITE",
  ANDROID: "ANDROID",
  IOS: "IOS",
  BARS: "BARS",
  PREV: "PREV",
  NEXT: "NEXT",
  HIDDEN: "HIDDEN",
  INITIAL: "INITIAL",
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  LOGIN: "LOGIN",
  DEFAULT: "DEFAULT",
  ALL: "ALL",
  READ: "READ",
  DELETE: "DELETE",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  ADD: "ADD",
  REMOVE: "REMOVE",
  SAVE: "SAVE",
  CONFIRM: "CONFIRM",
  CANCEL: "CANCEL",
  CLOSE: "CLOSE",

  TEXT: "TEXT",
  NUMBER: "NUMBER",
  YEAR: "YEAR",
  DATE: "DATE",
  TIME: "TIME",
  DATE_TIME: "DATE_TIME",
  TIME_DATE: "TIME_DATE",
  FORMAT_DATE: "DD/MM/YYYY",
  FORMAT_DATE_TIME: "DD/MM/YYYY HH:mm",
  FORMAT_TIME_DATE: "HH:mm DD/MM/YYYY",
  INPUT: "INPUT",
  CHECK_BOX: "CHECK_BOX",
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  TEXT_AREA: "TEXT_AREA",
  SELECT_MULTI: "SELECT_MULTI",
  PASSWORD: "PASSWORD",
  SWITCH: "SWITCH",
  LABEL: "LABEL",
  SELECT_LABEL: "SELECT_LABEL",
  TREE_SELECT: "TREE_SELECT",
  FILE: "FILE",
  ONE_DAY: "ONE_DAY",

  DESTROY: "DESTROY",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING",

  CHAIRMAN: "CHAIRMAN",
  MEMBER: "MEMBER",

  NOT_IN: "NOT_IN",
  NOT_UPLOADED: "NOT_UPLOADED",
  UPLOADING: "UPLOADING",
  UPLOADED: "UPLOADED",
  UPLOAD_ERROR: "UPLOAD_ERROR",

  NOT_FOUND: "NOT_FOUND",
  FILE_KEY_NAME: "PrivateKeyTTrust.pem",

  PERMISSION_DEFAULT: {
    create: false,
    delete: false,
    update: false,
  },

  CASCADER_JOIN: " > ",
  START: "START",
  END: "END",
  LOCK: "LOCK",
  COMPLETE: "COMPLETE",
  PROCESSING: "PROCESSING",
  PROCESSED: "PROCESSED",
  POPULATE: "populate",
};

export const PAGINATION_INIT = Object.assign(
  {},
  {
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  }
);
export const TOKEN_EXP_TIME = 1000 * 5 * 60;

export const GENDER_OPTIONS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

export const THOI_GIAN_FILTER = [
  {
    label: "Tháng hiện tại",
    value: "MONTH",
    fromDate: moment().startOf("month"),
    toDate: moment(),
  },
  {
    label: "Quý hiện tại",
    value: "QUARTER",
    fromDate: moment().startOf("quarter"),
    toDate: moment(),
  },
  {
    label: "Năm hiện tại",
    value: "YEAR",
    fromDate: moment().startOf("year"),
    toDate: moment(),
  },
  { label: "Tùy chọn", value: "OTHER" },
];

export const ERR_FILTER = [
  { label: "Tất cả", value: "ALL" },
  { label: "Dữ liệu không hợp lệ", value: "ERR" },
  { label: "Dữ liệu hợp lệ", value: "NO_ERR" },
];

export const TOAST_MESSAGE = {
  SUCCESS: {
    DEFAULT: "Thành công",
    DOWNLOAD: "Tải xuống thành công",
    UPDATE_ME: "Cập nhật thông tin thành công",
    REGISTER: "Đăng ký tài khoản thành công",
    REGISTER_AND_INVITE_LOGIN:
      "Đăng ký tài khoản thành công, xin mời đăng nhập",
    CREATE_FACTURE: "Thêm mới cơ sở sản xuất thành công",
    UPDATE_FACTURE: "Cập nhật thông tin thành công",
    DELETE_FACTURE: "Xoá cơ sở sản xuất thành công",
  },
  ERROR: {
    DEFAULT: "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên",
    LOGIN: "Có lỗi trong quá trình đăng nhập",
    GET: "Có lỗi trong quá trình lấy dữ liệu",
    POST: "Có lỗi trong quá trình tạo mới",
    PUT: "Có lỗi trong quá trình cập nhật",
    DELETE: "Có lỗi trong quá trình xoá dữ liệu",
    DESCRIPTION: "Vui lòng kiểm tra và thử lại",
    NOT_LOGIN: "Bạn vui lòng đăng nhập để tiếp tục",
    NOT_DELETE_ACTIVE: "Bạn không thể xoá quy trình đang hoạt động",
  },
  FILE: {
    NOT_ACCEPT_EXTENSION:
      "Định dạng file không hợp lệ, chỉ chấp nhận file có đuôi (.pem,.cer,.txt)",
    NOT_FOUND_KEY: "Bạn cần nhập khoá hoặc chọn file khoá của mình",
  },
  ICON: {
    SUCCESS: (
      <CheckCircleOutlined
        className="float-left"
        style={{ fontSize: "24px", color: "#fff" }}
      />
    ),
    ERROR: (
      <CloseCircleOutlined
        className="float-left"
        style={{ fontSize: "24px", color: "#fff" }}
      />
    ),
    INFO: (
      <InfoCircleOutlined
        className="float-left"
        style={{ fontSize: "24px", color: "#fff" }}
      />
    ),
    WARNING: (
      <WarningOutlined
        className="float-left"
        style={{ fontSize: "24px", color: "#fff" }}
      />
    ),
  },
  IMAGE_LARGE:
    "File của bạn có dung lượng lớn hơn 25MB, vui lòng chọn file khác",
  VIDEO_LARGE:
    "Video của bạn có dung lượng lớn hơn 50MB, vui lòng chọn file khác",
  NOT_IMAGE: "Bạn chỉ có thể tải lên ảnh",
  NOT_VIDEO: "Bạn chỉ có thể tải lên Video",
  PROCEDURE_EDIT_ERROR: "Có lỗi trong khi sửa quy trình",
  PRODUCT: {
    ADD_PRODUCT: "Sản phẩm của bạn đã được thêm vào hệ thống thành công",
    EDIT_PRODUCT: "Sản phẩm của bạn đã được chỉnh sửa thành công",
    DELETE_PRODUCT: "Sản phẩm của bạn đã được xoá thành công",
  },
  PARCEL: {
    DUPLICATE_STEP: "Thứ tự quy trình đã tồn tại",
    DUPLICATE_KEY_PARCEL: "Mã lô sản phẩm đã tồn tại",
    ADD_SUCCESS: "Thêm lô hàng thành công",
    EDIT_SUCCESS: "Chỉnh sửa thông tin lô hàng thành công",
    SENT_TO_ENDORSER: "Gửi duyệt lô hàng thành công",
    EDIT_SENT_TO_ENDORSER: "Cập nhật các yêu cầu duyệt thành công",
    SENT_TO_BROWSER: "Gửi kiểm định lô hàng thành công",
    DELETE:
      "Xoá lô hàng thành công, bạn sẽ được chuyển hướng tới trang quản lý sản phẩm",
    NOT_TIME_DATE:
      "Bạn chưa nhập ngày bắt đầu và ngày kết thúc trong từng bước của lô hàng",
    EMPTY_GUI_DUYET:
      "Bạn chưa chọn bước nào hoặc không có thay đổi để gửi duyệt",
    EMPTY_GUI_KIEM_DINH:
      "Bạn chưa chọn bước nào hoặc không có thay đổi để gửi kiểm định",
    EMPTY_GUI_KET_QUA:
      "Chưa có bước nào hoặc không có thay đổi để gửi kết quả cho nhà sản xuất",
    EMPTY_PHAN_CONG: "Chưa có bước kiểm định nào cần phần công",
  },
  KEY: {
    TITLE: "Cập nhật tiêu đề chữ ký thành công",
  },
  AUDIT: {
    CREATE_NEW: "Thêm nhật ký thành công",
    EDIT: "Cập nhật nhật ký thành công",
    REMOVE: "Xoá nhật ký thành công",
  },
  PUBLIC_PRODUCT: {
    SUCCESS: "Công khai lô hàng thành công",
    EDIT: "Cập nhật thông tin công khai lô hàng thành công",
    ERROR:
      "Có lỗi khi công khai lô hàng, xin vui lòng liên hệ quản trị để được hỗ trợ",
    NOT_SELECT_CHECKBOX:
      "Đây là trường bắt buộc phải công khai, bạn không thể sửa đổi",
  },
  COMMENT: {
    UPDATE_STATUS: "Phê duyệt bình luận thành công",
    DELETE: "Xoá bình luận thành công",
  },
  ORG: {
    CREATE: "Tạo tổ chức mới thành công",
    EDIT: "Chỉnh sửa thông tin tổ chức thành công",
    DELETE: "Xoá tổ chức thành công",
  },
  STEP: {
    EDIT_SUCCESS: "Cập nhật thông tin quy trình thành công",
    EDIT_ERROR: "Cập nhật thông tin quy trình không thành công",
  },
};

export const RULES = {
  REQUIRED: { required: true, message: "Không được để trống" },
  NUMBER: { pattern: "^[0-9]+$", message: "Không phải là số" },
  PHONE: {
    pattern: "^[0-9]+$",
    len: 10,
    message: "Số điện thoại không hợp lệ",
  },
  CMND: {
    required: true,
    pattern: "^[0-9]+$",
    message: "Số CMND/CCCD không hợp lệ",
  },
  EMAIL: { type: "email", message: "Email không hợp lệ" },
  NUMBER_FLOAT: {
    pattern: new RegExp("^[- +]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$"),
    message: "Không phải là số",
  },
  PHONE_NUMBER: {
    pattern: /^(0[35789]\d{8}|02\d{9}|\+84[35789]\d{8}|(\+842)\d{9})$/,
    message: "Số điện thoại bạn vừa nhập không hợp lệ",
  },
  PASSWORD_FORMAT: {
    pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?!.* )(?=.{6,})/,
    message:
      "Mật khẩu phải có ít nhất một chữ cái và một chữ số, độ dài ít nhất 6 ký tự và không có khoảng trắng",
  },
  USERNAME_RANGER: {
    pattern: new RegExp("^([a-zA-Z0-9_-]){6,32}$"),
    message: "Tên tài khoản chỉ chấp nhận độ dài 6 đến 32 ký tự",
  },
  USERNAME_LENGTH: {
    pattern: new RegExp("^(?!.* )(?=.{6,32})"),
    message:
      "Tên tài khoản chỉ chấp nhận độ dài 6 đến 32 ký tự và không có khoảng trắng",
  },
};

export const PAGINATION_CONFIG = Object.assign(
  {},
  {
    pageSizeOptions: ["1", "10", "20", "50"],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
  }
);

export const PAGINATION_MODAL = Object.assign({}, PAGINATION_CONFIG, {
  pageSizeOptions: [5, 10, 15],
  defaultPageSize: 5,
});

export const TRANG_THAI_HOAN_THANH = {
  DA_HOAN_THANH: "DA_HOAN_THANH",
  CHUA_HOAN_THANH: "CHUA_HOAN_THANH",
};
export const CONSTANT_MESSAGE = {
  REMOVE:
    "Nếu bạn thao tác xoá dẫn đến các thông tin không còn hiển thị. Bạn có chắc chắn muốn xoá thông tin này?",
  CONFIM: "Bạn có chắc chắn muốn xác nhận {0} không ?",
};
export const TRANG_THAI_XU_LY = {
  CHUA_XU_LY: { code: "CHUA_XU_LY", label: "Chưa xử lý", color: "#fa541c" },
  DANG_XU_LY: { code: "DANG_XU_LY", label: "Đang xử lý", color: "#1890ff" },
  DA_XU_LY: { code: "DA_XU_LY", label: "Đã xử lý", color: "#13c2c2" },
};
export const TRANG_THAI_THUC_HIEN = {
  CHUA_THUC_HIEN: {
    code: "CHUA_THUC_HIEN",
    label: "Chưa thực hiện",
    color: "#fa541c",
  },
  DA_THUC_HIEN: {
    code: "DA_THUC_HIEN",
    label: "Đã thực hiện",
    color: "#13c2c2",
  },
};

export const COMMON_FILE_NAME_EXTENSION = [
  "doc",
  "docx",
  "odt",
  "pdf",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
];

export const IMAGE_FILE_EXTENSION = ["jpg", "jpeg", "png", "svg"];
export const EXTRA_FIELD = {
  User: { code: "User", label: "Người dùng" },
  ViTri: { code: "ViTri", label: "Vị trí" },
  CongTrinh: { code: "CongTrinh", label: "Công trình" },
  DuongDay: { code: "DuongDay", label: "Đường dây" },
};
export const KIEU_DU_LIEU = {
  VAN_BAN: { code: "VAN_BAN", label: "Văn bản" },
  THOI_GIAN: { code: "THOI_GIAN", label: "Thời gian" },
  DANH_SACH: { code: "DANH_SACH", label: "Danh sách" },
};
export const ORG_UNIT_TYPE = {};
export const LOAI_TAI_KHOAN = {
  TAI_KHOAN_HE_THONG: {
    code: "TAI_KHOAN_HE_THONG",
    value: "TAI_KHOAN_HE_THONG",
    label: "Tài khoản hệ thống",
  },
  TAI_KHOAN_HRMS: {
    code: "TAI_KHOAN_HRMS",
    value: "TAI_KHOAN_HRMS",
    label: "Tài khoản HRMS",
  },
};

export const STATUS_PARCEL_ENDORSER = {
  CREATING: "creating", // Trạng thái đang tạo
  BROWSING: "browsing", // Trạng thái đang duyệt
  SENDING: "sending", // Trạng thái đang gửi sang bên kiểm định
  EDORSING: "endorsing", // Trạng thái đang kiểm định
  ENDORSING: "endorsing",
  ENDORSED: "endorsed", // Trạng thái hoàn tất kiểm định
  PUBLISH: "publish", // Trạng thái công khai
  REJECT: "reject", // Trạng thái bị từ chối kiểm định
  ASSIGNED: "assigned", // Trạng thái đã dc gán
  DENIED: "denied",
  COMPLETED: "completed",
};
export const STATUS_STEP = {
  CREATING: "creating", // Trạng thái đang tạo
  SENDING: "sending",
  REFUSED: "refused",
  RECEIVED: "received",
  UPDATING: "updating", // Trạng thái bước thực hiện đang ở trạng thái đang cập nhât

  EDORSING: "endorsing", // Trạng thái đang kiểm định
  ENDORSED: "endorsed", // Trạng thái hoàn tất kiểm định
  REJECT: "reject", // Trạng thái bị từ chối kiểm định
  PUBLISH: "publish", // Trạng thái công khai
};
export const ROLE_PAGES_ENDORSER = [
  {
    trang: "all",
    tentrang: "Chọn tất cả",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "quan-ly-nhan-vien",
    tentrang: "Tài khoản nhân viên",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "danh-sach-kiem-dinh",
    tentrang: "Danh sách kiểm định",
    quyen: ["xem", "sua"],
    xem: false,
    sua: false,
  },
  {
    trang: "kiem-dinh-san-pham",
    tentrang: "Kiểm định sản phẩm",
    quyen: ["xem", "them", "sua", "duyet", "guiketqua"],
    xem: false,
    them: false,
    sua: false,
    duyet: false,
    guiketqua: false,
  },
  {
    trang: "phan-quyen-vai-tro",
    tentrang: "Phân quyền vai trò",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "lich-su-hoat-dong",
    tentrang: "Lịch sử hoạt động",
    quyen: ["xem"],
    xem: false,
  },
  { trang: "dashboard", tentrang: "Dashboard", quyen: ["xem"], xem: false },
];
export const ROLE_PAGES_PRODUCER = [
  {
    trang: "all",
    tentrang: "Chọn tất cả",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },

  {
    trang: "quan-ly-nhan-vien",
    tentrang: "Tài khoản nhân viên",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "quan-ly-san-pham",
    tentrang: "Quản lý sản phẩm và lô hàng",
    quyen: ["xem", "them", "sua", "xoa", "duyet", "congkhai"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
    duyet: false,
    congkhai: false,
  },
  {
    trang: "quan-ly-quy-trinh",
    tentrang: "Quy trình",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "phan-quyen-vai-tro",
    tentrang: "Phân quyền vai trò",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "danh-sach-binh-luan",
    tentrang: "Quản lý bình luận",
    quyen: ["xem", "sua", "duyet"],
    xem: false,
    sua: false,
    duyet: false,
  },
  {
    trang: "co-so-san-xuat",
    tentrang: "Quản lý cơ sở sản xuất",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "lich-su-hoat-dong",
    tentrang: "Lịch sử hoạt động",
    quyen: ["xem"],
    xem: false,
  },
  { trang: "dashboard", tentrang: "Dashboard", quyen: ["xem"], xem: false },
];
export const ROLE_PAGES_SYSTEM = [
  {
    trang: "all",
    tentrang: "Chọn tất cả",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "danh-sach-to-chuc",
    tentrang: "Danh sách tổ chức",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "tai-khoan-to-chuc",
    tentrang: "Tài khoản tổ chức",
    quyen: ["xem", "them", "sua", "xoa"],
    xem: false,
    them: false,
    sua: false,
    xoa: false,
  },
  {
    trang: "lich-su-hoat-dong",
    tentrang: "Lịch sử hoạt động",
    quyen: ["xem"],
    xem: false,
  },
  { trang: "dashboard", tentrang: "Dashboard", quyen: ["xem"], xem: false },
];
export const STATUS_PARCEL = {
  CREATING: "creating",
  CANCELLED: "cancelled", // Lô hàng ở trạng thái đã hủy
  EXPORTED: "exported", // Lô hàng ở trạng thái đã xuất xưởng
  UNEXPORTED: "unexported", // Lô hàng ở trạng thái chưa xuất xưởng
  PUBLISH: "publish", // Lô hàng ở trạng thái công khai
};
export const VI_STATUS_PARCEL = {
  CREATING: "Đang tạo",
  BROWSING: "Đang duyệt",
  CANCELLED: "Đã huỷ",
  EXPORTED: "Đã xuất xưởng",
  UNEXPORTED: "Chưa xuất xưởng",
  CREATING: "Đang tạo lô hàng", // Trạng thái đang tạo
  SENDING: "Đang gửi kiểm định", // Trạng thái đang tạo
  ENDORSING: "Đang kiểm định", // Trạng thái đang kiểm định
  ENDORSED: "Hoàn tất kiểm định", // Trạng thái hoàn tất kiểm định
  PUBLISH: "Công khai", // Trạng thái công khai
  REJECT: "Từ chối kiểm định", // Trạng thái bị từ chối kiểm định
};

export const STATUS_ACCOUNT = [
  {
    name: "Chưa kích hoạt",
    value: false,
  },
  {
    name: "Đã kích hoạt",
    value: true,
  },
];

export const VI_STATUS_STEP = {
  creating: "Đang tạo",
  sending: "Chờ xác nhận kiểm định", // Trạng thái đang tạo
  endorsing: "Chờ kiểm định", // Trạng thái đang kiểm định
  endorsed: "Hoàn tất kiểm định", // Trạng thái hoàn tất kiểm định
  publish: "Công khai", // Trạng thái công khai
  accepted: "Đã duyệt",
  denied: "Từ chối duyệt",
  reject: "Từ chối kiểm định", // Trạng thái bị từ chối kiểm định
  assigned: "Đã phân công",
  browsing: "Đang duyệt",
  received: "Đã tiếp nhận",
  refused: "Từ chối tiếp nhận",
  completed: "Hoàn tất kiểm định",
  pending: "Chờ tiếp nhận",
};
export const STATUS_STEP_OPTIONS = [
  { name: "Đã phân công", value: "assigned" },
  { name: "Đang duyệt", value: "browsing" },
  { name: "Đã duyệt", value: "accepted" },
  { name: "Từ chối duyệt", value: "denied" },
  { name: "Hoàn tất kiểm định", value: "completed" },
];
export const STATUS_STEP_OPTIONS_SEARCH = [
  {
    name: "Chờ tiếp nhận",
    value: "pending",
  },
  {
    name: "Từ chối tiếp nhận",
    value: "refused",
  },
  {
    name: "Đã tiếp nhận",
    value: "received",
  },
  {
    name: "Đã phân công",
    value: "assigned",
  },
  {
    name: "Đang duyệt",
    value: "browsing",
  },
  { name: "Đã duyệt", value: "accepted" },
  { name: "Từ chối duyệt", value: "denied" },
  { name: "Hoàn tất kiểm định", value: "completed" },
];
export const STATUS_COMMENT_SELECT = [
  {
    value: "accepted",
    name: "Đã duyệt",
  },

  {
    value: "pending",
    name: "Chờ duyệt",
  },
  {
    value: "denied",
    name: "Từ chối",
  },
];
export const STATUS_COMMENT = {
  ACCEPTED: "accepted",
  DENIED: "denied",
  PENDING: "pending",
};
export const TYPE_SENDING = {
  SEND_TO_ENDORSER: "send-to-endorser",
  SEND_TO_PRODUCER: "send-to-producer",
};

export const SCOPE_SENDING = {
  ENDORSER: "endorser",
  PRODUCER: "producer",
  ALL: "all",
};
export const RESULT_SENDING = {
  ACCEPTED: "accepted",
  DENIED: "denied",
  ENDORSED: "endorsed",
  REJECT: "reject",
  COMPLETED: "completed",
  RECEIVED: "received",
  REFUSED: "refused",
};
export const STATUS_ENDORSER = {
  ASSIGNED: "assigned", // Trạng thái đã dc gán,
  BROWSING: "browsing",
  ACCEPTED: "accepted",
  REJECT: "reject",
  COMPLETED: "completed",
};
export const STATUS_PRODUCER_KD = {
  ENDORSED: "endorsed",
  REJECT: "reject",
  ENDORSING: "endorsing",
};
export const TYPE_ORG = {
  SYSTEM: "system",
  PRODUCER: "producer",
  ENDORSER: "endorser",
  CONSUMER: "consumer",
};
export const SELECT_ROLE = [
  {
    value: "endorser",
    name: "Đơn vị kiểm định",
  },

  {
    value: "producer",
    name: "Đơn vị sản xuất",
  },
  {
    value: "system",
    name: "Đơn vị phần mềm",
  },
  {
    value: "member",
    name: "Người dùng",
  },
];
export const SELECT_ROLE_CREATE_ORG = [
  {
    value: "endorser",
    name: "Đơn vị kiểm định",
  },

  {
    value: "producer",
    name: "Đơn vị sản xuất",
  }
];
export const product_public_items = [
  {
    name: "Tên sản phẩm",
    key: "name",
    checked: true,
    isEdit: false,
  },
  {
    name: "Mã sản phẩm",
    key: "code",
    checked: false,
    isEdit: true,
  },
  {
    name: "Quy trình sản xuất",
    key: "procedure",
    checked: false,
    isEdit: true,
  },
  {
    name: "Cơ sở sản xuất",
    key: "producer",
    checked: true,
    isEdit: false,
  },
  {
    name: "Địa chỉ URL",
    key: "url",
    checked: false,
    isEdit: true,
  },
  {
    name: "Địa chỉ",
    key: "address",
    checked: true,
    isEdit: false,
  },
  {
    name: "Các tiêu chuẩn quốc gia, quốc tế",
    key: "nationalstandard",
    checked: false,
    isEdit: true,
  },
  {
    name: "Mô tả sản phẩm",
    key: "describe",
    checked: true,
    isEdit: false,
  },
  {
    name: "Hình ảnh, video sản phẩm",
    key: "media",
    checked: false,
    isEdit: true,
  },
];
export const parcel_public_items = [
  {
    name: "Mã lô sản phẩm",
    key: "name",
    checked: false,
  },
  {
    name: "Ngày sản xuất",
    key: "nsx",
    checked: false,
  },
  {
    name: "Tình trạng lô hàng",
    key: "status",
    checked: false,
  },
  {
    name: "Số lượng sản phẩm",
    key: "num",
    checked: false,
  },
  {
    name: "Nhật ký sản xuất",
    key: "productHistory",
    checked: false,
  },
  {
    name: "Nhật ký kiểm định",
    key: "auditHistory",
    checked: false,
  },
];

export const SITE_URL = {
  URL: "https://truyxuat.hdu.edu.vn",
};
export const BROWSING_COLOR = {
  creating: {
    backgroundColor: "#FFE9D8",
    color: "#FF811E",
  },
  sending: {
    backgroundColor: "#FFF5DB",
    color: "#FFBD13",
  },
  endorsing: {
    backgroundColor: "#F0FCF8",
    color: "#179a6b",
  },
  endorsed: {
    backgroundColor: "#179A6B",
    color: "#ffffff",
  },
  reject: {
    color: "#F53B3B",
    backgroundColor: "#FAF1F4",
  },
  publish: {
    color: "#1890FF",
    backgroundColor: "#CEE7FF",
  },
  accepted: {
    color: "#062AAC",
    backgroundColor: "#F4F0FF",
  },
  denied: {
    color: "#FA5050",
    backgroundColor: "#FCF2F2",
  },
  assigned: {
    color: "#AF50FA",
    backgroundColor: "#F9F2FC",
  },
  browsing: {
    color: "#0DC2CD",
    backgroundColor: "#EFFFFB",
  },
  received: {
    color: "#239CDF",
    backgroundColor: "#EBF8FF",
  },
  refused: {
    color: "#A7A7A7",
    backgroundColor: "#F3F3F3",
  },
  completed: {
    color: "#FFFFFF",
    backgroundColor: "#1890FF",
  },
  pending: {
    color: "#D9AA33",
    backgroundColor: "#FFFBD3",
  },
  undefined: {
    color: "#FFBD13",
    borderColor: "#FFF3D3",
  },
};
export const DATA_SEARCH_PROCEDURE = [
  {
    name: "Đang sử dụng",
    value: true,
  },
  {
    name: "Dừng sử dụng",
    value: false,
  },
];
export const LINK_DOWNLOAD_APP = {
  CH_PLAY: "https://play.google.com/store/apps/details?id=vn.thinklabs.traceabilityapp",
  APP_STORE: "https://apps.apple.com/vn/app/th-tracing/id6529534082?platform=iphone"
}

export const ADVANTAGE_CONTENT = [
  {
    title: "Sứ mệnh",
    content: "HĐ - Tracing là chuẩn mực minh bạch thông tin và nguồn gốc sản phẩm nhằm giúp Doanh nghiệp chân chính gia tăng uy tín, tăng sức cạnh tranh, đồng thời kết nối hiệu quả với khách hàng.",
    position: "left",
    icon: "data:image/png;base64,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"

  },
  {
    title: "Sử dụng công nghệ Blockchain",
    content: "Giúp minh bạch thông tin sản phẩm, thông tin không thể bị sửa đổi hoặc xoá bỏ",
    position: "left",
    icon: "data:image/png;base64,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"
  },
  {
    title: "Kết nối",
    content: "HĐ - Tracing hỗ trợ kết nối doanh nghiệp với nhà kiểm định.",
    position: "right",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB4CAYAAADWpl3sAAAEmklEQVR42u2dTWsTQRjH9yP0I/gRAt7Fc089aI+13nrwEPDiRVrw0GOKxyLEi72miAcRSxUU9GADUoRWcIUeYndmMoJpdreXmCfWbJSmm+xL8szMf+B3aZvwzPzyPPO2Jd6sWitsXQtCuSrOVU1E7YaM2j4hItVziT99bu/3aZyGYqMVipt+z1/wTGwUuOh3QMaqLiOluQwyW+J2k6RTMnjcGwUpYr0OsXlo71PV87g1kktZy2OQ7EBGymchm8oyZS6XgbGRucoezLmRcm7xNC+oUs50zhaRrnHpvEsMsroTVEovz7Qw4NJpV/kRqWppiyuUZ0bEeh2CXaAvGoJdoAjRIlZNFp0BY5Hn+g5W0bYTK51p1U0bcBYdABNvr3RPL2Aetp/axJJxDm0udH05URZzCRhku8VKlYwTLfOhbL7y0oFLoCBfNmMudgDKZszF1tNuYF9sO7HStG/GgstygjBYRam2nCBW9aFkeSaXuAQGii3ZyXzclVssggKFg/nYARLJeBjeWoaSuQQESpLcCjVW1hbjUQvOgwqXgEDx4FLCASDZASDZAdhKXny90rv+YnHmbB/vsOi/E5LnIZi4+/4+i/5DMiRDMiRDMiRzAZIhGZIhGZIhGZJ5ME7CjZe3eh/EQe/w51FmdvxdSOYu+VAf5Xlvej0kc5Z8AR17ZgXlmguYkyF5JpK3v+5QaWcxHpBcguS91rvhzx4cbBotG5LTJRsvG5LTJRsv2zjJtIX6/uskz3uTwBySE2pfnhgh20jJOQeWDkPyS062ciSbxZhZI5lBuR4nmz48LMYOkqeXbLxsSE6XnFn285NXLMYSksuQnKwfWIwlJJcnmWAxlkZKpgzJcUFBr4dkzpILKIG0BYNk7pJJQJ6HBh59fgzJnCXP9ez60+bYeP3OSf8DeBuSjZd8MFYyHbXSfA/JpktGuYZkSIZkSIZkSC7kUIT+Po9kej0tvi7l3seHkFy05MW9lSyHILkkbx8/u/L9l9+uQfIUlPXobFbJyTXit93LoCc7kck2SMacDMmQDMmQDMmQzEMybZPo52PABYUNklMevaXXQrLpki9+fynLb9ZQrm2RjDkZkiEZkiEZkiEZkiEZks2T3L9KNF5yvw8sxpKtZADJAJIBJDsGJDsAvqvRASDZAfDVug4wlCwj5XMJCuDr7kFWyUFXbnEJCpQlOZSrXIICxRFEyh9K1lovcAkMFIeMVZ38Yl62GKrQ/0ruiiqX4EAx6J5eILco2ZYyWqpRsi2lFYqb//vFZYVFjK6qkc2WMrrgQjZbSFoWjx6OPOUSNJgOulVMN5ystDWXwMGkWSy3vGmaPJNLXIIHk5Vpn/bF0zaJiwtjSCvTaavtJpeOgHGIqpen0fwc4KECtpyGYsMrolEpgGh+jAqGaAtJEZxPNE7ELJiDJ2kiFBs8OusWVEmDjq54s2p0/InyPTtk1G4k++AZNlp5Yy9dfvZSQnnzbjRX47y7cLSgxRW39lc2ynge5D5dFQ5KM/dGZ98QPrlYytqgE1Q8UxsFT59OuiUZdChSTQdvufTFvyM1ZSzroquqlAhlZ+xv4tnlMU+TJfkAAAAASUVORK5CYII=",
    
  },
  {
    title: "Tầm nhìn",
    content: "HĐ - Tracing là phần mềm truy xuất nguồn gốc của trường Đại học Hồng Đức cung dịch vụ giúp Doanh nghiệp chuyển đổi số hiệu quả, tăng doanh thu, giảm chi phí.",
    position: "right",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB4CAYAAADWpl3sAAAHYklEQVR42u2dTWsbRxjH9RH8DeqPYOi9+OxTDk2OIb2l0BLTXnIJDaSQo9Mek4J7qa9OQw+lJLiGFpxDIwghkAaiggOK98VTqBtJvmz2T7LMsivto/GMpWdmnoE/2HpZzcxvnpd5Wal33mVQDFaOJtmF9DTfyib5djo57mfj40E6zouYhDaj7en4eBd9gT4ZjoarPV9LOkrX0ZAYYZrDzwcY/MOyz3rcCyw2nahvypHa59KBvgnAk1N1jZ2FV3DLCiounRWCYN0sYOdjdU3gnqMmuYIB9ZZRMMJKt7zHoiMiENz4Qq0aWaFY73K0EKvOyw9h0di4tXVugLOJ2mbSSFE531aFWhHAocsl6HSstlg0SjQVtMTgCIT5tFUWzaUhom69GeebZ5oHZ+Nc1p09UnKSrBkmWrkkWp4JRjl3IpaMsitcKi4y09EovTkXZHHTHmuSK4RaseLAhVArVhyBEJvFigPXzNhcPiknOkLRJFdT58UsKidyptaZsfRtusmlciI3SpoJmJzyCFB1l62UWmFRKZFzvcZSZ3VGmkulRK43LtJNiceBC3G5mh//yKVSIufqS9IVuLCCKYsgEUjWqyOQQI5AqlAfCeTAJZAjkECOQAI5AgnkCCSQI5BAjkBRQP7nv8Pi2b8vioP0SfFo+AeEv/EYnmNRR4FsABMA777cKa4/uV1c+v1q8cmvnxYf/7LRKbzmsz+/Lr58fAPvxTVYtEcga7AAA0gaqCPhmjuD+8Uz9YJFW6OCXANLgHIOnEX7g4YMuFvPf9AWuwRtPLyMUOCVdXsBuQGXjXyBzRqyY7i4DiwRcjlgUEfWWTpbyA8OfwMMa6jfPv0O2TIgzMzGr/91u9h4dNnWjbON2ewgw/3phIqGuPX8XnGrBDnlcVPrAqRpsDFQ8Li3LpwVZFgvANGZ7letuSysEc998fgG4NoMMlyrOWjwOAYBBqB3Vs0CMqDcevq9CdyWBieHLjsWnqAFrho8PyOU0JYNDyOQK8vByhThlq0BAhA8xc6r+xD+xmebgAY02r23rRqfEy/kg7RPJVeIhzbuF5avXaz5Igfcf/31uN40906Bxlp5fJDRsR3xFxaCDrWxXHS+yZwX75kWBsp6XqwPilmDibJqtDkeyNoNtuQiearipuk0CGEDn0vVF0C7kjZqTh0+ZArw3b9/cvZZ917unGUVi7BmEhTayAq0hrxcwHDdsJDFDiotylKRdNVDyTyeBAODBWgNeWmA0WlEBqotqnKr2Psl3tMCRKkr7gJ8/TVEONHuG23rAB0OZCQcFoDpjtadCvgYUJgiIaNtZ8m09LXbA6wSZgZ43BY0+sZ/yGgkXLEtYGjn1W7dvdPJlk6oDPee0fm7zetjKtR83hY02oHB6C9kNA4dQwI2h4z3dzxvLSSALiDToPVqmp+Q4eJmNyxCyN0D3k/I0EHWR5ZJg7aHrN21vXCt5vXRDgKyIWC9+eGvu6YTL4A2Trzo5MheqFPXtVEXA8CBJ17EFIoCbdrRRIK1hCnUw0imUPMuhjxou8iuuIjNCwIGIQPrwkpY9fzF/avzeB20Ka7FEBK0+ZIhOhEWRewcGQlrz/MMLlnWtABNHaGBhZAdBrd+af9z8w2Kfb1B0ZFTzKob3osBxgrwsrcaqT1YHXPbcZeyZoCmtxrpnS8dV+mtRryuKxzFtdVYm15hKmRm1W1rxlJm12ACGNMjRe1YrK3Y9OgS2ohl0PgODRArQdTBOGw6mLhBfA7mvri9BsIRINzVaBJWEIvpgw/tEBD38Z8p0CjYANVcTbOPdzRgfBasljpS1BwULA7ds4FcOxhncrchVqEI9255bEgvOzbhUtNBFic12UFuHaGhLRvWQrh3q1ty8D+SMv04fWxYDtcbW7X9HYjUbTIYKAREUqgrK+v1AnIVd3VsdHrDG+Tqmqgji9jrJeSGC2dxu6pPcL2C3IAN1yhwQ4VMLHLYiU6oML/2Cq73kCsRdxvaWKzXYIOC3FD1FU+Y9uhvBKKBYmUKmXj1FU/egw0acueXtWV9AITwt3xZmygcCeQIJJAjkECOQAI5AgnkCCSQI5BAjkAl5BWBHLjkZ/wikPy0buCCAcuPZAevbE9+7j5wJePsznvIo3SdS6VEbvVmnG72UJRSK1wqJXKr1yfJGhhL8hWoEiRdtQKXfZNL5URulE3y7V69JKdqjUvlRG6U/Z9dqPiKyw5Q2lXrIlOpwKRdtS71LFtxqajo7BqO1GqdrSRggaluxTOtOZENC6+lrbijJKPsCpcKi8x0VHriWVwl0w5AjYyaLjB5ScL8knbTBgWTaS4NENm7acm2PVa1nWhVsrfZHS4NEjUAT/J+z0GR0yNMBcADnMSsFbHooJTtUYAlRnssFzF4rsUSWRVbltJNhyjpebQsmCw2/iYnam0aC7Fq/6VSag68KKtGRQS2e7gDJFecCmCLZQcKd0YWvo4ssKx0n0nnsRVuZUFfoc96vhZYONbBsb6ajbNdzPFivMnuQ5v76ANAhdcbjoari2DwDpHLivh4az4eAAAAAElFTkSuQmCC"
    
  }
]
