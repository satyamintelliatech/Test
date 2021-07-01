export const GET_LIST = 'GET_LIST';
export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';

export const getList = list => ({
  type: GET_LIST,
  data: {list},
});

export const addItem = item => ({
  type: ADD_ITEM,
  data: {item},
});

export const updateItem = (item, index) => ({
  type: UPDATE_ITEM,
  data: {item, index},
});

export const deleteItem = index => ({
  type: DELETE_ITEM,
  data: {index},
});
