import { combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';

import reducerRetailOutlets from '../tunder/reducers/reducerRetailOutlets';
import reducerSettings from '../tunder/reducers/reducerSettings';
import reducerSignals from '../tunder/reducers/reducerSignals';

interface TunderReducers {
  signals: Reducer<any, AnyAction>;
  retailOutlets: Reducer<any, AnyAction>;
  settings: Reducer<any, AnyAction>;
}

const TunderStore = combineReducers<TunderReducers>({
  signals: reducerSignals,
  retailOutlets: reducerRetailOutlets,
  settings: reducerSettings,
});

export default TunderStore;
