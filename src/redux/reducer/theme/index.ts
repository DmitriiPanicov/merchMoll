import { combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';

import reducerTheme from './reducers/reducerTheme';

interface ThemeReducers {
  theme: Reducer<any, AnyAction>;
}

const ThemeStore = combineReducers<ThemeReducers>({
  theme: reducerTheme,
});

export default ThemeStore;
