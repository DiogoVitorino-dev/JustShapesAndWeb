import { store } from "@/store";
import { StageActions } from "@/store/reducers/stage/stageActions";
import stageReducer, {
  StageStatus,
  StagesState,
} from "@/store/reducers/stage/stageReducer";
import { StageSelectors } from "@/store/reducers/stage/stageSelectors";

const initialState: StagesState = {
  name: "",
  status: StageStatus.Idle,
};

describe("Reducer - Stage Reducer tests", () => {
  it("Should return the initial state", () => {
    expect(stageReducer(undefined, { type: "unknown" })).toStrictEqual(
      initialState,
    );
  });
});

describe("loaded Action - Stage Reducer tests", () => {
  const { loaded } = StageActions;

  it("Should load stage", () => {
    const newState = stageReducer(
      initialState,
      loaded({ name: "stage-test", initialSubstage: 1 }),
    );

    expect(newState.name).toBe("stage-test");
    expect(newState.status).toBe(StageStatus.Idle);
    expect(newState.checkpoint).toBe(1);
    expect(newState.substage).toBe(1);
  });

  it("Should replace the previous stage", () => {
    const previousState = stageReducer(
      initialState,
      loaded({ name: "stage-test", initialSubstage: 1 }),
    );

    const newState = stageReducer(
      previousState,
      loaded({ name: "stage-test-2", initialSubstage: 5 }),
    );

    expect(newState.name).toBe("stage-test-2");
    expect(newState.status).toBe(StageStatus.Idle);
    expect(newState.checkpoint).toBe(5);
    expect(newState.substage).toBe(5);
  });
});

describe("unloaded Action - Stage Reducer tests", () => {
  const { unloaded, loaded } = StageActions;

  it("Should unload the stage", () => {
    const previousState = stageReducer(
      initialState,
      loaded({ name: "stage-test", initialSubstage: 1 }),
    );

    const newState = stageReducer(previousState, unloaded());

    expect(newState.name).toBe("");
    expect(newState.status).toBe(StageStatus.Idle);
    expect(newState.checkpoint).toBe(undefined);
    expect(newState.substage).toBe(undefined);
  });
});

describe("checkpointReached Action - Stage Reducer tests", () => {
  const { checkpointReached } = StageActions;

  it("Should save the checkpoint", () => {
    const newState = stageReducer(initialState, checkpointReached(3));
    expect(newState.checkpoint).toBe(3);
  });

  it("Should change status after saving checkpoint", () => {
    const newState = stageReducer(initialState, checkpointReached(3));
    expect(newState.status).toBe(StageStatus.Playing);
  });
});

describe("chosenSubstage Action - Stage Reducer tests", () => {
  const { chosenSubstage } = StageActions;

  it("Should change current substage", () => {
    const newState = stageReducer(initialState, chosenSubstage(5));
    expect(newState.substage).toBe(5);
  });

  it("Should change status after changing current substage", () => {
    const newState = stageReducer(initialState, chosenSubstage(5));
    expect(newState.status).toBe(StageStatus.Playing);
  });
});

describe("statusUpdated Action - Stage Reducer tests", () => {
  const { statusUpdated } = StageActions;

  it("Should change status", () => {
    const newState = stageReducer(
      initialState,
      statusUpdated(StageStatus.Paused),
    );
    expect(newState.status).toBe(StageStatus.Paused);
  });
});

describe("restartedFromCheckpoint Action - Stage Reducer tests", () => {
  const { restartedFromCheckpoint } = StageActions;

  it("Should change status", () => {
    const newState = stageReducer(
      { ...initialState, checkpoint: 2 },
      restartedFromCheckpoint(),
    );
    expect(newState.substage).toBe(2);
  });

  it("Should change status after restarting at checkpoint", () => {
    const newState = stageReducer(
      { ...initialState, checkpoint: 2 },
      restartedFromCheckpoint(),
    );
    expect(newState.status).toBe(StageStatus.Playing);
  });
});

describe("selectors - stages Reducer tests", () => {
  const { selectCheckpoint, selectName, selectStatus, selectSubstage } =
    StageSelectors;

  const loadedStore = store;
  const { loaded, statusUpdated } = StageActions;

  beforeAll(() => {
    loadedStore.dispatch(loaded({ name: "stages-test", initialSubstage: 2 }));
    loadedStore.dispatch(statusUpdated(StageStatus.Paused));
  });

  it("Should return checkpoint", () => {
    expect(selectCheckpoint(loadedStore.getState())).toBe(2);
  });

  it("Should return name", () => {
    expect(selectName(loadedStore.getState())).toBe("stages-test");
  });

  it("Should return status", () => {
    expect(selectStatus(loadedStore.getState())).toBe(StageStatus.Paused);
  });

  it("Should return substage", () => {
    expect(selectSubstage(loadedStore.getState())).toBe(2);
  });
});
