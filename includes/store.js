import React, {PureComponent} from 'react';
import { createStore, combineReducers,applyMiddleware } from 'redux';
import Reducer from './Reducer';
const rootReducer = combineReducers({
    Reducer: Reducer
})


const configureStore = () => createStore(rootReducer);

export default configureStore;


