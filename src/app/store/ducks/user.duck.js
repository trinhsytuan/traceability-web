import { put, takeLatest } from 'redux-saga/effects';
import Cookies from 'js-cookie';

import { URL } from '@url';

import { convertSnakeCaseToCamelCase } from '@app/common/dataConverter';
import { getUserByToken, updateMe } from '@app/services/User';
import { checkTokenExp } from '@app/common/functionCommons';

import resources from '@app/rbac/resources';
import { ACTIONS } from '@app/rbac/commons';
import { authorizePermission } from '@app/rbac/authorizationHelper';
import { create } from '@app/rbac/permissionHelper';

export const actionTypes = {
  RequestUser: "User/RequestUser",
  UserLoaded: "User/UserLoaded",
  UpdateMyInfo: "User/UpdateMyInfo",
  ClearToken: "App/ClearToken",
  GetPermission: "User/GetPermission",
  UpdateAvatar: "User/UpdateAvatar",
  ResultLogin: "App/ResultLogin",
};

const initialAuthState = {
  permissions: {},
  myInfo: {},
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.UserLoaded: {
      const { infoData } = action.payload;
      return { ...state, myInfo: infoData };
    }

    case actionTypes.GetPermission: {
      const { userPermissions } = state?.myInfo;
      const permissions = {};
      Object.entries(resources).forEach(([key, value]) => {
        permissions[key] = {};
        ACTIONS.forEach((actionItem) => {
          permissions[key][actionItem.code] = authorizePermission(userPermissions, [create(value, actionItem)]);
        });
      });
      return Object.assign({}, state, { permissions: convertSnakeCaseToCamelCase(permissions) });
    }

    default:
      return state;
  }
};

export const actions = {
  requestUser: (history) => ({ type: actionTypes.RequestUser, payload: { history } }),
  userLoaded: (infoData) => ({ type: actionTypes.UserLoaded, payload: { infoData } }),
  updateMyInfo: (myInfo, avatar) => ({ type: actionTypes.UpdateMyInfo, payload: { myInfo, avatar } }),
  clearToken: (history) => ({ type: actionTypes.ClearToken, payload: { token: null, history } }),
  getPermission: () => ({ type: actionTypes.GetPermission }),
  setResultLogin: (resultLogin) => ({ type: actionTypes.ResultLogin, payload: { resultLogin } }),
};

export function* saga() {
  yield takeLatest(actionTypes.RequestUser, function* requestUserSaga(data) {
    const { history } = data?.payload;
    const token = Cookies.get("token");

    if (checkTokenExp(token)) {
      const dataResponse = yield getUserByToken();
      if (dataResponse) {
        if (dataResponse.access_role?.vaitro) {
          dataResponse.userPermissions = dataResponse.access_role.vaitro;
        }
        yield put(actions.userLoaded(dataResponse));
        yield put(actions.setResultLogin(true));
      }
    } else {
      yield put(actions.clearToken());
      yield put(actions.setResultLogin(false));
      history.push(URL.LOGIN);
    }
  });
  yield takeLatest(actionTypes.UpdateMyInfo, function* updateMyInfoSaga(data) {
    const dataResponse = yield updateMe(data.payload?.myInfo, data.payload?.avatar);
    if (dataResponse) {
      delete dataResponse.password;
      if (dataResponse.access_role?.vaitro) {
        dataResponse.userPermissions = dataResponse.access_role.vaitro;
      }
      yield put(actions.userLoaded(dataResponse));
    }
  });
}
