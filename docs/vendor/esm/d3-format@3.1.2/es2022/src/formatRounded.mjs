/* esm.sh - d3-format@3.1.2/src/formatRounded */
import{formatDecimalParts as o}from"./formatDecimal.mjs";function f(t,i){var n=o(t,i);if(!n)return t+"";var e=n[0],r=n[1];return r<0?"0."+new Array(-r).join("0")+e:e.length>r+1?e.slice(0,r+1)+"."+e.slice(r+1):e+new Array(r-e.length+2).join("0")}export{f as default};
//# sourceMappingURL=formatRounded.mjs.map