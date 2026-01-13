export type FilterState = {
  text?: string; 
  unansweredOnly: boolean;
  //includeNotDue: boolean,
  isMissionTarget: boolean,
  starredOnly: boolean,
  
};

export const DefaultFilterState: FilterState = {
  text: undefined,
  unansweredOnly: false,
  isMissionTarget: false,
  //includeNotDue: false,
  starredOnly: false,
}