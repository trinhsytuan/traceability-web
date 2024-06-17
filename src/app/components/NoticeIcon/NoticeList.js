import { Avatar, List } from 'antd';
import React from 'react';
import classNames from 'classnames';
import './NoticeList.less';

import { Link } from 'react-router-dom';

const NoticeList = ({
                      data = [],
                      onClick,
                      onClear,
                      title,
                      onViewMore,
                      emptyText,
                      showClear = true,
                      clearText,
                      viewMoreText,
                      showViewMore = false,
                    }) => {
  if (!data || data.length === 0) {
    return (
      <div className={'notFound'}>
        <img src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" alt="not found"/>
        <div>{emptyText}</div>
      </div>
    );
  }

  return (
    <div>
      <List
        className={'list'}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames('item', { ['read']: item.read });
          const leftIcon = item.avatar
            ? typeof item.avatar === 'string'
              ? <Avatar className="avatar" src={item.avatar}/>
              : <span className="iconElement">{item.avatar}</span>
            : null;
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick?.(item)}>
              <Link to={item.link} className="w-100">
                <List.Item.Meta
                  className="meta"
                  avatar={leftIcon}
                  title={<div className="title">
                    {item.title}
                    <div className="extra">{item.extra}</div>
                  </div>}
                  description={<div>
                    <div className="description">{item.description}</div>
                    <div className="datetime">{item.datetime}</div>
                  </div>}
                />
              </Link>
            </List.Item>
          );
        }}/>
      <div className={'bottomBar'}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
