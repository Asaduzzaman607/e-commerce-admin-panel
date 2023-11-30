import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import menuReducer from '../../redux/reducers/menu.reducer';
import userReducer from '../reducers/user.reducer';
import paginationReducer from "../reducers/paginate.reducers";


const persistConfig = {
    key: 'root',
    storage,
};

const reducer = combineReducers({
    user: userReducer,
    menu: menuReducer,
    pagination : paginationReducer
});

const persistedState = persistReducer(persistConfig, reducer)
    ? persistReducer(persistConfig, reducer)
    : {};

const store = configureStore({
    reducer: persistedState,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});

export default store;
