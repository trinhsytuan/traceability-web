import * as app from './app.duck';
import * as user from './user.duck';
import * as role from '@app/store/ducks/role.duck';
import * as extraField from '@app/store/ducks/extraField.duck';
import * as rerender from '@app/store/ducks/rerender.duck';

export const DUCKS = {
  app,
  user,
  // orgUnit,
  // caiDat,
  role,
  // notification,


  extraData: extraField,
  rerender,
};
