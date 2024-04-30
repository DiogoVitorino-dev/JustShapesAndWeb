import { createAction } from "@reduxjs/toolkit";

import type { HealthAtributes } from "./playerReducer";

type HealthAtributesPayload = Partial<Pick<HealthAtributes, "life" | "health">>;

const maxLifeChanged = createAction<number>("player/maxLifeChanged");

const maxHealthChanged = createAction<number>("player/maxHealthChanged");

const restored = createAction<HealthAtributesPayload | undefined>(
  "player/restored",
);

const healed = createAction<HealthAtributesPayload | undefined>(
  "player/healed",
);
const hurt = createAction<HealthAtributesPayload | undefined>("player/hurt");

export const PlayerActions = {
  /**
   * @DocMissing
   */
  maxLifeChanged,

  /**
   * @DocMissing
   */
  maxHealthChanged,

  /**
   * @DocMissing
   */
  healed,

  /**
   * @DocMissing
   */
  restored,

  /**
   * @DocMissing
   */
  hurt,
};
