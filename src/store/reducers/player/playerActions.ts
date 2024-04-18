import { createAction } from "@reduxjs/toolkit";

import type { HealthAtributes } from "./playerReducer";

type HealthAtributesPayload = Partial<Pick<HealthAtributes, "life" | "health">>;

const maxLifeIncreased = createAction<number>("player/maxLifeIncreased");

const maxHealthIncreased = createAction<number>("player/maxHealthIncreased");

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
  maxLifeIncreased,

  /**
   * @DocMissing
   */
  maxHealthIncreased,

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
