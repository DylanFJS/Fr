import "./chunk-CDK2B4E7.js";
import {
  d as d2,
  o as o3
} from "./chunk-ZF257OAW.js";
import {
  LitElement,
  a,
  b,
  css,
  d,
  e,
  html,
  m,
  m2,
  o,
  o2,
  r,
  r3 as r2,
  w
} from "./chunk-V5D7J42Y.js";
import {
  __decorate
} from "./chunk-NCOMLVU7.js";
import "./chunk-WKYGNSYM.js";

// node_modules/@cds/core/progress-circle/progress-circle.utils.js
function t(t2, e3 = 36) {
  return e3 / 2 - Math.ceil(t2 / 2);
}

// node_modules/@cds/core/progress-circle/progress-circle.element.scss.js
var s = css`@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}:host{--ring-opacity:1;--ring-color:var(--cds-alias-status-neutral-tint, var(--cds-global-color-construction-50, #f1f6f8));--fill-color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169));--fill-speed:var(--cds-global-animation-duration-secondary, 0.3s);font-family:inherit;font-size:inherit;color:inherit;display:block;cursor:inherit}.private-host,svg{height:100%;width:100%}svg{display:block}.private-host{display:flex;align-items:center;justify-content:center}.private-host .backstroke{stroke:var(--ring-color);opacity:var(--ring-opacity)}.private-host .arcstroke{stroke:var(--fill-color);transition:stroke-dashoffset var(--fill-speed) var(--cds-global-animation-easing-loop,cubic-bezier(.17,.4,.8,.79))}:host,:host([size=sm]){height:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)))}:host([size=md]){height:var(--cds-global-space-9,calc(24 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-9,calc(24 * 1rem / var(--cds-global-base,20)))}:host([size=lg]){height:var(--cds-global-space-11,calc(36 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-11,calc(36 * 1rem / var(--cds-global-base,20)))}:host([size=xl]){height:var(--cds-global-space-12,calc(48 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-12,calc(48 * 1rem / var(--cds-global-base,20)))}:host([size=xxl]){height:calc(var(--cds-global-space-13,calc(64 * 1rem / var(--cds-global-base,20))) - var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20))));width:calc(var(--cds-global-space-13,calc(64 * 1rem / var(--cds-global-base,20))) - var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20))))}:host([value="0"]) .fillstroke,:host([value="100"]) .fillstroke{display:none}:host(:not([value])) .progress-wrapper{animation:spin var(--cds-global-animation-duration-slowest,.8s) var(--cds-global-animation-easing-loop,cubic-bezier(.17,.4,.8,.79)) infinite}:host([status=info]){--ring-color:var(--cds-alias-status-info-tint, var(--cds-global-color-blue-50, #e6f7ff));--fill-color:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad))}:host([status=success]){--ring-color:var(--cds-alias-status-success-tint, var(--cds-global-color-green-50, #eefce3));--fill-color:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))}:host([status=warning]){--ring-color:var(--cds-alias-status-warning-tint, var(--cds-global-color-ochre-100, #fff2d6));--fill-color:var(--cds-alias-status-warning, var(--cds-global-color-ochre-500, #ffb92e))}:host([status=danger]){--ring-color:var(--cds-alias-status-danger-tint, var(--cds-global-color-red-50, #fff2f0));--fill-color:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))}:host([status=alt]){--ring-color:var(--cds-alias-status-alt-tint, var(--cds-global-color-violet-600, #9b32c8));--fill-color:var(--cds-alias-status-alt, var(--cds-global-color-violet-700, #7c12a5))}:host([inverse]){--ring-color:var(--cds-alias-status-neutral-tint, var(--cds-global-color-construction-50, #f1f6f8));--fill-color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))}`;

// node_modules/@cds/core/progress-circle/progress-circle.element.js
var d3 = class extends LitElement {
  constructor() {
    super(...arguments);
    this.status = "neutral", this.inverse = false, this.line = 3, this.i18n = a.keys.progress;
  }
  get radius() {
    return t(this.line);
  }
  get circumference() {
    return 2 * Math.PI * this.radius;
  }
  get progress() {
    return this.value ?? 30;
  }
  get progressOffset() {
    return (100 - this.progress) / 100 * this.circumference;
  }
  get size() {
    return this._size;
  }
  set size(s2) {
    if (d(s2, this._size)) {
      const i = this._size;
      this._size = s2, r(this, s2), this.requestUpdate("size", i);
    }
  }
  connectedCallback() {
    super.connectedCallback(), this._ariaLabel = this.ariaLabel, this.updateAria();
  }
  updated(s2) {
    super.updated(s2), (s2.has("value") || s2.has("i18n")) && this.updateAria();
  }
  updateAria() {
    this._ariaLabel === this.ariaLabel && (this._ariaLabel = e(this.value) ? this.i18n.looping : `${this.i18n.loading} ${this.value}%`, this.ariaLabel = this._ariaLabel), e(this.value) ? (this.role = "img", this.ariaValueMin = null, this.ariaValueMax = null, this.ariaValueNow = null) : (this.role = "progressbar", this.ariaValueMin = 0, this.ariaValueMax = 100, this.ariaValueNow = this.value);
  }
  render() {
    return html`<div class="private-host" aria-hidden="true"><div class="progress-wrapper"><svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false"><circle stroke-width="${this.line}" fill="none" cx="18" cy="18" r="${this.radius}" class="${this.progress > 99 ? "arcstroke" : "backstroke"}"/><path d="M 18 18 m 0,-${this.radius} a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius} a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}" class="fillstroke arcstroke" stroke-width="${this.line}" stroke-dasharray="${this.circumference}" stroke-dashoffset="${this.progressOffset}" fill="none"/></svg></div></div>`;
  }
  static get styles() {
    return [o2, s];
  }
};
__decorate([m({ type: String })], d3.prototype, "status", void 0), __decorate([m({ type: Boolean })], d3.prototype, "inverse", void 0), __decorate([m({ type: Number })], d3.prototype, "value", void 0), __decorate([m({ type: Number })], d3.prototype, "line", void 0), __decorate([m({ type: String })], d3.prototype, "size", null), __decorate([o()], d3.prototype, "i18n", void 0);

// node_modules/@cds/core/progress-circle/register.js
w("cds-progress-circle", d3);

// node_modules/@cds/core/button/button.element.scss.js
var o4 = css`:host{--box-shadow-color:var(--cds-alias-object-opacity-100, rgba(0, 0, 0, 0.2));--border-radius:var(--cds-alias-object-border-radius-100, calc(4 * 1rem / var(--cds-global-base, 20)));--border-width:var(--cds-alias-object-border-width-100, calc(1 * 1rem / var(--cds-global-base, 20)));--border-color:var(--background);--background:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad));--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white));--font-size:var(--cds-global-typography-font-size-2, calc(12 * 1rem / var(--cds-global-base, 20)));--padding:calc(var(--cds-global-space-6, calc(12 * 1rem / var(--cds-global-base, 20))) - var(--border-width));--height:var(--cds-global-space-11, calc(36 * 1rem / var(--cds-global-base, 20)));--min-width:var(--cds-global-space-13, calc(64 * 1rem / var(--cds-global-base, 20)));--text-decoration:none;--font-weight:var(--cds-global-typography-font-weight-semibold, 600);--font-family:var(--cds-global-typography-font-family, "Clarity City", "Avenir Next", sans-serif);--text-transform:uppercase;--letter-spacing:0.12em;display:inline-block;height:var(--height)}.private-host{display:inline-flex;align-items:center;-webkit-appearance:none!important;border-color:var(--border-color);border-radius:var(--border-radius);border-style:solid;border-width:var(--border-width);color:var(--color);cursor:pointer;font-size:var(--font-size);height:100%;line-height:1em;min-width:var(--min-width);overflow:visible;padding:var(--padding);position:relative;text-align:center;text-decoration:var(--text-decoration);text-overflow:ellipsis;transform:translateZ(0);user-select:none;vertical-align:middle;white-space:nowrap;width:100%;font-family:var(--font-family);font-weight:var(--font-weight);letter-spacing:var(--letter-spacing);text-transform:var(--text-transform)}.private-host>span{display:flex;align-items:center;justify-content:center;height:100%}cds-progress-circle{--ring-color:var(--cds-global-color-construction-400, #859399)}:host(:active) .private-host,:host(:active) .private-host::after{box-shadow:0 var(--cds-global-space-2,calc(2 * 1rem / var(--cds-global-base,20))) 0 0 var(--box-shadow-color) inset}.private-host::after{--offset:calc(-1 * var(--cds-global-space-1, calc(1 * 1rem / var(--cds-global-base, 20))));background:var(--background);border-radius:var(--border-radius);position:absolute;content:"";top:var(--offset);left:var(--offset);bottom:var(--offset);right:var(--offset);inset:var(--offset);z-index:-1}:host(:active) .private-host::after,:host(:focus) .private-host::after,:host(:hover) .private-host::after{filter:brightness(90%)}:host([action=outline]) .private-host::after{filter:brightness(100%);opacity:0}:host([action=outline]:active) .private-host::after,:host([action=outline]:focus) .private-host::after,:host([action=outline]:hover) .private-host::after,:host([status=inverse]:active) .private-host::after,:host([status=inverse]:focus) .private-host::after,:host([status=inverse]:hover) .private-host::after{opacity:.1}::slotted{line-height:1em!important;color:inherit!important}::slotted(cds-icon){--color:inherit;height:calc(var(--font-size) + (2*var(--cds-global-space-2,calc(2 * 1rem / var(--cds-global-base,20)))));width:calc(var(--font-size) + (2*var(--cds-global-space-2,calc(2 * 1rem / var(--cds-global-base,20)))))}:host([status=success]){--background:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))}:host([status=warning]){--background:var(--cds-alias-status-warning, var(--cds-global-color-ochre-500, #ffb92e));--color:var(--cds-global-color-construction-900, #21333b)}:host([status=danger]){--background:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))}:host([status=neutral]){--background:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))}:host([action=outline]){--color:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad));--border-color:var(--color)}:host([status=success][action=outline]){--color:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))}:host([status=warning][action=outline]){--color:var(--cds-alias-status-warning-dark, var(--cds-global-color-ochre-800, #a36500))}:host([status=danger][action=outline]){--color:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))}:host([status=neutral][action=outline]){--color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))}:host([status=inverse]){--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white));--background:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0))}:host([disabled][status=inverse]),:host([disabled][status=inverse][action=outline]),:host([status=inverse]){--border-color:var(--color)}:host([action*=flat]){--background:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0));--border-color:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0));--color:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad));--box-shadow-color:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0))}:host([action=flat-inline]){--height:auto;--padding:0;--min-width:auto;line-height:0}:host([status=success][action*=flat]){--color:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))}:host([status=warning][action*=flat]){--color:var(--cds-alias-status-warning-dark, var(--cds-global-color-ochre-800, #a36500))}:host([status=danger][action*=flat]){--color:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))}:host([status=neutral][action*=flat]){--color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))}:host([status=inverse][action*=flat]){--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))}:host([size=sm]){--padding:var(--cds-global-space-4, calc(6 * 1rem / var(--cds-global-base, 20))) var(--cds-global-space-6, calc(12 * 1rem / var(--cds-global-base, 20)));--height:calc(var(--cds-global-space-9, calc(24 * 1rem / var(--cds-global-base, 20))) + var(--cds-global-space-1, calc(1 * 1rem / var(--cds-global-base, 20))))}:host([size=sm]) .private-host .spinner:not(.spinner-check){height:var(--cds-global-space-6,calc(12 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-6,calc(12 * 1rem / var(--cds-global-base,20)));min-height:var(--cds-global-space-6,calc(12 * 1rem / var(--cds-global-base,20)));min-width:var(--cds-global-space-6,calc(12 * 1rem / var(--cds-global-base,20)))}:host([disabled]:active){pointer-events:none!important}:host([disabled]),:host([disabled][action=outline]){--background:var(--cds-alias-status-disabled-tint, var(--cds-global-color-construction-200, #cbd4d8));--border-color:var(--cds-alias-status-disabled-tint, var(--cds-global-color-construction-200, #cbd4d8));--box-shadow-color:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0))}:host([disabled]) .private-host,:host([disabled][action=outline]) .private-host{cursor:not-allowed;outline:0}:host([disabled]) .private-host::after,:host([disabled][action=outline]) .private-host::after{filter:brightness(100%)!important;opacity:1!important}:host([disabled][action*=flat]),:host([disabled][action=outline]),:host([disabled][status=inverse]){--background:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0));--color:var(--cds-alias-status-disabled, var(--cds-global-color-construction-300, #aeb8bc))}:host([disabled][action*=flat]){--border-color:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0))}:host([block]){width:100%}:host([size=icon]){--padding:calc(var(--cds-global-space-6, calc(12 * 1rem / var(--cds-global-base, 20))) - var(--border-width)) calc(var(--cds-global-space-6, calc(12 * 1rem / var(--cds-global-base, 20))) - var(--cds-global-space-2, calc(2 * 1rem / var(--cds-global-base, 20))) - var(--border-width))}:host([size=icon]) .private-host{min-width:0}:host([size=sm]) .private-host{--letter-spacing:0.073em}:host([action*=flat]) ::slotted(cds-badge),:host([action=outline]) ::slotted(cds-badge){--border-color:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad));--background:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad));--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))}:host([action*=flat][status=success]) ::slotted(cds-badge),:host([action=outline][status=success]) ::slotted(cds-badge){--border-color:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e));--background:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e));--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))}:host([action*=flat][status=warning]) ::slotted(cds-badge),:host([action=outline][status=warning]) ::slotted(cds-badge){--border-color:var(--cds-alias-status-warning-dark, var(--cds-global-color-ochre-800, #a36500));--background:var(--cds-alias-status-warning-dark, var(--cds-global-color-ochre-800, #a36500));--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))}:host([action*=flat][status=danger]) ::slotted(cds-badge),:host([action=outline][status=danger]) ::slotted(cds-badge){--border-color:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200));--background:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200));--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))}:host([action*=flat][status=neutral]) ::slotted(cds-badge),:host([action=outline][status=neutral]) ::slotted(cds-badge){--border-color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169));--background:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169));--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))}:host(:not([action=outline]):not([action*=flat])) ::slotted(cds-badge){--background:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0));--border-color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white));--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))}:host([action=solid][status=warning]) ::slotted(cds-badge){--border-color:var(--cds-global-color-construction-900, #21333b);--color:var(--cds-global-color-construction-900, #21333b)}:host([action*=flat][disabled]) ::slotted(cds-badge){--background:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0));--border-color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169));--color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))}:host([status=inverse]) ::slotted(cds-badge){--border-color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))!important;--color:var(--cds-global-typography-color-100, var(--cds-global-color-white, white))!important;--font-weight:var(--cds-global-typography-font-weight-semibold, 600)!important}:host([disabled]) ::slotted(cds-badge),:host([status=inverse]) ::slotted(cds-badge){--background:var(--cds-alias-object-opacity-0, rgba(0, 0, 0, 0))!important}:host([disabled][action*=flat]) ::slotted(cds-badge),:host([disabled][action=outline]) ::slotted(cds-badge),:host([disabled][status=inverse]) ::slotted(cds-badge){--border-color:var(--cds-alias-status-disabled, var(--cds-global-color-construction-300, #aeb8bc))!important;--color:var(--cds-alias-status-disabled, var(--cds-global-color-construction-300, #aeb8bc))!important}::slotted(span)::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((.1475em + 0em)*-1) + .037em)}::slotted(span)::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - .1475em - .1703em - .517em) + 0em)*-1) - .044em)}`;

// node_modules/@cds/core/button/button.element.js
var d4;
!function(t2) {
  t2.default = "default", t2.loading = "loading", t2.success = "success", t2.error = "error";
}(d4 || (d4 = {}));
var l = class extends m2 {
  constructor() {
    super(...arguments);
    this.action = "solid", this.status = "primary", this.size = "md", this.block = false, this.loadingState = d4.default, this._disabledExternally = false;
  }
  get disabled() {
    return super.disabled;
  }
  set disabled(t2) {
    this._disabledExternally = t2, super.disabled = t2;
  }
  firstUpdated(t2) {
    super.firstUpdated(t2), this.isDefaultLoadingState(this.loadingState) || (super.disabled = true);
  }
  update(t2) {
    t2.has("loadingState") && void 0 !== t2.get("loadingState") && (this.isDefaultLoadingState(this.loadingState) ? this.restoreButton() : this.disableButton()), super.update(t2);
  }
  render() {
    return html`<div class="private-host" cds-layout="horizontal gap:xs wrap:none align:center">${this.loadingState === d4.success ? html`<cds-icon shape="check" status="success" size="18"></cds-icon>` : ""} ${this.loadingState === d4.error ? html`<cds-icon shape="error-standard" status="danger" size="18"></cds-icon>` : ""} ${this.loadingState === d4.loading ? html`<cds-progress-circle .size="${"sm" === this.size ? "12" : "18"}" status="info"></cds-progress-circle>` : ""} ${this.loadingState === d4.default ? html`<slot></slot>` : ""}</div>`;
  }
  isDefaultLoadingState(t2) {
    return t2 === d4.default;
  }
  disableButton() {
    this.style.width = b(this), super.disabled = true;
  }
  restoreButton() {
    this.style.removeProperty("width"), super.disabled = this._disabledExternally;
  }
};
l.styles = [o2, o4], __decorate([m({ type: String })], l.prototype, "action", void 0), __decorate([m({ type: String })], l.prototype, "status", void 0), __decorate([m({ type: String })], l.prototype, "size", void 0), __decorate([m({ type: Boolean })], l.prototype, "block", void 0), __decorate([m({ type: String })], l.prototype, "loadingState", void 0), __decorate([m({ type: Boolean })], l.prototype, "disabled", null);

// node_modules/@cds/core/button/icon-button.element.js
var e2 = class extends l {
  constructor() {
    super();
    this.size = "icon";
  }
};

// node_modules/@cds/core/button/register.js
r2.addIcons(d2, o3), w("cds-button", l), w("cds-icon-button", e2);
//# sourceMappingURL=@cds_core_button_register__js.js.map
