import { RootState } from "@/store";

const selectLife = (state: RootState) => state.playerStatus.life;

const selectHealth = (state: RootState) => state.playerStatus.health;

export const PlayerStatusSelectors = {
  selectLife,
  selectHealth,
};
