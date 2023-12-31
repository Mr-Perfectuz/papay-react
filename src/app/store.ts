import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import HomePageReducer from "./screens/HomePage/slice";
import  ReduxLogger  from "redux-logger";
import RestaurantPageReducer from "./screens/RestaurantPage/slice";
import OrdersPageReducer from "./screens/OrdersPage/slice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ReduxLogger),
  reducer: {
    homePage: HomePageReducer,
    restaurantPage: RestaurantPageReducer,
    ordersPage: OrdersPageReducer
  },
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
