"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[64],{4991:function(e,n,t){t.d(n,{M:function(){return r}});function r(e,n){let{checkForDefaultPrevented:t=!0}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return function(r){if(null==e||e(r),!1===t||!r.defaultPrevented)return null==n?void 0:n(r)}}},1260:function(e,n,t){let r;t.d(n,{I0:function(){return b},XB:function(){return f},fC:function(){return p}});var u=t(2110),o=t(4090),i=t(4991),l=t(9586),s=t(1266),a=t(9830);let d="dismissableLayer.update",c=(0,o.createContext)({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),f=(0,o.forwardRef)((e,n)=>{var t;let{disableOutsidePointerEvents:f=!1,onEscapeKeyDown:v,onPointerDownOutside:p,onFocusOutside:b,onInteractOutside:h,onDismiss:y,...g}=e,O=(0,o.useContext)(c),[w,C]=(0,o.useState)(null),N=null!==(t=null==w?void 0:w.ownerDocument)&&void 0!==t?t:null==globalThis?void 0:globalThis.document,[,T]=(0,o.useState)({}),P=(0,s.e)(n,e=>C(e)),L=Array.from(O.layers),[D]=[...O.layersWithOutsidePointerEventsDisabled].slice(-1),M=L.indexOf(D),W=w?L.indexOf(w):-1,k=O.layersWithOutsidePointerEventsDisabled.size>0,I=W>=M,R=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null==globalThis?void 0:globalThis.document,t=(0,a.W)(e),r=(0,o.useRef)(!1),u=(0,o.useRef)(()=>{});return(0,o.useEffect)(()=>{let e=e=>{if(e.target&&!r.current){let r={originalEvent:e};function o(){E("dismissableLayer.pointerDownOutside",t,r,{discrete:!0})}"touch"===e.pointerType?(n.removeEventListener("click",u.current),u.current=o,n.addEventListener("click",u.current,{once:!0})):o()}else n.removeEventListener("click",u.current);r.current=!1},o=window.setTimeout(()=>{n.addEventListener("pointerdown",e)},0);return()=>{window.clearTimeout(o),n.removeEventListener("pointerdown",e),n.removeEventListener("click",u.current)}},[n,t]),{onPointerDownCapture:()=>r.current=!0}}(e=>{let n=e.target,t=[...O.branches].some(e=>e.contains(n));!I||t||(null==p||p(e),null==h||h(e),e.defaultPrevented||null==y||y())},N),S=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null==globalThis?void 0:globalThis.document,t=(0,a.W)(e),r=(0,o.useRef)(!1);return(0,o.useEffect)(()=>{let e=e=>{e.target&&!r.current&&E("dismissableLayer.focusOutside",t,{originalEvent:e},{discrete:!1})};return n.addEventListener("focusin",e),()=>n.removeEventListener("focusin",e)},[n,t]),{onFocusCapture:()=>r.current=!0,onBlurCapture:()=>r.current=!1}}(e=>{let n=e.target;[...O.branches].some(e=>e.contains(n))||(null==b||b(e),null==h||h(e),e.defaultPrevented||null==y||y())},N);return!function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null==globalThis?void 0:globalThis.document,t=(0,a.W)(e);(0,o.useEffect)(()=>{let e=e=>{"Escape"===e.key&&t(e)};return n.addEventListener("keydown",e),()=>n.removeEventListener("keydown",e)},[t,n])}(e=>{W!==O.layers.size-1||(null==v||v(e),!e.defaultPrevented&&y&&(e.preventDefault(),y()))},N),(0,o.useEffect)(()=>{if(w)return f&&(0===O.layersWithOutsidePointerEventsDisabled.size&&(r=N.body.style.pointerEvents,N.body.style.pointerEvents="none"),O.layersWithOutsidePointerEventsDisabled.add(w)),O.layers.add(w),m(),()=>{f&&1===O.layersWithOutsidePointerEventsDisabled.size&&(N.body.style.pointerEvents=r)}},[w,N,f,O]),(0,o.useEffect)(()=>()=>{w&&(O.layers.delete(w),O.layersWithOutsidePointerEventsDisabled.delete(w),m())},[w,O]),(0,o.useEffect)(()=>{let e=()=>T({});return document.addEventListener(d,e),()=>document.removeEventListener(d,e)},[]),(0,o.createElement)(l.WV.div,(0,u.Z)({},g,{ref:P,style:{pointerEvents:k?I?"auto":"none":void 0,...e.style},onFocusCapture:(0,i.M)(e.onFocusCapture,S.onFocusCapture),onBlurCapture:(0,i.M)(e.onBlurCapture,S.onBlurCapture),onPointerDownCapture:(0,i.M)(e.onPointerDownCapture,R.onPointerDownCapture)}))}),v=(0,o.forwardRef)((e,n)=>{let t=(0,o.useContext)(c),r=(0,o.useRef)(null),i=(0,s.e)(n,r);return(0,o.useEffect)(()=>{let e=r.current;if(e)return t.branches.add(e),()=>{t.branches.delete(e)}},[t.branches]),(0,o.createElement)(l.WV.div,(0,u.Z)({},e,{ref:i}))});function m(){let e=new CustomEvent(d);document.dispatchEvent(e)}function E(e,n,t,r){let{discrete:u}=r,o=t.originalEvent.target,i=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:t});n&&o.addEventListener(e,n,{once:!0}),u?(0,l.jH)(o,i):o.dispatchEvent(i)}let p=f,b=v},7881:function(e,n,t){t.d(n,{h:function(){return l}});var r=t(2110),u=t(4090),o=t(9542),i=t(9586);let l=(0,u.forwardRef)((e,n)=>{var t;let{container:l=null==globalThis?void 0:null===(t=globalThis.document)||void 0===t?void 0:t.body,...s}=e;return l?o.createPortal((0,u.createElement)(i.WV.div,(0,r.Z)({},s,{ref:n})),l):null})},2642:function(e,n,t){t.d(n,{z:function(){return l}});var r=t(4090),u=t(9542),o=t(1266),i=t(2618);let l=e=>{let{present:n,children:t}=e,l=function(e){var n,t;let[o,l]=(0,r.useState)(),a=(0,r.useRef)({}),d=(0,r.useRef)(e),c=(0,r.useRef)("none"),[f,v]=(n=e?"mounted":"unmounted",t={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},(0,r.useReducer)((e,n)=>{let r=t[e][n];return null!=r?r:e},n));return(0,r.useEffect)(()=>{let e=s(a.current);c.current="mounted"===f?e:"none"},[f]),(0,i.b)(()=>{let n=a.current,t=d.current;if(t!==e){let r=c.current,u=s(n);e?v("MOUNT"):"none"===u||(null==n?void 0:n.display)==="none"?v("UNMOUNT"):t&&r!==u?v("ANIMATION_OUT"):v("UNMOUNT"),d.current=e}},[e,v]),(0,i.b)(()=>{if(o){let e=e=>{let n=s(a.current).includes(e.animationName);e.target===o&&n&&(0,u.flushSync)(()=>v("ANIMATION_END"))},n=e=>{e.target===o&&(c.current=s(a.current))};return o.addEventListener("animationstart",n),o.addEventListener("animationcancel",e),o.addEventListener("animationend",e),()=>{o.removeEventListener("animationstart",n),o.removeEventListener("animationcancel",e),o.removeEventListener("animationend",e)}}v("ANIMATION_END")},[o,v]),{isPresent:["mounted","unmountSuspended"].includes(f),ref:(0,r.useCallback)(e=>{e&&(a.current=getComputedStyle(e)),l(e)},[])}}(n),a="function"==typeof t?t({present:l.isPresent}):r.Children.only(t),d=(0,o.e)(l.ref,a.ref);return"function"==typeof t||l.isPresent?(0,r.cloneElement)(a,{ref:d}):null};function s(e){return(null==e?void 0:e.animationName)||"none"}l.displayName="Presence"},9310:function(e,n,t){t.d(n,{T:function(){return o}});var r=t(4090),u=t(9830);function o(e){let{prop:n,defaultProp:t,onChange:o=()=>{}}=e,[i,l]=function(e){let{defaultProp:n,onChange:t}=e,o=(0,r.useState)(n),[i]=o,l=(0,r.useRef)(i),s=(0,u.W)(t);return(0,r.useEffect)(()=>{l.current!==i&&(s(i),l.current=i)},[i,l,s]),o}({defaultProp:t,onChange:o}),s=void 0!==n,a=s?n:i,d=(0,u.W)(o);return[a,(0,r.useCallback)(e=>{if(s){let t="function"==typeof e?e(n):e;t!==n&&d(t)}else l(e)},[s,n,l,d])]}},7288:function(e,n,t){t.d(n,{Z:function(){return u}});var r=t(8251);async function u(e){return(0,r.dw)("tauri",e)}}}]);