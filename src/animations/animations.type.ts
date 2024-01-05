import { AnimatedStyleApp } from "@/constants/types";

export interface StylizedAnimation {
  animatedStyle: AnimatedStyleApp;
}

export interface RunnableAnimation {
  run: () => StylizedAnimation;
}
