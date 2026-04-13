var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { i as isEasingArray, V as VisualElement, b as createBox, d as resolveElements, e as mixNumber, f as removeItem, g as isMotionValue, h as defaultOffset, k as createGeneratorEasing, l as fillOffset, n as isGenerator, s as secondsToMilliseconds, p as progress, o as isSVGElement, q as isSVGSVGElement, S as SVGVisualElement, H as HTMLVisualElement, v as visualElementStore, t as animateSingleValue, u as animateTarget, w as motionValue, x as spring, c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Z as Zap, m as motion, A as AnimatePresence, T as TriangleAlert, X, I as Info, y as Sr, U, a as me, z as axios, B as useToasts, C as eventBus, E as Events, L as Le } from "./app-CrFwRJNN.js";
import { T as Target, C as ChevronRight, M as Map$1, a as TooltipProvider, b as Tooltip, c as TooltipTrigger, H as House, d as TooltipContent, A as AppLayout } from "./app-layout-DDNtXEo2.js";
import { S as Shield } from "./shield-DwB6IayC.js";
import { U as Users } from "./users-CilOvMX3.js";
import { D as Dialog, a as DialogContent, b as DialogDescription, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-B622d0OX.js";
import { B as Button } from "./app-logo-icon-C-2e79QW.js";
import { B as Badge, C as Clock, a as Crosshair, S as Search, A as AttackModal } from "./AttackModal-HSfCe2PP.js";
import { L as LoaderCircle } from "./loader-circle-V0DbraQY.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-JX6mncuu.js";
import { I as Input } from "./index-DhJ5vCQh.js";
import { g as gameStateService } from "./GameStateService-DrLsyfk3.js";
import { S as Sword } from "./sword-CWkwtfRv.js";
import "./index-Dg28G0Tv.js";
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
function getEasingForSegment(easing, i) {
  return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
}
class GroupAnimation {
  constructor(animations) {
    this.stop = () => this.runAll("stop");
    this.animations = animations.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((animation) => animation.finished));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(propName) {
    return this.animations[0][propName];
  }
  setAll(propName, newValue) {
    for (let i = 0; i < this.animations.length; i++) {
      this.animations[i][propName] = newValue;
    }
  }
  attachTimeline(timeline) {
    const subscriptions = this.animations.map((animation) => animation.attachTimeline(timeline));
    return () => {
      subscriptions.forEach((cancel, i) => {
        cancel && cancel();
        this.animations[i].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(time) {
    this.setAll("time", time);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(speed) {
    this.setAll("speed", speed);
  }
  get state() {
    return this.getAll("state");
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    return getMax(this.animations, "duration");
  }
  get iterationDuration() {
    return getMax(this.animations, "iterationDuration");
  }
  runAll(methodName) {
    this.animations.forEach((controls) => controls[methodName]());
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
function getMax(animations, propName) {
  let max = 0;
  for (let i = 0; i < animations.length; i++) {
    const value = animations[i][propName];
    if (value !== null && value > max) {
      max = value;
    }
  }
  return max;
}
class GroupAnimationWithThen extends GroupAnimation {
  then(onResolve, _onReject) {
    return this.finished.finally(onResolve).then(() => {
    });
  }
}
function isObjectKey(key, object) {
  return key in object;
}
class ObjectVisualElement extends VisualElement {
  constructor() {
    super(...arguments);
    this.type = "object";
  }
  readValueFromInstance(instance, key) {
    if (isObjectKey(key, instance)) {
      const value = instance[key];
      if (typeof value === "string" || typeof value === "number") {
        return value;
      }
    }
    return void 0;
  }
  getBaseTargetFromProps() {
    return void 0;
  }
  removeValueFromRenderState(key, renderState) {
    delete renderState.output[key];
  }
  measureInstanceViewportBox() {
    return createBox();
  }
  build(renderState, latestValues) {
    Object.assign(renderState.output, latestValues);
  }
  renderInstance(instance, { output }) {
    Object.assign(instance, output);
  }
  sortInstanceNodePosition() {
    return 0;
  }
}
function isDOMKeyframes(keyframes) {
  return typeof keyframes === "object" && !Array.isArray(keyframes);
}
function resolveSubjects(subject, keyframes, scope, selectorCache) {
  if (subject == null) {
    return [];
  }
  if (typeof subject === "string" && isDOMKeyframes(keyframes)) {
    return resolveElements(subject, scope, selectorCache);
  } else if (subject instanceof NodeList) {
    return Array.from(subject);
  } else if (Array.isArray(subject)) {
    return subject.filter((s) => s != null);
  } else {
    return [subject];
  }
}
function calculateRepeatDuration(duration, repeat, _repeatDelay) {
  return duration * (repeat + 1);
}
function calcNextTime(current, next, prev, labels) {
  if (typeof next === "number") {
    return next;
  } else if (next.startsWith("-") || next.startsWith("+")) {
    return Math.max(0, current + parseFloat(next));
  } else if (next === "<") {
    return prev;
  } else if (next.startsWith("<")) {
    return Math.max(0, prev + parseFloat(next.slice(1)));
  } else {
    return labels.get(next) ?? current;
  }
}
function eraseKeyframes(sequence, startTime, endTime) {
  for (let i = 0; i < sequence.length; i++) {
    const keyframe = sequence[i];
    if (keyframe.at > startTime && keyframe.at < endTime) {
      removeItem(sequence, keyframe);
      i--;
    }
  }
}
function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
  eraseKeyframes(sequence, startTime, endTime);
  for (let i = 0; i < keyframes.length; i++) {
    sequence.push({
      value: keyframes[i],
      at: mixNumber(startTime, endTime, offset[i]),
      easing: getEasingForSegment(easing, i)
    });
  }
}
function normalizeTimes(times, repeat) {
  for (let i = 0; i < times.length; i++) {
    times[i] = times[i] / (repeat + 1);
  }
}
function compareByTime(a, b) {
  if (a.at === b.at) {
    if (a.value === null)
      return 1;
    if (b.value === null)
      return -1;
    return 0;
  } else {
    return a.at - b.at;
  }
}
const defaultSegmentEasing = "easeInOut";
function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators) {
  const defaultDuration = defaultTransition.duration || 0.3;
  const animationDefinitions = /* @__PURE__ */ new Map();
  const sequences = /* @__PURE__ */ new Map();
  const elementCache = {};
  const timeLabels = /* @__PURE__ */ new Map();
  let prevTime = 0;
  let currentTime = 0;
  let totalDuration = 0;
  for (let i = 0; i < sequence.length; i++) {
    const segment = sequence[i];
    if (typeof segment === "string") {
      timeLabels.set(segment, currentTime);
      continue;
    } else if (!Array.isArray(segment)) {
      timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
      continue;
    }
    let [subject, keyframes, transition = {}] = segment;
    if (transition.at !== void 0) {
      currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
    }
    let maxDuration = 0;
    const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
      const valueKeyframesAsList = keyframesAsList(valueKeyframes);
      const { delay = 0, times = defaultOffset(valueKeyframesAsList), type = defaultTransition.type || "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
      let { ease = defaultTransition.ease || "easeOut", duration } = valueTransition;
      const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
      const numKeyframes = valueKeyframesAsList.length;
      const createGenerator = isGenerator(type) ? type : generators == null ? void 0 : generators[type || "keyframes"];
      if (numKeyframes <= 2 && createGenerator) {
        let absoluteDelta = 100;
        if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
          const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
          absoluteDelta = Math.abs(delta);
        }
        const springTransition = {
          ...defaultTransition,
          ...remainingTransition
        };
        if (duration !== void 0) {
          springTransition.duration = secondsToMilliseconds(duration);
        }
        const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
        ease = springEasing.ease;
        duration = springEasing.duration;
      }
      duration ?? (duration = defaultDuration);
      const startTime = currentTime + calculatedDelay;
      if (times.length === 1 && times[0] === 0) {
        times[1] = 1;
      }
      const remainder = times.length - valueKeyframesAsList.length;
      remainder > 0 && fillOffset(times, remainder);
      valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
      if (repeat) {
        duration = calculateRepeatDuration(duration, repeat);
        const originalKeyframes = [...valueKeyframesAsList];
        const originalTimes = [...times];
        ease = Array.isArray(ease) ? [...ease] : [ease];
        const originalEase = [...ease];
        for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
          valueKeyframesAsList.push(...originalKeyframes);
          for (let keyframeIndex = 0; keyframeIndex < originalKeyframes.length; keyframeIndex++) {
            times.push(originalTimes[keyframeIndex] + (repeatIndex + 1));
            ease.push(keyframeIndex === 0 ? "linear" : getEasingForSegment(originalEase, keyframeIndex - 1));
          }
        }
        normalizeTimes(times, repeat);
      }
      const targetTime = startTime + duration;
      addKeyframes(valueSequence, valueKeyframesAsList, ease, times, startTime, targetTime);
      maxDuration = Math.max(calculatedDelay + duration, maxDuration);
      totalDuration = Math.max(targetTime, totalDuration);
    };
    if (isMotionValue(subject)) {
      const subjectSequence = getSubjectSequence(subject, sequences);
      resolveValueSequence(keyframes, transition, getValueSequence("default", subjectSequence));
    } else {
      const subjects = resolveSubjects(subject, keyframes, scope, elementCache);
      const numSubjects = subjects.length;
      for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
        keyframes = keyframes;
        transition = transition;
        const thisSubject = subjects[subjectIndex];
        const subjectSequence = getSubjectSequence(thisSubject, sequences);
        for (const key in keyframes) {
          resolveValueSequence(keyframes[key], getValueTransition(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
        }
      }
    }
    prevTime = currentTime;
    currentTime += maxDuration;
  }
  sequences.forEach((valueSequences, element) => {
    for (const key in valueSequences) {
      const valueSequence = valueSequences[key];
      valueSequence.sort(compareByTime);
      const keyframes = [];
      const valueOffset = [];
      const valueEasing = [];
      for (let i = 0; i < valueSequence.length; i++) {
        const { at, value, easing } = valueSequence[i];
        keyframes.push(value);
        valueOffset.push(progress(0, totalDuration, at));
        valueEasing.push(easing || "easeOut");
      }
      if (valueOffset[0] !== 0) {
        valueOffset.unshift(0);
        keyframes.unshift(keyframes[0]);
        valueEasing.unshift(defaultSegmentEasing);
      }
      if (valueOffset[valueOffset.length - 1] !== 1) {
        valueOffset.push(1);
        keyframes.push(null);
      }
      if (!animationDefinitions.has(element)) {
        animationDefinitions.set(element, {
          keyframes: {},
          transition: {}
        });
      }
      const definition = animationDefinitions.get(element);
      definition.keyframes[key] = keyframes;
      const { type: _type, ...remainingDefaultTransition } = defaultTransition;
      definition.transition[key] = {
        ...remainingDefaultTransition,
        duration: totalDuration,
        ease: valueEasing,
        times: valueOffset,
        ...sequenceTransition
      };
    }
  });
  return animationDefinitions;
}
function getSubjectSequence(subject, sequences) {
  !sequences.has(subject) && sequences.set(subject, {});
  return sequences.get(subject);
}
function getValueSequence(name, sequences) {
  if (!sequences[name])
    sequences[name] = [];
  return sequences[name];
}
function keyframesAsList(keyframes) {
  return Array.isArray(keyframes) ? keyframes : [keyframes];
}
function getValueTransition(transition, key) {
  return transition && transition[key] ? {
    ...transition,
    ...transition[key]
  } : { ...transition };
}
const isNumber = (keyframe) => typeof keyframe === "number";
const isNumberKeyframesArray = (keyframes) => keyframes.every(isNumber);
function createDOMVisualElement(element) {
  const options = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        transform: {},
        transformOrigin: {},
        style: {},
        vars: {},
        attrs: {}
      },
      latestValues: {}
    }
  };
  const node = isSVGElement(element) && !isSVGSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
  node.mount(element);
  visualElementStore.set(element, node);
}
function createObjectVisualElement(subject) {
  const options = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        output: {}
      },
      latestValues: {}
    }
  };
  const node = new ObjectVisualElement(options);
  node.mount(subject);
  visualElementStore.set(subject, node);
}
function isSingleValue(subject, keyframes) {
  return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes);
}
function animateSubject(subject, keyframes, options, scope) {
  const animations = [];
  if (isSingleValue(subject, keyframes)) {
    animations.push(animateSingleValue(subject, isDOMKeyframes(keyframes) ? keyframes.default || keyframes : keyframes, options ? options.default || options : options));
  } else {
    if (subject == null) {
      return animations;
    }
    const subjects = resolveSubjects(subject, keyframes, scope);
    const numSubjects = subjects.length;
    for (let i = 0; i < numSubjects; i++) {
      const thisSubject = subjects[i];
      const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
      if (!visualElementStore.has(thisSubject)) {
        createVisualElement(thisSubject);
      }
      const visualElement = visualElementStore.get(thisSubject);
      const transition = { ...options };
      if ("delay" in transition && typeof transition.delay === "function") {
        transition.delay = transition.delay(i, numSubjects);
      }
      animations.push(...animateTarget(visualElement, { ...keyframes, transition }, {}));
    }
  }
  return animations;
}
function animateSequence(sequence, options, scope) {
  const animations = [];
  const processedSequence = sequence.map((segment) => {
    if (Array.isArray(segment) && typeof segment[0] === "function") {
      const callback = segment[0];
      const mv = motionValue(0);
      mv.on("change", callback);
      if (segment.length === 1) {
        return [mv, [0, 1]];
      } else if (segment.length === 2) {
        return [mv, [0, 1], segment[1]];
      } else {
        return [mv, segment[1], segment[2]];
      }
    }
    return segment;
  });
  const animationDefinitions = createAnimationsFromSequence(processedSequence, options, scope, { spring });
  animationDefinitions.forEach(({ keyframes, transition }, subject) => {
    animations.push(...animateSubject(subject, keyframes, transition));
  });
  return animations;
}
function isSequence(value) {
  return Array.isArray(value) && value.some(Array.isArray);
}
function createScopedAnimate(options = {}) {
  const { scope, reduceMotion } = options;
  function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options2) {
    let animations = [];
    let animationOnComplete;
    if (isSequence(subjectOrSequence)) {
      const { onComplete, ...sequenceOptions } = optionsOrKeyframes || {};
      if (typeof onComplete === "function") {
        animationOnComplete = onComplete;
      }
      animations = animateSequence(subjectOrSequence, reduceMotion !== void 0 ? { reduceMotion, ...sequenceOptions } : sequenceOptions, scope);
    } else {
      const { onComplete, ...rest } = options2 || {};
      if (typeof onComplete === "function") {
        animationOnComplete = onComplete;
      }
      animations = animateSubject(subjectOrSequence, optionsOrKeyframes, reduceMotion !== void 0 ? { reduceMotion, ...rest } : rest, scope);
    }
    const animation = new GroupAnimationWithThen(animations);
    if (animationOnComplete) {
      animation.finished.then(animationOnComplete);
    }
    if (scope) {
      scope.animations.push(animation);
      animation.finished.then(() => {
        removeItem(scope.animations, animation);
      });
    }
    return animation;
  }
  return scopedAnimate;
}
const animate = createScopedAnimate();
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("Activity", __iconNode$a);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "m16 3 4 4-4 4", key: "1x1c3m" }],
  ["path", { d: "M20 7H4", key: "zbl0bi" }],
  ["path", { d: "m8 21-4-4 4-4", key: "h9nckh" }],
  ["path", { d: "M4 17h16", key: "g4d7ey" }]
];
const ArrowRightLeft = createLucideIcon("ArrowRightLeft", __iconNode$9);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  [
    "path",
    {
      d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
      key: "lc1i9w"
    }
  ],
  ["path", { d: "m7 16.5-4.74-2.85", key: "1o9zyk" }],
  ["path", { d: "m7 16.5 5-3", key: "va8pkn" }],
  ["path", { d: "M7 16.5v5.17", key: "jnp8gn" }],
  [
    "path",
    {
      d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
      key: "8zsnat"
    }
  ],
  ["path", { d: "m17 16.5-5-3", key: "8arw3v" }],
  ["path", { d: "m17 16.5 4.74-2.85", key: "8rfmw" }],
  ["path", { d: "M17 16.5v5.17", key: "k6z78m" }],
  [
    "path",
    {
      d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
      key: "1xygjf"
    }
  ],
  ["path", { d: "M12 8 7.26 5.15", key: "1vbdud" }],
  ["path", { d: "m12 8 4.74-2.85", key: "3rx089" }],
  ["path", { d: "M12 13.5V8", key: "1io7kd" }]
];
const Boxes = createLucideIcon("Boxes", __iconNode$8);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["line", { x1: "3", x2: "15", y1: "22", y2: "22", key: "xegly4" }],
  ["line", { x1: "4", x2: "14", y1: "9", y2: "9", key: "xcnuvu" }],
  ["path", { d: "M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18", key: "16j0yd" }],
  [
    "path",
    {
      d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5",
      key: "7cu91f"
    }
  ]
];
const Fuel = createLucideIcon("Fuel", __iconNode$7);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9", key: "eefl8a" }],
  ["path", { d: "m18 15 4-4", key: "16gjal" }],
  [
    "path",
    {
      d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5",
      key: "b7pghm"
    }
  ]
];
const Hammer = createLucideIcon("Hammer", __iconNode$6);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("Navigation", __iconNode$5);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M2 22h20", key: "272qi7" }],
  [
    "path",
    {
      d: "M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z",
      key: "1ma21e"
    }
  ]
];
const PlaneLanding = createLucideIcon("PlaneLanding", __iconNode$4);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M2 22h20", key: "272qi7" }],
  [
    "path",
    {
      d: "M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z",
      key: "fkigj9"
    }
  ]
];
const PlaneTakeoff = createLucideIcon("PlaneTakeoff", __iconNode$3);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
      key: "m3kijz"
    }
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
      key: "1fmvmk"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", key: "1f8sc4" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }]
];
const Rocket = createLucideIcon("Rocket", __iconNode$2);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("ShieldAlert", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
  ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }]
];
const TrendingUp = createLucideIcon("TrendingUp", __iconNode);
const ResourceBar = ({ recursos, taxasPerSecond }) => {
  const [current, setCurrent] = reactExports.useState({
    suprimentos: (recursos == null ? void 0 : recursos.suprimentos) ?? 0,
    combustivel: (recursos == null ? void 0 : recursos.combustivel) ?? 0,
    municoes: (recursos == null ? void 0 : recursos.municoes) ?? 0,
    pessoal: (recursos == null ? void 0 : recursos.pessoal) ?? 0,
    metal: (recursos == null ? void 0 : recursos.metal) ?? 0,
    energia: (recursos == null ? void 0 : recursos.energia) ?? 0,
    cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4
  });
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => ({
        suprimentos: prev.suprimentos + ((taxasPerSecond == null ? void 0 : taxasPerSecond.suprimentos) ?? 0),
        combustivel: prev.combustivel + ((taxasPerSecond == null ? void 0 : taxasPerSecond.combustivel) ?? 0),
        municoes: prev.municoes + ((taxasPerSecond == null ? void 0 : taxasPerSecond.municoes) ?? 0),
        metal: prev.metal + ((taxasPerSecond == null ? void 0 : taxasPerSecond.metal) ?? 0),
        energia: prev.energia + ((taxasPerSecond == null ? void 0 : taxasPerSecond.energia) ?? 0),
        pessoal: prev.pessoal,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4
      }));
    }, 1e3);
    return () => clearInterval(interval);
  }, [taxasPerSecond]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-6 gap-4 w-full z-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]", size: 24 }),
        label: "Suprimentos",
        value: current.suprimentos,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.suprimentos) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-sky-400"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]", size: 24 }),
        label: "Combustível",
        value: current.combustivel,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.combustivel) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-orange-500"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "text-zinc-400 drop-shadow-[0_0_12px_rgba(161,161,170,0.5)]", size: 24 }),
        label: "Metal",
        value: current.metal,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.metal) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-zinc-500"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]", size: 24 }),
        label: "Munições",
        value: current.municoes,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.municoes) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-red-500"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]", size: 24 }),
        label: "Energia",
        value: current.energia,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.energia) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-yellow-500"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]", size: 24 }),
        label: "Guarnição",
        value: current.pessoal,
        rate: 0,
        cap: 0,
        color: "text-white",
        accentColor: "bg-emerald-500",
        isStatic: true
      }
    )
  ] });
};
const ResourceItem = ({ icon, label, value, rate, cap, color, accentColor, isStatic = false }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center bg-black/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group cursor-help transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-28 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-50 pointer-events-none scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900 border border-white/10 px-5 py-4 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,1)] flex flex-col items-center min-w-[220px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-white tracking-[0.3em] mb-2", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 w-full text-[9px] font-mono uppercase text-neutral-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fluxo/Hora:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 font-black", children: [
            "+",
            (rate * 3600).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-white/5 pt-1 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Eficiência:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-400 font-black", children: [
            Math.min(100, value / cap * 100).toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[7px] text-neutral-600 mt-2 text-center italic", children: "Sensor ótico de monitorização estratégica ativado" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-3 opacity-60 group-hover:opacity-100 transition-all duration-300", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 group-hover:text-white transition-colors", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: `text-4xl font-black font-mono tracking-tighter ${color} drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value })
      },
      value
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 w-full", children: !isStatic ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-1 rounded-full bg-white/[0.03] border border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[9px] font-black ${rate >= 0 ? "text-emerald-500" : "text-red-500"}`, children: [
          rate >= 0 ? "+" : "",
          rate.toFixed(1),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] opacity-40", children: "/S" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-mono text-neutral-500 uppercase", children: [
          "MAX: ",
          cap.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1 bg-white/5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: `h-full ${accentColor}`,
          initial: { width: 0 },
          animate: { width: `${Math.min(100, value / cap * 100)}%` }
        }
      ) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-emerald-400 uppercase tracking-tighter", children: "Ativo" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent ${accentColor} to-transparent opacity-0 group-hover:opacity-40 transition-all duration-500` })
  ] });
};
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 0.8,
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: Math.floor(displayValue).toLocaleString() });
};
const GLOBAL_BUILDINGS = [
  { type: "quartel", nome: "Quartel", requiredLevel: 5 },
  { type: "mina_metal", nome: "Mina de Metal" },
  { type: "central_energia", nome: "Central de Energia" },
  { type: "parlamento", nome: "Parlamento" }
];
const VillageView = ({ base, onBuildingClick, gameConfig }) => {
  var _a;
  const playerBuildings = ((_a = base.edificios) == null ? void 0 : _a.map((eb) => {
    var _a2;
    return {
      type: (_a2 = eb.tipo) == null ? void 0 : _a2.toLowerCase(),
      level: eb.nivel
    };
  })) || [];
  const buildings = GLOBAL_BUILDINGS.map((b) => {
    const existing = playerBuildings == null ? void 0 : playerBuildings.find((pb) => pb.type === b.type);
    return {
      ...b,
      level: existing ? existing.level : 0
    };
  });
  console.log("BUILDINGS FINAL:", buildings);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-white/5 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[url('/images/maps/village_base_v2.png')] bg-cover bg-center transition-all duration-1000 group-hover:scale-110 opacity-40 contrast-150" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10%_16.6%] pointer-events-none opacity-50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 scanline-overlay opacity-[0.15] z-10 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent h-20 animate-scanline z-10 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-[2.5rem]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-[conic-gradient(from_0deg,transparent_0deg,rgba(14,165,233,0.05)_90deg,transparent_90deg)] animate-spin-slow origin-center opacity-40" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-2 z-20 flex flex-col gap-2 bg-black/80 text-white p-4 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl text-sky-500 font-black mb-4", children: "UI VALIDAÇÃO MANUAL" }),
      buildings.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        b.nome,
        " (Nível ",
        b.level,
        ")"
      ] }, b.type))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-8 left-8 z-30 flex items-center gap-4 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border border-sky-500/30 rounded-full animate-spin-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 bg-sky-500 rounded-full" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase text-sky-500 tracking-[0.4em] leading-none", children: "Sector_Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] font-mono text-neutral-500 mt-1 uppercase", children: "Holographic_Downlink_1.8b" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-8 right-8 z-30 text-right pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[14px] font-black text-white leading-none", children: [
        "GRID_",
        base.coordenada_x,
        ":",
        base.coordenada_y
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] font-black text-sky-500 uppercase mt-1 tracking-widest", children: "Sinal GPS Estável" })
    ] })
  ] });
};
const getEvolutionLevelAsset = (lvl) => {
  if (lvl >= 6) return 6;
  if (lvl >= 5) return 5;
  if (lvl >= 4) return 4;
  if (lvl >= 3) return 3;
  if (lvl >= 2) return 2;
  return 1;
};
const calculateBuildingCost = (baseAmount, currentLevel, scaling = 1.5) => {
  return Math.floor(baseAmount * (1 + currentLevel * scaling));
};
const calculateConstructionTime = (timeBase, currentLevel, speed = 1) => {
  const time = timeBase * (1 + currentLevel * 0.5) / speed;
  return Math.max(5, Math.floor(time));
};
const calculateResourceProduction = (baseProd, level, speed = 1, scaling = 1.5) => {
  return Math.floor(baseProd * speed * (1 + level * scaling));
};
const parseResourceValue = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    return parseFloat(val.replace(/[^\d.-]/g, "")) || 0;
  }
  return 0;
};
const BuildingModal = ({
  isOpen,
  onClose,
  building,
  gameConfig,
  onUpgrade,
  onTrain,
  isUpgrading,
  isTraining
}) => {
  var _a, _b, _c, _d, _e, _f, _g;
  if (!building) return null;
  const buildingsConfig = (gameConfig == null ? void 0 : gameConfig.buildings) || {};
  const config = buildingsConfig[building.tipo] || {
    name: building.nome || "Estrutura Desconhecida",
    cost: {},
    time_base: 0,
    description: "Informação tática indisponível para este setor."
  };
  const nextLevel = (building.nivel || 0) + 1;
  const [currentTryLevel, setCurrentTryLevel] = reactExports.useState(getEvolutionLevelAsset(building.nivel || 0));
  const [usePlaceholder, setUsePlaceholder] = reactExports.useState(false);
  const blueprintUrl = "/images/building_blueprint_placeholder.png";
  const currentImage = usePlaceholder ? blueprintUrl : `/images/edificios/${(_a = building.tipo) == null ? void 0 : _a.toLowerCase()}/lvl_${currentTryLevel}.png`;
  reactExports.useEffect(() => {
    if (building) {
      console.log("TACTICAL_MODAL_SCAN:", building);
      setTrainQty(1);
      setSelectedUnit(null);
    }
    setCurrentTryLevel(getEvolutionLevelAsset(building.nivel || 0));
    setUsePlaceholder(false);
  }, [building.tipo, building.nivel]);
  const renderCost = (resourceType, baseAmount) => {
    var _a2, _b2;
    if (!baseAmount) return null;
    const scaling = (gameConfig == null ? void 0 : gameConfig.scaling) || 1.5;
    const totalCost = calculateBuildingCost(baseAmount, building.nivel || 0, scaling);
    const playerAmount = parseResourceValue(((_b2 = (_a2 = building.base) == null ? void 0 : _a2.recursos) == null ? void 0 : _b2[resourceType]) || 0);
    const hasEnough = playerAmount >= totalCost;
    const resourceIcons = {
      "suprimentos": "📦",
      "combustivel": "⛽",
      "municoes": "🚀",
      "pessoal": "👤"
    };
    const resourceColors = {
      "suprimentos": "text-sky-400",
      "combustivel": "text-orange-400",
      "municoes": "text-red-400",
      "pessoal": "text-emerald-400"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        className: `flex items-center justify-between bg-black/40 p-3 rounded-xl border ${hasEnough ? "border-white/5" : "border-red-500/30"} group`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg group-hover:scale-110 transition-transform", children: resourceIcons[resourceType] || "💎" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase text-neutral-500 font-black tracking-widest", children: resourceType })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-mono font-black ${hasEnough ? resourceColors[resourceType] || "text-sky-400" : "text-red-500"}`, children: totalCost.toLocaleString() }) })
        ]
      },
      resourceType
    );
  };
  const getProductionBonus = (lvl) => {
    var _a2, _b2;
    const resKey = {
      "mina_suprimentos": "suprimentos",
      "refinaria": "combustivel",
      "fabrica_municoes": "municoes",
      "posto_recrutamento": "pessoal"
    }[building.tipo];
    if (!resKey) return null;
    const baseProd = ((_a2 = gameConfig == null ? void 0 : gameConfig.production) == null ? void 0 : _a2[resKey]) || 10;
    const speed = ((_b2 = gameConfig == null ? void 0 : gameConfig.speed) == null ? void 0 : _b2.resources) || 1;
    const scaling = (gameConfig == null ? void 0 : gameConfig.scaling) || 1.5;
    return calculateResourceProduction(baseProd, lvl, speed, scaling);
  };
  const currentBonus = getProductionBonus(building.nivel || 0);
  const nextBonus = getProductionBonus(nextLevel);
  const constSpeed = ((_b = gameConfig == null ? void 0 : gameConfig.speed) == null ? void 0 : _b.construction) || 1;
  const totalTime = calculateConstructionTime(config.time_base, building.nivel || 0, constSpeed);
  const timeFormatted = `${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`;
  const canAfford = config.cost ? Object.entries(config.cost).every(([type, amount]) => {
    var _a2, _b2;
    const cost = calculateBuildingCost(amount, building.nivel || 0, (gameConfig == null ? void 0 : gameConfig.scaling) || 1.5);
    return parseResourceValue(((_b2 = (_a2 = building.base) == null ? void 0 : _a2.recursos) == null ? void 0 : _b2[type]) || 0) >= cost;
  }) : true;
  const [trainQty, setTrainQty] = reactExports.useState(1);
  const [selectedUnit, setSelectedUnit] = reactExports.useState(null);
  const tipoLower = (_c = building.tipo) == null ? void 0 : _c.toLowerCase();
  const isMilitary = ["quartel", "aerodromo"].includes(tipoLower);
  const availableUnits = isMilitary ? Object.entries((gameConfig == null ? void 0 : gameConfig.units) || {}).filter(([key, unit]) => {
    if (tipoLower === "quartel") return ["infantaria", "blindado_apc", "tanque_combate", "agente_espiao", "politico"].includes(key);
    if (tipoLower === "aerodromo") return ["helicoptero_ataque"].includes(key);
    return false;
  }) : [];
  reactExports.useEffect(() => {
    if (isMilitary && availableUnits.length > 0 && !selectedUnit) {
      setSelectedUnit(availableUnits[0][0]);
    }
  }, [building.tipo, isMilitary, availableUnits]);
  const renderUnitCard = ([key, unit]) => {
    const isSelected = selectedUnit === key;
    Object.entries(unit.cost || {}).every(
      ([res, amt]) => {
        var _a2, _b2;
        return parseResourceValue(((_b2 = (_a2 = building.base) == null ? void 0 : _a2.recursos) == null ? void 0 : _b2[res]) || 0) >= amt * trainQty;
      }
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => setSelectedUnit(key),
        className: `p-3 rounded-xl border transition-all cursor-pointer group ${isSelected ? "bg-sky-500/10 border-sky-500" : "bg-black/20 border-white/5 hover:border-white/20"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-white truncate w-24", children: unit.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-neutral-800 text-neutral-400 text-[8px]", children: [
              unit.time,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1 text-[8px] uppercase font-bold text-neutral-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ATK" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: unit.attack })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "DEF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: unit.defense_general })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CAP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: unit.capacity || 0 })
            ] })
          ] })
        ]
      },
      key
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "w-[95vw] max-w-2xl bg-neutral-950/95 border-white/10 text-white overflow-hidden backdrop-blur-2xl p-0 rounded-2xl md:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,1)] max-h-[95vh] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "sr-only", children: [
      "Interface tática para gestão do edifício ",
      building == null ? void 0 : building.nome,
      ". Permite análise de custos, bónus de produção e autorização de melhorias estruturais."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !building.tipo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mx-auto text-orange-500 animate-pulse", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black uppercase tracking-tighter", children: "Erro de Telemetria" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-500 text-[10px] uppercase", children: "Assinatura do edifício não reconhecida." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onClose, variant: "outline", className: "mt-4", children: "Fechar" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        className: "flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-1/2 relative bg-gradient-to-br from-neutral-900 to-black p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "absolute top-4 right-4 text-neutral-500 hover:text-white md:hidden z-50 p-2",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `absolute top-6 left-6 ${building.nivel === 0 ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-sky-500/10 text-sky-400 border-sky-500/20"} font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-2xl`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 ${building.nivel === 0 ? "bg-orange-400" : "bg-sky-400"} rounded-full animate-pulse` }),
              building.nivel === 0 ? "STATUS: EM PLANEAMENTO" : "STATUS: OPERACIONAL"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { rotate: -5, scale: 0.8, opacity: 0 },
                animate: { rotate: 0, scale: 1, opacity: 1 },
                className: "relative mt-8 md:mt-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-sky-500/20 blur-[40px] md:blur-[60px] rounded-full animate-pulse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: currentImage,
                      className: "w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(14,165,233,0.5)]",
                      alt: "Preview",
                      onError: () => {
                        if (usePlaceholder) return;
                        if (currentTryLevel > 1) {
                          setCurrentTryLevel(1);
                        } else {
                          setUsePlaceholder(true);
                        }
                      }
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 w-full space-y-4 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-black text-neutral-500 uppercase tracking-[0.3em]", children: "Nível Estrutural" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl font-black text-white italic drop-shadow-lg", children: building.nivel || 0 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 justify-center", children: [1, 2, 3, 4, 5, 6].map((lvl) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 w-6 rounded-full transition-all duration-500 ${lvl <= building.nivel ? "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" : "bg-white/10"}` }, lvl)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-neutral-900/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "mb-4 md:mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none", children: config.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-sky-500 font-bold uppercase tracking-widest flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 10 }),
                " Setor de ",
                ((_g = (_f = (_e = (_d = building.tipo) == null ? void 0 : _d.replace) == null ? void 0 : _e.call(_d, "_", " ")) == null ? void 0 : _f.toUpperCase) == null ? void 0 : _g.call(_f)) ?? "ESTRUTURA"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:space-y-6 flex-1 overflow-y-auto md:pr-2 custom-scrollbar", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 p-5 rounded-2xl border-l-4 border-sky-600 flex gap-4 shadow-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "text-sky-500 shrink-0", size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] md:text-xs text-neutral-300 leading-relaxed italic", children: config.description })
              ] }),
              currentBonus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] md:text-[9px] font-black text-neutral-500 uppercase tracking-widest", children: "Capacidade Atual" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm md:text-xl font-mono font-black text-white", children: [
                    currentBonus.toLocaleString(),
                    "/h"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sky-600/10 p-3 md:p-4 rounded-xl md:rounded-2xl border border-sky-500/30 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] md:text-[9px] font-black text-sky-400 uppercase tracking-widest", children: "Nível Seguinte" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm md:text-xl font-mono font-black text-sky-400 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 md:w-4 md:h-4" }),
                    " ",
                    nextBonus == null ? void 0 : nextBonus.toLocaleString(),
                    "/h"
                  ] })
                ] })
              ] }),
              !currentBonus && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-600/10 p-4 rounded-2xl border border-orange-500/20 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-orange-500 uppercase tracking-widest block", children: "Potencial Estratégico" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-neutral-400", children: "Desbloqueia novas tecnologias e unidades de elite." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-orange-500", size: 24 })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 md:space-y-4", children: isMilitary ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between border-b border-white/10 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[9px] md:text-[10px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-2.5 h-2.5 md:w-3 md:h-3 text-sky-500" }),
                  " Mobilização de Tropas"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: availableUnits.map(renderUnitCard) }),
                selectedUnit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 p-4 rounded-xl space-y-3 border border-white/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black text-neutral-400", children: "Quantidade" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTrainQty(Math.max(1, trainQty - 10)), className: "text-neutral-500 hover:text-white", children: "-10" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          value: trainQty,
                          onChange: (e) => setTrainQty(Math.max(1, parseInt(e.target.value) || 1)),
                          className: "w-16 bg-black border border-white/10 rounded px-2 py-1 text-center font-mono text-xs text-sky-400 font-bold"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTrainQty(trainQty + 10), className: "text-neutral-500 hover:text-white", children: "+10" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      onClick: () => selectedUnit && onTrain(selectedUnit, trainQty),
                      disabled: isTraining,
                      className: "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-lg shadow-lg flex items-center justify-center gap-2",
                      children: [
                        isTraining ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 }),
                        isTraining ? "A RECRUTAR..." : "INICIAR RECRUTAMENTO"
                      ]
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-white/10 pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[9px] md:text-[10px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "w-2.5 h-2.5 md:w-3 md:h-3 text-orange-500" }),
                    " Logística de Campanha"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-orange-500 uppercase font-mono", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-2.5 h-2.5 md:w-3 md:h-3" }),
                    " ",
                    timeFormatted
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 md:gap-3", children: config.cost ? Object.entries(config.cost).map(([type, amount]) => renderCost(type, amount)) : null })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "mt-6 md:mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => onUpgrade(building.tipo),
                disabled: isUpgrading || !canAfford,
                className: `w-full font-black uppercase tracking-[0.15em] md:tracking-[0.2em] py-6 md:py-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 group transition-all shadow-2xl ${canAfford ? building.nivel === 0 ? "bg-emerald-600 hover:bg-emerald-500 text-white border-t border-white/20 shadow-emerald-900/40" : "bg-sky-600 hover:bg-sky-500 text-white border-t border-white/20 shadow-sky-900/40" : "bg-neutral-800 text-neutral-500 cursor-not-allowed border-none"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base md:text-xl group-hover:translate-x-1 transition-transform flex items-center gap-2", children: [
                    isUpgrading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin" }),
                    isUpgrading ? "AUTORIZANDO..." : canAfford ? building.nivel === 0 ? "CONSTRUIR" : "UPGRADE" : "RECURSOS INSUFICIENTES"
                  ] }),
                  !isUpgrading && canAfford && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" }),
                  !canAfford && !isUpgrading && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 md:w-5 md:h-5" })
                ]
              }
            ) })
          ] })
        ]
      }
    ) })
  ] }) });
};
const getUnitAsset = (type) => {
  if (!type) return "/assets/placeholders/unit_unknown.svg";
  const t = type.toLowerCase();
  const placeholders = [];
  if (placeholders.includes(t)) {
    return `/assets/placeholders/unit_${t}.svg`;
  }
  return `/images/unidades/${t}.png`;
};
const GarrisonPanel = ({ tropas = [], gameConfig }) => {
  const unitsConfig = (gameConfig == null ? void 0 : gameConfig.units) || {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 bg-white/[0.02] border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-emerald-500", size: 16 }),
      "Guarnição Ativa"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6 min-h-[150px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
      (tropas || []).map((t, i) => {
        const config = unitsConfig[t.tipo] || { name: t.tipo };
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            className: "bg-white/[0.03] p-4 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center p-1 group-hover:border-emerald-500/30 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getUnitAsset(t.tipo), className: "w-full h-full object-contain brightness-75 group-hover:brightness-110 transition-all", alt: config.name }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-white tracking-tight", children: config.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mt-1 opacity-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-neutral-400 font-bold uppercase tracking-widest leading-none", children: "Status: Prontidão Operacional" }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-mono font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]", children: t.quantidade }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] text-neutral-600 font-black uppercase", children: "Unidades" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-[1px] bg-white/5 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[8px] font-black uppercase text-neutral-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 10, className: "text-emerald-600" }),
                  "Potencial Defensivo: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "ALTO" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[8px] font-mono text-emerald-500/50 group-hover:text-emerald-500 transition-colors", children: [
                  "REF_",
                  Math.random().toString(36).substr(2, 4).toUpperCase()
                ] })
              ] })
            ]
          },
          i
        );
      }),
      (!tropas || tropas.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "mx-auto text-neutral-800 mb-3 opacity-20", size: 32 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase font-black text-neutral-600 tracking-[0.2em] block", children: "Setor Desguarnecido" })
      ] })
    ] }) })
  ] });
};
const ProductionQueue = ({
  construcoes = [],
  treinos = [],
  gameConfig
}) => {
  const unifiedQueue = [
    ...construcoes.map((c) => {
      var _a;
      return {
        id: c.id,
        tipo: "construcao",
        label: ((_a = c.edificio_tipo) == null ? void 0 : _a.replace(/_/g, " ")) || "Estrutura",
        sublabel: `Upgrade para Nível ${c.nivel_destino}`,
        started_at: c.created_at,
        ends_at: c.completado_em
      };
    }),
    ...treinos.map((t) => {
      var _a;
      return {
        id: t.id,
        tipo: "treino",
        label: ((_a = t.unidade) == null ? void 0 : _a.replace(/_/g, " ")) || "Unidade",
        sublabel: `Recrutamento: ${t.quantidade}x`,
        started_at: t.created_at,
        ends_at: t.completado_em
      };
    })
  ].sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 bg-white/[0.02] border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "text-sky-500 animate-pulse", size: 16 }),
      "Comandos em Execução"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: unifiedQueue.length > 0 ? unifiedQueue.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(QueueItem, { item, isFirst: index === 0 }, `${item.tipo}-${item.id}`)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "text-center py-10 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "mx-auto text-neutral-800 mb-3 opacity-20", size: 32 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase font-black text-neutral-600 tracking-[0.2em] block", children: "Sistemas em Espera" })
        ]
      }
    ) }) })
  ] });
};
const QueueItem = ({ item, isFirst }) => {
  const [progress2, setProgress] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState("");
  reactExports.useEffect(() => {
    const calculateProgress = () => {
      const start = new Date(item.started_at).getTime();
      const end = new Date(item.ends_at).getTime();
      const now = (/* @__PURE__ */ new Date()).getTime();
      const total = end - start;
      const elapsed = now - start;
      const remaining = end - now;
      const percent = Math.min(100, Math.max(0, elapsed / total * 100));
      setProgress(percent);
      if (remaining > 0) {
        const h = Math.floor(remaining / 36e5);
        const m = Math.floor(remaining % 36e5 / 6e4);
        const s = Math.floor(remaining % 6e4 / 1e3);
        if (h > 0) {
          setTimeLeft(`${h}h ${m}m`);
        } else {
          setTimeLeft(`${m}m ${s}s`);
        }
      } else {
        setTimeLeft("CONCLUÍDO");
        if (isFirst) {
          setTimeout(() => {
            Sr.reload({ only: ["base", "jogador"] });
          }, 500);
        }
      }
    };
    const timer = setInterval(calculateProgress, 1e3);
    calculateProgress();
    return () => clearInterval(timer);
  }, [item, isFirst]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
      className: `group relative ${!isFirst ? "opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-2 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black uppercase text-white tracking-tighter", children: item.label }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-neutral-500 font-bold uppercase pl-3.5 tracking-wider", children: item.sublabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] font-mono font-black flex items-center gap-1.5 ${isFirst ? "text-white" : "text-neutral-500"}`, children: [
            isFirst && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1 bg-red-500 rounded-full animate-ping" }),
            timeLeft
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1 bg-neutral-900 rounded-full overflow-hidden shadow-inner border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: `absolute inset-y-0 left-0 ${item.tipo === "construcao" ? "bg-gradient-to-r from-orange-600 to-orange-400" : "bg-gradient-to-r from-sky-600 to-sky-400"} shadow-[0_0_10px_rgba(14,165,233,0.3)]`,
            initial: { width: 0 },
            animate: { width: `${progress2}%` },
            transition: { type: "spring", bounce: 0, duration: 1.5 }
          }
        ) }),
        isFirst && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-x-2 -inset-y-3 bg-white/[0.02] rounded-xl -z-10 group-hover:bg-white/[0.04] transition-colors" })
      ]
    }
  );
};
const ArmyMovementPanel = ({
  ataquesEnviados,
  ataquesRecebidos,
  gameConfig
}) => {
  const [now, setNow] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(interval);
  }, []);
  const getTimeLeft = (targetTime) => {
    const diff = Math.max(0, new Date(targetTime).getTime() - now);
    const mins = Math.floor(diff / 6e4);
    const secs = Math.floor(diff % 6e4 / 1e3);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const hasMovements = ((ataquesEnviados == null ? void 0 : ataquesEnviados.length) ?? 0) > 0 || ((ataquesRecebidos == null ? void 0 : ataquesRecebidos.length) ?? 0) > 0;
  if (!hasMovements) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden mb-8 rounded-[1.5rem] shadow-2xl relative group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 bg-red-500/[0.03] border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.25em] text-red-500/80 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "animate-pulse", size: 16 }),
      "Monitor de Espaço Aéreo e Fronteira"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ataquesRecebidos == null ? void 0 : ataquesRecebidos.map((atk) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            className: "p-5 flex items-center justify-between bg-red-950/20 group/atk hover:bg-red-900/30 transition-all duration-500",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PlaneLanding, { className: "text-red-500 animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]", size: 24 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] font-black text-red-400 uppercase tracking-tight", children: "Invasão Hostil Detetada" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-neutral-500 uppercase font-mono tracking-tighter", children: [
                      "Vetor de Ataque: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: (_a = atk.origem) == null ? void 0 : _a.username })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 bg-red-500 rounded-full animate-ping" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-2xl font-black text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]", children: [
                  "-",
                  getTimeLeft(atk.chegada_em)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[7px] text-neutral-600 font-black uppercase tracking-[0.2em] opacity-50", children: "Tempo até Impacto" })
              ] })
            ]
          },
          atk.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ataquesEnviados == null ? void 0 : ataquesEnviados.map((atk) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "p-5 flex items-center justify-between group/of hover:bg-white/[0.02] transition-all duration-500",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PlaneTakeoff, { className: "text-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]", size: 24 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] font-black text-white uppercase tracking-tight group-hover/of:text-sky-400 transition-colors", children: "Ofensiva em Curso" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-neutral-500 uppercase font-mono", children: [
                    "Missão: ",
                    atk.tipo.replace(/_/g, " "),
                    " / Alvo: ",
                    (_a = atk.destino) == null ? void 0 : _a.username
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-black text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]", children: getTimeLeft(atk.chegada_em) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] text-neutral-600 font-black uppercase tracking-[0.2em]", children: "ETR_TIME" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 8, className: "text-sky-500 animate-slide-right" })
                ] })
              ] })
            ]
          },
          atk.id
        );
      }) })
    ] }) })
  ] });
};
function __insertCSS(code) {
  if (typeof document == "undefined") return;
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
Array(12).fill(0);
let toastsCounter = 1;
class Observer {
  constructor() {
    this.subscribe = (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    };
    this.publish = (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    };
    this.addToast = (data) => {
      this.publish(data);
      this.toasts = [
        ...this.toasts,
        data
      ];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) {
        this.dismissedToasts.delete(id);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id) {
            this.publish({
              ...toast2,
              ...data,
              id,
              title: message
            });
            return {
              ...toast2,
              ...data,
              id,
              dismissible,
              title: message
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id
        });
      }
      return id;
    };
    this.dismiss = (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
          id,
          dismiss: true
        })));
      } else {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) => subscriber({
            id: toast2.id,
            dismiss: true
          }));
        });
      }
      return id;
    };
    this.message = (message, data) => {
      return this.create({
        ...data,
        message
      });
    };
    this.error = (message, data) => {
      return this.create({
        ...data,
        message,
        type: "error"
      });
    };
    this.success = (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message
      });
    };
    this.info = (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message
      });
    };
    this.warning = (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message
      });
    };
    this.loading = (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message
      });
    };
    this.promise = (promise, data) => {
      if (!data) {
        return;
      }
      let id = void 0;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading,
          description: typeof data.description !== "function" ? data.description : void 0
        });
      }
      const p = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id !== void 0;
      let result;
      const originalPromise = p.then(async (response) => {
        result = [
          "resolve",
          response
        ];
        const isReactElementResponse = U.isValidElement(response);
        if (isReactElementResponse) {
          shouldDismiss = false;
          this.create({
            id,
            type: "default",
            message: response
          });
        } else if (isHttpResponse(response) && !response.ok) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
          const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !U.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (response instanceof Error) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !U.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !U.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "success",
            description,
            ...toastSettings
          });
        }
      }).catch(async (error) => {
        result = [
          "reject",
          error
        ];
        if (data.error !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
          const description = typeof data.description === "function" ? await data.description(error) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !U.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        }
      }).finally(() => {
        if (shouldDismiss) {
          this.dismiss(id);
          id = void 0;
        }
        data.finally == null ? void 0 : data.finally.call(data);
      });
      const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
      if (typeof id !== "string" && typeof id !== "number") {
        return {
          unwrap
        };
      } else {
        return Object.assign(id, {
          unwrap
        });
      }
    };
    this.custom = (jsx, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx(id),
        id,
        ...data
      });
      return id;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
    };
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const ToastState = new Observer();
const toastFunction = (message, data) => {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id
  });
  return id;
};
const isHttpResponse = (data) => {
  return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
const toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
}, {
  getHistory,
  getToasts
});
__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function useGameEntities() {
  const [state, setState] = reactExports.useState({
    entities: gameStateService.getGameState(),
    globalState: gameStateService.getGlobalState()
  });
  reactExports.useEffect(() => {
    const unsub = gameStateService.subscribe(() => {
      setState({
        entities: gameStateService.getGameState(),
        globalState: gameStateService.getGlobalState()
      });
    });
    return unsub;
  }, []);
  return state;
}
const ActiveMovements = () => {
  const { entities } = useGameEntities() || { entities: [] };
  const movements = entities.filter((e) => e.march);
  const [now, setNow] = U.useState(Date.now());
  U.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);
  if (movements.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-auto space-y-3 mt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 12, className: "text-red-500 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]", children: "ACTIVE_MOVEMENTS" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-3xl shadow-2xl space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar", children: movements.map((m) => {
      var _a, _b, _c, _d, _e;
      const remaining = Math.max(0, (((_a = m.march) == null ? void 0 : _a.arrivalTime) - now) / 1e3);
      const progress2 = Math.min(100, (1 - remaining / ((_b = m.march) == null ? void 0 : _b.totalTime)) * 100);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900/40 border border-white/5 p-3 rounded-2xl space-y-2 group transition-all hover:border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-white uppercase truncate w-32 tracking-tighter", children: m.status === "returning" ? "RETREAT_PROTOCOL" : "STRIKE_COMMAND" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[8px] font-black px-1.5 py-0.5 rounded-full ${m.status === "returning" ? "bg-sky-500/20 text-sky-400" : "bg-red-500/20 text-red-500"}`, children: ((_c = m.status) == null ? void 0 : _c.toUpperCase()) || "TRANSIT" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-neutral-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 10, className: "group-hover:text-white transition-colors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-mono tracking-tighter", children: [
            "GPS: ",
            (_d = m.march) == null ? void 0 : _d.target.x,
            ":",
            (_e = m.march) == null ? void 0 : _e.target.y
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-neutral-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono font-bold tracking-widest text-white", children: [
              remaining.toFixed(1),
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1 bg-white/5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: `h-full ${m.status === "returning" ? "bg-sky-500" : "bg-red-500"}`,
              animate: { width: `${progress2}%` },
              transition: { ease: "linear", duration: 0.1 }
            }
          ) })
        ] })
      ] }, m.id);
    }) })
  ] });
};
const StrategyHUD = ({
  resources,
  coordinates,
  selectedEntity,
  miniMapData,
  villages,
  onJump
}) => {
  var _a;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start w-full gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-1/4 pt-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-3xl pointer-events-auto shadow-2xl space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Map$1, { size: 12, className: "text-sky-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]", children: "ACTIVE_COLONIES" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: villages.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onJump(v.x, v.y),
              className: "bg-neutral-900/40 hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/30 px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all group w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-white uppercase tracking-tighter truncate", children: v.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-mono text-neutral-500 ml-auto group-hover:text-sky-400", children: [
                  v.x,
                  ":",
                  v.y
                ] })
              ]
            },
            v.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveMovements, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceNode, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14 }), label: "SUP", value: resources.suprimentos, color: "text-sky-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceNode, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { size: 14 }), label: "COMB", value: resources.combustivel, color: "text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceNode, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { size: 14 }), label: "MET", value: resources.metal, color: "text-zinc-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceNode, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 14 }), label: "MUN", value: resources.municoes, color: "text-red-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceNode, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }), label: "ENE", value: resources.energia, color: "text-yellow-400" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/80 backdrop-blur-2xl border border-sky-500/20 px-6 py-3 rounded-[2rem] flex items-center gap-4 pointer-events-auto shadow-2xl hover:border-sky-500/40 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 18, className: "text-sky-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] },
              transition: { repeat: Infinity, duration: 2 },
              className: "absolute inset-0 bg-sky-500 rounded-full"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-base text-white tracking-[0.2em] font-bold", children: [
          coordinates.x,
          ":",
          coordinates.y
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end w-full gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-950/90 backdrop-blur-3xl border-2 border-white/5 p-3 rounded-[2.5rem] w-64 h-64 pointer-events-auto shadow-2xl relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1),transparent_70%)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: { rotate: 360 },
            transition: { duration: 4, repeat: Infinity, ease: "linear" },
            className: "absolute inset-0 bg-conic-to-r from-sky-500/20 via-transparent to-transparent opacity-40 pointer-events-none"
          }
        ),
        miniMapData.map((e, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `absolute w-1 h-1 rounded-full ${e.type === "unit" ? "bg-sky-400" : "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"}`,
            style: {
              left: `${e.x / 1e3 * 100}%`,
              top: `${e.y / 1e3 * 100}%`
            }
          },
          idx
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-sky-500/50 uppercase tracking-[0.4em] flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-500/50 animate-pulse" }),
          "SCAN_ACTIVE"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedEntity && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { x: 100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 },
          className: "bg-neutral-900/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] w-96 pointer-events-auto shadow-2xl space-y-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest", children: "SIGNAL_DETECTED" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-3xl font-black text-white uppercase tracking-tighter leading-none", children: [
                  ((_a = selectedEntity.type) == null ? void 0 : _a.replace("Unit", "")) || "TARGET",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sky-500", children: "_SECURE" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-neutral-500 mt-1", children: [
                  "UUID: ",
                  selectedEntity.id.toString(16).toUpperCase()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-sky-500/10 rounded-3xl border border-sky-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 24, className: "text-sky-400" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBit, { label: "ARMOR_COV", value: "OPTIMAL", color: "text-sky-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBit, { label: "LOGISTICS", value: "ACTIVE", color: "text-emerald-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBit, { label: "POSITION", value: `${Math.round(selectedEntity.x)}:${Math.round(selectedEntity.y)}`, color: "text-white font-mono" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBit, { label: "THREAT_LVL", value: "MINIMAL", color: "text-neutral-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full py-4 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase text-xs rounded-2xl transition-all shadow-lg shadow-sky-500/20 active:scale-95", children: "EXECUTE_COMMAND_PROTOCOL" }) })
          ]
        }
      ) })
    ] })
  ] });
};
const ResourceNode = ({ icon, label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl group hover:border-white/20 transition-all cursor-help relative", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-1.5 bg-white/5 rounded-lg ${color}`, children: icon }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-500 uppercase block tracking-tighter", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-white font-mono tracking-tighter", children: Math.floor(value).toLocaleString() })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full mt-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-[8px] text-white p-2 rounded-lg border border-white/10 z-50 w-32", children: "Disponibilidade imediata de recursos para operaÃ§Ãµes de base." })
] });
const InfoBit = ({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 border border-white/5 p-2 rounded-xl", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-600 uppercase block mb-0.5", children: label }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-black uppercase tracking-tighter ${color}`, children: value })
] });
function WorldMapView({ playerBase, troops = [], gameConfig }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const [center, setCenter] = reactExports.useState({ x: (playerBase == null ? void 0 : playerBase.coordenada_x) || 500, y: (playerBase == null ? void 0 : playerBase.coordenada_y) || 500 });
  const [loading, setLoading] = reactExports.useState(false);
  const [selectedSector, setSelectedSector] = reactExports.useState(null);
  const [searchCoords, setSearchCoords] = reactExports.useState({ x: "", y: "" });
  const [isAttackModalOpen, setIsAttackModalOpen] = reactExports.useState(false);
  const [zoom, setZoom] = reactExports.useState(1);
  const [selectedUnit, setSelectedUnit] = reactExports.useState(null);
  const { entities: gameEntities, globalState } = useGameEntities();
  const selectedEntityObj = reactExports.useMemo(() => {
    return gameEntities.find((e) => e.id === selectedUnit);
  }, [gameEntities, selectedUnit]);
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 2.5));
  };
  const CHUNK_SIZE = 50;
  const [loadedChunks, setLoadedChunks] = reactExports.useState({});
  const fetchChunkData = async (cx, cy) => {
    const key = `${cx}-${cy}`;
    if (loadedChunks[key] || loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/mapa/chunk/${cx}/${cy}`);
      setLoadedChunks((prev) => ({ ...prev, [key]: response.data.bases }));
    } catch (error) {
      console.error("Erro ao carregar mapa tático:", error);
      toast.error("Falha na sincronização de satélite.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    const chunkX = Math.floor(center.x / CHUNK_SIZE);
    const chunkY = Math.floor(center.y / CHUNK_SIZE);
    fetchChunkData(chunkX, chunkY);
    const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    neighbors.forEach(([dx, dy]) => {
      const nx = chunkX + dx;
      const ny = chunkY + dy;
      if (nx >= 0 && nx < 20 && ny >= 0 && ny < 20) {
        fetchChunkData(nx, ny);
      }
    });
    if (window.eventBus) {
      const eb = window.eventBus;
      const unsubCombat = eb.subscribe("COMBAT:RESULT", (payload) => {
        const { vitoria, losses, loot } = payload.data;
        if (vitoria) {
          toast.success(`VITÓRIA MILITAR: Capturadas ${loot} unidades de recursos! Baixas: ${losses}`, {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "text-emerald-500" })
          });
        } else {
          toast.error(`DERROTA NO CAMPO: Forças repelidas com ${losses} baixas.`, {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "text-red-500" })
          });
        }
      });
      const unsubConquered = eb.subscribe("VILLAGE:CONQUERED", (payload) => {
        toast.success("DOMÍNIO ABSOLUTO: Nova base anexada ao seu comando!", {
          description: `Setor ${payload.data.villageId} agora sob sua soberania.`,
          duration: 6e3
        });
      });
      return () => {
        unsubCombat();
        unsubConquered();
      };
    }
  }, [center]);
  const visibleBases = reactExports.useMemo(() => {
    return Object.values(loadedChunks).flat();
  }, [loadedChunks]);
  const rebelBasesCount = reactExports.useMemo(() => {
    return visibleBases.filter((b) => !b.jogador_id).length;
  }, [visibleBases]);
  const handleSearch = () => {
    const nx = parseInt(searchCoords.x);
    const ny = parseInt(searchCoords.y);
    if (!isNaN(nx) && !isNaN(ny)) {
      setCenter({ x: nx, y: ny });
      setSelectedSector({ x: nx, y: ny, base: visibleBases.find((b) => b.coordenada_x === nx && b.coordenada_y === ny) });
    }
  };
  const jumpToPlayer = () => {
    if (playerBase) setCenter({ x: playerBase.coordenada_x, y: playerBase.coordenada_y });
  };
  const { post, processing } = me();
  const handleSendAttack = (params) => {
    if (window.eventBus) {
      window.eventBus.emit("ATTACK:LAUNCH", {
        timestamp: Date.now(),
        data: {
          originX: playerBase.coordenada_x,
          originY: playerBase.coordenada_y,
          targetX: params.destino_x,
          targetY: params.destino_y,
          ownerId: playerBase.jogador_id,
          troops: params.tropas
        }
      });
    }
    post(window.route("base.atacar", { ...params, origem_id: playerBase.id }), {
      onSuccess: () => {
        setIsAttackModalOpen(false);
        setSelectedSector(null);
        toast.success("Expedição Militar Lançada com Sucesso!");
      },
      onError: (errors) => {
        toast.error(Object.values(errors)[0]);
      }
    });
  };
  const debugRebels = [
    { id: 9991, coordenada_x: ((playerBase == null ? void 0 : playerBase.coordenada_x) || 500) + 2, coordenada_y: ((playerBase == null ? void 0 : playerBase.coordenada_y) || 500) + 2, jogador_id: null, nome: "REBELDE" },
    { id: 9992, coordenada_x: ((playerBase == null ? void 0 : playerBase.coordenada_x) || 500) - 2, coordenada_y: ((playerBase == null ? void 0 : playerBase.coordenada_y) || 500) - 1, jogador_id: null, nome: "REBELDE" }
  ];
  const allBases = [...visibleBases, ...debugRebels];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 h-full overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-neutral-950 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative h-[700px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-6 left-6 z-20 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex items-center shadow-2xl pointer-events-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "w-16 bg-transparent border-none text-center font-mono text-sky-400 placeholder:text-neutral-700 focus-visible:ring-0",
              placeholder: "X",
              value: searchCoords.x,
              onChange: (e) => setSearchCoords((prev) => ({ ...prev, x: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-white/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "w-16 bg-transparent border-none text-center font-mono text-sky-400 placeholder:text-neutral-700 focus-visible:ring-0",
              placeholder: "Y",
              value: searchCoords.y,
              onChange: (e) => setSearchCoords((prev) => ({ ...prev, y: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-neutral-400 hover:text-white", onClick: handleSearch, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "bg-black/80 backdrop-blur-xl border-white/10 rounded-2xl text-[10px] font-black uppercase pointer-events-auto", onClick: jumpToPlayer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 14, className: "mr-2 text-sky-500" }),
          " Minha Base"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "relative w-full h-full overflow-auto bg-neutral-900 custom-scrollbar",
          onWheel: handleWheel,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative transition-transform duration-200 ease-out",
              style: {
                width: `${20 * 80}px`,
                height: `${20 * 80}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "center center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: Array.from({ length: 20 }).map((_, iy) => {
                  const y = center.y - 10 + iy;
                  return Array.from({ length: 20 }).map((_2, ix) => {
                    var _a2;
                    const x = center.x - 10 + ix;
                    const baseAt = allBases.find((b) => b.coordenada_x === x && b.coordenada_y === y);
                    const isSelected = (selectedSector == null ? void 0 : selectedSector.x) === x && (selectedSector == null ? void 0 : selectedSector.y) === y;
                    const isPlayer = (baseAt == null ? void 0 : baseAt.jogador_id) === (playerBase == null ? void 0 : playerBase.jogador_id);
                    const isRebel = baseAt && !baseAt.jogador_id;
                    const isEnemy = baseAt && baseAt.jogador_id && baseAt.jogador_id !== (playerBase == null ? void 0 : playerBase.jogador_id);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `absolute border border-white/[0.05] transition-all cursor-crosshair group flex items-center justify-center
                                                        ${isSelected ? "border-sky-500 z-10 bg-sky-500/10 shadow-[0_0_30px_rgba(14,165,233,0.4)] ring-2 ring-sky-500/50" : "hover:bg-white/5"}
                                                        ${isPlayer ? "bg-sky-500/10 border-sky-500/20" : ""}
                                                        ${isEnemy ? "bg-red-500/10 border-red-500/20" : ""}
                                                        ${isRebel ? "bg-red-600/20 border-red-600/40 z-[1000] opacity-100" : ""}
                                                    `,
                          onClick: () => setSelectedSector({ x, y, base: baseAt }),
                          style: { left: ix * 80, top: iy * 80, width: 80, height: 80 },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `absolute top-1 left-1 text-[7px] font-mono transition-opacity ${isSelected ? "text-sky-400 opacity-100" : "text-neutral-700 opacity-40 group-hover:opacity-100"}`, children: [
                              x.toString().padStart(2, "0"),
                              ":",
                              y.toString().padStart(2, "0")
                            ] }),
                            baseAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              motion.div,
                              {
                                animate: isSelected ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {},
                                transition: { repeat: Infinity, duration: 3 },
                                className: `p-3 rounded-xl border-2 shadow-2xl relative
                                                                ${isPlayer ? "bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sky-500/20" : ""}
                                                                ${isEnemy ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/20" : ""}
                                                                ${isRebel ? "bg-red-600/40 text-red-100 border-red-600/60 shadow-red-600/40" : ""}
                                                            `,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 24 }),
                                  isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-2 bg-sky-500/20 blur-xl rounded-full -z-10 animate-pulse" })
                                ]
                              }
                            )
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "bg-black/90 border-white/10 p-4 rounded-2xl shadow-2xl side-top", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 12, className: isEnemy ? "text-red-500" : isRebel ? "text-amber-500" : "text-sky-500" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-white", children: isRebel ? "REBELDE" : (baseAt == null ? void 0 : baseAt.nome) || "Sector Neutro" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4 text-[8px] font-mono text-neutral-500", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "COORD: ",
                            x,
                            ":",
                            y
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "LOYALTY: ",
                            (baseAt == null ? void 0 : baseAt.loyalty) ?? 100,
                            "%"
                          ] }),
                          (baseAt == null ? void 0 : baseAt.is_protected) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-400 font-black animate-pulse", children: "UNDER_PROTECTION" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "OWNER: ",
                            isRebel ? "NEUTRAL_INSURGENT" : ((_a2 = baseAt == null ? void 0 : baseAt.jogador) == null ? void 0 : _a2.username) || "NONE"
                          ] })
                        ] })
                      ] }) })
                    ] }, `${x}-${y}`);
                  });
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none z-30", children: gameEntities.map((e) => {
                  var _a2;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      style: {
                        position: "absolute",
                        left: e.x * 80,
                        top: e.y * 80,
                        width: 80,
                        height: 80,
                        pointerEvents: "auto"
                      },
                      className: "flex items-center justify-center",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative group cursor-pointer", onClick: () => setSelectedUnit(e.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `
                                                    relative w-10 h-10 rounded-xl border-2 rotate-45 flex items-center justify-center transition-all
                                                    ${e.type === "Army" ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "border-sky-500/50 shadow-xl"}
                                                    ${selectedUnit === e.id ? "bg-orange-500 border-white" : "bg-black/80 hover:border-sky-400"}
                                                `, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-rotate-45", children: e.type === "Army" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 18, className: `${selectedUnit === e.id ? "text-black" : "text-orange-400"} ${e.status === "returning" ? "rotate-180" : ""}` }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 18, className: selectedUnit === e.id ? "text-black" : "text-sky-400" }) }) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "bg-black/90 border-white/10 p-3 rounded-xl shadow-2xl z-[100]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-black uppercase text-white flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 10, className: "text-orange-400" }),
                            "EXPE_ID: ",
                            e.id,
                            " | ",
                            ((_a2 = e.status) == null ? void 0 : _a2.toUpperCase()) || "OPERACIONAL"
                          ] }),
                          e.march && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[8px] font-mono text-neutral-500", children: [
                            "ETA: ",
                            Math.max(0, Math.floor(e.march.remainingTime)),
                            "s | DEST: ",
                            e.march.target.x,
                            ":",
                            e.march.target.y
                          ] })
                        ] }) })
                      ] }) })
                    },
                    `entity-${e.id}`
                  );
                }) })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-6 z-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-sky-500 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black tracking-widest text-neutral-400", children: "Scan Online" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3 bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] text-sky-400 tracking-tighter", children: [
          "COORD_X: ",
          center.x,
          " | COORD_Y: ",
          center.y,
          " | BASES: ",
          visibleBases.length,
          " | REBELDES: ",
          rebelBasesCount
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedSector && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 },
        className: "fixed right-10 top-32 bottom-32 w-96 bg-neutral-950/90 backdrop-blur-2xl rounded-[3rem] border-2 border-white/5 p-8 shadow-2xl z-40 overflow-hidden flex flex-col pointer-events-auto",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2", children: ((_a = selectedSector.base) == null ? void 0 : _a.nome) || "Sector Vazio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-neutral-500 font-mono text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 14 }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-500", children: [
                "[",
                selectedSector.x,
                ":",
                selectedSector.y,
                "]"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-8 overflow-auto custom-scrollbar", children: selectedSector.base ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-neutral-500 uppercase font-black tracking-widest", children: "Territorial_Loyalty" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-black ${(((_b = selectedSector.base) == null ? void 0 : _b.loyalty) ?? 100) < 30 ? "text-red-500" : "text-sky-400"}`, children: [
                  ((_c = selectedSector.base) == null ? void 0 : _c.loyalty) ?? 100,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${((_d = selectedSector.base) == null ? void 0 : _d.loyalty) ?? 100}%` },
                  className: `h-full transition-all duration-1000 ${(((_e = selectedSector.base) == null ? void 0 : _e.loyalty) ?? 100) < 30 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : (((_f = selectedSector.base) == null ? void 0 : _f.loyalty) ?? 100) < 60 ? "bg-amber-500" : "bg-sky-500"}`
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] text-neutral-500 font-mono leading-tight", children: (((_g = selectedSector.base) == null ? void 0 : _g.loyalty) ?? 100) < 30 ? "CRITICAL_INSTABILITY: High risk of capitulation detected." : "Sovereignty status within operational parameters." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-white/[0.03] rounded-3xl border border-white/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-neutral-500 uppercase font-black block tracking-widest", children: "Commanding_Officer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black text-white tracking-tight", children: ((_h = selectedSector.base.jogador) == null ? void 0 : _h.username) || "NEUTRAL_INSURGENT" })
            ] }),
            ((_i = selectedSector.base) == null ? void 0 : _i.is_protected) && selectedSector.base.protection_until && new Date(selectedSector.base.protection_until) > /* @__PURE__ */ new Date() ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center border-2 border-dashed border-yellow-500/30 rounded-3xl bg-yellow-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-yellow-500 animate-pulse", size: 32 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-yellow-500 uppercase tracking-widest", children: "TACTICAL_TRUCE_ACTIVE" }),
              selectedSector.base.protection_until && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-neutral-500 uppercase", children: [
                "Remains: ",
                new Date(selectedSector.base.protection_until).toLocaleTimeString()
              ] })
            ] }) }) : !((_j = selectedSector.base) == null ? void 0 : _j.jogador_id) || selectedSector.base.jogador_id !== (playerBase == null ? void 0 : playerBase.jogador_id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-3xl shadow-xl shadow-red-600/20 active:scale-95 transition-all text-xs",
                onClick: () => setIsAttackModalOpen(true),
                children: "ENGAGE_COMBAT_SEQUENCE"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center border-2 border-dashed border-sky-500/20 rounded-3xl bg-sky-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-sky-400 uppercase tracking-widest", children: "Friendly_Fire_Restricted" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "w-full border-2 border-white/5 py-8 rounded-3xl text-neutral-400 font-black uppercase",
              onClick: () => setIsAttackModalOpen(true),
              children: "DISPATCH_RECON"
            }
          ) })
        ]
      }
    ) }),
    selectedSector && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttackModal,
      {
        isOpen: isAttackModalOpen,
        onClose: () => setIsAttackModalOpen(false),
        origemBase: playerBase,
        destinoBase: selectedSector.base || { coordenada_x: selectedSector.x, coordenada_y: selectedSector.y, nome: "Sector Neutro" },
        tropasDisponiveis: troops,
        gameConfig,
        onEnviar: handleSendAttack,
        isSending: processing
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StrategyHUD,
      {
        resources: globalState.resources,
        coordinates: center,
        selectedEntity: selectedEntityObj,
        miniMapData: gameEntities,
        villages: globalState.villages,
        onJump: (x, y) => setCenter({ x, y })
      }
    )
  ] });
}
function VillageDashboard({
  jogador,
  base: initialBase,
  bases = [],
  taxasPerSecond,
  gameConfig,
  ataquesRecebidos,
  ataquesEnviados,
  relatoriosGlobal
}) {
  const base = U.useMemo(() => {
    if (!initialBase) return initialBase;
    const currentEdificios = initialBase.edificios || [];
    const missingBuildings = GLOBAL_BUILDINGS.filter((def) => def.type !== "qg" && def.type !== "muralha").filter((def) => !currentEdificios.some((e) => {
      var _a;
      return ((_a = e.tipo) == null ? void 0 : _a.toLowerCase()) === def.type.toLowerCase();
    })).map((def) => ({
      id: -(Math.random() * 1e6),
      // ID negativo para não colidir com DB
      tipo: def.type,
      nivel: 0,
      base_id: initialBase.id
    }));
    return {
      ...initialBase,
      edificios: [...currentEdificios, ...missingBuildings]
    };
  }, [initialBase]);
  const { addToast } = useToasts();
  const [selectedBuildingId, setSelectedBuildingId] = reactExports.useState(null);
  const [selectedBuildingType, setSelectedBuildingType] = reactExports.useState(null);
  const [isUpgrading, setIsUpgrading] = reactExports.useState(false);
  const [isTraining, setIsTraining] = reactExports.useState(false);
  const [gameMode, setGameMode] = reactExports.useState("VILLAGE");
  reactExports.useEffect(() => {
    if (!base) return;
    if (ataquesEnviados) eventBus.emit(Events.LARAVEL_SYNC_ATTACKS, { data: { attacks: ataquesEnviados } });
    if (ataquesRecebidos) eventBus.emit(Events.LARAVEL_SYNC_ATTACKS, { data: { attacks: ataquesRecebidos } });
    const unsubArrived = eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
      const res = ev.data.result === "VICTORY" ? "VITÓRIA" : "OPERACIONAL";
      addToast(`MISSÃO: Força de ataque atingiu o alvo com ${res}.`, "success");
    });
    const unsubReturned = eventBus.subscribe(Events.ATTACK_RETURNED, (ev) => {
      addToast(`LOGÍSTICA: Coluna militar regressou à base. Saque capturado.`, "info");
      Sr.reload({ only: ["base"] });
    });
    const unsubMode = eventBus.subscribe(Events.GAME_CHANGE_MODE, (ev) => {
      console.log("MODE CHANGE RECEIVED:", ev.data.mode);
      setGameMode(ev.data.mode);
    });
    return () => {
      unsubArrived();
      unsubReturned();
      unsubMode();
    };
  }, [base, ataquesEnviados, ataquesRecebidos]);
  if (!base) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-white uppercase font-mono", children: "Connecting to Satellite..." });
  const foundBuilding = (base.edificios || []).find((b) => b.id === selectedBuildingId || b.tipo === selectedBuildingType);
  let currentBuilding = null;
  if (selectedBuildingType === "qg") {
    currentBuilding = { tipo: "qg", nome: "Quartel General", nivel: Number(base.qg_nivel), base };
  } else if (selectedBuildingType === "muralha") {
    currentBuilding = { tipo: "muralha", nome: "Perímetro Defensivo", nivel: Number(base.muralha_nivel), base };
  } else if (foundBuilding) {
    currentBuilding = { ...foundBuilding, base };
  }
  const handleBuildingClick = (building) => {
    console.log("CLICK_CAPTURE:", building.tipo, "LVL:", building.nivel);
    setSelectedBuildingId(building.id || null);
    setSelectedBuildingType(building.tipo || null);
  };
  const handleUpgrade = (tipo) => {
    setIsUpgrading(true);
    Sr.post("/base/upgrade", { base_id: base.id, tipo }, {
      onSuccess: () => {
        addToast(`ORDEM DE ENGENHARIA CONFIRMADA: Upgrade de ${tipo.replace(/_/g, " ")} iniciado.`, "success");
        setIsUpgrading(false);
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors).flat().join(" | ");
        addToast(`FALHA NA TRANSMISSÃO: ${errorMsg || "Erro estrutural detetado."}`, "error");
        setIsUpgrading(false);
      }
    });
  };
  const handleTrain = (unidade, quantidade) => {
    setIsTraining(true);
    Sr.post("/base/treinar", { base_id: base.id, unidade, quantidade }, {
      onSuccess: () => {
        addToast(`MOBILIZAÇÃO INICIADA: Recrutamento de ${quantidade}x ${unidade.replace(/_/g, " ")} em curso.`, "military");
        setIsTraining(false);
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors).flat().join(" | ");
        addToast(`FALHA NO RECRUTAMENTO: ${errorMsg || "Candidatos insuficientes."}`, "error");
        setIsTraining(false);
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-1 flex-col gap-10 p-8 bg-neutral-950 text-white min-h-screen relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-[60%] h-[60%] bg-sky-500/10 blur-[200px] pointer-events-none animate-pulse duration-[10s]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-500/5 blur-[150px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Centro de Comando Tático" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceBar, { recursos: (base == null ? void 0 : base.recursos) ?? {}, taxasPerSecond: taxasPerSecond ?? {} }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8 flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "text-orange-500 animate-pulse", size: 28 }),
              "CENTRAL: ",
              (base == null ? void 0 : base.nome) ?? "Desconhecido",
              bases.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 ml-4 self-center", children: bases.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => b.id !== base.id && Sr.get(`/base/switch/${b.id}`),
                  className: `
                                                    px-4 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-widest border transition-all
                                                    ${b.id === base.id ? "bg-orange-500 border-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-black/40 border-white/10 text-neutral-500 hover:border-white/30 hover:text-white"}
                                                `,
                  children: b.nome
                },
                b.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-neutral-500 font-black uppercase tracking-widest", children: [
                "Sistemas On-line / Comando ",
                bases.length > 1 ? "Múltiplo" : "Único",
                " Ativo"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-neutral-700 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5", children: [
            "SIGINT_NODE_",
            (base == null ? void 0 : base.id) ?? "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArmyMovementPanel, { ataquesEnviados: ataquesEnviados ?? [], ataquesRecebidos: ataquesRecebidos ?? [], gameConfig }),
        gameMode === "WORLD_MAP" ? /* @__PURE__ */ jsxRuntimeExports.jsx(WorldMapView, { playerBase: base, troops: (base == null ? void 0 : base.tropas) ?? [], gameConfig }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VillageView, { base, onBuildingClick: handleBuildingClick, gameConfig })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 flex flex-col gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProductionQueue, { construcoes: base.construcoes || [], treinos: base.treinos || [], gameConfig }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GarrisonPanel, { tropas: (base == null ? void 0 : base.tropas) ?? [], gameConfig }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 bg-white/[0.02] border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "text-orange-500", size: 16 }),
            "Transmissões Globais"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6 min-h-[100px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: (relatoriosGlobal ?? []).length > 0 ? (relatoriosGlobal ?? []).map((r, i) => {
            var _a, _b;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group/item relative pl-4 transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-0 bottom-0 w-[2px] bg-orange-500/20 group-hover/item:bg-orange-500 transition-colors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-neutral-600 font-black uppercase tracking-widest mb-1 group-hover/item:text-neutral-400 transition-colors", children: new Date(r.created_at).toLocaleTimeString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-neutral-400 group-hover/item:text-white transition-colors", children: [
                "Operação de ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 font-black", children: (_a = r.atacante) == null ? void 0 : _a.username }),
                " interceptada em contra-partida com ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: (_b = r.defensor) == null ? void 0 : _b.username })
              ] })
            ] }, i);
          }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-4 text-neutral-700 text-[10px] font-black uppercase tracking-widest opacity-30", children: "Sem Atividade de Inteligência" }) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BuildingModal,
      {
        isOpen: !!selectedBuildingType,
        onClose: () => {
          setSelectedBuildingId(null);
          setSelectedBuildingType(null);
        },
        building: currentBuilding,
        gameConfig,
        onUpgrade: handleUpgrade,
        onTrain: handleTrain,
        isUpgrading,
        isTraining
      }
    )
  ] });
}
function useGameMode() {
  const [mode, setMode] = reactExports.useState(gameStateService.getMode());
  reactExports.useEffect(() => {
    const unsub = gameStateService.subscribe(() => {
      setMode(gameStateService.getMode());
    });
    return unsub;
  }, []);
  return mode;
}
class PollingService {
  constructor() {
    __publicField(this, "interval", null);
  }
  start(callback, delay = 1e4) {
    this.stop();
    this.interval = setInterval(() => {
      callback();
    }, delay);
  }
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
const PollingService$1 = new PollingService();
const breadcrumbs = [
  {
    title: "Centro de Comando",
    href: "/dashboard"
  }
];
function Dashboard(props) {
  var _a, _b, _c;
  const gameMode = useGameMode();
  const { entities } = useGameEntities() || { entities: [] };
  (entities == null ? void 0 : entities.some((e) => e.march)) ?? false;
  const [isReloading, setIsReloading] = reactExports.useState(false);
  const [lastSync, setLastSync] = reactExports.useState(/* @__PURE__ */ new Date());
  const [secondsSinceSync, setSecondsSinceSync] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const POLL_INTERVAL = 12e3;
    PollingService$1.start(() => {
      if (document.hidden || isReloading) return;
      setIsReloading(true);
      Sr.reload({
        only: ["gameData"],
        onSuccess: () => {
          setLastSync(/* @__PURE__ */ new Date());
        },
        onFinish: () => {
          setTimeout(() => setIsReloading(false), 1e3);
        }
      });
    }, POLL_INTERVAL);
    return () => PollingService$1.stop();
  }, [isReloading]);
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceSync(Math.floor(((/* @__PURE__ */ new Date()).getTime() - lastSync.getTime()) / 1e3));
    }, 1e3);
    return () => clearInterval(timer);
  }, [lastSync]);
  const SyncIndicator = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 right-4 z-50 rounded-full bg-black/80 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-500 shadow-lg backdrop-blur-sm border border-emerald-500/20 flex flex-col items-end", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1 inline-block h-1 w-1 animate-pulse rounded-full bg-emerald-500" }),
      "Sync: ",
      secondsSinceSync,
      "s ago"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[6px] text-neutral-600 mt-0.5 tracking-normal", children: "BUILD_VER: 2026.04.12.2101" })
  ] });
  const currentBase = ((_a = props.gameData) == null ? void 0 : _a.resources) ? { ...props.base, recursos: props.gameData.resources } : props.base;
  if (gameMode === "WORLD_MAP") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "SITREP: Mapa Mundial" }),
      props.base && /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorldMapView,
        {
          playerBase: currentBase,
          troops: ((_b = props.gameData) == null ? void 0 : _b.units) ?? ((_c = props.base) == null ? void 0 : _c.tropas),
          gameConfig: props.gameConfig
        }
      ),
      SyncIndicator
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(VillageDashboard, { ...props, base: currentBase }),
    SyncIndicator
  ] });
}
export {
  Dashboard as default
};
//# sourceMappingURL=dashboard-InSL5UrZ.js.map
