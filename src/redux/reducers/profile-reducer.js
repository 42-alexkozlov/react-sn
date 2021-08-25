import { profileApi } from '../../api/api';
import { v4 as uuidv4 } from 'uuid';


const ADD_POST = 'ADD_POST';
const SET_USER_PROFILE = 'SET_USER_PROFILE';
const SET_USER_STATUS = 'SET_USER_STATUS';

const initialState = {
  posts: [
    { id: 1, text: 'Are you ready?', likesCount: 4 },
    { id: 2, text: 'Go straight forward, please', likesCount: 2 },
    { id: 3, text: 'Where is the bathroom?', likesCount: 0 },
  ],
  userProfile: null,
};

const profileReducer = (state = initialState, action) => {

  switch (action.type) {
    case ADD_POST:
      const newPost = {
        id: uuidv4(),
        text: action.newPostText,
        likesCount: 0
      }
      return {
        ...state,
        posts: [newPost, ...state.posts],
      };

    case SET_USER_PROFILE:
      return { ...state, userProfile: action.userProfile };

    case SET_USER_STATUS:
      return { ...state, userProfile: { ...state.userProfile, status: action.userStatus } };

    default:
      return state;
  }
}

export const setNewPostInStore = (newPostText) => ({ type: ADD_POST, newPostText });
export const setUserProfileSuccess = (userProfile) => ({ type: SET_USER_PROFILE, userProfile })
export const setUserStatusSuccess = (userStatus) => ({ type: SET_USER_STATUS, userStatus })

export const getUserProfile = (profileId) => async (dispatch) => {
  const getProfileResponse = await profileApi.getProfile(profileId);
  dispatch(setUserProfileSuccess(getProfileResponse.data));
  const getProfileStatusResponse = await profileApi.getProfileStatus(getProfileResponse.data.userId);
  dispatch(setUserStatusSuccess(getProfileStatusResponse.data));
}

export const setUserStatus = (statusText) => async (dispatch) => {
  const setProfileStatusResponse = await profileApi.setProfileStatus(statusText)
  if (setProfileStatusResponse.data.resultCode === 0) {
    dispatch(setUserStatusSuccess(statusText));
  }
}

export default profileReducer;
