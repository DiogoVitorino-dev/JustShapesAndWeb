import { createReducer } from "@reduxjs/toolkit";

import { PlayerActions } from "./playerActions";

export enum PlayerStatus {
  Alive = "ALIVE",
  Invulnerable = "INVULNERABLE",
  Dead = "DEAD",
}

export interface HealthAtributes {
  life: number;
  health: number;
  maxLife: number;
  maxHealth: number;
}

interface Player extends HealthAtributes {
  status: PlayerStatus;
}

export interface PlayerState extends Player {}

const initialState: PlayerState = {
  life: 3,
  maxLife: 3,

  health: 3,
  maxHealth: 3,

  status: PlayerStatus.Alive,
};

const {
  maxLifeChanged,
  invulnerable,
  maxHealthChanged,
  healed,
  hurt,
  restored,
} = PlayerActions;

const playerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(maxLifeChanged, (state, action) => {
      state.maxLife = action.payload;
    })
    .addCase(maxHealthChanged, (state, action) => {
      state.maxHealth = action.payload;
    })
    .addCase(invulnerable, (state, action) => {
      if (state.status !== PlayerStatus.Dead && action.payload) {
        state.status = PlayerStatus.Invulnerable;
      } else if (state.status !== PlayerStatus.Dead) {
        state.status = PlayerStatus.Alive;
      }
    })
    .addCase(restored, (state, action) => {
      state.health = action.payload?.health || state.maxHealth;
      state.life = action.payload?.life || state.maxLife;
      state.status = PlayerStatus.Alive;
    })
    .addCase(healed, (state, action) => {
      let health = state.health;
      let life = state.life;

      if (action.payload?.health && state.status !== PlayerStatus.Dead) {
        health = health + action.payload.health;
      }

      if (action.payload?.life) {
        life = life + action.payload.life;
        health = state.maxHealth;
      }

      if (life > state.maxLife) {
        life = state.maxLife;
      }

      if (health > state.maxHealth) {
        health = state.maxHealth;
      }

      if (life > 0 && state.status === PlayerStatus.Dead) {
        state.status = PlayerStatus.Alive;
      }

      state.health = health;
      state.life = life;
    })
    .addCase(hurt, (state, action) => {
      if (
        state.status !== PlayerStatus.Invulnerable &&
        state.status !== PlayerStatus.Dead
      ) {
        let health = state.health;
        let life = state.life;

        if (action.payload?.life) {
          life = life - action.payload.life;

          // Must healed at the cost of life
          if (life > 0) {
            health = state.maxHealth;
          }
        }

        if (action.payload?.health) {
          health = health - action.payload.health;
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
