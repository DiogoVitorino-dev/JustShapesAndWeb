import { createEntityAdapter, createReducer } from "@reduxjs/toolkit";

import { SubstageActions } from "./substagesActions";

export interface Substage {
  id: number;

  /**
   * @DocMissing
   */
  musicStartTime: number;
}

export const substagesAdapter = createEntityAdapter<Substage>({
  sortComparer: (A, B) => A.id - B.id,
});

export interface SubstagesState {
  /**
   * @DocMissing
   */
  stage: string;
}

const { loaded, unloaded } = SubstageActions;

const initialState = substagesAdapter.getInitialState<SubstagesState>({
  stage: "",
});

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loaded, (state, action) => {
      state.stage = action.payload.stage;
      substagesAdapter.setAll(state, action.payload.substages);
    })
    .addCase(unloaded, (state) => {
      state.stage = initialState.stage;
      substagesAdapter.removeAll(state);
    });
});

export default reducer;
