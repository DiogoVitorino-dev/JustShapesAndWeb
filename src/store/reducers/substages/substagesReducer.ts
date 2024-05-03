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

const substagesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loaded, (state, action) => {
      state.stage = action.payload.stage;

      const sorted = action.payload.substages.sort((a, b) => a.id - b.id);

      const substages = sorted.reduce<Required<Substage>[]>((prev, curr) => {
        const item: Required<Substage> = { musicStartTime: 0, ...curr };

        if (!curr.musicStartTime) {
          const prevItem = prev.at(-1);

          if (prevItem) {
            item.musicStartTime = prevItem.duration + prevItem.musicStartTime;
          }
        }

        return [...prev, item];
      }, []);

      substagesAdapter.setAll(state, substages);
    })
    .addCase(unloaded, (state) => {
      state.stage = initialState.stage;
      substagesAdapter.removeAll(state);
    });
});

export default substagesReducer;
