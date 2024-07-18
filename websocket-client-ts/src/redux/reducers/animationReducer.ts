import { Reducer } from 'redux';
import {
  AnimationActionTypes,
  START_ANIMATION,
  STOP_ANIMATION,
} from '../actions/animationActions';

interface AnimationState {
  playing: boolean;
}

const initialState: AnimationState = {
  playing: false,
};

type GenericAction = AnimationActionTypes | { type: string };

const animationReducer: Reducer<AnimationState, GenericAction> = (
  state = initialState,
  action
) => {
  if (isKnownAction(action)) {
    switch (action.type) {
      case START_ANIMATION:
        return { ...state, playing: true };
      case STOP_ANIMATION:
        return { ...state, playing: false };
      default:
        return state;
    }
  }
  return state;
};

function isKnownAction(action: GenericAction): action is AnimationActionTypes {
  return [START_ANIMATION, STOP_ANIMATION].includes(action.type as any);
}

export default animationReducer;
