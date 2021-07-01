import {combineReducers} from 'redux';
import {GET_LIST, ADD_ITEM, UPDATE_ITEM, DELETE_ITEM} from './Action';

let dataState = {list: []};

const dataReducer = (state = dataState, action) => {
  switch (action.type) {
    case GET_LIST:
      let {list} = action.data;
      return {...state, list};

    case ADD_ITEM:
      let {item} = action.data;
      let clone = JSON.parse(JSON.stringify(state.list));
      clone.unshift(item);
      return {...state, list: clone};

    case UPDATE_ITEM: {
      let {item, index} = action.data;
      let clone = JSON.parse(JSON.stringify(state.list));
      clone[index] = item;
      return {...state, list: clone};
    }

    case DELETE_ITEM: {
      let {index} = action.data;
      let clone = JSON.parse(JSON.stringify(state.list));
      clone.splice(index, 1);
      return {...state, list: clone};
    }

    default:
      return state;
  }
};

const rootReducer = combineReducers({dataReducer});
export default rootReducer;
