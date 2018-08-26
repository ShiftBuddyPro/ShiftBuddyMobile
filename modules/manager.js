import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { AsyncStorage } from "react-native"
import isEmpty from '../utils/isEmpty';

const SET_CURRENT_MANAGER = 'manager/SET_CURRENT_MANAGER';
const GET_ERRORS = 'manager/GET_ERRORS';
const LOGOUT = 'manager/LOG_OUT';

const initialState = {
  isAuthenticated: false,
  managerData: {}
};

// Reducer
export default (state = initialState, action) => {
  switch(action.type){
    case SET_CURRENT_MANAGER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        managerData: action.payload,
      }
    case LOGOUT:
      return initialState;
    default: 
      return state;
  }
}

// Set logged in manager
export const setCurrentManager = decodedToken => {
  return {
    type: SET_CURRENT_MANAGER,
    payload: decodedToken
  }
}

// Logout - Delete manager token
export const logoutManager = () => dispatch => {
  localStorage.clear();
  dispatch({
    type: LOGOUT,
    payload: {},
  })
}

// Side Effects
export const loginManager = (managerData, callback) => dispatch => {
  axios
  .post('http://shiftbuddypro.herokuapp.com/api/managers/login', managerData)
    .then(res => {
      // Save to local storage
      const { token } = res.data;
      // Set token to local storage
      _storeData = async () => {
        try {
          await AsyncStorage.setItem('jwtToken', token);
        } catch (error) {
          console.log(error);
        }
      }
      // Set token to Auth Header
      setAuthToken(token);
      // Decode token to get Manager Data
      const decodedToken = jwt_decode(token);
      // Set Current Manager
      dispatch(setCurrentManager(decodedToken));
    })
    .then(() => callback())
    .catch(err => {
      console.log(err)
    })
}
