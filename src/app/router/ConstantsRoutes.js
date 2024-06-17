import React, { lazy } from "react";
import { HomeIcon, UserIcon } from "@app/components/Icons";

import { URL } from "@url";
import TruyXuatSanPham from "@containers/TruyXuatSanPham/TruyXuatSanPham";
import SearchIcon from "@components/Icons/SearchIcon";
import ProcedureIcon from "@components/Icons/ProcedureIcon";
import ThemMoiQuyTrinh from "@containers/QuyTrinh/ThemMoiQuyTrinh";
import PhanQuyenVaiTro from "@containers/PhanQuyenVaiTro";
import RolesIcon from "@components/Icons/RolesIcon";
import { TYPE_ORG } from "@constants";
import DanhSachKiemDinh from "@containers/QuanLy/DanhSachKiemDinh/DanhSachKiemDinh";
import KiemDinhSanPham from "@containers/KiemDinhSanPham/KiemDinhSanPham";
import QuanLyTaiKhoan from "@containers/QuanLy/TaiKhoan/QuanLyTaiKhoan";
import QuanLyTaiKhoanToChuc from "@containers/QuanLy/TaiKhoanToChuc/QuanLyTaiKhoanToChuc";
import MenuKDIcon from "@components/Icons/MenuKDIcon";
import CommentIcon from "@components/Icons/CommentIcon";

const ChinhSuaLoHang = lazy(() => import("@containers/ThemMoiLoHang/ChinhSuaLoHang"));
const MyInfo = lazy(() => import("@containers/MyInfo/MyInfo"));
const TrangChu = lazy(() => import("@containers/TrangChu/TrangChu"));
const Setting = lazy(() => import("@containers/Setting/Setting"));
const User = lazy(() => import("@containers/User/User"));
const DonVi = lazy(() => import("@containers/DonVi/DonVi"));
const KhoiPhucTaiKhoan = lazy(() => import("@containers/User/KhoiPhucTaiKhoan"));
const Role = lazy(() => import("@containers/Role/Role"));
const DanhSachQuyTrinh = lazy(() => import("@containers/QuyTrinh/DanhSachQuyTrinh"));
const DanhSachSanPham = lazy(() => import("@containers/DanhSachSanPham/DanhSachSanPham"));
const ThemMoiSanPham = lazy(() => import("@containers/ThemMoiSanPham/ThemMoiSanPham"));
const ThemMoiLoHang = lazy(() => import("@containers/ThemMoiLoHang/ThemMoiLoHang"));
const KiemDinhLoHang = lazy(() => import("@containers/KiemDinhLoHang/KiemDinhLoHang"));
const LichSuKiemDinh = lazy(() => import("@containers/LichSuKiemDinh/LichSuKiemDinh"));
const DanhSachBinhLuan = lazy(() => import("@containers/DanhSachBinhLuan/DanhSachBinhLuan"));
const ChiTietBinhLuan = lazy(() => import("@containers/ChiTietBinhLuan/ChiTietBinhLuan"));
const DanhSachToChuc = lazy(() => import("@containers/QuanLy/DanhSachToChuc/DanhSachToChuc"));
const CoSoSanXuat = lazy(() => import("@containers/CoSoSanXuat/CoSoSanXuat"));

function renderIcon(icon) {
  return (
    <span role="img" className="main-menu__icon">
      <div className="position-absolute" style={{ top: "50%", transform: "translateY(-50%)" }}>
        <div className="position-relative" style={{ width: "30px", height: "30px" }}>
          {icon}
        </div>
      </div>
    </span>
  );
}

const MY_INFO_ROUTE = {
  path: URL.THONG_TIN_CA_NHAN,
  breadcrumbName: "Thông tin cá nhân",
  component: MyInfo,
  permission: [],
  url: "all",
};

export const ADMIN_ROUTES = [
  // { isRedirect: true, from: '/', to: URL.MENU.DASHBOARD },
  {
    path: URL.MENU.DASHBOARD,
    menuName: "Trang chủ",
    component: TrangChu,
    icon: renderIcon(<HomeIcon />),
    permission: [],
    url: "all",
  },
  {
    path: URL.MENU.TRUY_XUAT_SAN_PHAM,
    breadcrumbName: "Truy xuất sản phẩm",
    menuName: "Truy xuất sản phẩm",
    icon: renderIcon(<SearchIcon />),
    component: TruyXuatSanPham,
    permission: [],
    url: "all",
  },
  {
    path: URL.MENU.KIEM_DINH_SAN_PHAM,
    breadcrumbName: "Kiểm định sản phẩm",
    menuName: "Kiểm định sản phẩm",
    icon: renderIcon(<MenuKDIcon />),
    component: KiemDinhSanPham,
    type_org: [TYPE_ORG.ENDORSER],
    permission: [],
    url: "kiem-dinh-san-pham",
  },
  {
    key: URL.MENU.QUAN_LY,
    menuName: "Quản lý",
    breakcrumbName: "Quy trình",
    icon: renderIcon(<ProcedureIcon />),
    children: [
      {
        path: URL.MENU.DANH_SACH_SAN_PHAM,
        menuName: "Danh sách sản phẩm",
        breadcrumbName: "Danh sách sản phẩm",
        component: DanhSachSanPham,
        permission: [],
        type_org: [TYPE_ORG.PRODUCER],
        url: "quan-ly-san-pham",
      },
      {
        path: URL.MENU.DANH_SACH_KIEM_DINH,
        menuName: "Danh sách kiểm định",
        breadcrumbName: "Danh sách kiểm định",
        component: DanhSachKiemDinh,
        permission: [],
        type_org: [TYPE_ORG.ENDORSER],
        url: "danh-sach-kiem-dinh",
      },
      {
        path: URL.MENU.QUY_TRINH,
        menuName: "Quy trình tổng thể sản xuất",
        breadcrumbName: "Quy trình tổng thể sản xuất",
        component: DanhSachQuyTrinh,
        permission: [],
        type_org: [TYPE_ORG.PRODUCER],
        url: "quan-ly-quy-trinh",
      },
      {
        path: URL.MENU.QUAN_LY_NHAN_VIEN,
        menuName: "Nhân viên",
        breadcrumbName: "Nhân viên",
        component: QuanLyTaiKhoan,
        permission: [],
        type_org: [TYPE_ORG.PRODUCER, TYPE_ORG.ENDORSER],
        url: "quan-ly-nhan-vien",
      },
      {
        path: URL.MENU.QUAN_LY_TAI_KHOAN_TO_CHUC,
        menuName: "Tài khoản tổ chức",
        breadcrumbName: "Tài khoản tổ chức",
        component: QuanLyTaiKhoanToChuc,
        permission: [],
        type_org: [TYPE_ORG.SYSTEM],
        url: "tai-khoan-to-chuc",
      },
      {
        path: URL.MENU.CO_SO_SAN_XUAT,
        menuName: "Cơ sở sản xuất",
        breadcrumbName: "Cơ sở sản xuất",
        component: CoSoSanXuat,
        permission: [],
        type_org: [TYPE_ORG.PRODUCER],
        url: "co-so-san-xuat",
      },
      {
        path: URL.MENU.DANH_SACH_TO_CHUC,
        menuName: "Danh sách tổ chức",
        breadcrumbName: "Danh sách tổ chức",
        component: DanhSachToChuc,
        permission: [],
        type_org: [TYPE_ORG.SYSTEM],
        url: "danh-sach-to-chuc",
      },
    ],
  },
  // {
  //   key: URL.MENU.QUAN_LY_NGUOI_DUNG,
  //   menuName: "Người dùng",
  //   icon: renderIcon(<UserIcon />),
  //   children: [
  //     {
  //       path: URL.MENU.USER,
  //       menuName: "Danh sách người dùng",
  //       component: User,
  //       permission: [],
  //     },
  //     {
  //       path: URL.MENU.KHOI_PHUC_TAI_KHOAN,
  //       menuName: "Khôi phục tài khoản",
  //       component: KhoiPhucTaiKhoan,
  //       permission: [],
  //     },
  //     {
  //       path: URL.MENU.ROLE,
  //       menuName: "Vai trò",
  //       component: Role,
  //       permission: [],
  //     },
  //   ],
  // },
  {
    path: URL.MENU.PHAN_QUYEN_VAI_TRO,
    menuName: "Phân quyền vai trò",
    icon: renderIcon(<RolesIcon />),
    component: PhanQuyenVaiTro,
    permission: [],
    url: "phan-quyen-vai-tro",
  },
  {
    path: URL.MENU.DANH_SACH_BINH_LUAN,
    menuName: "Danh sách bình luận",
    icon: renderIcon(<CommentIcon />),
    breadcrumbName: "Danh sách bình luận",
    component: DanhSachBinhLuan,
    permission: [],
    type_org: [TYPE_ORG.PRODUCER],
    url: "danh-sach-binh-luan",
  },

  // {
  //   key: URL.MENU.DANH_MUC,
  //   menuName: 'Danh mục',
  //   icon: renderIcon(<ListIcon/>),
  //   children: [
  //     {
  //       path: URL.MENU.DON_VI, menuName: 'Đơn vị', component: DonVi,
  //       permission: [create(resources.DON_VI, actions.READ)],
  //     },
  //   ],
  // },

  // {
  //   path: URL.MENU.DU_LIEU_BO_SUNG, menuName: 'Dữ liệu bổ sung',
  //   component: DuLieuBoSung,
  //   permission: [create(resources.EXTRA_DATA, actions.READ)],
  //   icon: renderIcon(<SettingIcon/>),
  //   hide: true,
  // },
  // {
  //   path: URL.MENU.SETTING, menuName: 'Cài đặt hệ thống',
  //   component: Setting,
  //   permission: [create(resources.CAI_DAT, actions.READ)],
  //   icon: renderIcon(<SettingIcon/>),
  // },

  // not render in menu
  MY_INFO_ROUTE,
  {
    path: URL.THEM_MOI_QUY_TRINH,
    breadcrumbName: "Thêm mới quy trình sản xuất",
    component: ThemMoiQuyTrinh,
    type_org: [TYPE_ORG.PRODUCER],
    permission: [],
    url: "quan-ly-quy-trinh",
  },
  {
    path: URL.CHI_TIET_QUY_TRINH_ID.format(":id"),
    breadcrumbName: "Chi tiết quy trình",
    component: ThemMoiQuyTrinh,
    type_org: [TYPE_ORG.PRODUCER],
    permission: [],
    url: "quan-ly-quy-trinh",
  },
  {
    path: URL.THEM_MOI_SAN_PHAM,
    breadcrumbName: "Thêm mới sản phẩm",
    component: ThemMoiSanPham,
    type_org: [TYPE_ORG.PRODUCER],
    permission: [],
    url: "quan-ly-san-pham",
  },
  {
    path: URL.CHI_TIET_SAN_PHAM_ID.format(":id"),
    breadcrumbName: "Chi tiết sản phẩm",
    component: ThemMoiSanPham,
    type_org: [TYPE_ORG.PRODUCER],
    permission: [],
    url: "quan-ly-san-pham",
  },
  {
    path: URL.THEM_LO_SAN_PHAM_ID.format(":id"),
    breadcrumbName: "Thông tin lô sản phẩm",
    component: ThemMoiLoHang,
    type_org: [TYPE_ORG.PRODUCER, TYPE_ORG.ENDORSER],
    permission: [],
    url: "quan-ly-san-pham",
  },
  {
    path: URL.CHI_TIET_LO_SAN_PHAM_ID.format(":id"),
    breadcrumbName: "Chi tiết lô sản phẩm",
    component: ChinhSuaLoHang,
    type_org: [TYPE_ORG.PRODUCER],
    permission: [],
    url: "quan-ly-san-pham",
  },
  {
    path: URL.KIEM_DINH_LO_HANG_ID.format(":id"),
    breadcrumbName: "Kiểm định lô hàng",
    component: KiemDinhLoHang,
    type_org: [TYPE_ORG.ENDORSER],
    permission: [],
    url: "kiem-dinh-san-pham",
  },
  {
    path: URL.LICH_SU_KIEM_DINH_ID.format(":id"),
    breadcrumbName: "Lịch sử kiểm định",
    component: LichSuKiemDinh,
    type_org: [TYPE_ORG.ENDORSER],
    permission: [],
    url: "lich-su-kiem-dinh",
  },
  {
    path: URL.CHI_TIET_BINH_LUAN_ID.format(":id"),
    breadcrumbName: "Chi tiết bình luận",
    component: ChiTietBinhLuan,
    type_org: [TYPE_ORG.PRODUCER],
    permission: [],
    url: "danh-sach-binh-luan",
  },
];

export function ConstantsRoutes() {
  return ADMIN_ROUTES;
}
