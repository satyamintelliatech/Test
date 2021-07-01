import {createStore} from 'redux';
import rootReducer from './combineReducer';
import thunk from 'redux-thunk';
export default store = createStore(rootReducer, applyMiddleware(thunk));
