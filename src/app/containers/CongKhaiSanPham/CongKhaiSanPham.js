import React, { useEffect, useState } from 'react';
import './CongKhaiSanPham.scss';
import { Button, Checkbox, Tooltip } from 'antd';
import { CONSTANTS, parcel_public_items, product_public_items, TOAST_MESSAGE } from '@constants';
import { createPublicProduct, editPublicProduct, getPublicProductByParcelID } from '@app/services/CongKhaiLoHang';
import { toast } from '@app/common/functionCommons';
import PreviewPublic from './PreviewPublic';
import BaseContent from '@components/BaseContent';
import VerifyDigitalSignature from '@components/VerifyDigitalSignature/VerifyDigitalSignature';

CongKhaiSanPham.propTypes = {};

function CongKhaiSanPham({ idParcel, infoStep, updateCP, infoParcel }) {
  const [checkedAll, setcheckedAll] = useState({
    product: false,
    procedure: false,
    step: false,
  });
  const [productCheckbox, setProductCheckBox] = useState(product_public_items);
  const [procedureCheckbox, setProcedureCheckBox] = useState(
    parcel_public_items,
  );
  const [stepCheckbox, setStepCheckbox] = useState({});
  const [dataPushTemp, setDataPushTemp] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [onDialogConfimKey, setHandleDialogConfimKey] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [idPublic, setIdPublic] = useState(null);
  const handleCancel = () => {
    setOpenPreview(!openPreview);
  };
  const handlePreview = () => {
    getInfoFromForm();
    handleCancel();
  };
  const handleDialogkey = () => {
    setHandleDialogConfimKey(!onDialogConfimKey);
  };
  const productChecked = (data) => {
    const { name, checked } = data.target;
    const updatedCheckbox = productCheckbox.map((item) => {
      if (item.key === name && item.isEdit) {
        return { ...item, checked };
      } else if (item.key === name && !item.isEdit) {
        toast(
          CONSTANTS.ERROR,
          TOAST_MESSAGE.PUBLIC_PRODUCT.NOT_SELECT_CHECKBOX,
        );
      }
      return item;
    });
    setProductCheckBox(updatedCheckbox);
  };
  const stepChange = (data) => {
    const { name, checked } = data.target;
    setStepCheckbox((prevStepCheckbox) => {
      return {
        ...prevStepCheckbox,
        [name]: checked,
      };
    });
  };
  const procedureCheck = (data) => {
    const { name, checked } = data.target;
    const updatedCheckbox = procedureCheckbox.map((item) => {
      if (item.key === name) {
        return { ...item, checked };
      }
      return item;
    });
    setProcedureCheckBox(updatedCheckbox);
  };
  const checkedAllProduct = (data) => {
    const { checked } = data.target;
    const updatedCheckbox = productCheckbox.map((item) => {
      if (item.isEdit) {
        return { ...item, checked };
      } else return { ...item, checked: true };
    });
    setProductCheckBox(updatedCheckbox);
  };
  const checkedAllProcedure = (data) => {
    const { checked } = data.target;
    const updatedCheckbox = procedureCheckbox.map((item) => {
      return { ...item, checked };
    });
    setProcedureCheckBox(updatedCheckbox);
  };
  const checkedAllStep = (data) => {
    const { checked } = data.target;
    const updatedCheckbox = {};
    infoStep.forEach((item) => {
      updatedCheckbox[item._id] = checked;
    });
    setStepCheckbox(updatedCheckbox);
  };
  useEffect(() => {
    const allChecked = productCheckbox.every((item) => item.checked);
    setcheckedAll({
      ...checkedAll,
      product: allChecked,
    });
  }, [productCheckbox]);
  useEffect(() => {
    const allChecked = procedureCheckbox.every((item) => item.checked);
    setcheckedAll({
      ...checkedAll,
      procedure: allChecked,
    });
  }, [procedureCheckbox]);
  useEffect(() => {
    if (!infoStep || infoStep.length == 0) return;

    if (Object.keys(stepCheckbox).length < infoStep.length) return;

    const allTrue = Object.values(stepCheckbox).every(
      (value) => value === true,
    );
    setcheckedAll({
      ...checkedAll,
      step: allTrue,
    });
  }, [stepCheckbox]);
  useEffect(() => {
    getAPI();
  }, [idParcel, infoStep, updateCP]);
  const getAPI = async () => {
    if (!infoStep || infoStep.length == 0) return;
    let response = await getPublicProductByParcelID(idParcel);
    if (!response || response.length == 0) return;
    setIsCreate(true);

    response = response[0];
    setIdPublic(response._id);
    const updatedProductItems = productCheckbox.map((item) => {
      return {
        ...item,
        checked: response.productPublicItems[item.key] || item.checked,
      };
    });
    const updatedProcedureItems = procedureCheckbox.map((item) => {
      return {
        ...item,
        checked: response.parcelPublicItems[item.key] || item.checked,
      };
    });
    setProductCheckBox(updatedProductItems);
    setProcedureCheckBox(updatedProcedureItems);
    const arrNew = {};
    for (let i = 0; i < response.stepPublicItems.length; i++) {
      arrNew[response.stepPublicItems[i]] = true;
    }
    setStepCheckbox(arrNew);
  };
  const getInfoFromForm = async () => {
    let product_public_items = {};
    for (let i = 0; i < productCheckbox.length; i++) {
      product_public_items[productCheckbox[i].key] = productCheckbox[i].checked;
    }
    let parcel_public_items = {};
    for (let i = 0; i < procedureCheckbox.length; i++) {
      parcel_public_items[procedureCheckbox[i].key] =
        procedureCheckbox[i].checked;
    }
    const step_public_items = [];
    for (const key in stepCheckbox) {
      if (stepCheckbox.hasOwnProperty(key) && stepCheckbox[key] === true) {
        step_public_items.push(key);
      }
    }
    const dataPush = {
      parcel: idParcel,
      product_public_items,
      parcel_public_items,
      step_public_items,
    };
    setDataPushTemp(dataPush);
  };
  const handlePublicProduct = async () => {
    getInfoFromForm();
    handleDialogkey();
  };
  const onConfimKey = async (key) => {
    if (!dataPushTemp) return;
    const dataPushNew = {
      ...dataPushTemp,
      private_key: key,
    };
    if (!isCreate) {
      const response = await createPublicProduct(dataPushNew);
      if (response)
        toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PUBLIC_PRODUCT.SUCCESS);
      getAPI();
    } else {
      const response = await editPublicProduct(dataPushNew, idPublic);
      if (response) toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.PUBLIC_PRODUCT.EDIT);
    }
  };

  return (
    <BaseContent>
      <div className="CongKhaiSanPham-container">
        <div className="CongKhaiSanPham-header">
          <span>Công khai sản phẩm</span>
          <div className="div_hr"></div>
        </div>

        <div className="CongKhaiSanPham-content">
          <div className="CongKhaiSanPham-ThongTinSanPham">
            <span className="title_sp">Thông tin sản phẩm</span>
            <Checkbox
              name="select_all_ttsp"
              className="select_all"
              checked={checkedAll?.product}
              onChange={checkedAllProduct}
            >
              Chọn tất cả
            </Checkbox>
            {productCheckbox.map((res, index) => (
              <Checkbox
                checked={res.checked}
                key={res.key}
                name={res.key}
                onChange={productChecked}
              >
                {res.name}
              </Checkbox>
            ))}
          </div>
          <div className="CongKhaiSanPham-ThongTinLoSanPham">
            <span className="title_sp">Thông tin lô sản phẩm</span>
            <Checkbox
              name="select_all_lsp"
              className="select_all"
              onChange={checkedAllProcedure}
              checked={checkedAll?.procedure}
            >
              Chọn tất cả
            </Checkbox>
            {procedureCheckbox.map((res, index) => (
              <Checkbox
                key={index}
                name={res.key}
                checked={res.checked}
                onChange={procedureCheck}
              >
                {res.name}
              </Checkbox>
            ))}
          </div>
          <div className="CongKhaiSanPham-QTSX">
            <span className="title_sp">Quy trình sản xuất lô sản phẩm</span>
            <Checkbox
              name="select_all_qtsx"
              className="select_all"
              onChange={checkedAllStep}
              checked={checkedAll.step}
            >
              Chọn tất cả
            </Checkbox>
            {infoStep.map((res, index) => {
              return (
                <Checkbox
                  name={`${res._id}`}
                  key={index}
                  checked={stepCheckbox[res._id] || false}
                  onChange={stepChange}
                >
                  Bước {res.stepIndex}: {res.name}
                </Checkbox>
              );
            })}
          </div>
          <div className="btn_action">
            <Tooltip
              placement="top"
              title="Xem trước sản phẩm trước khi công khai"
              color="#1890FF"
            >
              <Button className="preview_btn" onClick={handlePreview}>
                Bản xem trước
              </Button>
            </Tooltip>
            <Tooltip
              placement="top"
              title={isCreate ? 'Cập nhật thông tin công khai sản phẩm' : 'Công khai thông tin sản phẩm'}
              color="#179A6B"
            >
              <Button type="primary" onClick={handlePublicProduct}>
                {isCreate ? 'Cập nhật thông tin' : 'Công khai thông tin'}
              </Button>
            </Tooltip>
          </div>
        </div>

        <PreviewPublic
          isOpen={openPreview}
          handleOpen={handleCancel}
          idParcel={idParcel}
          infoParcel={infoParcel}
          infoStep={infoStep}
          infoPublic={dataPushTemp}
        />

        <VerifyDigitalSignature
          visible={onDialogConfimKey}
          handleVisible={handleDialogkey}
          onSubmit={onConfimKey}
        />
      </div>
    </BaseContent>
  );
}

export default CongKhaiSanPham;
