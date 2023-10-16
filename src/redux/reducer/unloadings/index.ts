import { combineReducers, Reducer, AnyAction } from "@reduxjs/toolkit";

import reducerTablesUnloadings from "./reducers/tablesUnloadinds";
import reducerExcelUnloadings from "./reducers/excelUnloadings";
import reducerCronUnloadings from "./reducers/cronUnloadings";
import reducerZipUnloadings from "./reducers/zipUnloadings";

interface UnloadingsReducers {
  tablesUnloadings: Reducer<any, AnyAction>;
  excelUnloadings: Reducer<any, AnyAction>;
  cronUnloadings: Reducer<any, AnyAction>;
  zipUnloadings: Reducer<any, AnyAction>;
}

const UnloadingsStore = combineReducers<UnloadingsReducers>({
  tablesUnloadings: reducerTablesUnloadings,
  excelUnloadings: reducerExcelUnloadings,
  cronUnloadings: reducerCronUnloadings,
  zipUnloadings: reducerZipUnloadings,
});

export default UnloadingsStore;
