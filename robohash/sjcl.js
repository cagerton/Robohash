"use strict";function n(a){throw a;}var q=void 0,t=!1;var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.L(a.slice(b/32),32-(b&31)).slice(1);return c===q?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.L(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return t;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},L:function(a,b,c,d){var e;e=0;for(d===q&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},da:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.bytes={fromBits:function(a){var b=[],c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b.push(e>>>24),e<<=8;return b},toBits:function(a){var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a[c],3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base64={H:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.H,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.H,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++)h=f.indexOf(a.charAt(d)),
0>h&&n(new sjcl.exception.invalid("this isn't base64!")),26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e);e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.C();a?(this.f=a.f.slice(0),this.d=a.d.slice(0),this.c=a.c):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.f=this.k.slice(0);this.d=[];this.c=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.d=sjcl.bitArray.concat(this.d,a);b=this.c;a=this.c=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this.p(c.splice(0,16));return this},finalize:function(){var a,b=this.d,c=this.f,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.c/
4294967296));for(b.push(this.c|0);b.length;)this.p(b.splice(0,16));this.reset();return c},k:[],b:[],C:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.k[b]=a(Math.pow(c,0.5)));this.b[b]=a(Math.pow(c,1/3));b++}},p:function(a){var b,c,d=a.slice(0),e=this.f,f=this.b,g=e[0],h=e[1],k=e[2],m=e[3],p=e[4],B=e[5],x=e[6],y=e[7];for(a=0;64>a;a++)16>a?b=d[a]:(b=d[a+1&15],c=d[a+14&15],b=d[a&15]=(b>>>7^b>>>18^b>>>3^
b<<25^b<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+d[a&15]+d[a+9&15]|0),b=b+y+(p>>>6^p>>>11^p>>>25^p<<26^p<<21^p<<7)+(x^p&(B^x))+f[a],y=x,x=B,B=p,p=m+b|0,m=k,k=h,h=g,g=b+(h&k^m&(h^k))+(h>>>2^h>>>13^h>>>22^h<<30^h<<19^h<<10)|0;e[0]=e[0]+g|0;e[1]=e[1]+h|0;e[2]=e[2]+k|0;e[3]=e[3]+m|0;e[4]=e[4]+p|0;e[5]=e[5]+B|0;e[6]=e[6]+x|0;e[7]=e[7]+y|0}};sjcl.hash.sha512=function(a){this.b[0]||this.C();a?(this.f=a.f.slice(0),this.d=a.d.slice(0),this.c=a.c):this.reset()};sjcl.hash.sha512.hash=function(a){return(new sjcl.hash.sha512).update(a).finalize()};
sjcl.hash.sha512.prototype={blockSize:1024,reset:function(){this.f=this.k.slice(0);this.d=[];this.c=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.d=sjcl.bitArray.concat(this.d,a);b=this.c;a=this.c=b+sjcl.bitArray.bitLength(a);for(b=1024+b&-1024;b<=a;b+=1024)this.p(c.splice(0,32));return this},finalize:function(){var a,b=this.d,c=this.f,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+4;a&31;a++)b.push(0);b.push(0);b.push(0);
b.push(Math.floor(this.c/0x100000000));for(b.push(this.c|0);b.length;)this.p(b.splice(0,32));this.reset();return c},k:[],W:[12372232,13281083,9762859,1914609,15106769,4090911,4308331,8266105],b:[],Y:[2666018,15689165,5061423,9034684,4764984,380953,1658779,7176472,197186,7368638,14987916,16757986,8096111,1480369,13046325,6891156,15813330,5187043,9229749,11312229,2818677,10937475,4324308,1135541,6741931,11809296,16458047,15666916,11046850,698149,229999,945776,13774844,2541862,12856045,9810911,11494366,
7844520,15576806,8533307,15795044,4337665,16291729,5553712,15684120,6662416,7413802,12308920,13816008,4303699,9366425,10176680,13195875,4295371,6546291,11712675,15708924,1519456,15772530,6568428,6495784,8568297,13007125,7492395,2515356,12632583,14740254,7262584,1535930,13146278,16321966,1853211,294276,13051027,13221564,1051980,4080310,6651434,14088940,4675607],C:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}function b(a){return 0x10000000000*(a-Math.floor(a))&255}var c=0,d=2,e;a:for(;80>
c;d++){for(e=2;e*e<=d;e++)if(0===d%e)continue a;8>c&&(this.k[2*c]=a(Math.pow(d,0.5)),this.k[2*c+1]=b(Math.pow(d,0.5))<<24|this.W[c]);this.b[2*c]=a(Math.pow(d,1/3));this.b[2*c+1]=b(Math.pow(d,1/3))<<24|this.Y[c];c++}},p:function(a){var b,c,d=a.slice(0),e=this.f,f=this.b,g=e[0],h=e[1],k=e[2],m=e[3],p=e[4],B=e[5],x=e[6],y=e[7],C=e[8],M=e[9],ba=e[10],N=e[11],ca=e[12],O=e[13],da=e[14],P=e[15],u=g,r=h,F=k,D=m,G=p,E=B,W=x,H=y,v=C,s=M,Q=ba,I=N,R=ca,J=O,X=da,K=P;for(a=0;80>a;a++){if(16>a)b=d[2*a],c=d[2*a+
1];else{c=d[2*(a-15)];var l=d[2*(a-15)+1];b=(l<<31|c>>>1)^(l<<24|c>>>8)^c>>>7;var w=(c<<31|l>>>1)^(c<<24|l>>>8)^(c<<25|l>>>7);c=d[2*(a-2)];var z=d[2*(a-2)+1],l=(z<<13|c>>>19)^(c<<3|z>>>29)^c>>>6,z=(c<<13|z>>>19)^(z<<3|c>>>29)^(c<<26|z>>>6),Y=d[2*(a-7)],Z=d[2*(a-16)],L=d[2*(a-16)+1];c=w+d[2*(a-7)+1];b=b+Y+(c>>>0<w>>>0?1:0);c+=z;b+=l+(c>>>0<z>>>0?1:0);c+=L;b+=Z+(c>>>0<L>>>0?1:0)}d[2*a]=b|=0;d[2*a+1]=c|=0;var Y=v&Q^~v&R,ea=s&I^~s&J,z=u&F^u&G^F&G,ia=r&D^r&E^D&E,Z=(r<<4|u>>>28)^(u<<30|r>>>2)^(u<<25|r>>>
7),L=(u<<4|r>>>28)^(r<<30|u>>>2)^(r<<25|u>>>7),ja=f[2*a],fa=f[2*a+1],l=K+((v<<18|s>>>14)^(v<<14|s>>>18)^(s<<23|v>>>9)),w=X+((s<<18|v>>>14)^(s<<14|v>>>18)^(v<<23|s>>>9))+(l>>>0<K>>>0?1:0),l=l+ea,w=w+(Y+(l>>>0<ea>>>0?1:0)),l=l+fa,w=w+(ja+(l>>>0<fa>>>0?1:0)),l=l+c,w=w+(b+(l>>>0<c>>>0?1:0));c=L+ia;b=Z+z+(c>>>0<L>>>0?1:0);X=R;K=J;R=Q;J=I;Q=v;I=s;s=H+l|0;v=W+w+(s>>>0<H>>>0?1:0)|0;W=G;H=E;G=F;E=D;F=u;D=r;r=l+c|0;u=w+b+(r>>>0<l>>>0?1:0)|0}h=e[1]=h+r|0;e[0]=g+u+(h>>>0<r>>>0?1:0)|0;m=e[3]=m+D|0;e[2]=k+F+(m>>>
0<D>>>0?1:0)|0;B=e[5]=B+E|0;e[4]=p+G+(B>>>0<E>>>0?1:0)|0;y=e[7]=y+H|0;e[6]=x+W+(y>>>0<H>>>0?1:0)|0;M=e[9]=M+s|0;e[8]=C+v+(M>>>0<s>>>0?1:0)|0;N=e[11]=N+I|0;e[10]=ba+Q+(N>>>0<I>>>0?1:0)|0;O=e[13]=O+J|0;e[12]=ca+R+(O>>>0<J>>>0?1:0)|0;P=e[15]=P+K|0;e[14]=da+X+(P>>>0<K>>>0?1:0)|0}};
sjcl.misc.hmac=function(a,b){this.J=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.o=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.o[0].update(c[0]);this.o[1].update(c[1]);this.F=new b(this.o[0])};sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){this.N&&n(new sjcl.exception.invalid("encrypt on already updated hmac called!"));this.update(a);return this.digest(a)};
sjcl.misc.hmac.prototype.reset=function(){this.F=new this.J(this.o[0]);this.N=t};sjcl.misc.hmac.prototype.update=function(a){this.N=!0;this.F.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.F.finalize(),a=(new this.J(this.o[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;(0>d||0>c)&&n(sjcl.exception.invalid("invalid params to pbkdf2"));"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,k,m=[],p=sjcl.bitArray;for(k=1;32*m.length<(d||1);k++){e=f=a.encrypt(p.concat(b,[k]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}m=m.concat(e)}d&&(m=p.clamp(m,d));return m};
sjcl.prng=function(a){this.g=[new sjcl.hash.sha256];this.l=[0];this.D=0;this.r={};this.B=0;this.I={};this.K=this.h=this.m=this.T=0;this.b=[0,0,0,0,0,0,0,0];this.j=[0,0,0,0];this.w=q;this.A=a;this.q=t;this.u={progress:{},seeded:{}};this.n=this.S=0;this.s=1;this.t=2;this.P=0x10000;this.G=[0,48,64,96,128,192,0x100,384,512,768,1024];this.Q=3E4;this.O=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;d===this.n&&n(new sjcl.exception.notReady("generator isn't seeded"));if(d&this.t){d=!(d&this.s);e=[];var f=0,g;this.K=e[0]=(new Date).valueOf()+this.Q;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.g.length&&!(e=e.concat(this.g[g].finalize()),f+=this.l[g],this.l[g]=0,!d&&this.D&1<<g);g++);this.D>=1<<this.g.length&&(this.g.push(new sjcl.hash.sha256),this.l.push(0));this.h-=f;f>this.m&&(this.m=f);this.D++;
this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.w=new sjcl.cipher.aes(this.b);for(d=0;4>d&&!(this.j[d]=this.j[d]+1|0,this.j[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.P&&aa(this),e=A(this),c.push(e[0],e[1],e[2],e[3]);aa(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b&&n("Setting paranoia=0 will ruin your security; use it only for testing");this.A=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),
g=this.r[c],h=this.isReady(),k=0;d=this.I[c];d===q&&(d=this.I[c]=this.T++);g===q&&(g=this.r[c]=0);this.r[c]=(this.r[c]+1)%this.g.length;switch(typeof a){case "number":b===q&&(b=1);this.g[g].update([d,this.B++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(k=1);for(c=0;c<a.length&&!k;c++)"number"!==typeof a[c]&&(k=1)}if(!k){if(b===q)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,
e>>>=1;this.g[g].update([d,this.B++,2,b,f,a.length].concat(a))}break;case "string":b===q&&(b=a.length);this.g[g].update([d,this.B++,3,b,f,a.length]);this.g[g].update(a);break;default:k=1}k&&n(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"));this.l[g]+=b;this.h+=b;h===this.n&&(this.isReady()!==this.n&&ga("seeded",Math.max(this.m,this.h)),ga("progress",this.getProgress()))},isReady:function(a){a=this.G[a!==q?a:this.A];return this.m&&this.m>=a?this.l[0]>
this.O&&(new Date).valueOf()>this.K?this.t|this.s:this.s:this.h>=a?this.t|this.n:this.n},getProgress:function(a){a=this.G[a?a:this.A];return this.m>=a?1:this.h>a?1:this.h/a},startCollectors:function(){this.q||(this.a={loadTimeCollector:S(this,this.Z),mouseCollector:S(this,this.$),keyboardCollector:S(this,this.X),accelerometerCollector:S(this,this.R)},window.addEventListener?(window.addEventListener("load",this.a.loadTimeCollector,t),window.addEventListener("mousemove",this.a.mouseCollector,t),window.addEventListener("keypress",
this.a.keyboardCollector,t),window.addEventListener("devicemotion",this.a.accelerometerCollector,t)):document.attachEvent?(document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)):n(new sjcl.exception.bug("can't attach event")),this.q=!0)},stopCollectors:function(){this.q&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,t),window.removeEventListener("mousemove",
this.a.mouseCollector,t),window.removeEventListener("keypress",this.a.keyboardCollector,t),window.removeEventListener("devicemotion",this.a.accelerometerCollector,t)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.q=t)},addEventListener:function(a,b){this.u[a][this.S++]=b},removeEventListener:function(a,b){var c,d,e=this.u[a],f=[];for(d in e)e.hasOwnProperty(d)&&
e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},X:function(){T(1)},$:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX||0,a.y||a.clientY||a.offsetY||0],2,"mouse");T(0)},Z:function(){T(2)},R:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&sjcl.random.addEntropy(b,1,"accelerometer")}a&&sjcl.random.addEntropy(a,2,"accelerometer");T(0)}};
function ga(a,b){var c,d=sjcl.random.u[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function T(a){window&&window.performance&&"function"===typeof window.performance.now?sjcl.random.addEntropy(window.performance.now(),a,"loadtime"):sjcl.random.addEntropy((new Date).valueOf(),a,"loadtime")}function aa(a){a.b=A(a).concat(A(a));a.w=new sjcl.cipher.aes(a.b)}function A(a){for(var b=0;4>b&&!(a.j[b]=a.j[b]+1|0,a.j[b]);b++);return a.w.encrypt(a.j)}
function S(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var U,ha,V;if("undefined"!==typeof module&&module.exports&&(ha=require("crypto"))&&ha.randomBytes)U=ha.randomBytes(128),U=new Uint32Array((new Uint8Array(U)).buffer),sjcl.random.addEntropy(U,1024,"crypto['randomBytes']");else if(window&&Uint32Array){V=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(V);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(V);else break a;sjcl.random.addEntropy(V,1024,"crypto['getRandomValues']")}}catch(ka){console.log("There was an error collecting entropy from the browser:"),
console.log(ka)}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},V:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.i({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.i(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||4<
f.iv.length)&&n(new sjcl.exception.invalid("json encrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.i(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,
b,c,d){var e=sjcl.json,f=e.V.apply(e,arguments);return e.encode(f)},U:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.i(e.i(e.i({},e.defaults),b),c,!0);var f;c=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)&&n(new sjcl.exception.invalid("json decrypt: invalid parameters"));
"string"===typeof a?(f=sjcl.misc.cachedPbkdf2(a,b),a=f.key.slice(0,b.ks/32),b.salt=f.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof c&&(c=sjcl.codec.utf8String.toBits(c));f=new sjcl.cipher[b.cipher](a);c=sjcl.mode[b.mode].decrypt(f,b.ct,b.iv,c,b.ts);e.i(d,b);d.key=a;return sjcl.codec.utf8String.fromBits(c)},decrypt:function(a,b,c,d){var e=sjcl.json;return e.U(a,e.decode(b),c,d)},encode:function(a){var b,c=
"{",d="";for(b in a)if(a.hasOwnProperty(b))switch(b.match(/^[a-z0-9]+$/i)||n(new sjcl.exception.invalid("json encode: invalid property name")),c+=d+'"'+b+'":',d=",",typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:n(new sjcl.exception.bug("json encode: unsupported type"))}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");a.match(/^\{.*\}$/)||n(new sjcl.exception.invalid("json decode: this isn't json!"));
a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++)(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i))||n(new sjcl.exception.invalid("json decode: this isn't json!")),b[d[2]]=d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]);return b},i:function(a,b,c){a===q&&(a={});if(b===q)return a;for(var d in b)b.hasOwnProperty(d)&&(c&&(a[d]!==q&&a[d]!==b[d])&&n(new sjcl.exception.invalid("required parameter overridden")),
a[d]=b[d]);return a},ca:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ba:function(a,b){var c={},d;for(d=0;d<b.length;d++)a[b[d]]!==q&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.aa={};
sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.aa,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===q?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};sjcl.bn=function(a){this.initWith(a)};
sjcl.bn.prototype={radix:24,maxMul:8,e:sjcl.bn,copy:function(){return new this.e(this)},initWith:function(a){var b=0,c;switch(typeof a){case "object":this.limbs=a.limbs.slice(0);break;case "number":this.limbs=[a];this.normalize();break;case "string":a=a.replace(/^0x/,"");this.limbs=[];c=this.radix/4;for(b=0;b<a.length;b+=c)this.limbs.push(parseInt(a.substring(Math.max(a.length-b-c,0),a.length-b),16));break;default:this.limbs=[0]}return this},equals:function(a){"number"===typeof a&&(a=new this.e(a));
var b=0,c;this.fullReduce();a.fullReduce();for(c=0;c<this.limbs.length||c<a.limbs.length;c++)b|=this.getLimb(c)^a.getLimb(c);return 0===b},getLimb:function(a){return a>=this.limbs.length?0:this.limbs[a]},greaterEquals:function(a){"number"===typeof a&&(a=new this.e(a));var b=0,c=0,d,e,f;for(d=Math.max(this.limbs.length,a.limbs.length)-1;0<=d;d--)e=this.getLimb(d),f=a.getLimb(d),c|=f-e&~b,b|=e-f&~c;return(c|~b)>>>31},toString:function(){this.fullReduce();var a="",b,c,d=this.limbs;for(b=0;b<this.limbs.length;b++){for(c=
d[b].toString(16);b<this.limbs.length-1&&6>c.length;)c="0"+c;a=c+a}return"0x"+a},addM:function(a){"object"!==typeof a&&(a=new this.e(a));var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]+=c[a];return this},doubleM:function(){var a,b=0,c,d=this.radix,e=this.radixMask,f=this.limbs;for(a=0;a<f.length;a++)c=f[a],c=c+c+b,f[a]=c&e,b=c>>d;b&&f.push(b);return this},halveM:function(){var a,b=0,c,d=this.radix,e=this.limbs;for(a=e.length-1;0<=a;a--)c=e[a],e[a]=c+b>>
1,b=(c&1)<<d;e[e.length-1]||e.pop();return this},subM:function(a){"object"!==typeof a&&(a=new this.e(a));var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]-=c[a];return this},mod:function(a){var b=!this.greaterEquals(new sjcl.bn(0));a=(new sjcl.bn(a)).normalize();var c=(new sjcl.bn(this)).normalize(),d=0;for(b&&(c=(new sjcl.bn(0)).subM(c).normalize());c.greaterEquals(a);d++)a.doubleM();for(b&&(c=a.sub(c).normalize());0<d;d--)a.halveM(),c.greaterEquals(a)&&
c.subM(a).normalize();return c.trim()},inverseMod:function(a){var b=new sjcl.bn(1),c=new sjcl.bn(0),d=new sjcl.bn(this),e=new sjcl.bn(a),f,g=1;a.limbs[0]&1||n(new sjcl.exception.invalid("inverseMod: p must be odd"));do{d.limbs[0]&1&&(d.greaterEquals(e)||(f=d,d=e,e=f,f=b,b=c,c=f),d.subM(e),d.normalize(),b.greaterEquals(c)||b.addM(a),b.subM(c));d.halveM();b.limbs[0]&1&&b.addM(a);b.normalize();b.halveM();for(f=g=0;f<d.limbs.length;f++)g|=d.limbs[f]}while(g);e.equals(1)||n(new sjcl.exception.invalid("inverseMod: p and x must be relatively prime"));
return c},add:function(a){return this.copy().addM(a)},sub:function(a){return this.copy().subM(a)},mul:function(a){"number"===typeof a&&(a=new this.e(a));var b,c=this.limbs,d=a.limbs,e=c.length,f=d.length,g=new this.e,h=g.limbs,k,m=this.maxMul;for(b=0;b<this.limbs.length+a.limbs.length+1;b++)h[b]=0;for(b=0;b<e;b++){k=c[b];for(a=0;a<f;a++)h[b+a]+=k*d[a];--m||(m=this.maxMul,g.cnormalize())}return g.cnormalize().reduce()},square:function(){return this.mul(this)},power:function(a){"number"===typeof a?
a=[a]:a.limbs!==q&&(a=a.normalize().limbs);var b,c,d=new this.e(1),e=this;for(b=0;b<a.length;b++)for(c=0;c<this.radix;c++)a[b]&1<<c&&(d=d.mul(e)),e=e.square();return d},mulmod:function(a,b){return this.mod(b).mul(a.mod(b)).mod(b)},powermod:function(a,b){for(var c=new sjcl.bn(1),d=new sjcl.bn(this),e=new sjcl.bn(a);;){e.limbs[0]&1&&(c=c.mulmod(d,b));e.halveM();if(e.equals(0))break;d=d.mulmod(d,b)}return c.normalize().reduce()},trim:function(){var a=this.limbs,b;do b=a.pop();while(a.length&&0===b);
a.push(b);return this},reduce:function(){return this},fullReduce:function(){return this.normalize()},normalize:function(){var a=0,b,c=this.ipv,d,e=this.limbs,f=e.length,g=this.radixMask;for(b=0;b<f||0!==a&&-1!==a;b++)a=(e[b]||0)+a,d=e[b]=a&g,a=(a-d)*c;-1===a&&(e[b-1]-=this.placeVal);return this},cnormalize:function(){var a=0,b,c=this.ipv,d,e=this.limbs,f=e.length,g=this.radixMask;for(b=0;b<f-1;b++)a=e[b]+a,d=e[b]=a&g,a=(a-d)*c;e[b]+=a;return this},toBits:function(a){this.fullReduce();a=a||this.exponent||
this.bitLength();var b=Math.floor((a-1)/24),c=sjcl.bitArray,d=[c.partial((a+7&-8)%this.radix||this.radix,this.getLimb(b))];for(b--;0<=b;b--)d=c.concat(d,[c.partial(Math.min(this.radix,a),this.getLimb(b))]),a-=this.radix;return d},bitLength:function(){this.fullReduce();for(var a=this.radix*(this.limbs.length-1),b=this.limbs[this.limbs.length-1];b;b>>>=1)a++;return a+7&-8}};
sjcl.bn.fromBits=function(a){var b=new this,c=[],d=sjcl.bitArray,e=this.prototype,f=Math.min(this.bitLength||0x100000000,d.bitLength(a)),g=f%e.radix||e.radix;for(c[0]=d.extract(a,0,g);g<f;g+=e.radix)c.unshift(d.extract(a,g,e.radix));b.limbs=c;return b};sjcl.bn.prototype.ipv=1/(sjcl.bn.prototype.placeVal=Math.pow(2,sjcl.bn.prototype.radix));sjcl.bn.prototype.radixMask=(1<<sjcl.bn.prototype.radix)-1;
sjcl.bn.pseudoMersennePrime=function(a,b){function c(a){this.initWith(a)}var d=c.prototype=new sjcl.bn,e,f;e=d.modOffset=Math.ceil(f=a/d.radix);d.exponent=a;d.offset=[];d.factor=[];d.minOffset=e;d.fullMask=0;d.fullOffset=[];d.fullFactor=[];d.modulus=c.modulus=new sjcl.bn(Math.pow(2,a));d.fullMask=0|-Math.pow(2,a%d.radix);for(e=0;e<b.length;e++)d.offset[e]=Math.floor(b[e][0]/d.radix-f),d.fullOffset[e]=Math.ceil(b[e][0]/d.radix-f),d.factor[e]=b[e][1]*Math.pow(0.5,a-b[e][0]+d.offset[e]*d.radix),d.fullFactor[e]=
b[e][1]*Math.pow(0.5,a-b[e][0]+d.fullOffset[e]*d.radix),d.modulus.addM(new sjcl.bn(Math.pow(2,b[e][0])*b[e][1])),d.minOffset=Math.min(d.minOffset,-d.offset[e]);d.e=c;d.modulus.cnormalize();d.reduce=function(){var a,b,c,d=this.modOffset,e=this.limbs,f=this.offset,x=this.offset.length,y=this.factor,C;for(a=this.minOffset;e.length>d;){c=e.pop();C=e.length;for(b=0;b<x;b++)e[C+f[b]]-=y[b]*c;a--;a||(e.push(0),this.cnormalize(),a=this.minOffset)}this.cnormalize();return this};d.M=-1===d.fullMask?d.reduce:
function(){var a=this.limbs,b=a.length-1,c,d;this.reduce();if(b===this.modOffset-1){d=a[b]&this.fullMask;a[b]-=d;for(c=0;c<this.fullOffset.length;c++)a[b+this.fullOffset[c]]-=this.fullFactor[c]*d;this.normalize()}};d.fullReduce=function(){var a,b;this.M();this.addM(this.modulus);this.addM(this.modulus);this.normalize();this.M();for(b=this.limbs.length;b<this.modOffset;b++)this.limbs[b]=0;a=this.greaterEquals(this.modulus);for(b=0;b<this.limbs.length;b++)this.limbs[b]-=this.modulus.limbs[b]*a;this.cnormalize();
return this};d.inverse=function(){return this.power(this.modulus.sub(2))};c.fromBits=sjcl.bn.fromBits;return c};var $=sjcl.bn.pseudoMersennePrime;
sjcl.bn.prime={p127:$(127,[[0,-1]]),p25519:$(255,[[0,-19]]),p192k:$(192,[[32,-1],[12,-1],[8,-1],[7,-1],[6,-1],[3,-1],[0,-1]]),p224k:$(224,[[32,-1],[12,-1],[11,-1],[9,-1],[7,-1],[4,-1],[1,-1],[0,-1]]),p256k:$(0x100,[[32,-1],[9,-1],[8,-1],[7,-1],[6,-1],[4,-1],[0,-1]]),p192:$(192,[[0,-1],[64,-1]]),p224:$(224,[[0,1],[96,-1]]),p256:$(0x100,[[0,-1],[96,1],[192,1],[224,-1]]),p384:$(384,[[0,-1],[32,1],[96,-1],[128,-1]]),p521:$(521,[[0,-1]])};
sjcl.bn.random=function(a,b){"object"!==typeof a&&(a=new sjcl.bn(a));for(var c,d,e=a.limbs.length,f=a.limbs[e-1]+1,g=new sjcl.bn;;){do c=sjcl.random.randomWords(e,b),0>c[e-1]&&(c[e-1]+=0x100000000);while(Math.floor(c[e-1]/f)===Math.floor(0x100000000/f));c[e-1]%=f;for(d=0;d<e-1;d++)c[d]&=a.radixMask;g.limbs=c;if(!g.greaterEquals(a))return g}};