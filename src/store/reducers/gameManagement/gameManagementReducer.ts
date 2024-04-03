import { createReducer } from "@reduxjs/toolkit";

export interface GameManagement {}

interface GameManagementState extends GameManagement {}

const initialState: GameManagementState = {};

const gameManagementReducer = createReducer(initialState, (builder) => {});

export default gameManagementReducer;
