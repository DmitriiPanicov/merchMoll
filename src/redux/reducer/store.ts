import { configureStore } from "@reduxjs/toolkit";

import UserSingleReportStore from "./userSingleReport";
import UserReportsStore from "./userReports/index";
import EasyMerchStore from "./easymerch/index";
import UnloadingsStore from "./unloadings";
import TunderStore from "./tunder/index";
import RolesStore from "./accessRights";
import ThemeStore from "./theme/index";
import UserStore from "./user/index";

const store = configureStore({
  reducer: {
    userSingleReport: UserSingleReportStore,
    userReports: UserReportsStore,
    unloadings: UnloadingsStore,
    easymerch: EasyMerchStore,
    tunder: TunderStore,
    roles: RolesStore,
    theme: ThemeStore,
    user: UserStore,
  },
});

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
