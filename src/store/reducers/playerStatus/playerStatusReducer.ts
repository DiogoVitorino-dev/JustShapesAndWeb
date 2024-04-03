import { createReducer } from "@reduxjs/toolkit";

import { PlayerStatusActions } from "./playerStatusActions";

export interface PlayerStatus {
  life: number;
  health: number;
}

interface PlayerStatusState extends PlayerStatus {}

const initialState: PlayerStatusState = {
  life: 3,
  health: 5,
};

const { addHealthPoints, addLifePoints, removeHealthPoints, removeLifePoints } =
  PlayerStatusActions;

const playerStatusReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addHealthPoints, (state, action) => {
      state.health = state.health + (action.payload || 1);
    })
    .addCase(addLifePoints, (state, action) => {
      state.life = state.life + (action.payload || 1);
    })
    .addCase(removeLifePoints, (state, action) => {
      const damage = state.life - (action.payload || 1);
      if (damage >= 0) {
        state.life = damage;
      }
    })
    .addCase(removeHealthPoints, (state, action) => {
      const damage = state.health - (action.payload || 1);
      if (damage >= 0) {
        state.health = damage;
      }
    });
});

export default playerStatusReducer;
