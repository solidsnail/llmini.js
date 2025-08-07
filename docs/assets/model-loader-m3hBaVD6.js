import{c as o,j as e,U as a,I as d}from"./index-VUGAKz4e.js";/**
 * @license lucide-react v0.534.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]],r=o("refresh-ccw",i),h=["ultravox-v0_5-llama-3_2-1b-ONNX","OuteTTS-0.2-500M"],l=({loadModel:s,loaded:c,error:n,progressInfo:t})=>e.jsxs(e.Fragment,{children:[!n&&t&&t.status!=="ready"&&e.jsx(a.Progress,{progressInfo:t,isInfinite:h.includes(t.name)}),!c&&e.jsx(a.Button,{icon:e.jsx(r,{size:d}),onClick:s,text:"Load model"})]});l.displayName="UiModelLoader";export{l as default};
