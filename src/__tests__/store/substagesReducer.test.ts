import { store } from "@/store";
import { SubstageActions } from "@/store/reducers/substages/substagesActions";
import reducer, { Substage } from "@/store/reducers/substages/substagesReducer";
import { SubstagesSelectors } from "@/store/reducers/substages/substagesSelectors";

const initialState = {
  stage: "",
  ids: [],
  entities: {},
};

let substages: Substage[] = [
  { id: 0, duration: 1000 },
  { id: 1, duration: 500 },
  { id: 2, duration: 3000 },
];

beforeEach(() => {
  substages = [
    { id: 0, duration: 1000 },
    { id: 1, duration: 500 },
    { id: 2, duration: 3000 },
  ];
});

describe("Reducer - Substages Reducer tests", () => {
  it("Should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toStrictEqual(initialState);
  });
});

describe("loaded Action - Substages Reducer tests", () => {
  const { loaded } = SubstageActions;

  it("Should load substages", () => {
    const newState = reducer(
      undefined,
      loaded({ stage: "substage-test", substages }),
    );

    expect(newState.stage).toBe("substage-test");
    expect(newState.ids).toStrictEqual(
      substages.map((substage) => substage.id),
    );
  });

  it("Should replace substages", () => {
    const replace = substages.map((substage) => ({
      ...substage,
      id: substage.id + 1,
    }));

    const previousState = reducer(
      undefined,
      loaded({ stage: "substage-test", substages }),
    );

    const newState = reducer(
      previousState,
      loaded({
        stage: "substage-test-2",
        substages: replace,
      }),
    );

    expect(newState.stage).toBe("substage-test-2");
    expect(newState.ids).toStrictEqual(replace.map((substage) => substage.id));
  });

  it("Should calculate the music start time correctly", () => {
    const newState = reducer(
      undefined,
      loaded({ stage: "substage-test", substages }),
    );
    const expected = [0, 1000, 1500];

    const result = Object.values(newState.entities).map(
      (substage) => substage.musicStartTime,
    );

    expect(result).toStrictEqual(expected);
  });

  it.each([
    [0, 500, [500, 1500, 2000]],
    [1, 500, [0, 500, 1000]],
    [2, 500, [0, 1000, 500]],
  ])(
    "Should calculate musicStartTime when manually assigned to index %i",
    (position, musicStartTime, expected) => {
      const modified = substages.map((substage, index) => {
        if (position === index) {
          substage.musicStartTime = musicStartTime;
        }
        return substage;
      });

      const newState = reducer(
        undefined,
        loaded({ stage: "substage-test", substages: modified }),
      );

      const result = Object.values(newState.entities).map(
        (substage) => substage.musicStartTime,
      );

      expect(result).toStrictEqual(expected);
    },
  );

  it("Substages should be ordered by id", () => {
    const newState = reducer(
      undefined,
      loaded({ stage: "substage-test", substages: substages.reverse() }),
    );

    Object.values(newState.entities).forEach((substage, index) => {
      expect(substage.id).toBe(index);
    });
  });
});

describe("unloaded Action - Substages Reducer tests", () => {
  const { unloaded, loaded } = SubstageActions;

  it("Should unload substages", () => {
    const previousState = reducer(
      undefined,
      loaded({ stage: "substage-test", substages }),
    );

    const newState = reducer(previousState, unloaded());
    expect(newState.stage).toBe("");
    expect(Object.keys(newState.entities).length).toBe(0);
  });
});

describe("selectors - Substages Reducer tests", () => {
  const {
    selectAllSubstages,
    selectFirstSubstage,
    selectStage,
    selectSubstageById,
    selectSubstageIds,
  } = SubstagesSelectors;

  const loadedStore = store;

  beforeAll(() => {
    loadedStore.dispatch(
      SubstageActions.loaded({ stage: "substage-test", substages }),
    );
  });

  it("Should return all substages", () => {
    expect(selectAllSubstages(loadedStore.getState()).length).toBe(3);
  });

  it("Should return the first substage", () => {
    expect(selectFirstSubstage(loadedStore.getState())?.id).toBe(
      substages[0].id,
    );
  });

  it("Should return stage", () => {
    expect(selectStage(loadedStore.getState())).toBe("substage-test");
  });

  it("Should return substage by id", () => {
    expect(selectSubstageById(loadedStore.getState(), 1).id).toBe(
      substages[1].id,
    );
  });

  it("Should return substage ids", () => {
    const expected = substages.map((substage) => substage.id);
    expect(selectSubstageIds(loadedStore.getState())).toStrictEqual(expected);
  });
});
