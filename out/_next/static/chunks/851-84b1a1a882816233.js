"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[851],{2110:function(e,n,t){t.d(n,{Z:function(){return r}});function r(){return(r=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}},1266:function(e,n,t){t.d(n,{F:function(){return l},e:function(){return u}});var r=t(4090);function l(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return e=>n.forEach(n=>{"function"==typeof n?n(e):null!=n&&(n.current=e)})}function u(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return(0,r.useCallback)(l(...n),n)}},4104:function(e,n,t){t.d(n,{b:function(){return l}});var r=t(4090);function l(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],t=[],l=()=>{let n=t.map(e=>(0,r.createContext)(e));return function(t){let l=(null==t?void 0:t[e])||n;return(0,r.useMemo)(()=>({["__scope".concat(e)]:{...t,[e]:l}}),[t,l])}};return l.scopeName=e,[function(n,l){let u=(0,r.createContext)(l),o=t.length;function i(n){let{scope:t,children:l,...i}=n,c=(null==t?void 0:t[e][o])||u,a=(0,r.useMemo)(()=>i,Object.values(i));return(0,r.createElement)(c.Provider,{value:a},l)}return t=[...t,l],i.displayName=n+"Provider",[i,function(t,i){let c=(null==i?void 0:i[e][o])||u,a=(0,r.useContext)(c);if(a)return a;if(void 0!==l)return l;throw Error("`".concat(t,"` must be used within `").concat(n,"`"))}]},function(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];let l=n[0];if(1===n.length)return l;let u=()=>{let e=n.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(n){let t=e.reduce((e,t)=>{let{useScope:r,scopeName:l}=t,u=r(n)["__scope".concat(l)];return{...e,...u}},{});return(0,r.useMemo)(()=>({["__scope".concat(l.scopeName)]:t}),[t])}};return u.scopeName=l.scopeName,u}(l,...n)]}},9586:function(e,n,t){t.d(n,{WV:function(){return i},jH:function(){return c}});var r=t(2110),l=t(4090),u=t(9542),o=t(9143);let i=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,n)=>{let t=(0,l.forwardRef)((e,t)=>{let{asChild:u,...i}=e,c=u?o.g7:n;return(0,l.useEffect)(()=>{window[Symbol.for("radix-ui")]=!0},[]),(0,l.createElement)(c,(0,r.Z)({},i,{ref:t}))});return t.displayName="Primitive.".concat(n),{...e,[n]:t}},{});function c(e,n){e&&(0,u.flushSync)(()=>e.dispatchEvent(n))}},9143:function(e,n,t){t.d(n,{A4:function(){return c},g7:function(){return o}});var r=t(2110),l=t(4090),u=t(1266);let o=(0,l.forwardRef)((e,n)=>{let{children:t,...u}=e,o=l.Children.toArray(t),c=o.find(a);if(c){let e=c.props.children,t=o.map(n=>n!==c?n:l.Children.count(e)>1?l.Children.only(null):(0,l.isValidElement)(e)?e.props.children:null);return(0,l.createElement)(i,(0,r.Z)({},u,{ref:n}),(0,l.isValidElement)(e)?(0,l.cloneElement)(e,void 0,t):null)}return(0,l.createElement)(i,(0,r.Z)({},u,{ref:n}),t)});o.displayName="Slot";let i=(0,l.forwardRef)((e,n)=>{let{children:t,...r}=e;return(0,l.isValidElement)(t)?(0,l.cloneElement)(t,{...function(e,n){let t={...n};for(let r in n){let l=e[r],u=n[r];/^on[A-Z]/.test(r)?l&&u?t[r]=function(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];u(...n),l(...n)}:l&&(t[r]=l):"style"===r?t[r]={...l,...u}:"className"===r&&(t[r]=[l,u].filter(Boolean).join(" "))}return{...e,...t}}(r,t.props),ref:n?(0,u.F)(n,t.ref):t.ref}):l.Children.count(t)>1?l.Children.only(null):null});i.displayName="SlotClone";let c=e=>{let{children:n}=e;return(0,l.createElement)(l.Fragment,null,n)};function a(e){return(0,l.isValidElement)(e)&&e.type===c}},9830:function(e,n,t){t.d(n,{W:function(){return l}});var r=t(4090);function l(e){let n=(0,r.useRef)(e);return(0,r.useEffect)(()=>{n.current=e}),(0,r.useMemo)(()=>function(){for(var e,t=arguments.length,r=Array(t),l=0;l<t;l++)r[l]=arguments[l];return null===(e=n.current)||void 0===e?void 0:e.call(n,...r)},[])}},2618:function(e,n,t){t.d(n,{b:function(){return l}});var r=t(4090);let l=(null==globalThis?void 0:globalThis.document)?r.useLayoutEffect:()=>{}},7742:function(e,n,t){t.d(n,{j:function(){return u}});let r=e=>"boolean"==typeof e?"".concat(e):0===e?"0":e,l=function(){for(var e,n,t=0,r="";t<arguments.length;)(e=arguments[t++])&&(n=function e(n){var t,r,l="";if("string"==typeof n||"number"==typeof n)l+=n;else if("object"==typeof n){if(Array.isArray(n))for(t=0;t<n.length;t++)n[t]&&(r=e(n[t]))&&(l&&(l+=" "),l+=r);else for(t in n)n[t]&&(l&&(l+=" "),l+=t)}return l}(e))&&(r&&(r+=" "),r+=n);return r},u=(e,n)=>t=>{var u;if((null==n?void 0:n.variants)==null)return l(e,null==t?void 0:t.class,null==t?void 0:t.className);let{variants:o,defaultVariants:i}=n,c=Object.keys(o).map(e=>{let n=null==t?void 0:t[e],l=null==i?void 0:i[e];if(null===n)return null;let u=r(n)||r(l);return o[e][u]}),a=t&&Object.entries(t).reduce((e,n)=>{let[t,r]=n;return void 0===r||(e[t]=r),e},{});return l(e,c,null==n?void 0:null===(u=n.compoundVariants)||void 0===u?void 0:u.reduce((e,n)=>{let{class:t,className:r,...l}=n;return Object.entries(l).every(e=>{let[n,t]=e;return Array.isArray(t)?t.includes({...i,...a}[n]):({...i,...a})[n]===t})?[...e,t,r]:e},[]),null==t?void 0:t.class,null==t?void 0:t.className)}}}]);