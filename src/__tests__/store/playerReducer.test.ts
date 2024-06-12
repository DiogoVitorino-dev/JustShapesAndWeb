import { store } from "@/store";
import { PlayerActions } from "@/store/reducers/player/playerActions";
import playerReducer, {
  PlayerState,
  PlayerStatus,
} from "@/store/reducers/player/playerReducer";
import { PlayerSelectors } from "@/store/reducers/player/playerSelectors";

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

describe("invulnerable Action - Player Reducer tests", () => {
  const { invulnerable } = PlayerActions;

  it("Should become invulnerable", () => {
    expect(playerReducer(initialState, invulnerable(true))).toStrictEqual({
      ...initialState,
      status: PlayerStatus.Invulnerable,
    });
  });

  it("should remove invulnerability", () => {
    const newState = playerReducer(initialState, invulnerable(true));
    expect(playerReducer(newState, invulnerable(false))).toStrictEqual({
      ...newState,
      status: PlayerStatus.Alive,
    });
  });

  it("Shouldn't become invulnerable while dead", () => {
    expect(playerReducer(lifeless, invulnerable(true))).toStrictEqual({
      ...lifeless,
    });
  });
});

describe("hurt Action - Player Reducer tests", () => {
  const { hurt } = PlayerActions;

  it("Should lose health", () => {
    expect(playerReducer(initialState, hurt({ health: 2 }))).toStrictEqual({
      ...initialState,
      health: initialState.health - 2,
    });
  });

  it("Should lose a life when health reaches 0", () => {
    expect(playerReducer(initialState, hurt({ health: 3 }))).toStrictEqual({
      ...initialState,
      health: initialState.maxHealth,
      life: initialState.life - 1,
    });
  });

  it("Should lose life", () => {
    expect(playerReducer(initialState, hurt({ life: 2 }))).toStrictEqual({
      ...initialState,
      life: initialState.life - 2,
    });
  });

  it("Should restore health upon losing life", () => {
    expect(playerReducer(degradedHealth, hurt({ life: 1 }))).toStrictEqual({
      ...degradedHealth,
      life: degradedHealth.life - 1,
      health: degradedHealth.maxHealth,
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
      life: initialState.life - 1,
      health: initialState.health - 1,
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
      health: degradedHealth.health + 1,
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
      life: degradedHealth.life + 1,
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
      life: degradedHealth.life + 1,
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
      life: lifeless.life + 1,
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

describe("selectors - player Reducer tests", () => {
  const {
    selectHealth,
    selectLife,
    selectMaxHealth,
    selectMaxLife,
    selectStatus,
  } = PlayerSelectors;

  const { maxHealthChanged, maxLifeChanged, healed } = PlayerActions;

  const loadedStore = store;

  beforeAll(() => {
    loadedStore.dispatch(maxHealthChanged(10));
    loadedStore.dispatch(maxLifeChanged(5));
    loadedStore.dispatch(healed({ health: 2 }));
  });

  it("Should return health value", () => {
    expect(selectHealth(loadedStore.getState())).toBe(initialState.health + 2);
  });

  it("Should return life value", () => {
    expect(selectLife(loadedStore.getState())).toBe(initialState.life);
  });

  it("Should return maxHealth value", () => {
    expect(selectMaxHealth(loadedStore.getState())).toBe(10);
  });

  it("Should return maxLife value", () => {
    expect(selectMaxLife(loadedStore.getState())).toBe(5);
  });

  it("Should return status value", () => {
    expect(selectStatus(loadedStore.getState())).toBe(PlayerStatus.Alive);
  });
});
