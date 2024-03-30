// Primary
export const Green = {
  100: "rgb(20, 255, 170)",
  80: "rgb(17, 207, 137)",
  60: "rgb(12, 150, 100)",
  40: "rgb(8, 94, 63)",
  15: "rgb(3, 38, 25)",
};

// Complement
export const Orange = {
  100: "rgb(255, 64, 20)",
  80: "rgb(207, 51, 17)",
  60: "rgb(150, 37, 12)",
  40: "rgb(94, 23, 8)",
  15: "rgb(38, 10, 3)",
};

// Primary Compose
export const Blue = {
  100: "rgb(20, 210, 255)",
  80: "rgb(17, 172, 207)",
  60: "rgb(12, 125, 150)",
  40: "rgb(8, 78, 94)",
  15: "rgb(3, 32, 38)",
};

// Complement Compose
export const Pink = {
  100: "rgb(255, 20, 108)",
  80: "rgb(207, 17, 86)",
  60: "rgb(150, 12, 63)",
  40: "rgb(94, 8, 39)",
  15: "rgb(38, 3, 16)",
};

// Utils
export const White = {
  100: "rgb(245, 245, 245)",
  80: "rgb(209, 209, 209)",
  60: "rgb(168, 168, 168)",
  40: "rgb(127, 127, 127)",
  15: "rgb(87, 87, 87)",
};

export const Black = {
  100: "rgb(10, 10, 10)",
  80: "rgb(56, 56, 56)",
  60: "rgb(97, 97, 97)",
  40: "rgb(138, 138, 138)",
  15: "rgb(179, 179, 179)",
};

const UI = {
  text: White["100"],
  subtext: White["60"],
  background: Green["15"],
  tint: Green["100"],
  borderColor: Black["15"],
  backdrop: Green["40"],
};

const entity = {
  player: Green["100"],
  enemy: Orange["100"],
};

const effects = {
  flash: White["100"],
};

const control = {
  button: Blue["100"],
  buttonBackground: Blue["40"],
};

const Menu = {
  title: {
    default: White["100"],
    variant_1: Green[100],
    variant_2: Blue[100],
  },
};

const settings = {
  iconItem: Green["100"],
};

export default {
  UI,
  Menu,
  entity,
  control,
  settings,
  effects,
};
