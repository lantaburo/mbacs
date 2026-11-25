import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

class FakeElement {
  constructor() {
    this.dataset = {};
    this.hidden = false;
    this.value = '';
    this.style = {};
    this.listeners = {};
    this.classList = { add() {}, remove() {}, toggle() {} };
  }

  set textContent(value) {
    this._textContent = String(value ?? '');
    this._innerHTML = this._textContent
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  get textContent() { return this._textContent ?? ''; }
  set innerHTML(value) { this._innerHTML = String(value ?? ''); }
  get innerHTML() { return this._innerHTML ?? ''; }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  querySelector() { return new FakeElement(); }
  closest() { return null; }
  reset() {}
}

const elements = new Map();
const getElement = (selector) => {
  if (!elements.has(selector)) elements.set(selector, new FakeElement());
  return elements.get(selector);
};

const localData = new Map();
const context = vm.createContext({
  console: { ...console, warn() {} },
  Blob,
  URL,
  FormData,
  Date,
  setTimeout,
  clearTimeout,
  confirm: () => true,
  fetch: async () => ({ ok: false, status: 401, json: async () => ({ error: 'Mode test lokal' }) }),
  localStorage: {
    getItem: (key) => localData.get(key) ?? null,
    setItem: (key, value) => localData.set(key, value),
    removeItem: (key) => localData.delete(key),
  },
  document: {
    body: { style: {} },
    querySelector: getElement,
    querySelectorAll: () => [],
    createElement: () => new FakeElement(),
    addEventListener() {},
  },
  window: { scrollTo() {} },
});

const source = fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
vm.runInContext(source, context, { filename: 'dist/app.js' });

assert.match(getElement('#attentionList').innerHTML, /Dimas Prasetyo/);
assert.match(getElement('#kanbanBoard').innerHTML, /data-advance-lead/);
assert.match(getElement('#customerTable').innerHTML, /data-customer-index/);

context.openModal('new-lead');
assert.match(getElement('#quickFormFields').innerHTML, /Sumber lead/);
assert.equal(getElement('#quickForm').dataset.action, 'new-lead');

context.openModal('new-booking');
assert.match(getElement('#quickFormFields').innerHTML, /Bay servis/);

context.openCustomer(0);
assert.match(getElement('#quickFormFields').innerHTML, /Customer 360|Ringkasan hubungan/);
assert.equal(getElement('#formSubmitButton').hidden, true);

console.log('MBACS UI smoke test passed');
