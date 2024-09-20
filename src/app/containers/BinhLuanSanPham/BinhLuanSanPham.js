import { API } from '@api';
import { formatTimeDate, toast, validateSpaceNull } from '@app/common/functionCommons';
import { createNewComment, deleteComment, getCommentByID, getCommentByMe } from '@app/services/BinhLuanSanPham';
import DeleteIcon from '@components/Icons/DeleteIcon';
import { CONSTANTS, STATUS_COMMENT, TOAST_MESSAGE } from '@constants';
import { URL } from '@url';
import { Button, Form, Pagination, Rate, Tooltip } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './BinhLuanSanPham.scss';
import ModalShowPendingComment from './ModalShowPendingComment';
import DialogDeleteConfim from '@components/DialogDeleteConfim/DialogDeleteConfim';

BinhLuanSanPham.propTypes = {
  disabled: PropTypes.bool,
};
BinhLuanSanPham.defaultProps = {
  disabled: false,
};
function BinhLuanSanPham({ idParcel, resultLogin, myInfo, idProduct, disabled }) {
  const history = useHistory();
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    status: STATUS_COMMENT.ACCEPTED,
    page: 1,
    limit: 10,
  });
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);
  const [commentByMe, setCommentByMe] = useState([]);
  const [commentDelete, setCommentDelete] = useState(null);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const onChangePagination = (page, limit) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", page);
    queryParams.set("limit", limit);
    const queryString = queryParams.toString();
    const newPagination = {
      status: STATUS_COMMENT.ACCEPTED,
      page,
      limit,
    };
    setPagination(newPagination);
    getAPI(newPagination);
    history.push(`?${queryString}`);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const newPagination = {
      status: STATUS_COMMENT.ACCEPTED,
      page: parseInt(queryParams.get("page")) || 1,
      limit: parseInt(queryParams.get("limit")) || 10,
    };
    setPagination(newPagination);
    getAPI(newPagination);
  }, [location.search]);
  const getAPI = async (data) => {
    const response = await getCommentByID(idParcel, data);
    setData(response.docs);
    setTotalDocs(response.totalDocs);
    if (data.page == 1) {
      const cmtByMe = await getCommentByMe(idParcel, myInfo._id);
      setCommentByMe(cmtByMe);
    }
  };
  const splitName = (name) => {
    var arrName = name?.split(" ");
    const initials = arrName?.slice(0, 4).map((name) => name.charAt(0).toUpperCase());
    const abbreviation = initials?.join("");
    return abbreviation;
  };
  const checkLogin = () => {
    if (!resultLogin) {
      toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR.NOT_LOGIN);
      history.push(URL.LOGIN);
    }
  };
  const sendComment = async (e) => {
    const dataSend = {
      parcel: idParcel,
      content: e.content,
      product: idProduct,
      rate: e.rate,
    };
    const response = await createNewComment(dataSend);
    if (response) {
      form.resetFields();
      getAPI(pagination);
      handleOpenModal();
    }
  };
  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  const parseUrlAvatar = (url) => {
    return API.PREVIEW_ID.format(url);
  };
  const deleteCmt = (res) => {
    setCommentDelete(res);
    setVisibleDelete(true);
  };
  const cancelDelete = () => {
    setCommentDelete(null);
    setVisibleDelete(false);
  };
  const confimDelete = async () => {
    const response = await deleteComment(commentDelete._id);
    if (response) {
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.COMMENT.DELETE);
      setVisibleDelete(false);
      onChangePagination(pagination.page, pagination.limit);
    }
  };
  return (
    <div className="BinhLuanSanPham-container">
      <div className="BinhLuanSanPham-Pagination">
        <span className="comment">Danh sách các bình luận</span>
      </div>
      <div className="BinhLuanSanPham-content">
        {data.length == 0 && commentByMe.length == 0 && (
          <span className="no_comment">Sản phẩm chưa có bình luận nào, hãy để lại bình luận cho sản phẩm bạn nhé!</span>
        )}
        {commentByMe.map((res, index) => {
          return (
            <div className="item-content-comment-by-me" key={index}>
              <div className="item-content-comment-avatar">
                {!res?.user?.avatar ? (
                  <>{splitName(res?.user?.name)}</>
                ) : (
                  <>
                    <img src={parseUrlAvatar(res.user.avatar)}></img>
                  </>
                )}
              </div>
              <div className="item-content-comment-body">
                <div className="item-content-group">
                  <div className="item-content-comment-body-user">
                    <span>{res?.user?.name}</span>
                    <Tooltip placement="top" title="Xoá bình luận" color="#FF0000">
                      <Button className="btn-delete" onClick={() => deleteCmt(res)}>
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </div>

                  <div className="item-content-comment-body-time">{formatTimeDate(res.createdAt)}</div>
                </div>
                <div className="rate-sp">{res?.rate && <Rate value={res?.rate} className="sao-rate" disabled />}</div>
                <div className="item-content-comment-desciption">{res?.content}</div>
              </div>
            </div>
          );
        })}
        {data.map((res, index) => {
          return (
            <div className="item-content-comment" key={index}>
              <div className="item-content-comment-avatar">
                {!res?.user?.avatar ? (
                  <>{splitName(res?.user?.name)}</>
                ) : (
                  <>
                    <img src={parseUrlAvatar(res.user.avatar)}></img>
                  </>
                )}
              </div>
              <div className="item-content-comment-body">
                <div className="item-content-group">
                  <div className="item-content-comment-body-user">{res?.user?.name}</div>

                  <div className="item-content-comment-body-time">{formatTimeDate(res.createdAt)}</div>
                </div>
                <div className="rate-sp">{res?.rate && <Rate value={res?.rate} className="sao-rate" disabled />}</div>
                <div className="item-content-comment-desciption">{res?.content}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="BinhLuanSanPham-Pagination">
        <span className="comment"></span>
        <div className="pagination">
          {data.length != 0 && (
            <Pagination
              total={totalDocs}
              onChange={onChangePagination}
              responsive={true}
              hideOnSinglePage={true}
              showSizeChanger={true}
              style={{ marginBottom: "20px" }}
              showTotal={(total, range) => `${range[0]}-${range[1]} của ${total}`}
              pageSize={pagination.limit}
              current={pagination.page}
            />
          )}
        </div>
      </div>
      {!disabled && (
        <Form form={form} onFinish={sendComment}>
          {resultLogin && (
            <div className="item-content-comment">
              <div className="item-content-comment-avatar">
                {!myInfo?.avatar ? (
                  <>{splitName(myInfo?.name)}</>
                ) : (
                  <>
                    <img src={parseUrlAvatar(myInfo.avatar)}></img>
                  </>
                )}
              </div>
              <div className="full-width">
                <div className="rate-sp-duoi">
                  <span className="title_danhgia">Đánh giá cho sản phẩm</span>
                  <Form.Item
                    className="sao-rate-duoi"
                    name="rate"
                    rules={[{ required: true, message: "Vui lòng đánh giá cho sản phẩm" }]}
                  >
                    <Rate />
                  </Form.Item>
                </div>
                <Form.Item
                  className="item-content-comment-body item-content-comment-formitem-textarea"
                  name="content"
                  rules={[
                    { required: true, message: "Vui lòng nhập bình luận của bạn!" },
                    { validator: validateSpaceNull },
                  ]}
                >
                  <TextArea
                    rows={4}
                    className="item-content-comment-body-textarea"
                    placeholder="Nhập bình luận"
                  ></TextArea>
                </Form.Item>
              </div>
            </div>
          )}

          {resultLogin && (
            <div className="BinhLuanSanPham-BtnSend">
              <Button type="primary" htmlType="submit">
                Gửi bình luận
              </Button>
            </div>
          )}
          {!resultLogin && (
            <div className="BinhLuanSanPham-BtnSend" onClick={checkLogin}>
              <Button type="primary">Bình luận</Button>
            </div>
          )}
        </Form>
      )}
      <ModalShowPendingComment isOpen={openModal} handleCancel={handleOpenModal} />
      <DialogDeleteConfim visible={visibleDelete} onCancel={cancelDelete} onOK={confimDelete} />
    </div>
  );
}
function mapStateToProps(store) {
  const { resultLogin } = store.app;
  const { myInfo } = store.user;
  return { resultLogin, myInfo };
}
export default connect(mapStateToProps)(BinhLuanSanPham);





