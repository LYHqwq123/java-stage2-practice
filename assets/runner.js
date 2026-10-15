'use strict';
const CHANNEL = 'java-practice-runtime-v1';
let Bridge;
let working = false;
const send = (data) => parent.postMessage({ channel: CHANNEL, ...data }, location.origin);
async function describe(error) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.stack || error.message;
  try { if (error?.getMessage) return String(await error.getMessage()); } catch (_) { }
  try { if (error?.toString) return String(await error.toString()); } catch (_) { }
  return 'Java 环境发生未知错误，请停止并重试。';
}
(async () => {
  try {
    if (typeof cheerpjInit !== 'function') throw new Error('CheerpJ CDN 加载失败，请检查网络后重试。');
    send({ type: 'phase', message: '正在加载浏览器 Java 环境，首次使用需要下载运行库…' });
    await cheerpjInit({ version: 8, status: 'none', javaProperties: ['file.encoding=UTF-8', 'user.language=en', 'user.country=US'] });
    const base = new URL('.', location.href).pathname;
    const lib = await cheerpjRunLibrary('/app' + base + 'compiler/tools.jar:/app' + base + 'compiler/practice-bridge.jar');
    Bridge = await lib.practice.PracticeBridge;
    send({ type: 'ready' });
  } catch (error) {
    send({ type: 'fatal', message: await describe(error) });
  }
})();
addEventListener('message', async (event) => {
  if (event.origin !== location.origin || event.source !== parent || event.data?.channel !== CHANNEL) return;
  const { type, id, source, stdin, className, fileName } = event.data;
  if (type !== 'run' || !Bridge || working) return;
  working = true;
  try {
    send({ type: 'phase', id, message: '正在使用 javac 编译并执行…' });
    const json = await Bridge.compileAndRun(source, stdin, className, fileName);
    send({ type: 'result', id, result: JSON.parse(json) });
  } catch (error) {
    const message = await describe(error);
    send({ type: 'error', id, message });
  } finally { working = false; }
});
