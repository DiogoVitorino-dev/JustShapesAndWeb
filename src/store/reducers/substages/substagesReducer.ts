import { createEntityAdapter, createReducer } from "@reduxjs/toolkit";

import { SubstageActions } from "./substagesActions";

export interface Substage {
  id: number;

  /**
   * @DocMissing
   */
  musicStartTime?: number;

  /**
   * @DocMissing
   */
  duration: number;
}

export const substagesAdapter = createEntityAdapter<Required<Substage>>({
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

      const sorted = action.payload.substages.sort((a, b) => a.id - b.id);

      let musicStartTime = 0;
      let substages: Required<Substage>[] = [];

      substages = sorted.map((item, index) => {
        if (item.musicStartTime) {
          musicStartTime = item.musicStartTime;
        } else if (index !== 0) {
          musicStartTime += item.duration;
        }
        return { ...item, musicStartTime };
      });

      substagesAdapter.setAll(state, substages);
    })
    .addCase(unloaded, (state) => {
      state.stage = initialState.stage;
      substagesAdapter.removeAll(state);
    });
});

export default reducer;
