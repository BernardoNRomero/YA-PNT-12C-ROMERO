/* esm.sh - ngraph.forcelayout@3.3.1 */
import*as __0$ from"../../ngraph.events@^1.0.0__Q__target=es2022.mjs";import*as __1$ from"../../ngraph.merge@^1.0.0__Q__target=es2022.mjs";import*as __2$ from"../../ngraph.random@^1.0.0__Q__target=es2022.mjs";var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({__esModule:true},m);switch(n){case"ngraph.events":return c(__0$);case"ngraph.merge":return e(__1$);case"ngraph.random":return e(__2$);default:console.error('module "'+n+'" not found');return null;}};
var qe=Object.create;var K=Object.defineProperty;var Fe=Object.getOwnPropertyDescriptor;var Se=Object.getOwnPropertyNames;var Ie=Object.getPrototypeOf,_e=Object.prototype.hasOwnProperty;var Q=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,i)=>(typeof require<"u"?require:e)[i]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')});var g=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Ne=(t,e,i,d)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of Se(e))!_e.call(t,a)&&a!==i&&K(t,a,{get:()=>e[a],enumerable:!(d=Fe(e,a))||d.enumerable});return t};var Pe=(t,e,i)=>(i=t!=null?qe(Ie(t)):{},Ne(e||!t||!t.__esModule?K(i,"default",{value:t,enumerable:!0}):i,t));var W=g((rt,Y)=>{Y.exports=function(e){return e===0?"x":e===1?"y":e===2?"z":"c"+(e+1)}});var q=g((ot,Z)=>{var Me=W();Z.exports=function(e){return i;function i(d,a){let s=a&&a.indent||0,h=a&&a.join!==void 0?a.join:`
`,c=Array(s+1).join(" "),f=[];for(let u=0;u<e;++u){let v=Me(u),F=u===0?"":c;f.push(F+d.replace(/{var}/g,v))}return f.join(h)}}});var oe=g((it,T)=>{var ee=q();T.exports=je;T.exports.generateCreateBodyFunctionBody=te;T.exports.getVectorCode=re;T.exports.getBodyCode=ne;function je(t,e){let i=te(t,e),{Body:d}=new Function(i)();return d}function te(t,e){return`
${re(t,e)}
${ne(t,e)}
return {Body: Body, Vector: Vector};
`}function ne(t){let e=ee(t),i=e("{var}",{join:", "});return`
function Body(${i}) {
  this.isPinned = false;
  this.pos = new Vector(${i});
  this.force = new Vector();
  this.velocity = new Vector();
  this.mass = 1;

  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.reset = function() {
  this.force.reset();
  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.setPosition = function (${i}) {
  ${e("this.pos.{var} = {var} || 0;",{indent:2})}
};`}function re(t,e){let i=ee(t),d="";return e&&(d=`${i(`
   var v{var};
Object.defineProperty(this, '{var}', {
  set: function(v) { 
    if (!Number.isFinite(v)) throw new Error('Cannot set non-numbers to {var}');
    v{var} = v; 
  },
  get: function() { return v{var}; }
});`)}`),`function Vector(${i("{var}",{join:", "})}) {
  ${d}
    if (typeof arguments[0] === 'object') {
      // could be another vector
      let v = arguments[0];
      ${i('if (!Number.isFinite(v.{var})) throw new Error("Expected value is not a finite number at Vector constructor ({var})");',{indent:4})}
      ${i("this.{var} = v.{var};",{indent:4})}
    } else {
      ${i('this.{var} = typeof {var} === "number" ? {var} : 0;',{indent:4})}
    }
  }
  
  Vector.prototype.reset = function () {
    ${i("this.{var} = ",{join:""})}0;
  };`}});var fe=g((at,w)=>{var z=q(),B=W();w.exports=Te;w.exports.generateQuadTreeFunctionBody=ie;w.exports.getInsertStackCode=ce;w.exports.getQuadNodeCode=ue;w.exports.isSamePosition=ae;w.exports.getChildBodyCode=se;w.exports.setChildBodyCode=de;function Te(t){let e=ie(t);return new Function(e)()}function ie(t){let e=z(t),i=Math.pow(2,t);return`
${ce()}
${ue(t)}
${ae(t)}
${se(t)}
${de(t)}

function createQuadTree(options, random) {
  options = options || {};
  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

  var gravity = options.gravity;
  var updateQueue = [];
  var insertStack = new InsertStack();
  var theta = options.theta;

  var nodesCache = [];
  var currentInCache = 0;
  var root = newNode();

  return {
    insertBodies: insertBodies,

    /**
     * Gets root node if it is present
     */
    getRoot: function() {
      return root;
    },

    updateBodyForce: update,

    options: function(newOptions) {
      if (newOptions) {
        if (typeof newOptions.gravity === 'number') {
          gravity = newOptions.gravity;
        }
        if (typeof newOptions.theta === 'number') {
          theta = newOptions.theta;
        }

        return this;
      }

      return {
        gravity: gravity,
        theta: theta
      };
    }
  };

  function newNode() {
    // To avoid pressure on GC we reuse nodes.
    var node = nodesCache[currentInCache];
    if (node) {
${h("      node.")}
      node.body = null;
      node.mass = ${e("node.mass_{var} = ",{join:""})}0;
      ${e("node.min_{var} = node.max_{var} = ",{join:""})}0;
    } else {
      node = new QuadNode();
      nodesCache[currentInCache] = node;
    }

    ++currentInCache;
    return node;
  }

  function update(sourceBody) {
    var queue = updateQueue;
    var v;
    ${e("var d{var};",{indent:4})}
    var r; 
    ${e("var f{var} = 0;",{indent:4})}
    var queueLength = 1;
    var shiftIdx = 0;
    var pushIdx = 1;

    queue[0] = root;

    while (queueLength) {
      var node = queue[shiftIdx];
      var body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = (body !== sourceBody);
      if (body && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        ${e("d{var} = body.pos.{var} - sourceBody.pos.{var};",{indent:8})}
        r = Math.sqrt(${e("d{var} * d{var}",{join:" + "})});

        if (r === 0) {
          // Poor man's protection against zero distance.
          ${e("d{var} = (random.nextDouble() - 0.5) / 50;",{indent:10})}
          r = Math.sqrt(${e("d{var} * d{var}",{join:" + "})});
        }

        // This is standard gravitation force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        v = gravity * body.mass * sourceBody.mass / (r * r * r);
        ${e("f{var} += v * d{var};",{indent:8})}
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        ${e("d{var} = node.mass_{var} / node.mass - sourceBody.pos.{var};",{indent:8})}
        r = Math.sqrt(${e("d{var} * d{var}",{join:" + "})});

        if (r === 0) {
          // Sorry about code duplication. I don't want to create many functions
          // right away. Just want to see performance first.
          ${e("d{var} = (random.nextDouble() - 0.5) / 50;",{indent:10})}
          r = Math.sqrt(${e("d{var} * d{var}",{join:" + "})});
        }
        // If s / r < \u03B8, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.max_${B(0)} - node.min_${B(0)}) / r < theta) {
          // in the if statement above we consider node's width only
          // because the region was made into square during tree creation.
          // Thus there is no difference between using width or height.
          v = gravity * node.mass * sourceBody.mass / (r * r * r);
          ${e("f{var} += v * d{var};",{indent:10})}
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
${s()}
        }
      }
    }

    ${e("sourceBody.force.{var} += f{var};",{indent:4})}
  }

  function insertBodies(bodies) {
    ${e("var {var}min = Number.MAX_VALUE;",{indent:4})}
    ${e("var {var}max = Number.MIN_VALUE;",{indent:4})}
    var i = bodies.length;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    while (i--) {
      var pos = bodies[i].pos;
      ${e("if (pos.{var} < {var}min) {var}min = pos.{var};",{indent:6})}
      ${e("if (pos.{var} > {var}max) {var}max = pos.{var};",{indent:6})}
    }

    // Makes the bounds square.
    var maxSideLength = -Infinity;
    ${e("if ({var}max - {var}min > maxSideLength) maxSideLength = {var}max - {var}min ;",{indent:4})}

    currentInCache = 0;
    root = newNode();
    ${e("root.min_{var} = {var}min;",{indent:4})}
    ${e("root.max_{var} = {var}min + maxSideLength;",{indent:4})}

    i = bodies.length - 1;
    if (i >= 0) {
      root.body = bodies[i];
    }
    while (i--) {
      insert(bodies[i], root);
    }
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop();
      var node = stackItem.node;
      var body = stackItem.body;

      if (!node.body) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        ${e("var {var} = body.pos.{var};",{indent:8})}
        node.mass += body.mass;
        ${e("node.mass_{var} += body.mass * {var};",{indent:8})}

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0; // Assume we are in the 0's quad.
        ${e("var min_{var} = node.min_{var};",{indent:8})}
        ${e("var max_{var} = (min_{var} + node.max_{var}) / 2;",{indent:8})}

${a(8)}

        var child = getChild(node, quadIdx);

        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          ${e("child.min_{var} = min_{var};",{indent:10})}
          ${e("child.max_{var} = max_{var};",{indent:10})}
          child.body = body;

          setChild(node, quadIdx, child);
        } else {
          // continue searching in this quadrant.
          insertStack.push(child, body);
        }
      } else {
        // We are trying to add to the leaf node.
        // We have to convert current leaf into internal node
        // and continue adding two nodes.
        var oldBody = node.body;
        node.body = null; // internal nodes do not cary bodies

        if (isSamePosition(oldBody.pos, body.pos)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = random.nextDouble();
            ${e("var d{var} = (node.max_{var} - node.min_{var}) * offset;",{indent:12})}

            ${e("oldBody.pos.{var} = node.min_{var} + d{var};",{indent:12})}
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));

          if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
            // This is very bad, we ran out of precision.
            // if we do not return from the method we'll get into
            // infinite loop here. So we sacrifice correctness of layout, and keep the app running
            // Next layout iteration should get larger bounding box in the first step and fix this
            return;
          }
        }
        // Next iteration should subdivide node further.
        insertStack.push(node, oldBody);
        insertStack.push(node, body);
      }
    }
  }
}
return createQuadTree;

`;function a(c){let f=[],u=Array(c+1).join(" ");for(let v=0;v<t;++v)f.push(u+`if (${B(v)} > max_${B(v)}) {`),f.push(u+`  quadIdx = quadIdx + ${Math.pow(2,v)};`),f.push(u+`  min_${B(v)} = max_${B(v)};`),f.push(u+`  max_${B(v)} = node.max_${B(v)};`),f.push(u+"}");return f.join(`
`)}function s(){let c=Array(11).join(" "),f=[];for(let u=0;u<i;++u)f.push(c+`if (node.quad${u}) {`),f.push(c+`  queue[pushIdx] = node.quad${u};`),f.push(c+"  queueLength += 1;"),f.push(c+"  pushIdx += 1;"),f.push(c+"}");return f.join(`
`)}function h(c){let f=[];for(let u=0;u<i;++u)f.push(`${c}quad${u} = null;`);return f.join(`
`)}}function ae(t){let e=z(t);return`
  function isSamePosition(point1, point2) {
    ${e("var d{var} = Math.abs(point1.{var} - point2.{var});",{indent:2})}
  
    return ${e("d{var} < 1e-8",{join:" && "})};
  }  
`}function de(t){var e=Math.pow(2,t);return`
function setChild(node, idx, child) {
  ${i()}
}`;function i(){let d=[];for(let a=0;a<e;++a){let s=a===0?"  ":"  else ";d.push(`${s}if (idx === ${a}) node.quad${a} = child;`)}return d.join(`
`)}}function se(t){return`function getChild(node, idx) {
${e()}
  return null;
}`;function e(){let i=[],d=Math.pow(2,t);for(let a=0;a<d;++a)i.push(`  if (idx === ${a}) return node.quad${a};`);return i.join(`
`)}}function ue(t){let e=z(t),i=Math.pow(2,t);var d=`
function QuadNode() {
  // body stored inside this node. In quad tree only leaf nodes (by construction)
  // contain bodies:
  this.body = null;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
${a("  this.")}

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  ${e("this.mass_{var} = 0;",{indent:2})}

  // bounding box coordinates
  ${e("this.min_{var} = 0;",{indent:2})}
  ${e("this.max_{var} = 0;",{indent:2})}
}
`;return d;function a(s){let h=[];for(let c=0;c<i;++c)h.push(`${s}quad${c} = null;`);return h.join(`
`)}}function ce(){return`
/**
 * Our implementation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
function InsertStack () {
    this.stack = [];
    this.popIdx = 0;
}

InsertStack.prototype = {
    isEmpty: function() {
        return this.popIdx === 0;
    },
    push: function (node, body) {
        var item = this.stack[this.popIdx];
        if (!item) {
            // we are trying to avoid memory pressure: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop: function () {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset: function () {
        this.popIdx = 0;
    }
};

function InsertStackElement(node, body) {
    this.node = node; // QuadTree node
    this.body = body; // physical body which needs to be inserted to node
}
`}});var pe=g((dt,G)=>{G.exports=Ee;G.exports.generateFunctionBody=ve;var Le=q();function Ee(t){let e=ve(t);return new Function("bodies","settings","random",e)}function ve(t){let e=Le(t);return`
  var boundingBox = {
    ${e("min_{var}: 0, max_{var}: 0,",{indent:4})}
  };

  return {
    box: boundingBox,

    update: updateBoundingBox,

    reset: resetBoundingBox,

    getBestNewPosition: function (neighbors) {
      var ${e("base_{var} = 0",{join:", "})};

      if (neighbors.length) {
        for (var i = 0; i < neighbors.length; ++i) {
          let neighborPos = neighbors[i].pos;
          ${e("base_{var} += neighborPos.{var};",{indent:10})}
        }

        ${e("base_{var} /= neighbors.length;",{indent:8})}
      } else {
        ${e("base_{var} = (boundingBox.min_{var} + boundingBox.max_{var}) / 2;",{indent:8})}
      }

      var springLength = settings.springLength;
      return {
        ${e("{var}: base_{var} + (random.nextDouble() - 0.5) * springLength,",{indent:8})}
      };
    }
  };

  function updateBoundingBox() {
    var i = bodies.length;
    if (i === 0) return; // No bodies - no borders.

    ${e("var max_{var} = -Infinity;",{indent:4})}
    ${e("var min_{var} = Infinity;",{indent:4})}

    while(i--) {
      // this is O(n), it could be done faster with quadtree, if we check the root node bounds
      var bodyPos = bodies[i].pos;
      ${e("if (bodyPos.{var} < min_{var}) min_{var} = bodyPos.{var};",{indent:6})}
      ${e("if (bodyPos.{var} > max_{var}) max_{var} = bodyPos.{var};",{indent:6})}
    }

    ${e("boundingBox.min_{var} = min_{var};",{indent:4})}
    ${e("boundingBox.max_{var} = max_{var};",{indent:4})}
  }

  function resetBoundingBox() {
    ${e("boundingBox.min_{var} = boundingBox.max_{var} = 0;",{indent:4})}
  }
`}});var le=g((st,U)=>{var ke=q();U.exports=Qe;U.exports.generateCreateDragForceFunctionBody=he;function Qe(t){let e=he(t);return new Function("options",e)}function he(t){return`
  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

  return {
    update: function(body) {
      ${ke(t)("body.force.{var} -= options.dragCoefficient * body.velocity.{var};",{indent:6})}
    }
  };
`}});var ye=g((ut,R)=>{var Ve=q();R.exports=Oe;R.exports.generateCreateSpringForceFunctionBody=ge;function Oe(t){let e=ge(t);return new Function("options","random",e)}function ge(t){let e=Ve(t);return`
  if (!Number.isFinite(options.springCoefficient)) throw new Error('Spring coefficient is not a number');
  if (!Number.isFinite(options.springLength)) throw new Error('Spring length is not a number');

  return {
    /**
     * Updates forces acting on a spring
     */
    update: function (spring) {
      var body1 = spring.from;
      var body2 = spring.to;
      var length = spring.length < 0 ? options.springLength : spring.length;
      ${e("var d{var} = body2.pos.{var} - body1.pos.{var};",{indent:6})}
      var r = Math.sqrt(${e("d{var} * d{var}",{join:" + "})});

      if (r === 0) {
        ${e("d{var} = (random.nextDouble() - 0.5) / 50;",{indent:8})}
        r = Math.sqrt(${e("d{var} * d{var}",{join:" + "})});
      }

      var d = r - length;
      var coefficient = ((spring.coefficient > 0) ? spring.coefficient : options.springCoefficient) * d / r;

      ${e("body1.force.{var} += coefficient * d{var}",{indent:6})};
      body1.springCount += 1;
      body1.springLength += r;

      ${e("body2.force.{var} -= coefficient * d{var}",{indent:6})};
      body2.springCount += 1;
      body2.springLength += r;
    }
  };
`}});var me=g((ct,J)=>{var Ae=q();J.exports=De;J.exports.generateIntegratorFunctionBody=be;function De(t){let e=be(t);return new Function("bodies","timeStep","adaptiveTimeStepWeight",e)}function be(t){let e=Ae(t);return`
  var length = bodies.length;
  if (length === 0) return 0;

  ${e("var d{var} = 0, t{var} = 0;",{indent:2})}

  for (var i = 0; i < length; ++i) {
    var body = bodies[i];
    if (body.isPinned) continue;

    if (adaptiveTimeStepWeight && body.springCount) {
      timeStep = (adaptiveTimeStepWeight * body.springLength/body.springCount);
    }

    var coeff = timeStep / body.mass;

    ${e("body.velocity.{var} += coeff * body.force.{var};",{indent:4})}
    ${e("var v{var} = body.velocity.{var};",{indent:4})}
    var v = Math.sqrt(${e("v{var} * v{var}",{join:" + "})});

    if (v > 1) {
      // We normalize it so that we move within timeStep range. 
      // for the case when v <= 1 - we let velocity to fade out.
      ${e("body.velocity.{var} = v{var} / v;",{indent:6})}
    }

    ${e("d{var} = timeStep * body.velocity.{var};",{indent:4})}

    ${e("body.pos.{var} += d{var};",{indent:4})}

    ${e("t{var} += Math.abs(d{var});",{indent:4})}
  }

  return (${e("t{var} * t{var}",{join:" + "})})/length;
`}});var Be=g((ft,xe)=>{xe.exports=We;function We(t,e,i,d){this.from=t,this.to=e,this.length=i,this.coefficient=d}});var X=g((vt,$e)=>{$e.exports=He;var ze=oe(),Ge=fe(),Ue=pe(),Re=le(),Je=ye(),Xe=me(),we={};function He(t){var e=Be(),i=Q("ngraph.merge"),d=Q("ngraph.events");if(t){if(t.springCoeff!==void 0)throw new Error("springCoeff was renamed to springCoefficient");if(t.dragCoeff!==void 0)throw new Error("dragCoeff was renamed to dragCoefficient")}t=i(t,{springLength:10,springCoefficient:.8,gravity:-12,theta:.8,dragCoefficient:.9,timeStep:.5,adaptiveTimeStepWeight:0,dimensions:2,debug:!1});var a=we[t.dimensions];if(!a){var s=t.dimensions;a={Body:ze(s,t.debug),createQuadTree:Ge(s),createBounds:Ue(s),createDragForce:Re(s),createSpringForce:Je(s),integrate:Xe(s)},we[s]=a}var h=a.Body,c=a.createQuadTree,f=a.createBounds,u=a.createDragForce,v=a.createSpringForce,F=a.integrate,L=n=>new h(n),S=Q("ngraph.random").random(42),l=[],y=[],$=c(t,S),I=f(l,t,S),E=v(t,S),O=u(t),P=0,C=[],b=new Map,k=0;j("nbody",D),j("spring",r);var M={bodies:l,quadTree:$,springs:y,settings:t,addForce:j,removeForce:_,getForces:A,step:function(){for(var n=0;n<C.length;++n)C[n](k);var o=F(l,t.timeStep,t.adaptiveTimeStepWeight);return k+=1,o},addBody:function(n){if(!n)throw new Error("Body is required");return l.push(n),n},addBodyAt:function(n){if(!n)throw new Error("Body position is required");var o=L(n);return l.push(o),o},removeBody:function(n){if(n){var o=l.indexOf(n);if(!(o<0))return l.splice(o,1),l.length===0&&I.reset(),!0}},addSpring:function(n,o,p,x){if(!n||!o)throw new Error("Cannot add null spring to force simulator");typeof p!="number"&&(p=-1);var N=new e(n,o,p,x>=0?x:-1);return y.push(N),N},getTotalMovement:function(){return P},removeSpring:function(n){if(n){var o=y.indexOf(n);if(o>-1)return y.splice(o,1),!0}},getBestNewBodyPosition:function(n){return I.getBestNewPosition(n)},getBBox:m,getBoundingBox:m,invalidateBBox:function(){console.warn("invalidateBBox() is deprecated, bounds always recomputed on `getBBox()` call")},gravity:function(n){return n!==void 0?(t.gravity=n,$.options({gravity:n}),this):t.gravity},theta:function(n){return n!==void 0?(t.theta=n,$.options({theta:n}),this):t.theta},random:S};return Ke(t,M),d(M),M;function m(){return I.update(),I.box}function j(n,o){if(b.has(n))throw new Error("Force "+n+" is already added");b.set(n,o),C.push(o)}function _(n){var o=C.indexOf(b.get(n));o<0||(C.splice(o,1),b.delete(n))}function A(){return b}function D(){if(l.length!==0){$.insertBodies(l);for(var n=l.length;n--;){var o=l[n];o.isPinned||(o.reset(),$.updateBodyForce(o),O.update(o))}}}function r(){for(var n=y.length;n--;)E.update(y[n])}}function Ke(t,e){for(var i in t)Ye(t,e,i)}function Ye(t,e,i){if(t.hasOwnProperty(i)&&typeof e[i]!="function"){var d=Number.isFinite(t[i]);d?e[i]=function(a){if(a!==void 0){if(!Number.isFinite(a))throw new Error("Value of "+i+" should be a valid number.");return t[i]=a,e}return t[i]}:e[i]=function(a){return a!==void 0?(t[i]=a,e):t[i]}}}});var Ce=g((pt,H)=>{H.exports=et;H.exports.simulator=X();var Ze=Q("ngraph.events");function et(t,e){if(!t)throw new Error("Graph structure cannot be undefined");var i=e&&e.createSimulator||X(),d=i(e);if(Array.isArray(e))throw new Error("Physics settings is expected to be an object");var a=t.version>19?D:A;e&&typeof e.nodeMass=="function"&&(a=e.nodeMass);var s=new Map,h={},c=0,f=d.settings.springTransform||tt;O(),$();var u=!1,v={step:function(){if(c===0)return F(!0),!0;var r=d.step();v.lastMove=r,v.fire("step");var n=r/c,o=n<=.01;return F(o),o},getNodePosition:function(r){return _(r).pos},setNodePosition:function(r){var n=_(r);n.setPosition.apply(n,Array.prototype.slice.call(arguments,1))},getLinkPosition:function(r){var n=h[r];if(n)return{from:n.from.pos,to:n.to.pos}},getGraphRect:function(){return d.getBBox()},forEachBody:L,pinNode:function(r,n){var o=_(r.id);o.isPinned=!!n},isNodePinned:function(r){return _(r.id).isPinned},dispose:function(){t.off("changed",E),v.fire("disposed")},getBody:y,getSpring:l,getForceVectorLength:S,simulator:d,graph:t,lastMove:0};return Ze(v),v;function F(r){u!==r&&(u=r,I(r))}function L(r){s.forEach(r)}function S(){var r=0,n=0;return L(function(o){r+=Math.abs(o.force.x),n+=Math.abs(o.force.y)}),Math.sqrt(r*r+n*n)}function l(r,n){var o;if(n===void 0)typeof r!="object"?o=r:o=r.id;else{var p=t.hasLink(r,n);if(!p)return;o=p.id}return h[o]}function y(r){return s.get(r)}function $(){t.on("changed",E)}function I(r){v.fire("stable",r)}function E(r){for(var n=0;n<r.length;++n){var o=r[n];o.changeType==="add"?(o.node&&P(o.node.id),o.link&&b(o.link)):o.changeType==="remove"&&(o.node&&C(o.node),o.link&&k(o.link))}c=t.getNodesCount()}function O(){c=0,t.forEachNode(function(r){P(r.id),c+=1}),t.forEachLink(b)}function P(r){var n=s.get(r);if(!n){var o=t.getNode(r);if(!o)throw new Error("initBody() was called with unknown node id");var p=o.position;if(!p){var x=M(o);p=d.getBestNewBodyPosition(x)}n=d.addBodyAt(p),n.id=r,s.set(r,n),m(r),j(o)&&(n.isPinned=!0)}}function C(r){var n=r.id,o=s.get(n);o&&(s.delete(n),d.removeBody(o))}function b(r){m(r.fromId),m(r.toId);var n=s.get(r.fromId),o=s.get(r.toId),p=d.addSpring(n,o,r.length);f(r,p),h[r.id]=p}function k(r){var n=h[r.id];if(n){var o=t.getNode(r.fromId),p=t.getNode(r.toId);o&&m(o.id),p&&m(p.id),delete h[r.id],d.removeSpring(n)}}function M(r){var n=[];if(!r.links)return n;for(var o=Math.min(r.links.length,2),p=0;p<o;++p){var x=r.links[p],N=x.fromId!==r.id?s.get(x.fromId):s.get(x.toId);N&&N.pos&&n.push(N)}return n}function m(r){var n=s.get(r);if(n.mass=a(r),Number.isNaN(n.mass))throw new Error("Node mass should be a number")}function j(r){return r&&(r.isPinned||r.data&&r.data.isPinned)}function _(r){var n=s.get(r);return n||(P(r),n=s.get(r)),n}function A(r){var n=t.getLinks(r);return n?1+n.length/3:1}function D(r){var n=t.getLinks(r);return n?1+n.size/3:1}}function tt(){}});var V=Pe(Ce()),{simulator:ht}=V,lt=V.default??V;export{lt as default,ht as simulator};
//# sourceMappingURL=ngraph.forcelayout.mjs.map