import { i as isEasingArray, V as VisualElement, a as createBox, b as resolveElements, d as mixNumber, e as removeItem, f as isMotionValue, g as defaultOffset, h as createGeneratorEasing, k as fillOffset, l as isGenerator, s as secondsToMilliseconds, p as progress, n as isSVGElement, o as isSVGSVGElement, q as SVGVisualElement, H as HTMLVisualElement, v as visualElementStore, t as animateSingleValue, w as animateTarget, x as motionValue, y as spring, c as createLucideIcon, j as jsxRuntimeExports, Z as Zap, r as reactExports, z as motion, U, X, A as AnimatePresence, S as Sr, B as eventBus, E as Events, u as useToasts, C as Logger, L as Le, $ as $e } from "./app-DhEBV9GP.js";
import { C as ChevronRight, T as TooltipProvider, A as AppLayout } from "./app-layout-CXa49aav.js";
import { S as Shield, T as Target } from "./target-B873FX7J.js";
import { U as Users } from "./users-BgjuA50a.js";
import { D as Dialog, a as DialogContent, b as DialogTitle, c as DialogFooter } from "./dialog-DoQJaFNB.js";
import { B as Button, c as cn } from "./app-logo-icon-D4zmJSyS.js";
import { B as Badge, C as Clock, a as ChevronUp, b as ChevronDown, A as AttackModal } from "./AttackModal-CTqsxyfM.js";
import { L as LoaderCircle } from "./loader-circle-DiJh00PG.js";
import { I as Input } from "./index-gThSfg0L.js";
import { g as gameStateService } from "./GameStateService-CxAdcfvt.js";
import { S as Search } from "./search-DqOxjPXi.js";
import { C as ChevronLeft } from "./chevron-left-BPSVj6Jm.js";
import { S as Sword } from "./sword-D6bokBzy.js";
import { C as Crosshair } from "./crosshair-BYEGaFJ4.js";
import { G as Globe, B as Book } from "./globe-x9SrZ4oD.js";
import { r as resourceSystem } from "./ResourceSystem-8rIHXv7Q.js";
import "./index-DOc__xIS.js";
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
const __iconNode$j = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("Activity", __iconNode$j);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("ArrowLeft", __iconNode$i);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
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
const Boxes = createLucideIcon("Boxes", __iconNode$h);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("CircleCheck", __iconNode$g);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["rect", { width: "16", height: "16", x: "4", y: "4", rx: "2", key: "14l7u7" }],
  ["rect", { width: "6", height: "6", x: "9", y: "9", rx: "1", key: "5aljv4" }],
  ["path", { d: "M15 2v2", key: "13l42r" }],
  ["path", { d: "M15 20v2", key: "15mkzm" }],
  ["path", { d: "M2 15h2", key: "1gxd5l" }],
  ["path", { d: "M2 9h2", key: "1bbxkp" }],
  ["path", { d: "M20 15h2", key: "19e6y8" }],
  ["path", { d: "M20 9h2", key: "19tzq7" }],
  ["path", { d: "M9 2v2", key: "165o2o" }],
  ["path", { d: "M9 20v2", key: "i2bqo8" }]
];
const Cpu = createLucideIcon("Cpu", __iconNode$f);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("Eye", __iconNode$e);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  [
    "path",
    {
      d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
      key: "18mbvz"
    }
  ],
  ["path", { d: "M6.453 15h11.094", key: "3shlmq" }],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }]
];
const FlaskConical = createLucideIcon("FlaskConical", __iconNode$d);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
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
const Fuel = createLucideIcon("Fuel", __iconNode$c);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
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
const Hammer = createLucideIcon("Hammer", __iconNode$b);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("Lock", __iconNode$a);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("Navigation", __iconNode$9);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912", key: "we99rg" }],
  [
    "path",
    {
      d: "M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393",
      key: "1w6hck"
    }
  ],
  [
    "path",
    {
      d: "M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z",
      key: "15hgfx"
    }
  ],
  [
    "path",
    {
      d: "M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319",
      key: "452b4h"
    }
  ]
];
const Pickaxe = createLucideIcon("Pickaxe", __iconNode$8);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M2 22h20", key: "272qi7" }],
  [
    "path",
    {
      d: "M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z",
      key: "1ma21e"
    }
  ]
];
const PlaneLanding = createLucideIcon("PlaneLanding", __iconNode$7);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M2 22h20", key: "272qi7" }],
  [
    "path",
    {
      d: "M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z",
      key: "fkigj9"
    }
  ]
];
const PlaneTakeoff = createLucideIcon("PlaneTakeoff", __iconNode$6);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
      key: "1v9wt8"
    }
  ]
];
const Plane = createLucideIcon("Plane", __iconNode$5);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
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
const Rocket = createLucideIcon("Rocket", __iconNode$4);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    { d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z", key: "14u9p9" }
  ]
];
const Triangle = createLucideIcon("Triangle", __iconNode$3);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("Truck", __iconNode$2);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("User", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z",
      key: "gksnxg"
    }
  ],
  ["path", { d: "M6 18h12", key: "9pbo8z" }],
  ["path", { d: "M6 14h12", key: "4cwo0f" }],
  ["rect", { width: "12", height: "12", x: "6", y: "10", key: "apd30q" }]
];
const Warehouse = createLucideIcon("Warehouse", __iconNode);
const ResourceBar = ({ recursos, taxasPerSecond, populacao }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-6 gap-6 w-full z-20 px-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-sky-400", size: 20 }),
        label: "Suprimentos",
        value: (recursos == null ? void 0 : recursos.suprimentos) ?? 0,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.suprimentos) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-sky-500",
        glowColor: "shadow-sky-500/40"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "text-orange-400", size: 20 }),
        label: "Combustível",
        value: (recursos == null ? void 0 : recursos.combustivel) ?? 0,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.combustivel) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-orange-500",
        glowColor: "shadow-orange-500/40"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "text-zinc-400", size: 20 }),
        label: "Metal",
        value: (recursos == null ? void 0 : recursos.metal) ?? 0,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.metal) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-zinc-500",
        glowColor: "shadow-zinc-500/40"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "text-red-400", size: 20 }),
        label: "Munições",
        value: (recursos == null ? void 0 : recursos.municoes) ?? 0,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.municoes) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-red-500",
        glowColor: "shadow-red-500/40"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-yellow-400", size: 20 }),
        label: "Energia",
        value: (recursos == null ? void 0 : recursos.energia) ?? 0,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.energia) ?? 0,
        cap: (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-yellow-500",
        glowColor: "shadow-yellow-500/40"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceItem,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-emerald-400", size: 20 }),
        label: "Guarnição",
        value: (recursos == null ? void 0 : recursos.pessoal) ?? 0,
        customValue: populacao ? `${Math.floor(populacao.used)} / ${populacao.total}` : null,
        rate: (taxasPerSecond == null ? void 0 : taxasPerSecond.pessoal) ?? 0,
        cap: (populacao == null ? void 0 : populacao.total) ?? (recursos == null ? void 0 : recursos.cap) ?? 1e4,
        color: "text-white",
        accentColor: "bg-emerald-500",
        glowColor: "shadow-emerald-500/40"
      }
    )
  ] });
};
const ResourceItem = ({ icon, label, value, rate, cap, color, accentColor, glowColor, isStatic = false, customValue }) => {
  const [simulatedValue, setSimulatedValue] = reactExports.useState(value);
  reactExports.useEffect(() => {
    if (value > 0 || simulatedValue === 0) setSimulatedValue(value);
  }, [value]);
  reactExports.useEffect(() => {
    if (isStatic || rate === 0) return;
    const interval = setInterval(() => {
      setSimulatedValue((prev) => Math.min(cap, prev + rate));
    }, 1e3);
    return () => clearInterval(interval);
  }, [rate, cap, isStatic]);
  const percentage = Math.min(100, simulatedValue / cap * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group perspective-1000", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl rounded-[2.5rem] ${accentColor}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col bg-black/40 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all duration-700 hover:bg-neutral-900/40 hover:border-white/10 hover:-translate-y-1 overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 w-1.5 h-1.5 border-t border-l border-white/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 w-1.5 h-1.5 border-t border-r border-white/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-2 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-1.5 rounded-lg bg-white/5 ${glowColor} shadow-lg transition-transform group-hover:scale-110`, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black tracking-[0.2em] text-neutral-500 group-hover:text-neutral-300 transition-colors", children: label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-3xl font-black font-mono tracking-tighter ${color} mb-2 px-1 relative`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value: simulatedValue, customValue }),
        rate !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute -right-2 top-0 text-[10px] font-black ${rate > 0 ? "text-emerald-500" : "text-rose-500"} flex items-center gap-0.5`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Triangle, { className: rate > 0 ? "fill-emerald-500" : "rotate-180 fill-rose-500", size: 6 }),
          Math.abs(rate).toFixed(1)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[8px] font-bold text-neutral-600 uppercase", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hover:text-neutral-400 transition-colors", children: "Storage_Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px] text-neutral-500", children: [
            percentage.toFixed(0),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-white/5 rounded-full p-[1px] border border-white/[0.03]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: `h-full rounded-full ${accentColor} ${glowColor} shadow-[0_0_8px_rgba(255,255,255,0.1)]`,
            initial: { width: 0 },
            animate: { width: `${percentage}%` },
            transition: { duration: 1.5, ease: "easeOut" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[7px] font-mono text-neutral-700 tracking-tighter", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "L: 0%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "M: 50%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "F: ",
            cap.toLocaleString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute pointer-events-none inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity",
          style: { backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, white 1px, white 2px)", backgroundSize: "100% 4px" }
        }
      )
    ] })
  ] });
};
const AnimatedNumber = ({ value, customValue }) => {
  if (customValue) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: customValue });
  const [displayValue, setDisplayValue] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: Math.floor(displayValue).toLocaleString() });
};
const BUILDING_SLOTS = {
  HQ: { x: 400, y: 300 },
  RADAR: { x: 268, y: 185 },
  ENERGY: { x: 400, y: 70 },
  RESEARCH: { x: 532, y: 185 },
  FACTORY: { x: 135, y: 300 },
  BARRACKS: { x: 665, y: 300 },
  AIRPORT: { x: 532, y: 415 },
  WALL: { x: 400, y: 530 }
};
const BUILDING_OFFSETS = {
  HQ: { x: 1, y: 59 },
  RADAR: { x: -75, y: 2 },
  ENERGY: { x: 25, y: 135 },
  RESEARCH: { x: 121, y: 22 },
  FACTORY: { x: 28, y: 28 },
  BARRACKS: { x: 6, y: 55 },
  AIRPORT: { x: -10, y: 90 },
  WALL: { x: -296, y: 8, rotation: 0 }
};
const BUILDING_LAYOUT = {
  central_energia: { ...BUILDING_SLOTS.ENERGY, id: "ENERGY", w: 90, h: 90, anchor: "center", assetName: "energia_v1.png" },
  radar_estrategico: { ...BUILDING_SLOTS.RADAR, id: "RADAR", w: 80, h: 90, anchor: "center", assetName: "radar_v1.png" },
  centro_pesquisa: { ...BUILDING_SLOTS.RESEARCH, id: "RESEARCH", w: 90, h: 90, anchor: "center", assetName: "pesquisa_v1.png" },
  fabrica_municoes: { ...BUILDING_SLOTS.FACTORY, id: "FACTORY", w: 100, h: 110, anchor: "center", assetName: "fabrica_v2.png" },
  hq: { ...BUILDING_SLOTS.HQ, id: "HQ", w: 140, h: 160, anchor: "center", assetName: "hq_v2.png" },
  quartel: { ...BUILDING_SLOTS.BARRACKS, id: "BARRACKS", w: 100, h: 110, anchor: "center", assetName: "quartel_v2.png" },
  aerodromo: { ...BUILDING_SLOTS.AIRPORT, id: "AIRPORT", w: 140, h: 120, anchor: "center", assetName: "aerodromo_v1.png" },
  muralha: { ...BUILDING_SLOTS.WALL, id: "WALL", w: 320, h: 200, anchor: "center", assetName: "muralha_v2.png" },
  mina_metal: { x: 135, y: 185, id: "METAL_MINE", w: 80, h: 80, anchor: "center", assetName: "mina_v1.png" },
  mina_suprimentos: { x: 268, y: 415, id: "SUPPLY_MINE", w: 80, h: 80, anchor: "center", assetName: "mina_v1.png" },
  refinaria: { x: 665, y: 185, id: "REFINERY", w: 90, h: 90, anchor: "center", assetName: "refinaria_v1.png" },
  housing: { x: 665, y: 415, id: "HOUSING", w: 80, h: 80, anchor: "center", assetName: "housing_v1.png" },
  posto_recrutamento: { x: 400, y: 185, id: "RECRUITMENT", w: 90, h: 90, anchor: "center", assetName: "recrutamento_v1.png" }
};
const BuildingNode = ({
  type,
  level,
  layout,
  onClick,
  isConstructing
}) => {
  const [isInvalid, setIsInvalid] = reactExports.useState(false);
  const w = layout.w;
  const h = layout.h;
  const currentOffset = BUILDING_OFFSETS[layout.id] || { x: 0, y: 0, rotation: 0 };
  const rotation = currentOffset.rotation || 0;
  const left = layout.x - w / 2 + (currentOffset.x || 0);
  const top = layout.y - h + (currentOffset.y || 0);
  const assetPath = `/assets/buildings/${layout.assetName || type.toLowerCase() + ".png"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "building-node group",
      onClick,
      whileHover: { scale: 1.05, zIndex: 1e3 },
      style: {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${w}px`,
        height: `${h}px`,
        zIndex: Math.floor(layout.y),
        filter: isInvalid ? "sepia(1) hue-rotate(-50deg) saturate(2)" : "none",
        opacity: isInvalid ? 0.6 : 1,
        cursor: "pointer",
        transform: rotation ? `rotate(${rotation}deg)` : "none"
      },
      children: [
        isConstructing && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] },
            transition: { repeat: Infinity, duration: 2 },
            className: "absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", width: "100%", height: "100%" }, children: !isInvalid ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: assetPath,
            alt: type,
            style: {
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
              filter: isConstructing ? "grayscale(0.5) brightness(0.7)" : "none"
            },
            onError: () => setIsInvalid(true)
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-full h-full bg-red-900/10 border border-red-500/50 text-[10px] text-red-500", children: "ERR_ASSET" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: "-20px",
          left: "50%",
          transform: `translateX(-50%) rotate(${-rotation}deg)`,
          background: isConstructing ? "rgba(234, 179, 8, 0.9)" : "rgba(0, 0, 0, 0.85)",
          color: isConstructing ? "#000" : "#fff",
          padding: "2px 10px",
          borderRadius: "4px",
          fontSize: "10px",
          fontWeight: "bold",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
          textTransform: "uppercase",
          zIndex: 20
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isConstructing ? "opacity-80" : "opacity-60", children: type.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 ${isConstructing ? "font-black" : "text-cyan-400"}`, children: isConstructing ? "EM OBRA" : `LVL ${level}` })
        ] })
      ]
    }
  );
};
const VisualVillageView = ({ base, onBuildingClick, gameConfig, buildingQueue }) => {
  const containerRef = U.useRef(null);
  const [scale, setScale] = U.useState(1);
  U.useEffect(() => {
    const updateScale = () => {
      var _a;
      if (containerRef.current) {
        const parentWidth = ((_a = containerRef.current.parentElement) == null ? void 0 : _a.clientWidth) || 0;
        if (parentWidth < 800) {
          setScale(parentWidth / 800);
        } else {
          setScale(1);
        }
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "w-full flex flex-col items-center py-6 lg:py-12 bg-[#050608] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        id: "VillageCanvas",
        className: "village-root shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-gray-900/50",
        style: {
          position: "relative",
          width: "800px",
          height: "600px",
          margin: "0 auto",
          borderRadius: "12px",
          backgroundColor: "#0a0c10",
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          marginBottom: `-${600 * (1 - scale)}px`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                    .village-root {
                        all: initial;
                        position: relative;
                        display: block;
                        width: 800px;
                        height: 600px;
                        margin: 0 auto;
                        box-sizing: border-box;
                        overflow: hidden;
                    }
                    .village-root * {
                        box-sizing: border-box;
                        background: transparent !important;
                    }
                    .village-root div {
                        position: absolute;
                    }
                    .village-root .building-node {
                        pointer-events: auto;
                    }
                    .building-node:hover {
                        filter: brightness(1.2) drop-shadow(0 0 10px rgba(0, 255, 255, 0.2)) !important;
                    }
                ` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, zIndex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/images/village/terrain_v22.png",
              style: { width: "800px", height: "600px", objectFit: "fill" },
              alt: "Tactical Terrain V22"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }, children: Object.entries(BUILDING_LAYOUT).map(([type, layout]) => {
            var _a, _b;
            const b = (_a = base.edificios) == null ? void 0 : _a.find((e) => {
              var _a2;
              const eType = (_a2 = e.buildingType || e.tipo) == null ? void 0 : _a2.toLowerCase();
              const lType = type.toLowerCase();
              if (eType !== lType) return false;
              if (!e.pos_x || Number(e.pos_x) < 50) return true;
              return Number(e.pos_x) === layout.x && Number(e.pos_y) === layout.y;
            });
            const level = (b == null ? void 0 : b.nivel) || 0;
            const isConstructing = (buildingQueue || []).some(
              (q) => q.type === type && q.pos_x === layout.x && q.pos_y === layout.y
            );
            const config = (_b = gameConfig == null ? void 0 : gameConfig.buildings) == null ? void 0 : _b[type];
            if (level === 0 && !isConstructing) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              BuildingNode,
              {
                type,
                level,
                layout,
                isConstructing,
                onClick: () => onBuildingClick({
                  ...b,
                  id: (b == null ? void 0 : b.id) || null,
                  buildingType: type,
                  name: (config == null ? void 0 : config.name) || type,
                  level,
                  pos_x: layout.x,
                  pos_y: layout.y
                })
              },
              `${type}-${layout.x}-${layout.y}`
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-cyan-500 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]", children: "Sincronização Tática V22 - Operacional" })
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
const calculateBuildingCost = (baseAmount, currentLevel) => {
  return Math.floor(baseAmount * Math.pow(1.6, currentLevel));
};
const calculateConstructionTime = (timeBase, currentLevel) => {
  const time = timeBase * Math.pow(1.1, currentLevel);
  return Math.max(5, Math.floor(time));
};
const parseResourceValue = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    return parseFloat(val.replace(/[^\d.-]/g, "")) || 0;
  }
  return 0;
};
const getBuildingAsset = (type, level = 1) => {
  if (!type) return "/assets/placeholders/building_unknown.svg";
  const t = type.toLowerCase();
  if (level === "blueprint") {
    return "/images/building_blueprint_placeholder.png";
  }
  let assetFolder = t;
  if (t === "mina_metal") assetFolder = "factory";
  if (t === "central_energia") assetFolder = "solar";
  return `/images/edificios/${assetFolder}/lvl_${level}.png`;
};
const getUnitAsset = (type) => {
  if (!type) return "/assets/placeholders/unit_unknown.svg";
  const t = type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `/images/unidades/${t}.png`;
};
const BuildingModal = ({
  isOpen,
  onClose,
  building,
  gameConfig,
  onUpgrade,
  onTrain,
  isUpgrading,
  isTraining,
  population,
  unitTypes
}) => {
  var _a;
  if (!building) return null;
  const buildingsConfig = (gameConfig == null ? void 0 : gameConfig.buildings) || {};
  const config = buildingsConfig[building.buildingType] || {
    name: building.nome || "Estrutura Desconhecida",
    cost: {},
    time_base: 0,
    description: "Informação tática indisponível para este setor."
  };
  (building.nivel || 0) + 1;
  const isBuilt = (building.nivel || 0) > 0;
  const [usePlaceholder, setUsePlaceholder] = reactExports.useState(false);
  const [trainQty, setTrainQty] = reactExports.useState(1);
  const [selectedUnit, setSelectedUnit] = reactExports.useState(null);
  const currentImage = usePlaceholder ? getBuildingAsset(building.buildingType, "blueprint") : getBuildingAsset(building.buildingType, isBuilt ? getEvolutionLevelAsset(building.nivel) : 1);
  reactExports.useEffect(() => {
    if (building) {
      setTrainQty(1);
      setSelectedUnit(null);
    }
    setUsePlaceholder(false);
  }, [building.buildingType, building.nivel]);
  const renderCost = (resourceType, baseAmount) => {
    var _a2, _b;
    if (!baseAmount) return null;
    const totalCost = calculateBuildingCost(baseAmount, building.nivel || 0);
    const playerAmount = parseResourceValue(((_b = (_a2 = building.base) == null ? void 0 : _a2.recursos) == null ? void 0 : _b[resourceType]) || 0);
    const hasEnough = playerAmount >= totalCost;
    const resourceIcons = { "suprimentos": "📦", "combustivel": "⛽", "municoes": "🚀", "pessoal": "👤" };
    const resourceColors = { "suprimentos": "text-sky-400", "combustivel": "text-orange-400", "municoes": "text-red-400", "pessoal": "text-emerald-400" };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between bg-black/40 p-3.5 rounded-2xl border ${hasEnough ? "border-white/5" : "border-red-500/30"} group transition-all hover:bg-white/[0.02]`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm grayscale group-hover:grayscale-0 transition-all", children: resourceIcons[resourceType] || "💎" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase text-neutral-500 font-black tracking-widest", children: resourceType })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-mono font-black ${hasEnough ? resourceColors[resourceType] : "text-red-500"}`, children: totalCost.toLocaleString() })
    ] }, resourceType);
  };
  const totalTime = calculateConstructionTime(config.time_base, building.nivel || 0);
  const timeFormatted = `${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`;
  const canAfford = config.cost ? Object.entries(config.cost).every(([type, amount]) => {
    var _a2, _b;
    const cost = calculateBuildingCost(type === "pessoal" ? 0 : amount, building.nivel || 0);
    return type === "pessoal" ? ((population == null ? void 0 : population.available) ?? 0) >= amount : parseResourceValue(((_b = (_a2 = building.base) == null ? void 0 : _a2.recursos) == null ? void 0 : _b[type]) || 0) >= cost;
  }) : true;
  const tipoLower = (_a = building.buildingType) == null ? void 0 : _a.toLowerCase();
  const isMilitary = ["quartel", "aerodromo"].includes(tipoLower);
  const availableUnits = isMilitary ? (unitTypes || []).filter((ut) => {
    const k = ut.name.toLowerCase();
    if (tipoLower === "quartel") return ["infantaria", "blindado", "tanque", "agente", "politico"].some((s) => k.includes(s));
    if (tipoLower === "aerodromo") return ["helicoptero", "drone"].some((s) => k.includes(s));
    return false;
  }) : [];
  reactExports.useEffect(() => {
    if (isMilitary && availableUnits.length > 0 && !selectedUnit) setSelectedUnit(availableUnits[0].name);
  }, [building.buildingType, isMilitary, availableUnits]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl bg-[#020406] border-white/10 text-white overflow-hidden backdrop-blur-3xl p-0 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[90vh] md:h-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-[45%] bg-[#050709] relative flex flex-col items-center justify-center p-10 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-[0.03] pointer-events-none", style: { backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed transition-all duration-1000 ${isBuilt ? "border-sky-500/20 animate-[spin_20s_linear_infinite]" : "border-orange-500/20 animate-pulse"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `absolute top-8 left-8 ${isBuilt ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"} font-black px-5 py-2.5 rounded-full text-[10px] tracking-widest uppercase flex items-center gap-3 backdrop-blur-xl`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full animate-pulse ${isBuilt ? "bg-sky-500 shadow-[0_0_10px_#0ea5e9]" : "bg-orange-500 shadow-[0_0_10px_#f97316]"}` }),
        isBuilt ? "SISTEMA_OPERACIONAL" : "ASSINATURA_PLANEADA"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "relative z-10 group cursor-crosshair", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 blur-[80px] opacity-20 group-hover:opacity-40 transition-all ${isBuilt ? "bg-sky-500" : "bg-orange-500"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: currentImage,
            className: "w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-700",
            alt: config.name,
            onError: () => setUsePlaceholder(true)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 w-full space-y-4 z-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-1", children: "Nível de Autorização" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl font-black text-white italic tracking-tighter leading-none", children: building.nivel || 0 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 justify-center", children: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 rounded-full transition-all duration-500 ${i <= (building.nivel % 8 || 0) ? "w-6 bg-sky-500" : "w-2 bg-white/5"}` }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-black/40 to-transparent relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 overflow-y-auto pr-4 custom-scrollbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-sky-500/10 rounded-xl border border-sky-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { size: 16, className: "text-sky-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-sky-500/60 uppercase tracking-[0.4em]", children: [
              "Protocolo_",
              tipoLower
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-4xl md:text-5xl font-black uppercase tracking-tighter text-white", children: config.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-neutral-400 font-medium leading-relaxed max-w-md", children: config.description })
        ] }),
        isMilitary ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14, className: "text-emerald-500" }),
            " Mobilização_Batalhão"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: availableUnits.map((unit) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setSelectedUnit(unit.name),
              className: `p-4 rounded-[1.5rem] border transition-all flex items-center gap-4 relative overflow-hidden group ${selectedUnit === unit.name ? "bg-emerald-500/10 border-emerald-500/40 shadow-2xl" : "bg-black/40 border-white/5 hover:border-white/20"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getUnitAsset(unit.name), className: "w-10 h-10 object-contain brightness-75 group-hover:brightness-110", alt: unit.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start translate-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-white", children: unit.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-mono text-neutral-500", children: [
                    unit.build_time,
                    "s"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-4 text-[12px] font-black text-emerald-500 opacity-60", children: [
                  "#",
                  unit.id
                ] })
              ]
            },
            unit.id
          )) }),
          selectedUnit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 p-6 rounded-[2rem] border border-white/5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase font-black text-neutral-500 tracking-widest", children: "Contingente_Mobilizado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: trainQty, onChange: (e) => setTrainQty(Math.max(1, parseInt(e.target.value))), className: "bg-transparent border-none text-right font-mono text-emerald-400 font-black text-xl w-24 focus:ring-0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onTrain(selectedUnit, trainQty), disabled: isTraining, className: "w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all", children: isTraining ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : "Confirmar_Diretiva_Mobilização" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { size: 14, className: "text-orange-500" }),
              " Logística_Estrutural"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-[9px] font-black text-orange-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
              " ",
              timeFormatted
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: config.cost && Object.entries(config.cost).map(([type, amount]) => renderCost(type, amount)) })
        ] })
      ] }),
      !isMilitary && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => onUpgrade(building.buildingType),
          disabled: isUpgrading || !canAfford,
          className: `w-full h-20 md:h-24 font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl relative overflow-hidden transition-all active:scale-[0.98] ${canAfford ? "bg-sky-600 hover:bg-sky-500 text-white" : "bg-neutral-900 text-neutral-700 cursor-not-allowed border border-white/5"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 z-10 transition-transform group-hover:scale-105", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: isUpgrading ? "TRANSMITINDO_DADOS..." : canAfford ? building.nivel === 0 ? "CONSTRUIR_SETOR" : "UPGRADE_ESTRUTURAL" : "INSOLVÊNCIA_TÉCNICA" }),
              canAfford && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] opacity-60 tracking-[0.5em]", children: [
                "Autorizar_Execução_Nível_",
                building.nivel + 1
              ] })
            ] }),
            canAfford && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" })
          ]
        }
      ) })
    ] })
  ] }) });
};
const Card = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("rounded-lg border bg-card text-card-foreground shadow-xs", className), ...props }));
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props }));
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-2xl font-semibold leading-none tracking-tight", className), ...props }));
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props }));
CardFooter.displayName = "CardFooter";
const GarrisonPanel = ({
  tropas = [],
  reinforcements = [],
  stationedOutside = [],
  gameConfig
}) => {
  const [activeTab, setActiveTab] = reactExports.useState("local");
  const unitsConfig = (gameConfig == null ? void 0 : gameConfig.units) || {};
  const handleRecall = (id) => {
    if (confirm("Deseja retirar estas tropas e trazê-las de volta?")) {
      Sr.post(`/reinforcements/recall/${id}`, {}, {
        onSuccess: () => {
        }
      });
    }
  };
  const renderUnitList = (items, type) => {
    if (!items || items.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-16 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01] relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "mx-auto text-neutral-800 mb-4 opacity-20", size: 40 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase font-black text-neutral-600 tracking-[0.4em] block", children: "Sem Unidades Detetadas" })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: items.map((t, idx) => {
      var _a, _b, _c, _d, _e;
      const unitName = type === "local" ? t.tipo : ((_a = t.type) == null ? void 0 : _a.name) || "unidade";
      const quantity = type === "local" ? t.quantidade : t.quantity;
      const config = unitsConfig[unitName] || {};
      const displayName = config.name || unitName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          className: "bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-black/40 rounded-xl border border-white/10 p-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: getUnitAsset(unitName),
                  className: "w-full h-full object-contain",
                  alt: displayName
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black uppercase text-white tracking-widest", children: displayName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-emerald-400 font-bold", children: quantity.toLocaleString() }),
                  type !== "local" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] text-neutral-500 uppercase font-bold", children: type === "received" ? `De: ${(_c = (_b = t.origin_base) == null ? void 0 : _b.jogador) == null ? void 0 : _c.username}` : `Em: ${(_e = (_d = t.target_base) == null ? void 0 : _d.jogador) == null ? void 0 : _e.username}` })
                ] })
              ] })
            ] }),
            type === "sent" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => handleRecall(t.id),
                className: "h-8 px-3 text-[8px] font-black uppercase bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 12, className: "mr-1" }),
                  " Retirar"
                ]
              }
            )
          ]
        },
        idx
      );
    }) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#050709]/60 border-white/5 backdrop-blur-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[2rem] relative group border-t-emerald-500/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 border-b border-white/5 bg-white/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.3em] text-neutral-400 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-emerald-500", size: 16 }),
        "Logística de Guarnição"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5", children: [
        { id: "local", label: "Local", count: tropas.length },
        { id: "received", label: "Aliados", count: reinforcements.length },
        { id: "sent", label: "No Estrangeiro", count: stationedOutside.length }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-neutral-500 hover:text-white hover:bg-white/5"}`,
          children: [
            tab.label,
            " ",
            tab.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-50", children: [
              "[",
              tab.count,
              "]"
            ] })
          ]
        },
        tab.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-6 min-h-[200px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -10 },
          transition: { duration: 0.2 },
          children: [
            activeTab === "local" && renderUnitList(tropas, "local"),
            activeTab === "received" && renderUnitList(reinforcements, "received"),
            activeTab === "sent" && renderUnitList(stationedOutside, "sent")
          ]
        },
        activeTab
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] font-mono text-neutral-500 tracking-[0.5em] uppercase", children: "Tactical_Garrison_Interface_V.4.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 bg-emerald-500/30 rounded-full" }, i)) })
      ] })
    ] })
  ] });
};
const ProductionQueue = ({
  construcoes = [],
  treinos = [],
  gameConfig
}) => {
  const unifiedQueue = [
    ...construcoes.map((c) => ({
      id: c.id,
      buildingType: "construcao",
      label: (c.buildingType || c.type || "Estrutura").replace(/_/g, " "),
      sublabel: `Upgrade para Nível ${c.target_level}`,
      started_at: c.started_at,
      ends_at: c.finishes_at,
      duration: c.duration || 0,
      position: c.position || 1,
      status: c.status || "active"
    })),
    ...treinos.map((t) => {
      var _a;
      return {
        id: t.id,
        buildingType: "treino",
        label: (((_a = t.unitType) == null ? void 0 : _a.name) || t.unidade || "Unidade").replace(/_/g, " "),
        sublabel: `Recrutamento: ${t.quantity_remaining || t.quantity || t.quantidade}x`,
        started_at: t.started_at,
        ends_at: t.finishes_at,
        duration: t.duration_per_unit || t.total_duration / t.quantity || 0,
        position: t.position || 1,
        status: t.status || "active",
        quantity: t.quantity,
        quantity_remaining: t.quantity_remaining
      };
    })
  ].sort((a, b) => a.position - b.position);
  const handleCancel = (id, type) => {
    if (type === "construcao") {
      Sr.post(`/base/upgrade/cancelar/${id}`);
    } else {
      Sr.post(`/units/cancelar/${id}`);
    }
  };
  const handleMoveUp = (id, type) => {
    if (type === "construcao") {
      Sr.post(`/base/upgrade/subir/${id}`);
    } else {
      Sr.post(`/units/subir/${id}`);
    }
  };
  const handleMoveDown = (id, type) => {
    if (type === "construcao") {
      Sr.post(`/base/upgrade/descer/${id}`);
    } else {
      Sr.post(`/units/descer/${id}`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-black/40 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group border-t-sky-500/30 border-t-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 bg-white/[0.02] border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "text-sky-500 animate-pulse", size: 16 }),
      "Centro de Logística de Fila"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: unifiedQueue.length > 0 ? unifiedQueue.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      QueueItem,
      {
        item,
        isFirst: item.position === 1,
        onCancel: () => handleCancel(item.id, item.buildingType),
        onMoveUp: () => handleMoveUp(item.id, item.buildingType),
        onMoveDown: () => handleMoveDown(item.id, item.buildingType),
        isLast: index === unifiedQueue.length - 1
      },
      `${item.buildingType}-${item.id}`
    )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "text-center py-10 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "mx-auto text-neutral-800 mb-3 opacity-20", size: 32 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase font-black text-neutral-600 tracking-[0.2em] block", children: "Sem Operações de Engenharia ou Mobilização" })
        ]
      }
    ) }) })
  ] });
};
const QueueItem = ({ item, isFirst, onCancel, onMoveUp, onMoveDown, isLast }) => {
  const [currentTime, setCurrentTime] = reactExports.useState((/* @__PURE__ */ new Date()).getTime());
  const [hasTriggeredReload, setHasTriggeredReload] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setCurrentTime((/* @__PURE__ */ new Date()).getTime()), 1e3);
    return () => clearInterval(timer);
  }, []);
  const calculateProgress = () => {
    if (!isFirst || !item.ends_at) {
      const h2 = Math.floor(item.duration / 3600);
      const m2 = Math.floor(item.duration % 3600 / 60);
      const s2 = item.duration % 60;
      return { percent: 0, timeStr: `Aguardando (${h2 > 0 ? h2 + "h " : ""}${m2}m ${s2}s)` };
    }
    const start = new Date(item.started_at).getTime();
    const end = new Date(item.ends_at).getTime();
    const now = currentTime;
    const total = end - start;
    const remaining = end - now;
    const h = Math.max(0, Math.floor(remaining / 36e5));
    const m = Math.max(0, Math.floor(remaining % 36e5 / 6e4));
    const s = Math.max(0, Math.floor(remaining % 6e4 / 1e3));
    const timeStr2 = remaining <= 0 ? "Concluindo..." : h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
    const percent2 = Math.min(100, Math.max(0, (total - remaining) / total * 100));
    return { percent: percent2, timeStr: timeStr2 };
  };
  const { percent, timeStr } = calculateProgress();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
      className: `group relative p-4 rounded-xl transition-all duration-300 ${isFirst ? "bg-white/[0.05] border border-white/10" : "bg-black/20 border border-white/5 opacity-60 hover:opacity-100"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-8 rounded-lg flex items-center justify-center ${isFirst ? "bg-sky-500/20 text-sky-400" : "bg-neutral-800 text-neutral-500"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black", children: item.position }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black uppercase text-white tracking-tighter flex items-center gap-2", children: [
                item.buildingType === "construcao" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 10, className: "text-emerald-400" }),
                item.label,
                isFirst && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-neutral-500 font-bold uppercase tracking-wider", children: item.sublabel })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
            !isFirst && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onMoveUp,
                className: "p-1.5 hover:bg-white/10 rounded-md text-neutral-400 hover:text-white transition-colors",
                title: "Subir Prioridade",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 })
              }
            ),
            !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onMoveDown,
                className: "p-1.5 hover:bg-white/10 rounded-md text-neutral-400 hover:text-white transition-colors",
                title: "Descer Prioridade",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onCancel,
                className: "p-1.5 hover:bg-red-500/20 rounded-md text-neutral-500 hover:text-red-500 transition-colors",
                title: "Abortar Projeto",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-black text-white/40 uppercase tracking-widest", children: item.buildingType === "construcao" ? "Engenharia" : "Mobilização" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-mono font-black ${isFirst ? "text-sky-400" : "text-neutral-600"}`, children: timeStr })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: `absolute inset-y-0 left-0 ${isFirst ? item.buildingType === "construcao" ? "bg-sky-500 shadow-[0_0_10px_#0ea5e9]" : "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-neutral-800"}`,
              initial: { width: 0 },
              animate: { width: `${percent}%` },
              transition: { duration: 0.5 }
            }
          ) })
        ] })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ataquesRecebidos == null ? void 0 : ataquesRecebidos.map((movement) => {
        var _a, _b;
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: ((_b = (_a = movement.origin) == null ? void 0 : _a.jogador) == null ? void 0 : _b.username) || "REBELDES" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 bg-red-500 rounded-full animate-ping" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-2xl font-black text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]", children: [
                  "-",
                  getTimeLeft(movement.arrival_time)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[7px] text-neutral-600 font-black uppercase tracking-[0.2em] opacity-50", children: "Tempo até Impacto" })
              ] })
            ]
          },
          movement.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ataquesEnviados == null ? void 0 : ataquesEnviados.map((movement) => {
        var _a, _b, _c;
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
                    movement.type.toUpperCase(),
                    " / Alvo: ",
                    ((_b = (_a = movement.target) == null ? void 0 : _a.jogador) == null ? void 0 : _b.username) || ((_c = movement.target) == null ? void 0 : _c.nome) || "SETOR DESCONHECIDO"
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-black text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]", children: getTimeLeft(movement.arrival_time) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] text-neutral-600 font-black uppercase tracking-[0.2em]", children: "ETR_TIME" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 8, className: "text-sky-500 animate-slide-right" })
                ] })
              ] })
            ]
          },
          movement.id
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
const TILE_SIZE = 80;
const VIEWPORT_RANGE = 7;
const getTerrain = (tx, ty) => {
  if (ty < 0 || ty > 1e3 || tx < 0 || tx > 1e3) return "water";
  if (ty < 3 || ty > 997 || tx < 3 || tx > 997) return "water";
  const noise = (Math.sin(tx * 0.12) + Math.cos(ty * 0.15) + Math.sin(tx * 0.3 + ty * 0.2)) / 3;
  if (noise > 0.53) return "mountain";
  if (noise < -0.45) return "desert";
  if (noise < -0.65) return "water";
  return "grass";
};
function WorldMapView({ playerBase, troops = [], gameConfig, unitTypes, diplomaties = [], myAllianceId }) {
  var _a, _b, _c, _d, _e, _f;
  const [center, setCenter] = reactExports.useState({ x: (playerBase == null ? void 0 : playerBase.coordenada_x) || 50, y: (playerBase == null ? void 0 : playerBase.coordenada_y) || 50 });
  const [selectedSector, setSelectedSector] = reactExports.useState(null);
  const [searchCoords, setSearchCoords] = reactExports.useState({ x: "", y: "" });
  const [isAttackModalOpen, setIsAttackModalOpen] = reactExports.useState(false);
  const [zoom, setZoom] = reactExports.useState(1);
  const [selectedUnit, setSelectedUnit] = reactExports.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = reactExports.useState(true);
  const { entities: gameEntities, globalState } = useGameEntities();
  const allBases = globalState.worldMapBases;
  const mapRef = reactExports.useRef(null);
  const [dragOffset, setDragOffset] = reactExports.useState({ x: 0, y: 0 });
  const handleWheel = (e) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 2));
  };
  const jumpTo = (x, y, base) => {
    setCenter({ x, y });
    setSelectedSector({ x, y, base });
    setDragOffset({ x: 0, y: 0 });
  };
  const handleSearch = () => {
    const nx = parseInt(searchCoords.x);
    const ny = parseInt(searchCoords.y);
    if (!isNaN(nx) && !isNaN(ny)) jumpTo(nx, ny, allBases.find((b) => b.coordenada_x === nx && b.coordenada_y === ny));
  };
  const jumpToPlayer = () => {
    if (playerBase) jumpTo(playerBase.coordenada_x, playerBase.coordenada_y, playerBase);
  };
  const handleSendAttack = (params) => {
    if (!playerBase) return;
    eventBus.emit(Events.ATTACK_LAUNCH, {
      originX: playerBase.coordenada_x,
      originY: playerBase.coordenada_y,
      targetX: params.destino_x,
      targetY: params.destino_y,
      ownerId: playerBase.ownerId,
      troops: params.tropas,
      backendParams: { ...params, origem_id: playerBase.id }
    });
    setIsAttackModalOpen(false);
    toast.success("ORDEM TRANSMITIDA: Tropas em movimento.");
  };
  const tilesToRender = reactExports.useMemo(() => {
    const tiles = [];
    const startX = Math.floor(center.x - VIEWPORT_RANGE);
    const endX = Math.ceil(center.x + VIEWPORT_RANGE);
    const startY = Math.floor(center.y - VIEWPORT_RANGE);
    const endY = Math.ceil(center.y + VIEWPORT_RANGE);
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        tiles.push({ x, y });
      }
    }
    return tiles;
  }, [center]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-[800px] w-full gap-0 overflow-hidden rounded-[3rem] border border-white/10 bg-[#05080f] shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: mapRef,
        className: "absolute inset-0 z-0 cursor-grab active:cursor-grabbing overflow-hidden",
        onWheel: handleWheel,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            drag: true,
            dragMomentum: false,
            style: {
              width: "100%",
              height: "100%",
              transform: `scale(${zoom})`,
              transformOrigin: "center center"
            },
            className: "relative",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: tilesToRender.map(({ x, y }) => {
                const baseAt = allBases.find((b) => b.coordenada_x === x && b.coordenada_y === y);
                const isSelected = (selectedSector == null ? void 0 : selectedSector.x) === x && (selectedSector == null ? void 0 : selectedSector.y) === y;
                const terrain = getTerrain(x, y);
                const isPlayer = (baseAt == null ? void 0 : baseAt.ownerId) === (playerBase == null ? void 0 : playerBase.ownerId);
                const baseAllianceId = baseAt == null ? void 0 : baseAt.aliancaId;
                const dip = diplomaties.find((d) => d.target_alianca_id === baseAllianceId && d.status === "ACCEPTED");
                const isAlly = baseAllianceId && (baseAllianceId === myAllianceId || (dip == null ? void 0 : dip.tipo) === "ALLY");
                const isNAP = (dip == null ? void 0 : dip.tipo) === "NAP";
                const isEnemy = (dip == null ? void 0 : dip.tipo) === "ENEMY" || (baseAt == null ? void 0 : baseAt.ownerId) && !isAlly && !isNAP && !isPlayer;
                const isRebel = baseAt && !baseAt.ownerId;
                const left = (x - center.x + VIEWPORT_RANGE) * TILE_SIZE;
                const top = (y - center.y + VIEWPORT_RANGE) * TILE_SIZE;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onClick: () => jumpTo(x, y, baseAt),
                    className: `absolute transition-all duration-300 group
                                        ${isSelected ? "z-20 ring-4 ring-sky-500 ring-offset-4 ring-offset-black/50" : "hover:brightness-125"}
                                    `,
                    style: {
                      left,
                      top,
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      backgroundImage: `url(/assets/terrains/${terrain}.png)`,
                      backgroundSize: "cover"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-1 left-1 font-mono text-[7px] text-white/20 select-none", children: [
                        x,
                        ":",
                        y
                      ] }),
                      baseAt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          initial: { scale: 0 },
                          animate: { scale: 1 },
                          className: `p-1 rounded-xl border-2 backdrop-blur-md relative shadow-2xl transition-all duration-500
                                                    ${isPlayer ? "bg-sky-500/30 border-sky-400/50 shadow-sky-500/20" : ""}
                                                    ${isAlly && !isPlayer ? "bg-cyan-500/30 border-cyan-400/50 shadow-cyan-500/20" : ""}
                                                    ${isNAP ? "bg-purple-500/30 border-purple-400/50 shadow-purple-500/20" : ""}
                                                    ${isEnemy ? "bg-red-500/30 border-red-400/50 shadow-red-500/20" : ""}
                                                    ${isRebel ? "bg-amber-600/30 border-amber-400/50 shadow-amber-600/20" : ""}
                                                `,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: "/assets/structures/base.png",
                                className: "w-12 h-12 object-contain",
                                style: {
                                  filter: isPlayer ? "drop-shadow(0 0 10px #0ea5e9)" : isAlly ? "drop-shadow(0 0 10px #06b6d4)" : isNAP ? "drop-shadow(0 0 10px #a855f7)" : isEnemy ? "drop-shadow(0 0 10px #ef4444)" : "drop-shadow(0 0 10px #f59e0b)"
                                }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white/40 shadow-lg animate-pulse 
                                                    ${isPlayer ? "bg-sky-500" : isAlly ? "bg-cyan-500" : isNAP ? "bg-purple-500" : isEnemy ? "bg-red-500" : "bg-amber-500"}` })
                          ]
                        }
                      ) })
                    ]
                  },
                  `${x}:${y}`
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none z-30", children: gameEntities.map((e) => {
                const left = (e.x - center.x + VIEWPORT_RANGE) * TILE_SIZE;
                const top = (e.y - center.y + VIEWPORT_RANGE) * TILE_SIZE;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: { left, top },
                    className: "absolute flex items-center justify-center",
                    style: { width: TILE_SIZE, height: TILE_SIZE },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-8 h-8 rounded-lg bg-black/80 border border-orange-500 flex items-center justify-center rotate-45 shadow-orange-500/20 shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 14, className: "-rotate-45 text-orange-400" }) })
                  },
                  e.id
                );
              }) })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute left-6 top-6 bottom-6 z-40 transition-all duration-500 flex gap-4 ${isSidebarOpen ? "w-[320px]" : "w-0"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex-1 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-white/5 bg-white/5 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 18, className: "text-orange-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-white", children: "Objetivos Táticos" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-neutral-500", children: [
            allBases.length,
            " NÓS"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto custom-scrollbar p-3 space-y-1", children: allBases.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => jumpTo(b.coordenada_x, b.coordenada_y, b),
            className: `w-full group px-4 py-3 rounded-2xl border transition-all flex items-center justify-between
                                    ${(selectedSector == null ? void 0 : selectedSector.x) === b.coordenada_x && (selectedSector == null ? void 0 : selectedSector.y) === b.coordenada_y ? "bg-sky-500 border-sky-400 text-white" : "bg-white/5 border-transparent hover:bg-white/10 text-neutral-400 hover:text-white"}
                                `,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase truncate max-w-[120px]", children: b.nome }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-mono opacity-60", children: [
                  "[",
                  b.coordenada_x,
                  ":",
                  b.coordenada_y,
                  "]"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                !b.ownerId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-black", children: "REBEL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "opacity-20 group-hover:opacity-100 transition-opacity" })
              ] })
            ]
          },
          b.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-black/40 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "bg-white/5 border-white/10 h-8 text-[10px] uppercase font-black",
              placeholder: "X",
              value: searchCoords.x,
              onChange: (e) => setSearchCoords((prev) => ({ ...prev, x: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "bg-white/5 border-white/10 h-8 text-[10px] uppercase font-black",
              placeholder: "Y",
              value: searchCoords.y,
              onChange: (e) => setSearchCoords((prev) => ({ ...prev, y: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", className: "h-8 w-12 bg-sky-600 hover:bg-sky-500", onClick: handleSearch, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14 }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setIsSidebarOpen(!isSidebarOpen),
          className: "self-center bg-black/80 backdrop-blur-xl border border-white/10 w-8 h-12 rounded-xl flex items-center justify-center hover:bg-sky-600 transition-colors group",
          children: isSidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-20 max-w-5xl pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedSector && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 },
          className: "w-full bg-black/80 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between pointer-events-auto ring-1 ring-white/5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-2xl border-2 backdrop-blur-lg
                                    ${((_a = selectedSector.base) == null ? void 0 : _a.ownerId) === (playerBase == null ? void 0 : playerBase.ownerId) ? "bg-sky-500/10 border-sky-500/40 text-sky-400" : "bg-red-500/10 border-red-500/40 text-red-400"}
                                `, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/structures/base.png", className: "w-12 h-12 object-contain" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-white uppercase tracking-tighter", children: ((_b = selectedSector.base) == null ? void 0 : _b.nome) || "Sector de Exploração" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-sky-400 border border-white/5", children: [
                    "[",
                    selectedSector.x,
                    ":",
                    selectedSector.y,
                    "]"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-[10px] font-black uppercase text-neutral-500 tracking-[0.15em]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 12, className: "text-orange-500" }),
                    "Terrain: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: getTerrain(selectedSector.x, selectedSector.y) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 bg-white/10 rounded-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 12, className: "text-sky-500" }),
                    "Stability: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
                      ((_c = selectedSector.base) == null ? void 0 : _c.loyalty) ?? 100,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 bg-white/10 rounded-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12, className: "text-neutral-400" }),
                    "Intel: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: ((_e = (_d = selectedSector.base) == null ? void 0 : _d.jogador) == null ? void 0 : _e.username) || "NEUTRAL" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "border-white/10 hover:bg-white/10 text-[10px] font-black uppercase px-8 py-6 rounded-2xl text-neutral-400",
                  onClick: () => setSelectedSector(null),
                  children: "Fugir"
                }
              ),
              !((_f = selectedSector.base) == null ? void 0 : _f.ownerId) || selectedSector.base.ownerId !== (playerBase == null ? void 0 : playerBase.ownerId) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-10 py-6 rounded-2xl shadow-xl shadow-red-600/30",
                  onClick: () => setIsAttackModalOpen(true),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "mr-3", size: 16 }),
                    " Lançar Assalto"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: true, className: "bg-sky-600/20 text-sky-400 border-sky-500/20 text-[10px] font-black uppercase px-10 py-6 rounded-2xl", children: "Zona Aliada" })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-8 shadow-2xl pointer-events-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => zoom > 0.5 && setZoom((z) => z - 0.2), className: "text-neutral-400", children: "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] text-neutral-500 font-black uppercase tracking-widest mb-1", children: "Satellite_Link_Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono text-sky-400", children: [
            "MAGNIFICATION_LVL: ",
            (zoom * 100).toFixed(0),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => zoom < 1.8 && setZoom((z) => z + 0.2), className: "text-neutral-400", children: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-white/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: jumpToPlayer,
            className: "bg-sky-600/20 hover:bg-sky-600/40 text-sky-400 border border-sky-500/20 rounded-xl px-4 py-1.5 text-[9px] font-black uppercase",
            children: "Home Target"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttackModal,
      {
        isOpen: isAttackModalOpen,
        onClose: () => setIsAttackModalOpen(false),
        origemBase: playerBase,
        destinoBase: (selectedSector == null ? void 0 : selectedSector.base) || { coordenada_x: selectedSector == null ? void 0 : selectedSector.x, coordenada_y: selectedSector == null ? void 0 : selectedSector.y, nome: "Sector Vazio" },
        tropasDisponiveis: troops,
        gameConfig,
        unitTypes,
        onEnviar: handleSendAttack,
        isSending: false
      }
    )
  ] });
}
const UnitQueue = ({ queue = [] }) => {
  const [now, setNow] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(timer);
  }, []);
  const sortedQueue = [...queue].sort((a, b) => a.position - b.position);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 bg-white/[0.02] border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-emerald-500 animate-pulse", size: 16 }),
      "Linha de Mobilização"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: sortedQueue.length > 0 ? sortedQueue.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      QueueEntry,
      {
        item,
        now
      },
      item.id
    )) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase font-black text-neutral-600 tracking-[0.4em]", children: "Quartel em Espera" }) }) }) })
  ] });
};
const QueueEntry = ({ item, now }) => {
  var _a;
  const [hasTriggeredReload, setHasTriggeredReload] = U.useState(false);
  const start = new Date(item.started_at).getTime();
  const end = new Date(item.finishes_at).getTime();
  const total = end - start;
  const elapsed = now - start;
  const remainingMs = end - now;
  const isFinished = remainingMs <= 0;
  const percent = isFinished ? 100 : Math.min(100, Math.max(0, elapsed / total * 100));
  const seconds = Math.max(0, Math.floor(remainingMs / 1e3));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = seconds % 60;
  const timeStr = h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
  const unitName = ((_a = item.unitType) == null ? void 0 : _a.name) || "Unidade Desconhecida";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 },
      className: `
                relative p-4 rounded-[1.2rem] border transition-all duration-500
                ${item.position === 1 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.01] border-white/5 opacity-60"}
            `,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black text-white uppercase tracking-tight", children: unitName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5", children: [
              "Lote: x",
              item.quantity
            ] })
          ] }),
          item.position !== 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-neutral-500 font-bold uppercase tracking-widest", children: [
            "Aguardando (",
            h,
            "m ",
            s,
            "s)"
          ] }) }),
          item.position === 1 && !isFinished ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "text-emerald-500 animate-[spin_4s_linear_infinite]", size: 12 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-black text-emerald-400", children: timeStr })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black text-neutral-600 uppercase tracking-widest", children: isFinished ? "Concluído" : `Posição #${item.position}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: `h-full ${item.position === 1 ? "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]" : "bg-neutral-800"}`,
            animate: { width: `${percent}%` },
            transition: { type: "tween", ease: "linear", duration: 1 }
          }
        ) }),
        item.position === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 opacity-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 40, className: "animate-pulse" }) })
      ]
    }
  );
};
const ICON_MAP = {
  crosshair: Crosshair,
  shield: Shield,
  truck: Truck,
  zap: Zap,
  pickaxe: Pickaxe,
  warehouse: Warehouse,
  eye: Eye,
  plane: Plane,
  beaker: FlaskConical
};
const RESOURCE_LABELS = {
  suprimentos: "SUP",
  combustivel: "FUEL",
  municoes: "MUN",
  metal: "MTL",
  energia: "NRG",
  pessoal: "PSS"
};
const RESOURCE_COLORS = {
  suprimentos: "text-emerald-400",
  combustivel: "text-amber-400",
  municoes: "text-red-400",
  metal: "text-slate-300",
  energia: "text-cyan-400",
  pessoal: "text-orange-400"
};
function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  return `${h}h ${m}m`;
}
function CountdownTimer({ targetDate }) {
  const [remaining, setRemaining] = reactExports.useState("");
  reactExports.useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = Math.max(0, Math.floor((target - now) / 1e3));
      setRemaining(formatTime(diff));
      if (diff <= 0) {
        Sr.reload();
      }
    };
    tick();
    const interval = setInterval(tick, 1e3);
    return () => clearInterval(interval);
  }, [targetDate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-orange-400 font-black", children: remaining });
}
function ResearchPanel({ research, researchBonuses, baseId, resources }) {
  var _a, _b;
  const [isResearching, setIsResearching] = reactExports.useState(false);
  const [expandedTech, setExpandedTech] = reactExports.useState(null);
  if (!research) return null;
  const { technologies, activeResearch } = research;
  const techList = Object.values(technologies);
  const handleResearch = (techKey) => {
    setIsResearching(true);
    Sr.post("/base/pesquisar", {
      base_id: baseId,
      tech: techKey
    }, {
      onSuccess: () => setIsResearching(false),
      onError: () => setIsResearching(false)
    });
  };
  const canAfford = (costs) => {
    return Object.entries(costs).every(([res, amount]) => (resources[res] ?? 0) >= amount);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/30 border border-white/5 rounded-[1.5rem] overflow-hidden backdrop-blur-xl shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "text-cyan-400", size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400", children: "Centro de Pesquisa & I&D" }),
        activeResearch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-cyan-400/60 font-mono mt-0.5", children: [
          "Pesquisa ativa: ",
          ((_a = technologies[activeResearch.tipo]) == null ? void 0 : _a.name) ?? activeResearch.tipo
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activeResearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        className: "border-b border-cyan-500/10 bg-cyan-500/5",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "text-cyan-400 animate-spin", size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-white font-bold", children: [
                (_b = technologies[activeResearch.tipo]) == null ? void 0 : _b.name,
                " → L",
                activeResearch.nivel
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-neutral-500", children: "Em progresso..." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "text-neutral-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CountdownTimer, { targetDate: activeResearch.completado_em })
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/[0.03]", children: techList.map((tech) => {
      const IconComponent = ICON_MAP[tech.icon] || FlaskConical;
      const isMaxed = tech.currentLevel >= tech.maxLevel;
      const isActive = (activeResearch == null ? void 0 : activeResearch.tipo) === tech.key;
      const affordable = !isMaxed && canAfford(tech.nextCost);
      const isExpanded = expandedTech === tech.key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setExpandedTech(isExpanded ? null : tech.key),
            className: "w-full px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-all duration-200",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-xl border transition-all duration-300 ${isMaxed ? "bg-emerald-500/10 border-emerald-500/20" : isActive ? "bg-cyan-500/10 border-cyan-500/20 animate-pulse" : "bg-white/5 border-white/10 group-hover:border-white/20"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { size: 16, className: isMaxed ? "text-emerald-400" : isActive ? "text-cyan-400" : "text-neutral-400 group-hover:text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white", children: tech.name }),
                  isMaxed && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12, className: "text-emerald-400" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-neutral-500", children: [
                  "L",
                  tech.currentLevel,
                  "/",
                  tech.maxLevel,
                  tech.bonusPerLevel > 0 && !isMaxed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyan-400/60 ml-2", children: [
                    "(+",
                    (tech.bonusPerLevel * 100).toFixed(0),
                    "% por nível)"
                  ] }),
                  tech.bonusPerLevel > 0 && tech.currentLevel > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 ml-2", children: [
                    "Total: +",
                    (tech.bonusPerLevel * tech.currentLevel * 100).toFixed(0),
                    "%"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-full rounded-full transition-all duration-500 ${isMaxed ? "bg-emerald-500" : "bg-cyan-500"}`,
                  style: { width: `${tech.currentLevel / tech.maxLevel * 100}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: `text-neutral-600 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}` })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isExpanded && !isMaxed && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.2 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-4 pt-1 ml-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-neutral-500 mb-3", children: tech.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-3", children: [
                Object.entries(tech.nextCost).map(([res, amount]) => {
                  const enough = (resources[res] ?? 0) >= amount;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[9px] font-mono px-2 py-1 rounded-lg border ${enough ? "bg-white/5 border-white/10" : "bg-red-500/10 border-red-500/20"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: RESOURCE_COLORS[res] || "text-white", children: RESOURCE_LABELS[res] || res }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: enough ? "text-white ml-1" : "text-red-400 ml-1", children: amount.toLocaleString() })
                  ] }, res);
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-mono px-2 py-1 rounded-lg bg-white/5 border border-white/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10, className: "inline text-neutral-500 mr-1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-300", children: formatTime(tech.nextTime) })
                ] })
              ] }),
              tech.reason && !isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-neutral-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 12 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tech.reason })
              ] }) : !isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleResearch(tech.key);
                  },
                  disabled: !tech.canResearch || !affordable || isResearching,
                  className: `px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${tech.canResearch && affordable ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-105 active:scale-95" : "bg-white/5 text-neutral-600 cursor-not-allowed"}`,
                  children: [
                    isResearching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin inline mr-2", size: 12 }) : null,
                    "Investigar L",
                    tech.currentLevel + 1
                  ]
                }
              ) : null
            ] })
          }
        ) })
      ] }, tech.key);
    }) })
  ] });
}
function TutorialOverlay() {
  const [step, setStep] = reactExports.useState(0);
  const [isVisible, setIsVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("mw_tutorial_seen");
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);
  const steps = [
    {
      title: "Bem-vindo ao Comando",
      content: "Comandante, você foi designado para este setor estratégico. Aqui está o seu painel tático principal.",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "text-orange-500", size: 40 })
    },
    {
      title: "Gestão de Recursos",
      content: "Observe a barra superior. Suprimentos, Combustível e Munições são vitais para as suas operações.",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-orange-500", size: 40 })
    },
    {
      title: "Mobilização",
      content: "Clique nos edifícios para expandir a sua base ou treinar tropas. A velocidade depende do seu nível tecnológico.",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-orange-500", size: 40 })
    },
    {
      title: "Operação Global",
      content: "Use o mapa para localizar alvos. Lembre-se: o território é hostil. Boa sorte, Comandante.",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "text-orange-500", size: 40 })
    }
  ];
  const handleClose = () => {
    localStorage.setItem("mw_tutorial_seen", "true");
    setIsVisible(false);
  };
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 },
      className: "bg-[#0b0f14] border border-orange-500/30 rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_100px_rgba(249,115,22,0.2)] relative overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[80px] rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleClose,
            className: "absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center gap-6 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20",
              children: steps[step].icon
            },
            step
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black uppercase tracking-tighter text-white", children: steps[step].title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-400 text-sm leading-relaxed font-medium", children: steps[step].content })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-4", children: steps.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-1 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-orange-500" : "w-2 bg-neutral-800"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: nextStep,
              className: "w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.2)]",
              children: step < steps.length - 1 ? "Próximo Passo" : "Entendido, Comandante"
            }
          )
        ] })
      ]
    }
  ) }) });
}
const STABLE_EMPTY_ARRAY = [];
function VillageDashboard({
  jogador,
  base: initialBase,
  bases: backendBases = STABLE_EMPTY_ARRAY,
  taxasPerSecond,
  gameConfig,
  relatoriosGlobal,
  buildings = STABLE_EMPTY_ARRAY,
  population,
  resources,
  buildingQueue = STABLE_EMPTY_ARRAY,
  unitQueue = STABLE_EMPTY_ARRAY,
  units = STABLE_EMPTY_ARRAY,
  unitTypes = STABLE_EMPTY_ARRAY,
  ataquesRecebidos = STABLE_EMPTY_ARRAY,
  ataquesEnviados = STABLE_EMPTY_ARRAY,
  diplomaties = STABLE_EMPTY_ARRAY,
  myAllianceId,
  reinforcements = STABLE_EMPTY_ARRAY,
  stationedOutside = STABLE_EMPTY_ARRAY,
  research = null,
  researchBonuses = {},
  researchConfig = null,
  activeEvents = []
}) {
  const { globalState } = useGameEntities();
  const base = U.useMemo(() => ({
    ...initialBase,
    edificios: buildings,
    recursos: resources,
    buildingQueue,
    unitQueue
  }), [initialBase, buildings, resources, buildingQueue, unitQueue]);
  const displayBases = (globalState.worldMapBases.length > 0 ? globalState.worldMapBases.filter((b) => b.ownerId === jogador.id) : backendBases.map((b) => ({ id: b.id, nome: b.nome }))) || [];
  const { addToast } = useToasts();
  const [selectedBuildingId, setSelectedBuildingId] = reactExports.useState(null);
  const [selectedBuildingType, setSelectedBuildingType] = reactExports.useState(null);
  const [selectedPos, setSelectedPos] = reactExports.useState(null);
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
      Logger.info(`MODE CHANGE [UI_SYNC]: ${ev.data.mode}`);
      setGameMode(ev.data.mode);
    });
    const unsubAlert = eventBus.subscribe(Events.UI_ALERT, (ev) => {
      addToast(ev.data.message, ev.data.type || "error");
      setIsUpgrading(false);
      setIsTraining(false);
    });
    const unsubSuccess = eventBus.subscribe(Events.ACTION_SUCCESS, (ev) => {
      setIsUpgrading(false);
      setIsTraining(false);
      setSelectedBuildingId(null);
      setSelectedBuildingType(null);
    });
    return () => {
      unsubArrived();
      unsubReturned();
      unsubMode();
      unsubAlert();
      unsubSuccess();
    };
  }, [base, ataquesEnviados, ataquesRecebidos]);
  if (!base) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-white uppercase font-mono", children: "Connecting to Satellite..." });
  const foundBuilding = (buildings || []).find((b) => {
    if (selectedBuildingId && b.id === selectedBuildingId) return true;
    if (selectedBuildingType && b.buildingType === selectedBuildingType) {
      if (selectedPos) {
        return b.pos_x === selectedPos.x && b.pos_y === selectedPos.y;
      }
      return true;
    }
    return false;
  });
  let currentBuilding = null;
  if (selectedBuildingType) {
    const buildDef = ((gameConfig == null ? void 0 : gameConfig.buildings) || {})[selectedBuildingType];
    const dbLevel = (foundBuilding == null ? void 0 : foundBuilding.nivel) || 0;
    const queueEntries = (buildingQueue || []).filter((q) => q.type === selectedBuildingType);
    const isUpgradingNow = queueEntries.length > 0;
    const nextLevel = dbLevel + 1;
    if (selectedBuildingType === "hq") {
      currentBuilding = { buildingType: "hq", nome: "Centro de Comando (HQ)", nivel: dbLevel, nextLevel, isUpgradingNow, base };
    } else if (selectedBuildingType === "muralha") {
      currentBuilding = { buildingType: "muralha", nome: "Perímetro Defensivo (Muralha)", nivel: dbLevel, nextLevel, isUpgradingNow, base };
    } else if (foundBuilding) {
      currentBuilding = { ...foundBuilding, ...buildDef, nome: (buildDef == null ? void 0 : buildDef.name) || "Estrutura", nivel: dbLevel, nextLevel, isUpgradingNow, base };
    } else {
      currentBuilding = {
        ...buildDef,
        buildingType: selectedBuildingType,
        nome: (buildDef == null ? void 0 : buildDef.name) || "Projeto Padrão",
        nivel: dbLevel,
        nextLevel,
        isUpgradingNow,
        base
      };
    }
  }
  const handleBuildingClick = (building) => {
    setSelectedBuildingId(building.id || null);
    setSelectedBuildingType(building.buildingType || null);
    setSelectedPos(building.pos_x !== void 0 ? { x: building.pos_x, y: building.pos_y } : null);
  };
  const handleUpgrade = (buildingType) => {
    setIsUpgrading(true);
    eventBus.emit(Events.BUILDING_UPGRADE_REQUEST, {
      base_id: base.id,
      tipo: buildingType,
      pos_x: (selectedPos == null ? void 0 : selectedPos.x) || 0,
      pos_y: (selectedPos == null ? void 0 : selectedPos.y) || 0
    });
    setSelectedBuildingId(null);
    setSelectedPos(null);
    addToast("Pedido de atualização estrutural enviado ao Comando.", "info");
  };
  const handleTrain = (unidade, quantidade) => {
    setIsTraining(true);
    const unitType = unitTypes.find(
      (ut) => ut.name.toLowerCase().includes(unidade.toLowerCase())
    );
    if (!unitType) {
      addToast("SÉRIE DE DADOS CORROMPIDA: Unidade não mapeada no registo central.", "error");
      setIsTraining(false);
      return;
    }
    Sr.post("/units/recruit", {
      unit_type_id: unitType.id,
      total_quantity: quantidade,
      // The new controller expects 'quantity'
      quantity: quantidade
    }, {
      onSuccess: () => {
        setIsTraining(false);
        addToast("Ordem de mobilização transmitida aos quartéis.", "success");
      },
      onError: (err) => {
        setIsTraining(false);
        addToast(Object.values(err)[0] || "Falha na mobilização.", "error");
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-1 flex-col gap-10 p-8 bg-[#020406] text-white min-h-screen relative overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-[80%] h-[70%] bg-sky-500/10 blur-[180px] opacity-40 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-[50%] h-[50%] bg-orange-500/5 blur-[150px] opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.03]",
          style: { backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.05] pointer-events-none",
          style: { backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)", backgroundSize: "100% 4px" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Centro de Comando Tático" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceBar, { recursos: resources, taxasPerSecond: taxasPerSecond ?? {}, populacao: population }),
    activeEvents && activeEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 relative z-10 px-4", children: activeEvents.map((evento) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between backdrop-blur-md shadow-[0_0_20px_rgba(234,179,8,0.15)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "text-yellow-500 animate-spin-slow", size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-yellow-500 font-black uppercase tracking-widest text-sm", children: evento.nome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-300 text-xs mt-1", children: evento.descricao })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-yellow-500/60 uppercase font-black tracking-widest", children: "Multiplicador Ativo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-black text-yellow-400 font-mono", children: [
          "x",
          evento.multiplicador
        ] })
      ] })
    ] }, evento.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8 flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-500/10 p-2 rounded-xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "text-orange-500 animate-pulse", size: 32 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-orange-500/60 font-black tracking-[0.4em] mb-0.5", children: "ESTAÇÃO_OPERACIONAL" }),
                (base == null ? void 0 : base.nome) ?? "Desconhecido"
              ] }),
              displayBases.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 ml-6 self-center bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-sm", children: displayBases.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => b.id !== base.id && Sr.get(`/base/switch/${b.id}`),
                  className: `
                                                    px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-300
                                                    ${b.id === base.id ? "bg-orange-500 border-orange-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)]" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5"}
                                                `,
                  children: b.nome
                },
                b.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-neutral-500 font-black uppercase tracking-widest", children: "Sistemas On-line" })
              ] }),
              (base == null ? void 0 : base.loyalty) !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em]", children: "Civil_Control:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { width: 0 },
                    animate: { width: `${base.loyalty}%` },
                    className: "h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-white font-black font-mono tracking-tighter", children: [
                  base.loyalty,
                  "%"
                ] })
              ] }),
              ((base == null ? void 0 : base.is_protected) || (base == null ? void 0 : base.isProtected)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-sky-900/30 px-4 py-2 rounded-2xl border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)] backdrop-blur-md", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-sky-400 animate-pulse", size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-sky-400 font-black uppercase tracking-[0.2em]", children: "Escudo Operacional" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              $e,
              {
                href: "/manual",
                className: "text-[10px] text-neutral-500 hover:text-orange-400 font-black uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Book, { size: 12 }),
                  "Manual Operacional"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-neutral-700 font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5", children: [
              "SIGINT_NODE_",
              (base == null ? void 0 : base.id) ?? "N/A"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArmyMovementPanel, { ataquesEnviados: ataquesEnviados ?? [], ataquesRecebidos: ataquesRecebidos ?? [], gameConfig }),
        gameMode === "WORLD_MAP" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          WorldMapView,
          {
            playerBase: base,
            troops: units.length > 0 ? units.map((u) => {
              const unitType = u.type || unitTypes.find((ut) => ut.id === u.unit_type_id);
              return { tipo: (unitType == null ? void 0 : unitType.name) || "unidade", quantidade: u.quantity };
            }) : (base == null ? void 0 : base.tropas) ?? [],
            gameConfig,
            unitTypes,
            diplomaties,
            myAllianceId
          }
        ) : buildings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center min-h-[400px] bg-black/40 border-2 border-dashed border-orange-500/20 rounded-[2rem] backdrop-blur-xl p-10 text-center gap-6 animate-in fade-in zoom-in duration-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-orange-500 animate-pulse", size: 40 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black uppercase tracking-tighter text-white", children: "Base não inicializada" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-neutral-500 font-medium max-w-xs mx-auto leading-relaxed", children: "O setor militar detetado não possui infraestrutura operacional ativa no momento. É necessário realizar a mobilização inicial." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => Sr.post("/base/bootstrap", { base_id: base.id }),
              className: "group relative px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-10 flex items-center gap-3", children: [
                  "Mobilizar Estruturas Iniciais",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 18 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" })
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VisualVillageView, { base, onBuildingClick: handleBuildingClick, gameConfig, buildingQueue })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 flex flex-col gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductionQueue,
          {
            construcoes: buildingQueue,
            treinos: (unitQueue || []).map((t) => {
              const unitType = t.unitType || unitTypes.find((ut) => ut.id === t.unit_type_id);
              return { ...t, unitType };
            }),
            gameConfig
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UnitQueue, { queue: unitQueue || STABLE_EMPTY_ARRAY }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GarrisonPanel,
          {
            tropas: (units.length > 0 ? units : (base == null ? void 0 : base.tropas) || []).map((u) => {
              const unitType = u.type || unitTypes.find((ut) => Number(ut.id) === Number(u.unit_type_id));
              return {
                tipo: (unitType == null ? void 0 : unitType.name) || u.name || u.unidade || u.tipo || "unidade",
                quantidade: u.quantity || u.quantidade || 0
              };
            }),
            reinforcements,
            stationedOutside,
            gameConfig
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ResearchPanel,
          {
            research,
            researchBonuses,
            baseId: base == null ? void 0 : base.id,
            resources
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-black/20 border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[1.5rem] relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4 bg-white/[0.02] border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "text-orange-500", size: 16 }),
            "Transmissões Globais"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6 min-h-[100px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: (relatoriosGlobal ?? []).length > 0 ? (relatoriosGlobal ?? []).map((r) => {
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
            ] }, r.id);
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
          setIsUpgrading(false);
          setIsTraining(false);
        },
        building: currentBuilding,
        gameConfig,
        onUpgrade: handleUpgrade,
        onTrain: handleTrain,
        isUpgrading,
        isTraining,
        population,
        unitTypes
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TutorialOverlay, {})
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
const breadcrumbs = [
  {
    title: "Centro de Comando",
    href: "/dashboard"
  }
];
function Dashboard(props) {
  var _a, _b;
  const gameMode = useGameMode();
  const state = props.state || {};
  const { entities } = useGameEntities() || { entities: [] };
  (entities == null ? void 0 : entities.some((e) => e.march)) ?? false;
  const [resources, setResources] = reactExports.useState(state.resources ?? props.resources ?? ((_a = props.base) == null ? void 0 : _a.recursos) ?? {});
  reactExports.useEffect(() => {
    var _a2;
    const incoming = state.resources ?? props.resources ?? ((_a2 = props.gameData) == null ? void 0 : _a2.resources);
    if (incoming && typeof incoming === "object") {
      setResources(incoming);
      resourceSystem.sync(incoming);
    }
  }, [state.resources, props.resources, (_b = props.gameData) == null ? void 0 : _b.resources]);
  const currentBase = state.base ?? props.base;
  const currentBuildings = state.buildings ?? props.buildings ?? [];
  const currentPopulation = state.population ?? props.population ?? null;
  const currentUnits = state.units ?? props.units ?? [];
  const currentMovements = state.movements ?? props.movements ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { breadcrumbs, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, scale: 1.02, filter: "blur(10px)" },
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      className: "flex-1 flex flex-col",
      children: gameMode === "WORLD_MAP" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorldMapView,
        {
          playerBase: currentBase,
          troops: state.units ? state.units.map((u) => ({ unidade: u.name, quantidade: u.quantity })) : [],
          gameConfig: state.gameConfig || props.gameConfig
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        VillageDashboard,
        {
          ...state,
          base: currentBase,
          buildings: currentBuildings,
          population: currentPopulation,
          resources,
          units: currentUnits,
          movements: currentMovements,
          activeEvents: state.activeEvents || props.activeEvents || [],
          gameConfig: state.gameConfig || props.gameConfig,
          unitTypes: state.unitTypes || props.unitTypes,
          unitQueue: state.unitQueue || props.unitQueue,
          buildingQueue: state.buildingQueue || props.buildingQueue,
          diplomaties: state.diplomaties || props.diplomaties,
          reinforcements: state.reinforcements,
          stationedOutside: state.stationedOutside
        }
      )
    },
    gameMode
  ) }) });
}
export {
  Dashboard as default
};
//# sourceMappingURL=dashboard-CFShUhUW.js.map
