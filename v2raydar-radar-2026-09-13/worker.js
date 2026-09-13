var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
__name(PerformanceEntry, "PerformanceEntry");
var PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark");
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = "measure";
};
__name(PerformanceMeasure, "PerformanceMeasure");
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, "PerformanceResourceTiming");
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
__name(Performance, "Performance");
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, "PerformanceObserver");
__publicField(PerformanceObserver, "supportedEntryTypes", []);
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../usr/local/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, "ReadStream");

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, "WriteStream");

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, "Process");

// ../../../../usr/local/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../usr/local/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.js
var SOURCES = [
  "https://raw.githubusercontent.com/masir-sefid/Sub/main/@Masir_Sefid.txt",
  "https://github.com/Epodonios/v2ray-configs/raw/main/All_Configs_Sub.txt",
  "https://raw.githubusercontent.com/ALIILAPRO/v2rayNG-Config/main/sub.txt",
  "https://raw.githubusercontent.com/zieng2/wl/main/vless_universal.txt",
  "https://raw.githubusercontent.com/barry-far/V2ray-config/main/All_Configs_base64_Sub.txt",
  "https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/Vless-Reality-White-Lists-Rus-Mobile.txt",
  "https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/Vless-Reality-White-Lists-Rus-Mobile-2.txt",
  "https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/BLACK_VLESS_RUS_mobile.txt",
  "https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/WHITE-CIDR-RU-checked.txt",
  "https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/BLACK_VLESS_RUS.txt",
  "https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/BLACK_SS+All_RUS.txt",
  "https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/main/splitted-by-protocol/vless.txt",
  "https://raw.githubusercontent.com/barry-far/V2ray-config/main/Sub1.txt",
  "https://raw.githubusercontent.com/barry-far/V2ray-Config/main/Sub2.txt",
  "https://raw.githubusercontent.com/barry-far/V2ray-Config/main/Sub3.txt",
  "https://raw.githubusercontent.com/ebrasha/free-v2ray-public-list/refs/heads/main/V2Ray-Config-By-EbraSha.txt",
  "https://raw.githubusercontent.com/MohammadBahemmat/V2ray-Collector/main/subscriptions/all.txt",
  "https://raw.githubusercontent.com/mahdibland/V2RayAggregator/master/sub/sub_merge.txt",
  "https://raw.githubusercontent.com/mfuu/v2ray/master/v2ray.txt",
  "https://raw.githubusercontent.com/ermaozi/get_subscribe/main/subscribe/v2ray.txt",
  "https://raw.githubusercontent.com/ThomasJasperthecat/sub/main/sublist1.txt",
  "https://sub.iampedi5.live/sub/base64.txt",
  "https://raw.githubusercontent.com/iampedii/whitedns-sub/refs/heads/main/mihomo.yaml"
];
var LINK_RE = /(?:vmess|vless|trojan|ss|ssr|hysteria2|hy2|tuic):\/\/[^\s"'<>()\r\n]+/gi;
function b64norm(s) {
  return s.replace(/-/g, "+").replace(/_/g, "/");
}
__name(b64norm, "b64norm");
function b64dec(s) {
  s = b64norm(s);
  s += "=".repeat((4 - s.length % 4) % 4);
  try {
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++)
      bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return "";
  }
}
__name(b64dec, "b64dec");
function utob(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++)
    bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
__name(utob, "utob");
function scalar(v) {
  if (typeof v === "boolean")
    return v ? "true" : "false";
  if (typeof v === "number")
    return String(v);
  if (v === null || v === void 0)
    return '""';
  const s = String(v);
  if (s === "" || /[:#{}\[\],&*?|<>=!%@`"]/.test(s) || /^\s|\s$/.test(s))
    return JSON.stringify(s);
  return s;
}
__name(scalar, "scalar");
function extractConfigs(text) {
  const found = /* @__PURE__ */ new Set();
  let m;
  LINK_RE.lastIndex = 0;
  while (m = LINK_RE.exec(text)) {
    let s = m[0];
    if (s.endsWith("\\"))
      s = s.slice(0, -1);
    found.add(s);
  }
  if (found.size < 3) {
    try {
      const dec = b64dec(text.replace(/\s+/g, ""));
      LINK_RE.lastIndex = 0;
      while (m = LINK_RE.exec(dec))
        found.add(m[0]);
    } catch (e) {
    }
  }
  return found;
}
__name(extractConfigs, "extractConfigs");
async function aggregate() {
  const results = await Promise.allSettled(
    SOURCES.map(async (url) => {
      const r = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        redirect: "follow",
        signal: AbortSignal.timeout(15e3)
      });
      if (!r.ok)
        throw new Error("status " + r.status);
      const t = await r.text();
      return extractConfigs(t);
    })
  );
  const all = /* @__PURE__ */ new Set();
  let ok = 0;
  results.forEach((res) => {
    if (res.status === "fulfilled") {
      ok++;
      res.value.forEach((c) => all.add(c));
    }
  });
  return { configs: [...all], sourcesOk: ok, sourcesTotal: SOURCES.length };
}
__name(aggregate, "aggregate");
async function getConfigs(env2, urlObj) {
  const refresh = urlObj && urlObj.searchParams && urlObj.searchParams.has("refresh");
  const ttl = parseInt(env2.CACHE_TTL || "900", 10);
  const cache = caches.default;
  const key = "https://cache.v2raydar/agg";
  if (!refresh) {
    const hit = await cache.match(key);
    if (hit)
      return await hit.json();
  }
  const data = await aggregate();
  await cache.put(
    key,
    new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Cache-Control": "max-age=" + ttl }
    })
  );
  return data;
}
__name(getConfigs, "getConfigs");
function parseVmess(link) {
  try {
    const json2 = JSON.parse(b64dec(link.slice(8)));
    const net = json2.net || "tcp";
    const out = {
      name: json2.ps || `${json2.add}:${json2.port}`,
      type: "vmess",
      server: json2.add,
      port: parseInt(json2.port, 10),
      uuid: json2.id,
      alterId: parseInt(json2.aid || 0, 10),
      cipher: json2.scy || "auto",
      network: net
    };
    if (json2.tls === "reality") {
      out.tls = true;
      out.sni = json2.sni || json2.peer;
      out["client-fingerprint"] = json2.fp || "chrome";
      out["reality-opts"] = { "public-key": json2.pbk, "short-id": json2.sid || "" };
    } else if (json2.tls === "tls") {
      out.tls = true;
      out.sni = json2.sni || json2.host;
      if (json2.fp)
        out["client-fingerprint"] = json2.fp;
    }
    if (net === "ws")
      out["ws-opts"] = { path: json2.path || "/", headers: json2.host ? { Host: json2.host } : {} };
    else if (net === "grpc")
      out["grpc-opts"] = { "grpc-service-name": json2.path || "" };
    else if (net === "h2")
      out["h2-opts"] = { path: json2.path || "/", hosts: json2.host ? [json2.host] : [] };
    return out;
  } catch (e) {
    return null;
  }
}
__name(parseVmess, "parseVmess");
function parseVless(link) {
  try {
    const u = new URL(link);
    const p = Object.fromEntries(u.searchParams);
    const out = {
      name: decodeURIComponent(u.hash.slice(1) || u.hostname),
      type: "vless",
      server: u.hostname,
      port: parseInt(u.port, 10),
      uuid: decodeURIComponent(u.username),
      network: p.type || "tcp"
    };
    const sec = p.security || "none";
    if (sec === "tls" || sec === "reality") {
      out.tls = true;
      out.sni = p.sni || p.peer;
      if (p.fp)
        out["client-fingerprint"] = p.fp;
      if (sec === "reality")
        out["reality-opts"] = { "public-key": p.pbk, "short-id": p.sid || "" };
    }
    if (out.network === "ws")
      out["ws-opts"] = { path: p.path || "/", headers: p.host ? { Host: p.host } : {} };
    else if (out.network === "grpc")
      out["grpc-opts"] = { "grpc-service-name": p.serviceName || p.path || "" };
    else if (out.network === "h2")
      out["h2-opts"] = { path: p.path || "/", hosts: p.host ? [p.host] : [] };
    if (p.flow)
      out.flow = p.flow;
    return out;
  } catch (e) {
    return null;
  }
}
__name(parseVless, "parseVless");
function parseTrojan(link) {
  try {
    const u = new URL(link);
    const p = Object.fromEntries(u.searchParams);
    const out = {
      name: decodeURIComponent(u.hash.slice(1) || u.hostname),
      type: "trojan",
      server: u.hostname,
      port: parseInt(u.port, 10),
      password: decodeURIComponent(u.username),
      network: p.type || "tcp"
    };
    if (!p.security || p.security === "tls") {
      out.tls = true;
      out.sni = p.sni || p.peer;
      if (p.fp)
        out["client-fingerprint"] = p.fp;
    }
    if (out.network === "ws")
      out["ws-opts"] = { path: p.path || "/", headers: p.host ? { Host: p.host } : {} };
    else if (out.network === "grpc")
      out["grpc-opts"] = { "grpc-service-name": p.serviceName || p.path || "" };
    return out;
  } catch (e) {
    return null;
  }
}
__name(parseTrojan, "parseTrojan");
function parseSS(link) {
  try {
    let body = link.slice(5);
    let name = "";
    if (body.includes("#")) {
      const parts = body.split("#");
      body = parts[0];
      name = decodeURIComponent(parts[1]);
    }
    let userinfo, server, port;
    if (body.includes("@")) {
      const [ui, hp] = body.split("@");
      userinfo = ui;
      [server, port] = hp.split(":");
    } else {
      const dec = b64dec(body);
      const m = dec.match(/^(.+?)@(.+?):(\d+)$/);
      if (!m)
        return null;
      userinfo = m[1];
      server = m[2];
      port = m[3];
    }
    let method, password;
    if (userinfo.includes(":")) {
      [method, password] = userinfo.split(":");
    } else {
      const dec = b64dec(userinfo);
      [method, password] = dec.split(":");
    }
    return { name: name || `${server}:${port}`, type: "ss", server, port: parseInt(port, 10), cipher: method, password: decodeURIComponent(password) };
  } catch (e) {
    return null;
  }
}
__name(parseSS, "parseSS");
function parseSSR(link) {
  try {
    const dec = b64dec(link.slice(6));
    const m = dec.match(/^(.+?):(\d+):(.+?):(.+?):(.+?):(.+?)(\/?.*)?$/);
    if (!m)
      return null;
    let [, server, port, protocol, method, obfs, basePass, extra] = m;
    const password = b64dec(basePass);
    const params = {};
    if (extra) {
      const q = extra.replace(/^\?/, "");
      for (const kv of q.split("&")) {
        const [k, v] = kv.split("=");
        if (k)
          params[k] = b64dec(decodeURIComponent(v || ""));
      }
    }
    return {
      name: params.remarks || `${server}:${port}`,
      type: "ssr",
      server,
      port: parseInt(port, 10),
      protocol,
      "protocol-param": params.protoparam || "",
      method,
      obfs,
      "obfs-param": params.obfsparam || "",
      password
    };
  } catch (e) {
    return null;
  }
}
__name(parseSSR, "parseSSR");
function parseHy2(link) {
  try {
    const u = new URL(link);
    const p = Object.fromEntries(u.searchParams);
    const out = {
      name: decodeURIComponent(u.hash.slice(1) || u.hostname),
      type: "hysteria2",
      server: u.hostname,
      port: parseInt(u.port, 10),
      password: decodeURIComponent(u.username) || p.auth
    };
    if (p.sni)
      out.sni = p.sni;
    if (p.obfs)
      out.obfs = p.obfs;
    if (p.pbk)
      out["obfs-password"] = p.pbk;
    if (p.insecure === "1" || p.allowInsecure)
      out["skip-cert-verify"] = true;
    if (p.mport)
      out["hop-port"] = p.mport;
    if (p.pinSHA256)
      out["pin-sha256"] = p.pinSHA256;
    return out;
  } catch (e) {
    return null;
  }
}
__name(parseHy2, "parseHy2");
function parseTuic(link) {
  try {
    const u = new URL(link);
    const p = Object.fromEntries(u.searchParams);
    let user = decodeURIComponent(u.username);
    const pass = decodeURIComponent(u.password);
    let uuid = user, token = pass;
    if (user.includes(":")) {
      [uuid, token] = user.split(":");
    }
    const out = {
      name: decodeURIComponent(u.hash.slice(1) || u.hostname),
      type: "tuic",
      server: u.hostname,
      port: parseInt(u.port, 10),
      uuid
    };
    if (token)
      out.token = token;
    if (p.sni)
      out.sni = p.sni;
    if (p.alpn)
      out.alpn = p.alpn.split(",");
    if (p.congestion_control)
      out["congestion-controller"] = p.congestion_control;
    if (p["insecure"] === "1")
      out["skip-cert-verify"] = true;
    return out;
  } catch (e) {
    return null;
  }
}
__name(parseTuic, "parseTuic");
function parseLink(c) {
  if (c.startsWith("vmess://"))
    return parseVmess(c);
  if (c.startsWith("vless://"))
    return parseVless(c);
  if (c.startsWith("trojan://"))
    return parseTrojan(c);
  if (c.startsWith("ss://"))
    return parseSS(c);
  if (c.startsWith("ssr://"))
    return parseSSR(c);
  if (c.startsWith("hysteria2://") || c.startsWith("hy2://"))
    return parseHy2(c);
  if (c.startsWith("tuic://"))
    return parseTuic(c);
  return null;
}
__name(parseLink, "parseLink");
function emitProxy(p) {
  const keys = Object.entries(p).filter(([k, v]) => v !== void 0 && v !== null);
  if (!keys.length)
    return "{}";
  const lines = [`${keys[0][0]}: ${scalar(keys[0][1])}`];
  for (const [k, v] of keys.slice(1)) {
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const [k2, v2] of Object.entries(v))
        lines.push(`  ${k2}: ${scalar(v2)}`);
    } else if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const it of v)
        lines.push(`  - ${scalar(it)}`);
    } else {
      lines.push(`${k}: ${scalar(v)}`);
    }
  }
  return lines.join("\n");
}
__name(emitProxy, "emitProxy");
function buildMihomo(configs) {
  const proxies = [];
  for (const c of configs) {
    const p = parseLink(c);
    if (p && p.server && p.port)
      proxies.push(p);
  }
  const seen = /* @__PURE__ */ new Set();
  const uniq = [];
  for (const p of proxies) {
    const k = p.name + "|" + p.server + "|" + p.port;
    if (seen.has(k))
      continue;
    seen.add(k);
    uniq.push(p);
  }
  let yaml = "port: 7890\nallow-lan: false\nsocks-port: 7891\nmode: rule\nlog-level: info\nexternal-controller: 127.0.0.1:9090\nipv6: false\n";
  yaml += "proxies:\n";
  for (const p of uniq)
    yaml += "  - " + emitProxy(p).replace(/\n/g, "\n    ") + "\n";
  yaml += "proxy-groups:\n  - name: PROXY\n    type: select\n    proxies:\n      - DIRECT\n";
  for (const p of uniq)
    yaml += "      - " + scalar(p.name) + "\n";
  yaml += "rules:\n  - MATCH,PROXY\n";
  return { yaml, count: uniq.length, parsed: proxies.length };
}
__name(buildMihomo, "buildMihomo");

// --- XRAY BEST PROBE + PANEL (v3) ---
async function tcpProbe(host, port){
  const t0=Date.now();
  try{
    const mod=await import("cloudflare:sockets");
    const sock=await mod.connect({hostname: host, port: port});
    try{ sock.close(); }catch(e){}
    return Date.now()-t0;
  }catch(e){
    // fallback fetch timing
    try{
      const c=new AbortController();
      const to=setTimeout(()=>c.abort(),700);
      await fetch("http://"+host+":"+port+"/",{signal:c.signal, cf:{cacheEverything:false}});
      clearTimeout(to);
      return Date.now()-t0;
    }catch(err){
      // if error is fast (connection refused) treat as low latency else high
      const dt=Date.now()-t0;
      return dt < 900 ? dt : 9999;
    }
  }
}

async function buildXrayRealityJson(configs, urlObj) {
  const want = 10; // همیشه پیش‌فرض ۱۰۰ — ?count= برای اورراید
  const qCount = urlObj && urlObj.searchParams.get("count");
  const finalWant = qCount ? Math.min(Math.max(parseInt(qCount,10)||10,1),32) : want;
  const userRaw = urlObj && (urlObj.searchParams.get("user") || urlObj.searchParams.get("username"));
  const user = userRaw ? userRaw.trim().slice(0,32).replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g,"_") : "";
  const remarkParam = urlObj && (urlObj.searchParams.get("remark") || urlObj.searchParams.get("remarks"));
  const remark = remarkParam || (user ? `⚡ ${userRaw.trim()} • VPN4000` : "⚡ Smart • VPN4000");
  const baseTag = user ? user : "REALITY_POOL";
  const count = finalWant;
  // parse and filter
  const parsed = [];
  for (const c of configs.configs) {
    let p = null;
    if (c.startsWith("vless://")) p = parseVless(c);
    else if (c.startsWith("trojan://")) p = parseTrojan(c);
    else if (c.startsWith("vmess://")) p = parseVmess(c);
    else continue;
    if (!p || !p.server || !p.port) continue;
    parsed.push({ raw: c, p });
  }
  // prefer reality vless > tls > all
  let reality = parsed.filter(x => x.p["reality-opts"] && x.p["reality-opts"]["public-key"]);
  let pool = reality.length ? reality : parsed.filter(x => x.p.tls);
  if (!pool.length) pool = parsed;
  // sampling for probing: take up to 120 candidates
  const useBest = !(urlObj && urlObj.searchParams.get("best")==="0");
  let candidates = pool;
  // dedup first then sample
  {
    const seen2=new Set(); const tmp=[];
    for(const x of pool){ const k=x.p.server+":"+x.p.port+":"+(x.p.uuid||x.p.password||""); if(seen2.has(k)) continue; seen2.add(k); tmp.push(x); if(tmp.length>=80) break; }
    candidates=tmp;
  }
  let uniq=[];
  if(useBest && candidates.length>8){
    // probe latency with concurrency 24
    const toProbe=candidates.slice(0,60);
    const conc=48;
    const results=[];
    for(let i=0;i<toProbe.length;i+=conc){
      const slice=toProbe.slice(i,i+conc);
      const settled=await Promise.all(slice.map(async (entry)=>{
        const ms=await tcpProbe(entry.p.server, entry.p.port);
        return {entry, ms};
      }));
      results.push(...settled);
      // small gap to avoid burst
      /* no gap */
    }
    results.sort((a,b)=>a.ms-b.ms);
    // keep only reachable (ms<9000) then top
    const filtered=results.filter(r=>r.ms<9000);
    const src=filtered.length>=count?filtered:results;
    uniq=src.slice(0,count).map(r=>r.entry);
    // if still short, fill from remaining
    if(uniq.length<count){
      const have=new Set(uniq.map(x=>x.p.server+":"+x.p.port));
      for(const x of candidates){ if(uniq.length>=count) break; const k=x.p.server+":"+x.p.port; if(!have.has(k)){ uniq.push(x); have.add(k); } }
    }
  } else {
    const seen = new Set();
    for (const x of candidates) {
      const k = x.p.server + ":" + x.p.port + ":" + (x.p.uuid || x.p.password || "");
      if (seen.has(k)) continue;
      seen.add(k); uniq.push(x);
      if (uniq.length >= count) break;
    }
  }
  if (!uniq.length) {
    // fallback single dummy if empty (should not happen)
    return {
      dns: { servers: ["1.1.1.1", "8.8.8.8"] },
      log: { loglevel: "warning" },
      routing: { rules: [{ type: "field", network: "tcp,udp", balancerTag: "AUTO_REALITY" }], balancers: [{ tag: "AUTO_REALITY", selector: ["REALITY_POOL"], strategy: { type: "leastPing" }, fallbackTag: "REALITY_POOL" }], domainStrategy: "AsIs" },
      inbounds: [{ tag: "SOCKS-IN", port: 10808, listen: "127.0.0.1", protocol: "socks", settings: { udp: true, auth: "noauth" }, sniffing: { enabled: true, routeOnly: true, destOverride: ["http","tls","quic"] } }, { tag: "HTTP-IN", port: 10809, listen: "127.0.0.1", protocol: "http", settings: {} }],
      outbounds: [{ tag: "DIRECT", protocol: "freedom" }, { tag: "BLOCK", protocol: "blackhole" }],
      observatory: { probeUrl: "https://connectivitycheck.gstatic.com/generate_204", probeInterval: "15s", subjectSelector: [baseTag], enableConcurrency: true },
      remarks: remark
    };
  }
  const outbounds = [];
  uniq.forEach((entry, i) => {
    const p = entry.p;
    const tag = i === 0 ? baseTag : `${baseTag}-${i+1}`;
    const isTrojan = p.type === "trojan";
    const isVmess = p.type === "vmess";
    const net = p.network || "tcp";
    const flow = p.flow || "xtls-rprx-vision";
    if (isTrojan) {
      outbounds.push({
        tag,
        protocol: "trojan",
        settings: { servers: [{ address: p.server, port: p.port, password: p.password }] },
        streamSettings: buildStreamSettings(p, net)
      });
    } else if (isVmess) {
      outbounds.push({
        tag,
        protocol: "vmess",
        settings: { vnext: [{ address: p.server, port: p.port, users: [{ id: p.uuid, alterId: p.alterId || 0, security: p.cipher || "auto" }] }] },
        streamSettings: buildStreamSettings(p, net)
      });
    } else {
      // vless default
      outbounds.push({
        tag,
        protocol: "vless",
        settings: { vnext: [{ address: p.server, port: p.port, users: [{ id: p.uuid, encryption: "none", ...(net === "tcp" && p.tls ? { flow } : {}) }] }] },
        streamSettings: buildStreamSettings(p, net)
      });
      // fix flow removal when not needed
      if (!p.tls || net !== "tcp") delete outbounds[outbounds.length-1].settings.vnext[0].users[0].flow;
    }
  });
  outbounds.push({ tag: "DIRECT", protocol: "freedom" });
  outbounds.push({ tag: "BLOCK", protocol: "blackhole" });
  return {
    dns: { servers: ["1.1.1.1", "8.8.8.8"] },
    log: { loglevel: "warning" },
    routing: { rules: [{ type: "field", network: "tcp,udp", balancerTag: "AUTO_REALITY" }], balancers: [{ tag: "AUTO_REALITY", selector: [baseTag], strategy: { type: "leastPing" }, fallbackTag: baseTag }], domainStrategy: "AsIs" },
    inbounds: [
      { tag: "SOCKS-IN", port: 10808, listen: "127.0.0.1", protocol: "socks", settings: { udp: true, auth: "noauth" }, sniffing: { enabled: true, routeOnly: true, destOverride: ["http","tls","quic"] } },
      { tag: "HTTP-IN", port: 10809, listen: "127.0.0.1", protocol: "http", settings: {} }
    ],
    outbounds,
    observatory: { probeUrl: "https://connectivitycheck.gstatic.com/generate_204", probeInterval: "15s", subjectSelector: [baseTag], enableConcurrency: true },
    remarks: remark
  };
}
function buildStreamSettings(p, net) {
  const sec = p["reality-opts"] ? "reality" : (p.tls ? "tls" : "none");
  const ss = { network: net, security: sec };
  if (net === "tcp") ss.tcpSettings = { header: { type: "none" } };
  else if (net === "ws") {
    const o = p["ws-opts"] || {};
    ss.wsSettings = { path: o.path || "/", headers: o.headers || {} };
  } else if (net === "grpc") {
    const o = p["grpc-opts"] || {};
    ss.grpcSettings = { serviceName: o["grpc-service-name"] || "" };
    // Xray uses grpcSettings
  } else if (net === "h2") {
    const o = p["h2-opts"] || {};
    ss.httpSettings = { path: o.path || "/", host: o.hosts || [] };
  }
  if (sec === "reality") {
    ss.realitySettings = {
      serverName: p.sni || "",
      publicKey: (p["reality-opts"] && p["reality-opts"]["public-key"]) || "",
      shortId: (p["reality-opts"] && p["reality-opts"]["short-id"]) || "",
      fingerprint: p["client-fingerprint"] || "chrome",
      spiderX: "/"
    };
    if (!ss.realitySettings.serverName) delete ss.realitySettings.serverName;
    // Xray expects serverName present for reality; if empty keep as ""
    if (p.sni) ss.realitySettings.serverName = p.sni; else ss.realitySettings.serverName = "";
  } else if (sec === "tls") {
    ss.tlsSettings = {
      serverName: p.sni || "",
      fingerprint: p["client-fingerprint"] || "chrome",
      allowInsecure: false
    };
    if (p.sni) ss.tlsSettings.serverName = p.sni;
  }
  return ss;
}
async function sendXrayJson(configs, urlObj) {
  const j = await buildXrayRealityJson(configs, urlObj);
  return new Response(JSON.stringify(j, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=86400", "X-Update-Interval": "24h", "Access-Control-Allow-Origin": "*" }
  });
}
async function sendXrayJsonCached(env2, urlObj, ctx) {
  try {
    const cache = caches.default;
    const user = urlObj.searchParams.get("user") || urlObj.searchParams.get("username") || "";
    const cnt = urlObj.searchParams.get("count") || "10";
    const best = urlObj.searchParams.get("best") || "1";
    const rk = urlObj.searchParams.get("remark") || "";
    const keyStr = "https://cache.v2raydar/xray/v10/" + encodeURIComponent(user) + "/" + cnt + "/" + best + "/" + encodeURIComponent(rk);
    const keyReq = new Request(keyStr);
    const doRefresh = urlObj.searchParams.has("refresh") || urlObj.searchParams.has("force");
    if (!doRefresh) {
      const hit = await cache.match(keyReq);
      if (hit) {
        const h = new Response(hit.body, hit);
        h.headers.set("X-Cache", "HIT");
        h.headers.set("Cache-Control", "public, max-age=86400");
        h.headers.set("X-Update-Interval", "24h");
        h.headers.set("Access-Control-Allow-Origin", "*");
        return h;
      }
    }
    const data = await getConfigs(env2, urlObj);
    const j = await buildXrayRealityJson(data, urlObj);
    const resp = new Response(JSON.stringify(j, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
        "X-Cache": "MISS",
        "X-Update-Interval": "24h",
        "Access-Control-Allow-Origin": "*"
      }
    });
    ctx.waitUntil(cache.put(keyReq, resp.clone()));
    return resp;
  } catch (e) {
    const data = await getConfigs(env2, urlObj);
    return sendXrayJson(data, urlObj);
  }
}

function panelHtml(origin){
  return `<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>VPN4000 Panel</title>
<style>
*{box-sizing:border-box;font-family:Vazirmatn,system-ui,sans-serif}
body{background:#0b0e17;color:#e8ecf4;min-height:100vh;margin:0;padding:18px}
.wrap{max-width:720px;margin:0 auto}
h1{text-align:center;background:linear-gradient(90deg,#7c5cff,#00d4ff);-webkit-background-clip:text;color:transparent;margin:10px 0 6px}
.sub{color:#8a93ad;text-align:center;font-size:13px;margin-bottom:16px}
.card{background:#131829;border:1px solid #232b45;border-radius:16px;padding:16px;margin-bottom:14px}
label{font-size:13px;color:#8a93ad;display:block;margin:8px 0 6px}
input,select{width:100%;background:#0d1120;border:1px solid #2a3560;border-radius:12px;color:#e8ecf4;padding:12px 14px;font-size:15px;outline:none}
input:focus{border-color:#7c5cff}
.row{display:flex;gap:8px;margin-top:12px}
button{flex:1;background:linear-gradient(135deg,#7c5cff,#5a34f0);border:0;color:#fff;border-radius:12px;padding:12px;font-weight:700;cursor:pointer}
button.sec{background:#1c2440;border:1px solid #2a3560}
.linkbox{background:#0d1120;border:1px dashed #2a3560;border-radius:12px;padding:12px;word-break:break-all;direction:ltr;text-align:left;font-size:13px;margin-top:10px}
.hint{font-size:12px;color:#5c6684;line-height:1.8;margin-top:8px}
.badge{display:inline-block;background:#1c2440;border:1px solid #2a3560;border-radius:8px;padding:4px 10px;font-size:12px;margin:2px}
a{color:#7c5cff}
</style></head><body><div class="wrap">
<h1>⚡ VPN4000 — پنل کاربری</h1>
<div class="sub">از ۲۲هزار کانفیگ، ۱۰ تا پرسرعت‌ترین تست شده — فرمت Xray REALITY_POOL + leastPing</div>
<div class="card">
<label>نام کاربری (برای لینک اختصاصی)</label>
<input id="user" placeholder="مثلا ali123" value="">
<label>تعداد سرور (۵ تا ۳۲)</label>
<select id="cnt"><option value="6">6</option><option value="8">8</option><option value="10" selected>10 — پیشنهادی</option><option value="16">16</option><option value="24">24</option></select>
<div class="row"><button onclick="gen()">ساخت لینک اختصاصی</button><button class="sec" onclick="copyL()">📋 کپی</button></div>
<div id="out" class="linkbox" style="display:none"></div>
<div class="hint" id="hint"></div>
</div>
<div class="card">
<div style="font-weight:700;margin-bottom:8px">لینک‌های مستقیم</div>
<div id="direct"></div>
<div class="hint">پورت کلاینت: SOCKS 10808 / HTTP 10809 — داخل Xray/V2RayN/V2RayNG کپی کن. هر لینک خودکار بهترین سرورها رو میده (هر ۲۴ ساعت خودکار رفرش - ضعیف‌ها حذف می‌شن).</div><div class="card" style="text-align:left;direction:ltr;font-size:12px"><b>BEST (از ۲۲هزار — تست‌شده، تازه):</b><br><code id="bestlinks"></code></div>
</div>
<div class="card" style="text-align:center;font-size:12px;color:#5c6684">MANUAL: <code id="manual"></code></div>
</div>
<script>
const ORIGIN = "`+origin+`";
function gen(){
  const u=document.getElementById('user').value.trim()||'';
  const c=document.getElementById('cnt').value;
  const base=ORIGIN+"/xray.json?count="+c+(u?"&user="+encodeURIComponent(u):"");
  const el=document.getElementById('out');
  el.style.display='block';
  el.textContent=base;
  document.getElementById('hint').innerHTML = u ? 'لینک اختصاصی <b>'+u+'</b> — اسم داخل remarks هم میاد. همین لینک رو به کلاینت بده — هر ۲۴ ساعت خودکار سرورای جدید تمیز جایگزین می‌شن — قبلی‌های ضعیف حذف.' : 'بدون نام کاربری — لینک عمومی. برای شخصی سازی اسم بنویس.';
  el.onclick=()=>navigator.clipboard.writeText(base);
}
function copyL(){
  const t=document.getElementById('out').textContent.trim();
  if(!t) return alert('اول ساخت بزن');
  navigator.clipboard.writeText(t).then(()=>alert('کپی شد ✓'));
}
(function(){
  const d=document.getElementById('direct');
  const base=ORIGIN+"/xray.json";
  d.innerHTML='<div class=\"badge\"><a href=\"'+base+'?count=10\" target=\"_blank\">xray.json?count=10</a></div> <div class=\"badge\"><a href=\"'+base+'?count=6\" target=\"_blank\">count=6</a></div> <div class=\"badge\"><a href=\"'+base+'?count=16\" target=\"_blank\">count=16</a></div> <div class=\"badge\"><a href=\"'+base+'?best=0\" target=\"_blank\">بدون تست (سریع)</a></div> <div class=\"badge\"><a href=\"'+ORIGIN+'/sub\" target=\"_blank\">/sub قدیمی</a></div>';
  document.getElementById('manual').textContent=base+"?count=10&user=USERNAME";
  const b=document.getElementById('bestlinks'); if(b){ const o=ORIGIN; b.innerHTML = '<a href="'+o+'/best?count=10" target="_blank">/best (plain, 10 best)</a> — <a href="'+o+'/best64?count=10" target="_blank">/best64 (base64)</a> — <a href="'+o+'/best.json?count=10&user=USERNAME" target="_blank">/best.json (Xray)</a> — <a href="'+o+'/sub" target="_blank">/sub (22k raw)</a>'; }
  gen();
})();
</script></body></html>`;
}


async function sendBestSub(request, env2, urlObj, ctx){
  const count = Math.min(Math.max(parseInt(urlObj.searchParams.get("count")||"10",10)||10,1),32);
  const user = urlObj.searchParams.get("user")||urlObj.searchParams.get("username")||"";
  // edge cache per user/count (24h)
  const cache=caches.default;
  const key="https://cache.v2raydar/best/"+encodeURIComponent(user)+"/"+count+"?"+(urlObj.searchParams.get("best")||"1");
  if(!urlObj.searchParams.has("refresh")){
    const hit=await cache.match(new Request(key));
    if(hit){
      const h=new Response(hit.body,hit);
      h.headers.set("Content-Type","text/plain; charset=utf-8");
      h.headers.set("X-Cache","HIT"); h.headers.set("X-Update-Interval","24h");
      h.headers.set("Access-Control-Allow-Origin","*");
      return h;
    }
  }
  const data=await getConfigs(env2, urlObj);
  // pick best: same logic as Xray but for raw links
  // reuse ranking: probe top 120 candidates
  const parsed=[];
  for(const c of data.configs){
    let pp=null;
    if(c.startsWith("vless://")) pp=parseVless(c);
    else if(c.startsWith("trojan://")) pp=parseTrojan(c);
    else if(c.startsWith("vmess://")) pp=parseVmess(c);
    else continue;
    if(!pp||!pp.server||!pp.port) continue;
    parsed.push({raw:c, p:pp});
  }
  let pool=parsed.filter(x=>x.p["reality-opts"]&&x.p["reality-opts"]["public-key"]);
  if(!pool.length) pool=parsed.filter(x=>x.p.tls);
  if(!pool.length) pool=parsed;
  // dedup
  const seen=new Set(); const uniqPool=[];
  for(const x of pool){ const k=x.p.server+":"+x.p.port+":"+(x.p.uuid||x.p.password||""); if(seen.has(k)) continue; seen.add(k); uniqPool.push(x); if(uniqPool.length>=80) break; }
  const useBest=!(urlObj.searchParams.get("best")==="0");
  let chosen=[];
  if(useBest && uniqPool.length>count){
    const probeUrl=(h,pt)=> tcpProbe(h,pt);
    const conc=48; const results=[];
    for(let i=0;i<Math.min(60,uniqPool.length);i+=conc){
      const slice=uniqPool.slice(i,i+conc);
      const part=await Promise.all(slice.map(async e=>({e, ms: await probeUrl(e.p.server,e.p.port)})));
      results.push(...part);
      /* no gap */
    }
    results.sort((a,b)=>a.ms-b.ms);
    const filtered=results.filter(r=>r.ms<9000);
    const src=filtered.length>=count?filtered:results;
    chosen=src.slice(0,count).map(r=>r.e);
    if(chosen.length<count){
      const have=new Set(chosen.map(x=>x.p.server+":"+x.p.port));
      for(const x of uniqPool){ if(chosen.length>=count) break; const k=x.p.server+":"+x.p.port; if(!have.has(k)){ chosen.push(x); have.add(k); } }
    }
  } else {
    chosen=uniqPool.slice(0,count);
  }
  // apply user personalization to remarks
  const tagBase = user ? user.replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g,"_").slice(0,32) : "";
  const lines=chosen.map((x,i)=>{
    let raw=x.raw;
    if(tagBase){
      const tag=i===0?tagBase:tagBase+"-"+(i+1);
      // replace fragment after #
      if(raw.includes("#")) raw=raw.split("#")[0]+"#"+encodeURIComponent(tag);
      else raw=raw+"#"+encodeURIComponent(tag);
    }
    return raw;
  });
  const text=lines.join("\n");
  const b64 = urlObj.pathname.endsWith("/subscription") || urlObj.pathname.endsWith("/sub") ? text : text; // plain vs base64 handled by caller but for /best we give base64
  const asBase64 = (urlObj.pathname==="/best" || urlObj.pathname==="/best.txt") ? false : true;
  const body = asBase64 ? utob(text) : text;
  const resp=new Response(body,{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=86400","X-Update-Interval":"24h","X-Cache":"MISS","Access-Control-Allow-Origin":"*"}});
  ctx.waitUntil(cache.put(new Request(key), resp.clone()));
  return resp;
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
__name(json, "json");
function sendSubscription(configs, asBase64) {
  const text = configs.configs.join("\n");
  const body = asBase64 ? utob(text) : text;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(sendSubscription, "sendSubscription");
function sendMihomo(configs) {
  const { yaml, count: count3 } = buildMihomo(configs.configs);
  return new Response(yaml, {
    status: 200,
    headers: {
      "Content-Type": "text/yaml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mihomo.yaml"',
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(sendMihomo, "sendMihomo");
async function tgSend(env2, chatId, text, kb) {
  const body = { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true };
  if (kb && kb.length) {
    let keyboard = [];
    // kb can be [["label","url/callback"], ...] or already nested
    for (const row of kb) {
      if (Array.isArray(row[0])) {
        keyboard.push(row.map(([txt, data]) => data.startsWith("http") ? { text: txt, url: data } : { text: txt, callback_data: data }));
      } else {
        const [txt, data] = row;
        keyboard.push([data.startsWith("http") ? { text: txt, url: data } : { text: txt, callback_data: data }]);
      }
    }
    body.reply_markup = { inline_keyboard: keyboard };
  }
  return fetch(`https://api.telegram.org/bot${env2.TG_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}
__name(tgSend, "tgSend");
async function tgSendDocument(env2, chatId, text, filename, caption) {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("document", new Blob([text], { type: "text/plain" }), filename);
  if (caption)
    form.append("caption", caption);
  return fetch(`https://api.telegram.org/bot${env2.TG_BOT_TOKEN}/sendDocument`, {
    method: "POST",
    body: form
  });
}
__name(tgSendDocument, "tgSendDocument");
async function handleTelegram(request, env2) {
  if (!env2.TG_BOT_TOKEN)
    return new Response("bot not configured", { status: 200 });
  let update;
  try { update = await request.json(); } catch (e) { return new Response("ok"); }
  // handle callback_query (inline buttons)
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message.chat.id;
    const data = cq.data || "";
    const origin = new URL(request.url).origin;
    const username = (cq.from.username || cq.from.first_name || "user").replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g,"_");
    try {
      if (data === "get_xray") {
        const xrayUrl = origin + "/xray.json?count=10&user=" + encodeURIComponent(username);
        const panelUrl = origin + "/panel";
        await tgAnswerCallback(env2, cq.id, "لینک اختصاصیت ساخته شد ✅");
        await tgSend(env2, chatId, `⚡ <b>ساب Xray اختصاصی تو</b>\n\n<b>${username} — 10 سرور پرسرعت (هر ۲۴ساعت رفرش)</b>\n<code>${xrayUrl}</code>\n\n▫️ لینک کوتاه:\n<code>${origin}/xray/${username}</code>\n\n▫️ <a href="${panelUrl}">🔧 پنل کاربری</a> — نام رو عوض کن\n▫️ فرمت: Xray REALITY_POOL / 10808-10809 / leastPing`, [["🌐 پنل کاربری", panelUrl],["🔄 رفرش ساب", xrayUrl]]);
      } else if (data === "get_panel") {
        await tgAnswerCallback(env2, cq.id);
        await tgSend(env2, chatId, `🌐 <b>پنل کاربری</b>\n${origin}/panel\n\nاسم کاربریتو بزن، سابت با همون اسم (ali123-1..10) ساخته میشه.`);
      }
    } catch(e){}
    return new Response("ok");
  }
  const msg = update.message || update.edited_message;
  if (!msg || !msg.text) return new Response("ok");
  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const origin = new URL(request.url).origin;
  const subUrl = origin + "/subscription";
  const plainUrl = origin + "/sub";
  const xrayUrlUser = origin + "/xray.json?count=10&user=" + encodeURIComponent((msg.from && msg.from.username) ? msg.from.username : String(chatId));
  const panelUrl = origin + "/panel";
  const brokerUrl = "https://netra-broker.ersaz0174.workers.dev";
  // Try to enrich via broker (optional - non-blocking)
  let brokerNote = "";
  try {
    const r = await fetch(brokerUrl + "/api/broker/link?chat=" + chatId, { cf: { cacheTtl: 60 } });
    if (r.ok) { const j = await r.json(); if (j && j.link) brokerNote = "\n🤝 بروکر: " + j.link; }
  } catch(e){}
  try {
    if (text.startsWith("/start") || text.startsWith("/help")) {
      await tgSend(env2, chatId,
        `🛰️ <b>V2RayDAR Radar</b> — ساب هوشمند\n\n`
        + `⚡ <b>ساب Xray جدید (پیشنهادی)</b> — ۱۰ سرور پرسرعت تست‌شده، اسم شخصی، هر ۲۴ساعت تمیز میشه:\n`
        + `<code>${xrayUrlUser}</code>\n`
        + `لینک کوتاه: <code>${origin}/xray/${(msg.from&&msg.from.username)||chatId}</code>\n\n`
        + `🌐 پنل کاربری: ${panelUrl}\n`
        + `📄 ساب قدیمی: <code>${subUrl}</code>\n`
        + `📃 متن: <code>${plainUrl}</code>\n`
        + `🔗 Xray خام: <code>${origin}/xray.json?count=10</code>\n`
        + (brokerNote || "")
        + `\n\nدستورات:\n`
        + `/xray — ساب Xray اختصاصی (۱۰ تایی REALITY)\n`
        + `/panel — پنل کاربری\n`
        + `/best — ۱۰ تا بهترین تست‌شده (plain, با اسم شخصی) — همون ۲۲هزار ولی تمیز\n/best — ۱۰ تا بهترین تست‌شده — با اسم شخصی\n/config /sub — فایل کامل (۲۲هزار)\n`
        + `/mihomo — کانفیگ Mihomo/Clash`,
        [["⚡ ساب Xray من", "get_xray"],["🌐 پنل کاربری", "get_panel"]]);
    } else if (text.startsWith("/xray") || text === "/reality") {
      const user = (msg.from && msg.from.username) ? msg.from.username : String(chatId);
      const link = origin + "/xray.json?count=10&user=" + encodeURIComponent(user);
      await tgSend(env2, chatId, `⚡ <b>ساب Xray — ${user}</b> (۱۰ سرور پرسرعت / ۲۴ساعت رفرش)\n<code>${link}</code>\n\nکوتاه: <code>${origin}/xray/${user}</code>\nپنل: ${panelUrl}\n\n▫️ برای تعداد دیگر: <code>${origin}/xray.json?count=16&user=${user}</code>`, [["🌐 پنل", panelUrl]]);
    } else if (text.startsWith("/panel") || text.startsWith("/user")) {
      await tgSend(env2, chatId, `🌐 <b>پنل کاربری</b>\n${panelUrl}\n\nنام کاربریتو وارد کن — سابت با اسم خودت (مثلا ali123-1..10) ساخته میشه.\nمستقیم: <code>${xrayUrlUser}</code>`);
    } else if (text.startsWith("/mihomo") || text.startsWith("/clash")) {
      await tgSend(env2, chatId, `📦 <b>Mihomo/Clash</b>\n<code>${origin}/mihomo.yaml</code>\n\nو Xray: <code>${origin}/xray.json</code>`);
    } else if (text.startsWith("/config") || text.startsWith("/sub") || text.startsWith("/get")) {
      const data = await getConfigs(env2, new URL(subUrl + "?refresh=1"));
      const plain = data.configs.join("\n");
      await tgSendDocument(env2, chatId, plain, "v2raydar_configs.txt",
        `✅ ${data.configs.length} کانفیگ تازه (از ${data.sourcesOk}/${data.sourcesTotal} سورس)\n🔗 ساب: ${subUrl}\n⚡ Xray (۱۰ پرسرعت): ${xrayUrlUser}`);
    } else {
      await tgSend(env2, chatId, `دستور ناشناخته. بزن /start برای راهنما.\n\n⚡ ساب اختصاصیت:\n<code>${xrayUrlUser}</code>`);
    }
  } catch (e) { await tgSend(env2, chatId, "خطا: " + String(e)); }
  return new Response("ok");
}
async function tgAnswerCallback(env2, id, text){
  try { await fetch("https://api.telegram.org/bot"+env2.TG_BOT_TOKEN+"/answerCallbackQuery",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({callback_query_id:id, text:text||""})}); }catch(e){}
}
__name(handleTelegram, "handleTelegram");
async function handleSetup(request, env2) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== env2.ADMIN_KEY)
    return json({ error: "forbidden" }, 403);
  if (!env2.TG_BOT_TOKEN)
    return json({ error: "TG_BOT_TOKEN not set" }, 400);
  const whUrl = url.origin + "/webhook";
  const r = await fetch(`https://api.telegram.org/bot${env2.TG_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(whUrl)}&max_connections=20`);
  return json({ set: await r.json(), webhook: whUrl });
}
__name(handleSetup, "handleSetup");
async function handleWebhookInfo(env2) {
  if (!env2.TG_BOT_TOKEN)
    return json({ error: "TG_BOT_TOKEN not set" }, 400);
  const r = await fetch(`https://api.telegram.org/bot${env2.TG_BOT_TOKEN}/getWebhookInfo`);
  return json(await r.json());
}
__name(handleWebhookInfo, "handleWebhookInfo");
var src_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === "/webhook" && request.method === "POST")
        return handleTelegram(request, env2);
      if (path === "/setup")
        return handleSetup(request, env2);
      if (path === "/webhookinfo")
        return handleWebhookInfo(env2);
      if (path === "/health" || path === "/") {
        const data = await getConfigs(env2, url);
        return json({ ok: true, name: "v2raydar-sub", configs: data.configs.length, sourcesOk: data.sourcesOk, sourcesTotal: data.sourcesTotal, cached: !url.searchParams.has("refresh") });
      }
      if (path === "/subscription")
        return sendSubscription(await getConfigs(env2, url), true);
      if (path === "/sub" || path === "/subscription.txt")
        return sendSubscription(await getConfigs(env2, url), false);
      if (path === "/best" || path === "/best.txt" || path === "/best/sub" || path === "/best64" || path === "/top" || path === "/fresh")
        return sendBestSub(request, env2, url, ctx);
      if (path === "/best.json" || path === "/best/xray.json")
        return sendXrayJsonCached(env2, url, ctx);
      if (path === "/panel" || path === "/user" || path === "/dashboard") {
        return new Response(panelHtml(url.origin), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
      }
      if (path.startsWith("/xray/") || path.startsWith("/reality/") || path.startsWith("/u/")) {
        const user = decodeURIComponent(path.split("/").pop() || "");
        url.searchParams.set("user", user);
        return sendXrayJsonCached(env2, url, ctx);
      }
      if (path === "/xray.json" || path === "/xray" || path === "/reality.json" || path === "/reality" || path === "/json")
        return sendXrayJsonCached(env2, url, ctx);
      if (path === "/mihomo.yaml")
        return sendMihomo(await getConfigs(env2, url));
      if (path === "/stats") {
        const d = await getConfigs(env2, url);
        return json(d);
      }
      return json({ error: "not found", paths: ["/", "/health", "/subscription", "/sub", "/best", "/best.json", "/mihomo.yaml", "/xray.json", "/panel", "/xray/:user", "/webhook"] }, 404);
    } catch (e) {
      return json({ error: String(e) }, 500);
    }
  }
};
export {
  SOURCES,
  aggregate,
  buildMihomo,
  src_default as default,
  extractConfigs,
  getConfigs,
  parseLink
};
//# sourceMappingURL=index.js.map
