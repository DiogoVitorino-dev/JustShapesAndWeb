import { PlayerActions } from "@/store/reducers/player/playerActions";
import playerReducer, {
  PlayerState,
  PlayerStatus,
} from "@/store/reducers/player/playerReducer";

const initialState: PlayerState = {
  life: 3,
  maxLife: 3,

  health: 3,
  maxHealth: 3,

  status: PlayerStatus.Alive,
};

const degradedHealth: PlayerState = {
  ...initialState,
  life: 2,
  health: 2,
};

const lifeless: PlayerState = {
  ...initialState,
  life: 0,
  health: 0,
  status: PlayerStatus.Dead,
};

describe("Reducer - Player Reducer tests", () => {
  it("Should return the initial state", () => {
    expect(playerReducer(undefined, { type: "unknown" })).toStrictEqual(
      initialState,
    );
  });
});

describe("maxLifeChanged Action - Player Reducer tests", () => {
  const { maxLifeChanged } = PlayerActions;

  it("Should increase maximum life", () => {
    expect(playerReducer(initialState, maxLifeChanged(4))).toStrictEqual({
      ...initialState,
      maxLife: 4,
    });
  });
});

describe("maxHealthChanged Action - Player Reducer tests", () => {
  const { maxHealthChanged } = PlayerActions;

  it("Should increase maximum health", () => {
    expect(playerReducer(initialState, maxHealthChanged(4))).toStrictEqual({
      ...initialState,
      maxHealth: 4,
    });
  });
});

describe("hurt Action - Player Reducer tests", () => {
  const { hurt } = PlayerActions;

  it("Should lose health", () => {
    expect(playerReducer(initialState, hurt({ health: 2 }))).toStrictEqual({
      ...initialState,
      health: 1,
    });
  });

  it("Should lose a life when health reaches 0", () => {
    expect(playerReducer(initialState, hurt({ health: 3 }))).toStrictEqual({
      ...initialState,
      health: initialState.maxHealth,
      life: 2,
    });
  });

  it("Should lose life", () => {
    expect(playerReducer(initialState, hurt({ life: 2 }))).toStrictEqual({
      ...initialState,
      life: 1,
    });
  });

  it("Should restore health upon losing life", () => {
    expect(playerReducer(degradedHealth, hurt({ life: 1 }))).toStrictEqual({
      ...initialState,
      life: 1,
      health: initialState.maxHealth,
    });
  });

  it("Shouldn't have negative health", () => {
    expect(playerReducer(lifeless, hurt({ health: 5 }))).toStrictEqual(
      lifeless,
    );
  });

  it("Shouldn't have negative life", () => {
    expect(playerReducer(lifeless, hurt({ life: 5 }))).toStrictEqual(lifeless);
  });

  it("Should lose life and health at the same time", () => {
    expect(
      playerReducer(initialState, hurt({ life: 1, health: 1 })),
    ).toStrictEqual({
      ...initialState,
      life: 2,
      health: 2,
    });
  });

  it("Should have dead status when life reaches 0", () => {
    expect(playerReducer(initialState, hurt({ life: 3 }))).toStrictEqual(
      lifeless,
    );
  });
});

describe("healed Action - Player Reducer tests", () => {
  const { healed } = PlayerActions;

  it("Should heal health", () => {
    expect(playerReducer(degradedHealth, healed({ health: 1 }))).toStrictEqual({
      ...degradedHealth,
      health: 3,
    });
  });

  it("Shouldn't heal above maximum health", () => {
    expect(playerReducer(degradedHealth, healed({ health: 2 }))).toStrictEqual({
      ...degradedHealth,
      health: degradedHealth.maxHealth,
    });
  });

  it("Should gain life", () => {
    expect(playerReducer(degradedHealth, healed({ life: 1 }))).toStrictEqual({
      ...degradedHealth,
      life: 3,
      health: degradedHealth.maxHealth,
    });
  });

  it("Shouldn't have a life above the maximum", () => {
    expect(playerReducer(degradedHealth, healed({ life: 2 }))).toStrictEqual({
      ...degradedHealth,
      life: degradedHealth.maxLife,
      health: degradedHealth.maxHealth,
    });
  });

  it("Should restore health upon gain life", () => {
    expect(playerReducer(degradedHealth, healed({ life: 1 }))).toStrictEqual({
      ...degradedHealth,
      life: 3,
      health: degradedHealth.maxHealth,
    });
  });

  it("Shouldn't heal health while status is dead", () => {
    expect(playerReducer(lifeless, healed({ health: 1 }))).toStrictEqual(
      lifeless,
    );
  });

  it("Should restore upon gaining a life", () => {
    expect(playerReducer(lifeless, healed({ life: 1 }))).toStrictEqual({
      ...lifeless,
      life: 1,
      health: lifeless.maxHealth,
      status: PlayerStatus.Alive,
    });
  });
});

describe("restored Action - Player Reducer tests", () => {
  const { restored } = PlayerActions;

  it("Should restore lifeless status", () => {
    expect(playerReducer(lifeless, restored())).toStrictEqual({
      ...lifeless,
      life: lifeless.maxLife,
      health: lifeless.maxHealth,
      status: PlayerStatus.Alive,
    });
  });

  it("Should restore degraded health", () => {
    expect(playerReducer(degradedHealth, restored())).toStrictEqual({
      ...degradedHealth,
      life: degradedHealth.maxLife,
      health: degradedHealth.maxHealth,
    });
  });
});
