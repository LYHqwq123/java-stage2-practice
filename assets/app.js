'use strict';
(() => {
  const $ = (id) => document.getElementById(id);
  const stage = Number(document.documentElement.dataset.stage);
  const stageText = stage === 1 ? '一' : '二';
  const storageKey = `java-stage-${stage}-practice-v1`;
  let course, current, drafts = {}, learned = {}, selectedTab = 'question', running = false;
  let onlyUnfinished = false, saveTimer, toastTimer;
  const starter = '// 先读题，再从这里开始。可在“参考答案”中载入完整答案。\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO：在这里完成本题\n\n    }\n}\n';
  function toast(text) { $('toast').textContent = text; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 2400); }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({ drafts, learned, selected: current?.id })); $('save-status').textContent = '已保存'; }
    catch (_) { $('save-status').textContent = '保存失败'; toast('浏览器存储不可用，请下载代码保留草稿。'); }
  }
  function saveDraft() {
    if (!current) return;
    drafts[current.id] = { code: $('editor').value, stdin: $('stdin').value };
    clearTimeout(saveTimer); persist(); updateEditorInfo();
  }
  function updateEditorInfo() {
    $('line-count').textContent = `${$('editor').value.split('\n').length} 行`;
    $('file-name').textContent = identifySource($('editor').value).fileName;
  }
  function identifySource(source) {
    // Strip comments/literals for declarations; the actual compiler validates Java syntax.
    const clean = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, ' ');
    const packageName = clean.match(/\bpackage\s+([\w.]+)\s*;/)?.[1];
    const publicName = clean.match(/\bpublic\s+(?:(?:abstract|final|strictfp)\s+)*class\s+([A-Za-z_$][\w$]*)/)?.[1];
    const classes = [];
    for (const match of clean.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)[^;{]*\{/g)) {
      const begin = match.index + match[0].length - 1;
      let depth = 1, end = begin + 1;
      while (end < clean.length && depth) { if (clean[end] === '{') depth++; if (clean[end] === '}') depth--; end++; }
      classes.push({ name: match[1], begin, end });
    }
    const mainPosition = clean.search(/\bstatic\s+(?:(?:public|final|synchronized|strictfp)\s+)*void\s+main\s*\(/);
    const enclosing = classes.filter(c => c.begin < mainPosition && c.end > mainPosition).sort((a, b) => a.begin - b.begin);
    const entry = enclosing.map(c => c.name).join('$');
    const name = publicName || enclosing[0]?.name || classes[0]?.name || 'Main';
    return { className: (packageName ? packageName + '.' : '') + (entry || name), fileName: name + '.java' };
  }
  function fillList(id, values) { const node = $(id); node.replaceChildren(...(Array.isArray(values) ? values : [values]).filter(Boolean).map((value) => { const li = document.createElement('li'); li.textContent = typeof value === 'string' ? value : value.title || JSON.stringify(value); return li; })); }
  function renderProgress() {
    const done = course.questions.filter(q => learned[q.id]).length;
    $('progress-text').textContent = `${done} / ${course.questions.length}`;
    $('progress').max = course.questions.length; $('progress').value = done;
    $('complete-button').setAttribute('aria-pressed', String(!!learned[current?.id]));
    $('complete-button').textContent = learned[current?.id] ? '✓ 已学会' : '○ 标记学会';
  }
  function renderList() {
    const query = $('search').value.trim().toLowerCase(), concept = $('concept-filter').value;
    const questions = course.questions.filter(q => (!onlyUnfinished || !learned[q.id]) && (!concept || q.concepts?.includes(concept)) && (!query || `${q.number} ${q.originalLabel || ''} ${q.title} ${q.prompt} ${(q.concepts || []).join(' ')}`.toLowerCase().includes(query)));
    $('list-count').textContent = `${questions.length} 道题 · 点击开始练习`;
    $('question-list').replaceChildren();
    if (!questions.length) { const p = document.createElement('p'); p.className = 'muted'; p.textContent = '没有符合条件的题目。'; $('question-list').append(p); }
    for (const q of questions) {
      const button = document.createElement('button'); button.className = `question-item${q.id === current?.id ? ' active' : ''}${learned[q.id] ? ' done' : ''}`;
      if (q.id === current?.id) button.setAttribute('aria-current', 'true');
      const number = document.createElement('span'); number.className = 'question-num'; number.textContent = learned[q.id] ? '✓' : String(q.number).padStart(2, '0');
      const content = document.createElement('span'); content.className = 'question-item-content';
      const title = document.createElement('strong'); title.textContent = q.title;
      const subtitle = document.createElement('small'); subtitle.textContent = (q.concepts || []).join(' / ');
      content.append(title, subtitle); button.append(number, content); button.addEventListener('click', () => selectQuestion(q.id)); $('question-list').append(button);
    }
    renderProgress();
  }
  function showTab(tab) {
    selectedTab = tab;
    for (const key of ['question', 'guide', 'answer']) { const selected = key === tab; $('tab-' + key).classList.toggle('active', selected); $('tab-' + key).setAttribute('aria-selected', String(selected)); $('tab-' + key).tabIndex = selected ? 0 : -1; $('panel-' + key).hidden = !selected; }
  }
  function selectQuestion(id) {
    if (running) { toast('请先停止当前运行，再切换题目。'); return; }
    if (current) saveDraft();
    current = course.questions.find(q => q.id === id) || course.questions[0];
    location.hash = encodeURIComponent(current.id);
    $('question-title').textContent = current.title;
    $('question-index').textContent = `STAGE 0${stage} / ${current.originalLabel || `第 ${current.number} 题`}`;
    $('question-prompt').textContent = current.prompt;
    $('concept-tags').replaceChildren(...(current.concepts || []).map(text => { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = text; return tag; }));
    $('sample-input').textContent = current.stdin?.trim() ? current.stdin : '（无需输入）';
    $('sample-output').textContent = current.expectedOutput || '（本题无标准输出，运行后观察结果）';
    $('approach').textContent = current.approach || '';
    fillList('explanation', current.explanation || []); fillList('pitfalls', current.pitfalls || []); fillList('exercises', current.exercises || []);
    $('answer-code').textContent = current.code || '';
    $('editor').value = drafts[current.id]?.code ?? current.starter ?? starter;
    $('stdin').value = drafts[current.id]?.stdin ?? current.stdin ?? '';
    $('stdout').textContent = '点击「编译并运行」，查看真实结果。';
    $('run-status').textContent = '尚未运行'; $('run-status').className = 'run-status'; $('diagnostic-details').hidden = true;
    $('previous').disabled = course.questions.indexOf(current) === 0;
    $('next').disabled = course.questions.indexOf(current) === course.questions.length - 1;
    showTab('question'); renderList(); updateEditorInfo(); persist();
  }

  class JavaRuntime {
    constructor() { this.frame = null; this.ready = null; this.pending = null; this.sequence = 0; this.initialized = false; }
    initialize() {
      if (this.ready) return this.ready;
      this.ready = new Promise((resolve, reject) => {
        this.resolveReady = resolve; this.rejectReady = reject;
        this.frame = document.createElement('iframe'); this.frame.className = 'runtime-frame'; this.frame.title = 'Java 编译运行环境'; this.frame.setAttribute('aria-hidden', 'true'); this.frame.src = './runner.html';
        document.body.append(this.frame);
        this.listener = event => {
          if (event.origin !== location.origin || event.source !== this.frame?.contentWindow || event.data?.channel !== 'java-practice-runtime-v1') return;
          const data = event.data;
          if (data.type === 'phase') { $('run-status').textContent = '环境加载 / 编译中'; $('runtime-note').textContent = data.message; }
          if (data.type === 'ready') { this.initialized = true; clearTimeout(this.initTimeout); resolve(); }
          if (data.type === 'fatal') { clearTimeout(this.initTimeout); reject(new Error(data.message)); }
          if (this.pending && data.id === this.pending.id && ['result', 'error'].includes(data.type)) {
            clearTimeout(this.pending.timeout); const pending = this.pending; this.pending = null;
            data.type === 'result' ? pending.resolve(data.result) : pending.reject(new Error(data.message));
          }
        };
        addEventListener('message', this.listener);
        this.initTimeout = setTimeout(() => reject(new Error('Java 环境加载超过 180 秒。请检查网络能否访问 cjrtnc.leaningtech.com，再重新运行。')), 180000);
      });
      return this.ready;
    }
    async run(source, stdin) {
      await this.initialize();
      return new Promise((resolve, reject) => {
        const id = ++this.sequence;
        this.pending = { id, resolve, reject, timeout: setTimeout(() => { this.pending = null; reject(new Error('编译或运行超过 90 秒，环境已重置。请检查循环或稍后重试。')); this.destroy(); }, 90000) };
        this.frame.contentWindow.postMessage({ channel: 'java-practice-runtime-v1', type: 'run', id, source, stdin, ...identifySource(source) }, location.origin);
      });
    }
    destroy() {
      clearTimeout(this.initTimeout); removeEventListener('message', this.listener);
      if (this.pending) { clearTimeout(this.pending.timeout); this.pending.reject(new Error('运行已停止。')); this.pending = null; }
      if (!this.initialized && this.rejectReady) this.rejectReady(new Error('环境加载已停止。'));
      this.frame?.remove(); this.frame = null; this.ready = null; this.initialized = false;
    }
  }
  const runtime = new JavaRuntime();
  const normal = value => String(value || '').replace(/\r\n/g, '\n').split('\n').map(line => line.trimEnd()).join('\n').trimEnd();
  function renderResult(result) {
    const success = result.compileExit === 0 && !result.error && !result.timedOut;
    $('stdout').textContent = result.stdout || (success ? '（程序运行完成，没有标准输出）' : '（暂无标准输出）');
    const details = [result.diagnostics && `javac 编译信息\n${result.diagnostics}`, result.stderr && `标准错误输出\n${result.stderr}`, result.error && `运行错误\n${result.error}`].filter(Boolean).join('\n\n');
    $('diagnostics').textContent = details;
    $('diagnostic-details').hidden = !details; $('diagnostic-details').open = !success;
    $('diagnostic-title').textContent = result.compileExit !== 0 ? '编译未通过 · 点击查看 javac 错误' : success ? '编译信息' : '运行错误 · 点击查看';
    $('run-status').textContent = success ? `运行成功 · ${(result.durationMs / 1000).toFixed(2)} s` : result.compileExit !== 0 ? '编译失败' : '运行出错';
    $('run-status').className = `run-status ${success ? 'success' : 'error'}`;
    $('runtime-note').textContent = '本次结果来自真实 javac 编译与 Java 字节码执行。每次运行使用独立类加载器；标准输入按 UTF-8 读取。';
    return success;
  }
  function setRunning(value) {
    running = value; $('run-button').disabled = value; $('test-button').disabled = value; $('stop-button').hidden = !value;
    $('editor').readOnly = value; $('stdin').readOnly = value;
    for (const id of ['reset-code', 'load-answer', 'use-sample']) $(id).disabled = value;
    if (value) { $('run-status').textContent = '正在准备…'; $('run-status').className = 'run-status running'; $('diagnostic-details').hidden = true; }
  }
  async function runCode(checkTests = false) {
    if (running || !current) return;
    saveDraft(); const source = $('editor').value; if (!source.trim()) return toast('请先输入 Java 代码。');
    setRunning(true);
    try {
      if (!checkTests) { const result = await runtime.run(source, $('stdin').value); renderResult(result); if (result.timedOut) runtime.destroy(); }
      else {
        const tests = current.tests?.length ? current.tests : [{ stdin: current.stdin || '', stdout: current.expectedOutput || '' }];
        const results = []; let last;
        for (let i = 0; i < tests.length; i++) {
          $('run-status').textContent = `样例 ${i + 1} / ${tests.length}`;
          last = await runtime.run(source, tests[i].stdin || '');
          const valid = last.compileExit === 0 && !last.error && !last.timedOut;
          const passed = valid && normal(last.stdout) === normal(tests[i].stdout);
          results.push(`样例 ${i + 1}：${passed ? '通过 ✓' : valid ? '输出不一致' : '编译或运行失败'}${passed ? '' : `\n期望：${tests[i].stdout || '（空）'}\n实际：${last.stdout || '（空）'}`}`);
          if (!valid) { renderResult(last); break; }
        }
        const allPassed = results.length === tests.length && results.every(line => line.includes('通过 ✓'));
        if (last && last.compileExit === 0 && !last.error) renderResult(last);
        $('stdout').textContent = results.join('\n\n');
        $('run-status').textContent = allPassed ? `全部 ${tests.length} 组样例通过` : '样例未全部通过';
        $('run-status').className = `run-status ${allPassed ? 'success' : 'error'}`;
        if (allPassed) { learned[current.id] = true; persist(); renderList(); toast('样例通过！再试试讲解里的进阶练习。'); }
        if (last?.timedOut) runtime.destroy();
      }
    } catch (error) {
      $('run-status').textContent = '运行未完成'; $('run-status').className = 'run-status error';
      $('diagnostics').textContent = String(error?.message || error); $('diagnostic-details').hidden = false; $('diagnostic-details').open = true; $('diagnostic-title').textContent = '环境或运行信息';
      runtime.destroy();
    } finally { setRunning(false); }
  }

  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', () => showTab(button.dataset.tab));
    button.addEventListener('keydown', event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const keys = ['question', 'guide', 'answer']; let index = keys.indexOf(selectedTab); index = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3; showTab(keys[index]); $('tab-' + keys[index]).focus(); });
  });
  $('search').addEventListener('input', () => course && renderList()); $('concept-filter').addEventListener('change', () => course && renderList());
  $('unfinished-filter').addEventListener('click', () => { onlyUnfinished = !onlyUnfinished; $('unfinished-filter').setAttribute('aria-pressed', String(onlyUnfinished)); renderList(); });
  $('complete-button').addEventListener('click', () => { if (!current) return; learned[current.id] = !learned[current.id]; persist(); renderList(); });
  $('editor').addEventListener('input', () => { $('save-status').textContent = '正在保存'; updateEditorInfo(); clearTimeout(saveTimer); saveTimer = setTimeout(saveDraft, 350); });
  $('stdin').addEventListener('input', saveDraft);
  $('editor').addEventListener('keydown', event => { if (event.key !== 'Tab' || event.shiftKey) return; event.preventDefault(); const el = event.target, begin = el.selectionStart, end = el.selectionEnd; el.setRangeText('    ', begin, end, 'end'); saveDraft(); });
  addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); runCode(); } });
  $('run-button').addEventListener('click', () => runCode()); $('test-button').addEventListener('click', () => runCode(true));
  $('stop-button').addEventListener('click', () => runtime.destroy());
  $('load-answer').addEventListener('click', () => { if (!current || running) return; $('editor').value = current.code; saveDraft(); toast('参考答案已载入，可以修改并运行。'); });
  $('copy-answer').addEventListener('click', async () => { try { await navigator.clipboard.writeText(current.code); toast('答案已复制。'); } catch (_) { toast('复制受浏览器限制，请在答案区手动选择复制。'); } });
  $('reset-code').addEventListener('click', () => { if (!current || running) return; $('editor').value = current.starter || starter; $('stdin').value = current.stdin || ''; saveDraft(); toast('已恢复练习模板。'); });
  $('use-sample').addEventListener('click', () => { if (!current || running) return; $('stdin').value = current.stdin || ''; saveDraft(); toast('示例输入已填入。'); });
  $('download-code').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([$('editor').value], { type: 'text/x-java-source;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = identifySource($('editor').value).fileName; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  document.querySelectorAll('.open-lessons').forEach(button => button.addEventListener('click', () => $('lessons-dialog').showModal()));
  $('close-lessons').addEventListener('click', () => $('lessons-dialog').close());
  $('lessons-dialog').addEventListener('click', event => { if (event.target === $('lessons-dialog')) { const rect = event.target.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close(); } });
  for (const [id, delta] of [['previous', -1], ['next', 1]]) $(id).addEventListener('click', () => { const q = course?.questions[course.questions.indexOf(current) + delta]; if (q) selectQuestion(q.id); });
  addEventListener('pagehide', () => { saveDraft(); runtime.destroy(); });
  (async () => {
    try {
      const response = await fetch('./data/questions.json'); if (!response.ok) throw new Error(`题库请求失败（HTTP ${response.status}）。`);
      course = await response.json(); if (!course.questions?.length) throw new Error('题库为空，请检查 data/questions.json。');
      let saved = {}; try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (_) { }
      drafts = saved.drafts || {}; learned = saved.learned || {};
      $('stage-label').textContent = `阶段${stageText} · ${stage === 1 ? '基础入门' : '面向对象进阶'}`;
      $('course-title').textContent = stage === 1 ? '从第一行 Java 开始' : '用对象组织你的代码';
      $('course-subtitle').textContent = stage === 1 ? '基础语法、循环与数组，逐题掌握。' : '类、继承与多态，边写边理解。';
      $('answer-pdf').href = `./downloads/阶段${stageText}答案.pdf`; $('guide-pdf').href = `./downloads/阶段${stageText}零基础详解.pdf`;
      const concepts = [...new Set(course.questions.flatMap(q => q.concepts || []))];
      concepts.forEach(text => { const option = document.createElement('option'); option.value = option.textContent = text; $('concept-filter').append(option); });
      fillList('lesson-list', (course.lessons || []).map(lesson => typeof lesson === 'string' ? lesson : lesson.title));
      $('lesson-content').replaceChildren(...(course.lessons || []).map((lesson, index) => {
        const details = document.createElement('details'); details.className = 'lesson'; details.open = index === 0;
        const summary = document.createElement('summary'); summary.textContent = typeof lesson === 'string' ? lesson : lesson.title;
        const body = document.createElement('p'); body.textContent = typeof lesson === 'string' ? '' : lesson.body || lesson.content || '';
        details.append(summary, body);
        if (lesson.code) { const pre = document.createElement('pre'); pre.textContent = lesson.code; details.append(pre); }
        return details;
      }));
      fillList('course-notes', course.notes || []);
      const hash = decodeURIComponent(location.hash.slice(1)); selectQuestion(hash || saved.selected || course.questions[0].id);
    } catch (error) { $('load-error').hidden = false; $('load-error').textContent = `无法载入题库：${error.message} 请通过 http:// 或 https:// 打开网站。`; }
  })();
})();
