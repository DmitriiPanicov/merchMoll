import { combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';

import reducerIntegrationErrors from '../easymerch/reducers/reducerIntegrationErrors';
import reducerServiceTypes from '../easymerch/reducers/reducerServiceTypes';
import reducerOutlets from '../easymerch/reducers/reducerOutlets';
import reducerReports from '../easymerch/reducers/reducerReports';
import reducerUsers from '../easymerch/reducers/reducerUsers';

interface EasyMerchReducers {
  outlets: Reducer<any, AnyAction>;
  reports: Reducer<any, AnyAction>;
  users: Reducer<any, AnyAction>;
  serviceTypes: Reducer<any, AnyAction>;
  integrationErrors: Reducer<any, AnyAction>;
}

const EasyMerchStore = combineReducers<EasyMerchReducers>({
  outlets: reducerOutlets,
  reports: reducerReports,
  users: reducerUsers,
  serviceTypes: reducerServiceTypes,
  integrationErrors: reducerIntegrationErrors,
});

export default EasyMerchStore;
