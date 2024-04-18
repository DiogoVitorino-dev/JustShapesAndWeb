import { createReducer } from "@reduxjs/toolkit";

import { PlayerActions } from "./playerActions";

export enum PlayerStatus {
  Alive,
  Invulnerable,
  Dead,
}

export interface HealthAtributes {
  life: number;
  health: number;
  maxLife: number;
  maxHealth: number;
}

export type HealthHistory = HealthAtributes[];

interface Player extends HealthAtributes {
  status: PlayerStatus;
  history: HealthHistory;
}

export interface PlayerState extends Player {}

const initialState: PlayerState = {
  life: 3,
  maxLife: 3,

  health: 3,
  maxHealth: 3,

  history: [],
  status: PlayerStatus.Alive,
};

const { maxLifeIncreased, maxHealthIncreased, healed, hurt, restored } =
  PlayerActions;

const playerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(maxLifeIncreased, (state, action) => {
      state.maxLife = action.payload;
    })
    .addCase(maxHealthIncreased, (state, action) => {
      state.maxHealth = action.payload;
    })
    .addCase(restored, (state, action) => {
      state.health = action.payload?.health || state.maxHealth;
      state.life = action.payload?.life || state.maxLife;
      state.status = PlayerStatus.Alive;
    })
    .addCase(healed, (state, action) => {
      let health = state.health;
      let life = state.life;

      if (action.payload?.health) {
        health = health + action.payload.health;
      }

      if (action.payload?.life) {
        life = life + action.payload.life;
      }

      if (health > state.maxHealth) {
        life += 1;
        health = state.maxHealth;
      }

      if (life > state.maxLife) {
        life = state.maxLife;
      }

      state.health = health;
      state.life = life;
    })
    .addCase(hurt, (state, action) => {
      if (state.status !== PlayerStatus.Invulnerable) {
        let health = state.health;
        let life = state.life;

        if (action.payload?.health) {
          health = health - action.payload.health;
        }

        if (action.payload?.life) {
          life = life - action.payload.life;

          // Must healed at the cost of life
          if (life > 0) {
            health = state.maxHealth;
          }
        }

        if (health <= 0) {
          health = state.maxHealth;
          life -= 1;
        }

        if (life <= 0) {
          life = 0;
          health = 0;
          state.status = PlayerStatus.Dead;
        }

        state.health = health;
        state.life = life;
      }
    });
});

export default playerReducer;
