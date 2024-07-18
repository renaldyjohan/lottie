export const START_ANIMATION = 'START_ANIMATION';
export const STOP_ANIMATION = 'STOP_ANIMATION';

interface StartAnimationAction {
  type: typeof START_ANIMATION;
}  

interface StopAnimationAction {
  type: typeof STOP_ANIMATION;
}  

export type AnimationActionTypes = StartAnimationAction | StopAnimationAction;

export const startAnimation = (): AnimationActionTypes => ({
  type: START_ANIMATION,
});  

export const stopAnimation = (): AnimationActionTypes => ({
  type: STOP_ANIMATION,
});  
