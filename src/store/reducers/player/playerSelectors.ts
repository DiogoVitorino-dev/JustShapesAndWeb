import { RootState } from "@/store";

const selectLife = (state: RootState) => state.player.life;

const selectHealth = (state: RootState) => state.player.health;

const selectStatus = (state: RootState) => state.player.status;

const selectMaxHealth = (state: RootState) => state.player.maxHealth;

const selectMaxLife = (state: RootState) => state.player.maxLife;

export const PlayerSelectors = {
  /**
   * @DocMissing
   */
  selectLife,

  /**
   * @DocMissing
   */
  selectHealth,

  /**
   * @DocMissing
   */
  selectStatus,

  /**
   * @DocMissing
   */
  selectMaxHealth,

  /**
   * @DocMissing
   */
  selectMaxLife,
};
