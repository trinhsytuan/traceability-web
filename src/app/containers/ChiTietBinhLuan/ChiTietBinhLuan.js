import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ChiTietBinhLuan.scss";
import BaseContent from "@components/BaseContent";
import { LeftOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Pagination, Rate } from "antd";
import { getCommentByIDAll, updateCommentById } from "@app/services/BinhLuanSanPham";
import queryString from "query-string";
import { API } from "@api";
import { formatTimeDate, toast } from "@app/common/functionCommons";
import { CONSTANTS, STATUS_COMMENT, TOAST_MESSAGE } from "@constants";
import { connect } from "react-redux";
ChiTietBinhLuan.propTypes = {};

function ChiTietBinhLuan({ myPermission }) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const tentrang = "danh-sach-binh-luan";
  const goBack = () => {
    history.goBack();
  };
  useEffect(() => {
    handleParseParams();
  }, [location.search]);
  const handleParseParams = async () => {
    const params = queryString.parse(location.search);
    setPage(parseInt(params.page) || 1);
    setLimit(parseInt(params.limit) || 10);
    getAPI(params.page || 1, params.limit || 10);
  };
  const getAPI = async (page, limit) => {
    const response = await getCommentByIDAll(id, page, limit);
    setData(response.docs);
    setTotalDocs(parseInt(response.totalDocs) || 0);
  };
  const paginationChange = (page, limit) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", page);
    queryParams.set("limit", limit);
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
  };
  const parseUrlAvatar = (url) => {
    return API.PREVIEW_ID.format(url);
  };
  const splitName = (name) => {
    var arrName = name?.split(" ");
    const initials = arrName?.slice(0, 4).map((name) => name.charAt(0).toUpperCase());
    const abbreviation = initials?.join("");
    return abbreviation;
  };
  const handleSendResult = async (id, result) => {
    const response = await updateCommentById(id, result);
    if (response) {
      updateRecord(id, result);
      toast(CONSTANTS.SUCCESS, TOAST_MESSAGE.COMMENT.UPDATE_STATUS);
    } else {
      toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR.DEFAULT);
      handleParseParams();
    }
  };
  const updateRecord = (id, newStatus) => {
    setData((prevRecords) => {
      return prevRecords.map((record) => {
        if (record._id === id) {
          return { ...record, status: newStatus };
        }
        return record;
      });
    });
  };
  return (
    <BaseContent>
      <div className="details-comment-container">
        <div className="details-comment-header">
          <div className="details-comment-header-left">
            <LeftOutlined onClick={goBack} />
            <span>Bình luận</span>
          </div>
          <div className="details-comment-header-right">
            <Pagination
              total={totalDocs}
              showTotal={(total, range) => `${range[0]}-${range[1]} của ${total}`}
              pageSize={limit}
              showSizeChanger={true}
              responsive={true}
              current={page}
              onChange={paginationChange}
            />
          </div>
        </div>
        <div className="details-comment-body">
          {data.map((res, index) => (
            <div className="details-comment-user-container">
              <div key={index} className="details-comment-user">
                <div className="details-comment-user-left">
                  {!res.user.avatar ? (
                    <div className="noAvatar">{splitName(res.user.name)}</div>
                  ) : (
                    <div className="avatar">
                      <img src={parseUrlAvatar(res.user.avatar)} />
                    </div>
                  )}
                </div>
                <div className="details-comment-user-right">
                  <div className="detail-comment-user-name">
                    <span>{res.user.name}</span>
                  </div>
                  <div className="detail-comment-time">
                    <span>{formatTimeDate(res.createdAt)}</span>
                  </div>
                  {res?.rate && (
                    <div className="detail-rate">
                      <Rate value={res?.rate} disabled />
                    </div>
                  )}
                  <div className="detail-comment-content">
                    <span>{res.content}</span>
                  </div>
                </div>
              </div>
              {!res.status ||
                (res.status == STATUS_COMMENT.PENDING &&
                  (myPermission?.[tentrang]?.duyet || myPermission?.is_admin) && (
                    <div className="btn-actions-comment">
                      <Button className="btn_reject" onClick={() => handleSendResult(res._id, STATUS_COMMENT.DENIED)}>
                        Từ chối
                      </Button>
                      <Button
                        className="btn_acceptCmt"
                        type="primary"
                        onClick={() => handleSendResult(res._id, STATUS_COMMENT.ACCEPTED)}
                      >
                        Duyệt
                      </Button>
                    </div>
                  ))}
            </div>
          ))}
        </div>
      </div>
    </BaseContent>
  );
}
function mapStateToProps(store) {
  const { myInfo } = store.user;

  return { myPermission: myInfo?.userPermissions };
}
export default connect(mapStateToProps)(ChiTietBinhLuan);


