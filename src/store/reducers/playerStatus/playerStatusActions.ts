import { createAction } from "@reduxjs/toolkit";

const addLifePoints = createAction<number | undefined>(
  "playerStatus/addLifePoints",
);
const removeLifePoints = createAction<number | undefined>(
  "playerStatus/removeLifePoints",
);
const addHealthPoints = createAction<number | undefined>(
  "playerStatus/addHealthPoints",
);
const removeHealthPoints = createAction<number | undefined>(
  "playerStatus/removeHealthPoints",
);

export const PlayerStatusActions = {
  addLifePoints,
  removeLifePoints,
  addHealthPoints,
  removeHealthPoints,
};
