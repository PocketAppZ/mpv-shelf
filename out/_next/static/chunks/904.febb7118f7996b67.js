"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[904],{3854:function(e,t,n){n.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,n(7461).Z)("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]])},1213:function(e,t,n){n.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,n(7461).Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},7904:function(e,t,n){n.r(t),n.d(t,{UserAvatar:function(){return m}});var r=n(3827),l=n(4090),o=n(2178),a=n(2169);let u=l.forwardRef((e,t)=>{let{className:n,...l}=e;return(0,r.jsx)(o.fC,{ref:t,className:(0,a.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",n),...l})});u.displayName=o.fC.displayName;let i=l.forwardRef((e,t)=>{let{className:n,...l}=e;return(0,r.jsx)(o.Ee,{ref:t,className:(0,a.cn)("aspect-square h-full w-full",n),...l})});i.displayName=o.Ee.displayName;let c=l.forwardRef((e,t)=>{let{className:n,...l}=e;return(0,r.jsx)(o.NY,{ref:t,className:(0,a.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted",n),...l})});c.displayName=o.NY.displayName;var d=n(1213),s=n(3854),f=n(7907);function m(e){let{userObject:t,asChild:n}=e,l=(0,f.usePathname)();return console.log("userAvatar"),(0,r.jsxs)(u,{className:(0,a.cn)("h-auto w-40 text-xl font-medium rounded-sm md:w-52 lg:w-64 xl:w-80 flex justify-center items-center outline drop-shadow-lg shadow-md text-background",n&&"h-auto w-full text-lg font-medium outline rounded",n&&(null==t?void 0:t.imagePath)&&"md:w-3/4 rounded-none",n&&(null==t?void 0:t.imagePath)&&"h-40 md:w-40 rounded-sm",n&&!(null==t?void 0:t.imagePath)&&"outline drop-shadow-md",n&&t.imagePath&&"w-full outline-none"),children:[(0,r.jsx)(i,{src:(null==t?void 0:t.imagePath)?null==t?void 0:t.imagePath:"",alt:null==t?void 0:t.id.toString(),className:(0,a.cn)("object-cover drop-shadow-md",n&&"w-5/6 lg:w-[60%]")}),(0,r.jsx)(c,{className:(0,a.cn)("h-40 w-40 text-xl font-medium rounded-sm select-none flex justify-center items-center",n&&"w-full text-lg font-medium",!n&&"md:w-52\n                 md:h-52  \n                 lg:w-64 \n                 lg:h-64\n                 xl:h-80\n                 xl:w-80",l.includes("/login")&&"h-40 w-40"),children:(0,r.jsxs)("div",{className:"flex h-full w-full flex-col items-center justify-center",style:{backgroundColor:"".concat(null==t?void 0:t.color)},children:[(0,r.jsx)("span",{className:(0,a.cn)("flex outline outline-2 text-center  \n                        md:text-2xl \n                        md:pb-0.5\n                        lg:text-4xl\n                        lg:mt-3\n                        xl:pb-1.5\n                        xl:text-5xl \n                        rounded-sm px-2 font-bold text-lg\n                        drop-shadow-md",!(null==t?void 0:t.id)&&"outline-none shadow-none",n&&"text-lg md:text-xl lg:text-2xl xl:text-3xl"),children:null==t?void 0:t.id}),(null==t?void 0:t.id)?(0,r.jsx)(d.Z,{className:"h-auto w-1/2 drop-shadow-md",strokeWidth:1.3}):(0,r.jsx)(s.Z,{className:"h-auto w-1/2 text-tertiary drop-shadow-md",strokeWidth:1.3})]})})]})}},2110:function(e,t,n){n.d(t,{Z:function(){return r}});function r(){return(r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}},2178:function(e,t,n){n.d(t,{Ee:function(){return x},NY:function(){return w},fC:function(){return g}});var r=n(2110),l=n(4090),o=n(4104),a=n(9830),u=n(2618),i=n(9586);let c="Avatar",[d,s]=(0,o.b)(c),[f,m]=d(c),h=(0,l.forwardRef)((e,t)=>{let{__scopeAvatar:n,...o}=e,[a,u]=(0,l.useState)("idle");return(0,l.createElement)(f,{scope:n,imageLoadingStatus:a,onImageLoadingStatusChange:u},(0,l.createElement)(i.WV.span,(0,r.Z)({},o,{ref:t})))}),p=(0,l.forwardRef)((e,t)=>{let{__scopeAvatar:n,src:o,onLoadingStatusChange:c=()=>{},...d}=e,s=m("AvatarImage",n),f=function(e){let[t,n]=(0,l.useState)("idle");return(0,u.b)(()=>{if(!e){n("error");return}let t=!0,r=new window.Image,l=e=>()=>{t&&n(e)};return n("loading"),r.onload=l("loaded"),r.onerror=l("error"),r.src=e,()=>{t=!1}},[e]),t}(o),h=(0,a.W)(e=>{c(e),s.onImageLoadingStatusChange(e)});return(0,u.b)(()=>{"idle"!==f&&h(f)},[f,h]),"loaded"===f?(0,l.createElement)(i.WV.img,(0,r.Z)({},d,{ref:t,src:o})):null}),v=(0,l.forwardRef)((e,t)=>{let{__scopeAvatar:n,delayMs:o,...a}=e,u=m("AvatarFallback",n),[c,d]=(0,l.useState)(void 0===o);return(0,l.useEffect)(()=>{if(void 0!==o){let e=window.setTimeout(()=>d(!0),o);return()=>window.clearTimeout(e)}},[o]),c&&"loaded"!==u.imageLoadingStatus?(0,l.createElement)(i.WV.span,(0,r.Z)({},a,{ref:t})):null}),g=h,x=p,w=v},1266:function(e,t,n){n.d(t,{F:function(){return l},e:function(){return o}});var r=n(4090);function l(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return e=>t.forEach(t=>{"function"==typeof t?t(e):null!=t&&(t.current=e)})}function o(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,r.useCallback)(l(...t),t)}},4104:function(e,t,n){n.d(t,{b:function(){return l}});var r=n(4090);function l(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=[],l=()=>{let t=n.map(e=>(0,r.createContext)(e));return function(n){let l=(null==n?void 0:n[e])||t;return(0,r.useMemo)(()=>({["__scope".concat(e)]:{...n,[e]:l}}),[n,l])}};return l.scopeName=e,[function(t,l){let o=(0,r.createContext)(l),a=n.length;function u(t){let{scope:n,children:l,...u}=t,i=(null==n?void 0:n[e][a])||o,c=(0,r.useMemo)(()=>u,Object.values(u));return(0,r.createElement)(i.Provider,{value:c},l)}return n=[...n,l],u.displayName=t+"Provider",[u,function(n,u){let i=(null==u?void 0:u[e][a])||o,c=(0,r.useContext)(i);if(c)return c;if(void 0!==l)return l;throw Error("`".concat(n,"` must be used within `").concat(t,"`"))}]},function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let l=t[0];if(1===t.length)return l;let o=()=>{let e=t.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(t){let n=e.reduce((e,n)=>{let{useScope:r,scopeName:l}=n,o=r(t)["__scope".concat(l)];return{...e,...o}},{});return(0,r.useMemo)(()=>({["__scope".concat(l.scopeName)]:n}),[n])}};return o.scopeName=l.scopeName,o}(l,...t)]}},9586:function(e,t,n){n.d(t,{WV:function(){return u},jH:function(){return i}});var r=n(2110),l=n(4090),o=n(9542),a=n(9143);let u=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,t)=>{let n=(0,l.forwardRef)((e,n)=>{let{asChild:o,...u}=e,i=o?a.g7:t;return(0,l.useEffect)(()=>{window[Symbol.for("radix-ui")]=!0},[]),(0,l.createElement)(i,(0,r.Z)({},u,{ref:n}))});return n.displayName="Primitive.".concat(t),{...e,[t]:n}},{});function i(e,t){e&&(0,o.flushSync)(()=>e.dispatchEvent(t))}},9143:function(e,t,n){n.d(t,{A4:function(){return i},g7:function(){return a}});var r=n(2110),l=n(4090),o=n(1266);let a=(0,l.forwardRef)((e,t)=>{let{children:n,...o}=e,a=l.Children.toArray(n),i=a.find(c);if(i){let e=i.props.children,n=a.map(t=>t!==i?t:l.Children.count(e)>1?l.Children.only(null):(0,l.isValidElement)(e)?e.props.children:null);return(0,l.createElement)(u,(0,r.Z)({},o,{ref:t}),(0,l.isValidElement)(e)?(0,l.cloneElement)(e,void 0,n):null)}return(0,l.createElement)(u,(0,r.Z)({},o,{ref:t}),n)});a.displayName="Slot";let u=(0,l.forwardRef)((e,t)=>{let{children:n,...r}=e;return(0,l.isValidElement)(n)?(0,l.cloneElement)(n,{...function(e,t){let n={...t};for(let r in t){let l=e[r],o=t[r];/^on[A-Z]/.test(r)?l&&o?n[r]=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];o(...t),l(...t)}:l&&(n[r]=l):"style"===r?n[r]={...l,...o}:"className"===r&&(n[r]=[l,o].filter(Boolean).join(" "))}return{...e,...n}}(r,n.props),ref:t?(0,o.F)(t,n.ref):n.ref}):l.Children.count(n)>1?l.Children.only(null):null});u.displayName="SlotClone";let i=e=>{let{children:t}=e;return(0,l.createElement)(l.Fragment,null,t)};function c(e){return(0,l.isValidElement)(e)&&e.type===i}},9830:function(e,t,n){n.d(t,{W:function(){return l}});var r=n(4090);function l(e){let t=(0,r.useRef)(e);return(0,r.useEffect)(()=>{t.current=e}),(0,r.useMemo)(()=>function(){for(var e,n=arguments.length,r=Array(n),l=0;l<n;l++)r[l]=arguments[l];return null===(e=t.current)||void 0===e?void 0:e.call(t,...r)},[])}},2618:function(e,t,n){n.d(t,{b:function(){return l}});var r=n(4090);let l=(null==globalThis?void 0:globalThis.document)?r.useLayoutEffect:()=>{}}}]);