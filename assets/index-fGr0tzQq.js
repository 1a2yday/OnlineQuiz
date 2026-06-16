(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const P=new Map;let G="home";function L(e,t){P.set(e,t)}function y(e){G=e,window.location.hash!==`#${e}`&&(window.location.hash=e);const t=P.get(e);t&&(t(),window.scrollTo(0,0))}window.addEventListener("hashchange",()=>{const e=window.location.hash.replace("#","");e&&P.has(e)&&e!==G&&(G=e,P.get(e)(),window.scrollTo(0,0))});const g={QUIZ_BANKS:"english_quiz_banks",USERS:"english_quiz_users",CURRENT_USER:"english_quiz_current_user",QUIZ_RECORDS:"english_quiz_records",WRONG_QUESTIONS:"english_quiz_wrong_questions",BLACKLIST:"english_quiz_blacklist",APP_CONFIG:"english_quiz_config"};function k(e,t){try{const n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}function v(e,t){localStorage.setItem(e,JSON.stringify(t))}const ce="english_quiz_remote_cache";async function le(){try{const e=await fetch("quizzes/manifest.json");if(!e.ok)return;const t=await e.json(),n=[];for(const s of t)try{const a=await fetch(`quizzes/${s.file}`);if(!a.ok)continue;const i=await a.json();if(!i.name||!Array.isArray(i.questions))continue;n.push({id:`remote_${s.id}`,name:s.name,questions:i.questions,createdAt:0})}catch{console.warn(`远程题库加载失败: ${s.file}`)}v(ce,n),window.dispatchEvent(new CustomEvent("remote-quizzes-loaded"))}catch{}}function ze(){return k(ce,[])}function C(){const e=k(g.QUIZ_BANKS,[]);return[...ze(),...e]}function ue(){return k(g.QUIZ_BANKS,[])}function Te(e){if(e.id.startsWith("remote_"))return;const t=ue(),n=t.findIndex(s=>s.id===e.id);n>=0?t[n]=e:t.push(e),v(g.QUIZ_BANKS,t)}function Z(e){if(e.startsWith("remote_"))return;const t=ue().filter(n=>n.id!==e);v(g.QUIZ_BANKS,t)}function D(){return k(g.USERS,[])}function w(){return k(g.CURRENT_USER,null)}function K(e){if(v(g.CURRENT_USER,e),e){const t=D();t.find(n=>n.id===e.id)||(t.push(e),v(g.USERS,t))}}function me(e){const t=D().filter(i=>i.id!==e);v(g.USERS,t);const n=w();n&&n.id===e&&K(null);const s=Q().filter(i=>i.userId!==e);v(g.QUIZ_RECORDS,s);const a=F().filter(i=>i.userId!==e);v(g.WRONG_QUESTIONS,a)}function Q(){return k(g.QUIZ_RECORDS,[])}function Me(e){const t=Q();t.push(e),v(g.QUIZ_RECORDS,t)}function N(e){return Q().filter(t=>t.quizBankId===e).sort((t,n)=>{const s=t.correctCount/t.totalCount,a=n.correctCount/n.totalCount;return a!==s?a-s:t.timeSeconds-n.timeSeconds})}function F(){return k(g.WRONG_QUESTIONS,[])}function R(e,t,n){const s=F(),a=s.find(i=>i.userId===e&&i.questionId===t);a?(a.wrongCount+=1,a.mastered=!1):s.push({userId:e,questionId:t,quizBankId:n,wrongCount:1,mastered:!1}),v(g.WRONG_QUESTIONS,s)}function pe(e,t){const n=F(),s=n.find(a=>a.userId===e&&a.questionId===t);s&&(s.mastered=!0,v(g.WRONG_QUESTIONS,n))}function fe(e){return F().filter(t=>t.userId===e&&!t.mastered)}function ye(e,t){const n=F().find(s=>s.userId===e&&s.questionId===t);return n?n.wrongCount:0}function T(){return k(g.BLACKLIST,[])}function xe(e,t){const n=T();n.find(s=>s.userId===e)||(n.push({userId:e,userName:t,timestamp:Date.now()}),v(g.BLACKLIST,n))}function ge(e){const t=T().filter(n=>n.userId!==e);v(g.BLACKLIST,t)}function V(e){return T().some(t=>t.userId===e)}function U(){return k(g.APP_CONFIG,{bannerUrl:"banner.gif",adminPasswordHash:"",welcomeTitle:"英语刷题助手",welcomeSubtitle:"Sweet English, Sweet Learning!"})}function M(e){const t=U();v(g.APP_CONFIG,{...t,...e})}const A=Object.freeze(Object.defineProperty({__proto__:null,addToBlacklist:xe,deleteQuizBank:Z,deleteUserData:me,getAppConfig:U,getBlacklist:T,getCurrentUser:w,getLeaderboard:N,getQuizBanks:C,getQuizRecords:Q,getUserWrongQuestions:fe,getUsers:D,getWrongCountForQuestion:ye,getWrongQuestions:F,isBlacklisted:V,loadRemoteQuizzes:le,markWrongQuestionMastered:pe,recordWrongAnswer:R,removeFromBlacklist:ge,saveQuizBank:Te,saveQuizRecord:Me,setAppConfig:M,setCurrentUser:K},Symbol.toStringTag,{value:"Module"})),O=[{id:"honey-lemon",name:"蜂蜜柠檬糖",emoji:"🍯",primary:"#FF8C42",primaryLight:"#FFAA70",secondary:"#FFB347",secondaryLight:"#FFC773",accent:"#2EC4A7",highlight:"#FFC940",background:"#FFF8F0",card:"#FFFFFF",text:"#4A3030",textSecondary:"#8B7070",textMuted:"#B8A0A0",textLight:"#C8B0A0",border:"#FFE0D0",borderStrong:"#FFC8A8",bgLight:"#FFF5EE",shadow:"rgba(255, 140, 66, 0.15)",shadowHover:"rgba(255, 140, 66, 0.25)",primaryGradient:"linear-gradient(135deg, #FF8C42, #FFAA70)",secondaryGradient:"linear-gradient(135deg, #FFB347, #FFC773)",accentGradient:"linear-gradient(135deg, #2EC4A7, #50D8B8)",highlightGradient:"linear-gradient(135deg, #FFC940, #FFD970)"},{id:"mint",name:"薄荷糖",emoji:"🍃",primary:"#00BFA5",primaryLight:"#33CFB5",secondary:"#26A69A",secondaryLight:"#4DB6AC",accent:"#00D2A0",highlight:"#FFC940",background:"#F0FFFA",card:"#FFFFFF",text:"#2D4040",textSecondary:"#5C7070",textMuted:"#90A0A0",textLight:"#A8B8B8",border:"#C8E8E0",borderStrong:"#A0D8C8",bgLight:"#E8F8F2",shadow:"rgba(0, 191, 165, 0.15)",shadowHover:"rgba(0, 191, 165, 0.25)",primaryGradient:"linear-gradient(135deg, #00BFA5, #33CFB5)",secondaryGradient:"linear-gradient(135deg, #26A69A, #4DB6AC)",accentGradient:"linear-gradient(135deg, #00D2A0, #33E0B8)",highlightGradient:"linear-gradient(135deg, #FFC940, #FFD970)"},{id:"strawberry",name:"草莓糖",emoji:"🍓",primary:"#FF6B9D",primaryLight:"#FF85B3",secondary:"#9B59B6",secondaryLight:"#B07CD8",accent:"#00D2A0",highlight:"#FFD93D",background:"#FFF0F5",card:"#FFFFFF",text:"#4A3040",textSecondary:"#8B7080",textMuted:"#B8A0B0",textLight:"#C8B0C0",border:"#FFE0EC",borderStrong:"#FFB8D0",bgLight:"#FFF5F7",shadow:"rgba(255, 107, 157, 0.15)",shadowHover:"rgba(255, 107, 157, 0.25)",primaryGradient:"linear-gradient(135deg, #FF6B9D, #FF85B3)",secondaryGradient:"linear-gradient(135deg, #9B59B6, #B07CD8)",accentGradient:"linear-gradient(135deg, #00D2A0, #33E0B8)",highlightGradient:"linear-gradient(135deg, #FFD93D, #FFE566)"},{id:"blueberry",name:"蓝莓糖",emoji:"🫐",primary:"#667EEA",primaryLight:"#8295F0",secondary:"#764BA2",secondaryLight:"#9568C0",accent:"#00D2A0",highlight:"#FFC940",background:"#F2F0FF",card:"#FFFFFF",text:"#303048",textSecondary:"#686880",textMuted:"#9898B0",textLight:"#B0B0C8",border:"#D8D8F0",borderStrong:"#C0C0E8",bgLight:"#ECEAFA",shadow:"rgba(102, 126, 234, 0.15)",shadowHover:"rgba(102, 126, 234, 0.25)",primaryGradient:"linear-gradient(135deg, #667EEA, #8295F0)",secondaryGradient:"linear-gradient(135deg, #764BA2, #9568C0)",accentGradient:"linear-gradient(135deg, #00D2A0, #33E0B8)",highlightGradient:"linear-gradient(135deg, #FFC940, #FFD970)"}],re="honey-lemon",be="english_quiz_theme";function he(){try{return localStorage.getItem(be)||re}catch{return re}}function Pe(e){localStorage.setItem(be,e)}function J(){const e=he();return O.find(t=>t.id===e)||O[0]}function ve(e){const t=document.documentElement;t.style.setProperty("--c-primary",e.primary),t.style.setProperty("--c-primary-light",e.primaryLight),t.style.setProperty("--c-secondary",e.secondary),t.style.setProperty("--c-secondary-light",e.secondaryLight),t.style.setProperty("--c-accent",e.accent),t.style.setProperty("--c-highlight",e.highlight),t.style.setProperty("--c-background",e.background),t.style.setProperty("--c-card",e.card),t.style.setProperty("--c-text",e.text),t.style.setProperty("--c-text-secondary",e.textSecondary),t.style.setProperty("--c-text-muted",e.textMuted),t.style.setProperty("--c-text-light",e.textLight),t.style.setProperty("--c-border",e.border),t.style.setProperty("--c-border-strong",e.borderStrong),t.style.setProperty("--c-bg-light",e.bgLight),t.style.setProperty("--c-shadow",e.shadow),t.style.setProperty("--c-shadow-hover",e.shadowHover),t.style.setProperty("--c-primary-gradient",e.primaryGradient),t.style.setProperty("--c-secondary-gradient",e.secondaryGradient),t.style.setProperty("--c-accent-gradient",e.accentGradient),t.style.setProperty("--c-highlight-gradient",e.highlightGradient)}function Ne(){const e=J();return ve(e),e}const Oe="modulepreload",je=function(e,t){return new URL(e,t).href},ie={},S=function(t,n,s){let a=Promise.resolve();if(n&&n.length>0){let r=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");a=r(n.map(c=>{if(c=je(c,s),c in ie)return;ie[c]=!0;const u=c.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(s)for(let p=o.length-1;p>=0;p--){const h=o[p];if(h.href===c&&(!u||h.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${m}`))return;const x=document.createElement("link");if(x.rel=u?"stylesheet":Oe,u||(x.as="script"),x.crossOrigin="",x.href=c,d&&x.setAttribute("nonce",d),document.head.appendChild(x),u)return new Promise((p,h)=>{x.addEventListener("load",p),x.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return a.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};function we(){const e="abcdefghijklmnopqrstuvwxyz0123456789";let t="";for(let n=0;n<12;n++)t+=e.charAt(Math.floor(Math.random()*e.length));return`u_${t}_${Date.now().toString(36)}`}function Ee(){return`qb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`}function ke(){return`q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`}function _(e){const t=Math.floor(e/60),n=e%60;return`${t.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}function Y(e){const t=[...e];for(let n=t.length-1;n>0;n--){const s=Math.floor(Math.random()*(n+1));[t[n],t[s]]=[t[s],t[n]]}return t}function Ie(e){const t=e.trim();if(!t)return{valid:!1,error:"名字不能为空"};const n=(t.match(/[\u4e00-\u9fff]/g)||[]).length,s=(t.match(/[a-zA-Z]/g)||[]).length,a=t.length-n-s;return n>5?{valid:!1,error:"中文最多5个字符"}:s>10?{valid:!1,error:"英文最多10个字符"}:a>0?{valid:!1,error:"名字只能包含中文或英文字母"}:n===0&&s===0?{valid:!1,error:"名字至少包含一个中文字或英文字母"}:t.length>15?{valid:!1,error:"名字总长度不能超过15个字符"}:{valid:!0,error:""}}const De=[/[^\u4e00-\u9fffa-zA-Z0-9_\-\s]/g];function Se(e){const t=e.trim().toLowerCase(),n=["admin","root","system","test","null","管理员","系统","超级管理员","版主"];for(const s of n)if(t.includes(s.toLowerCase()))return!0;for(const s of De){const a=t.match(s);if(a&&a.length>2)return!0}return!1}async function X(e){const t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(n)).map(a=>a.toString(16).padStart(2,"0")).join("")}function I(e){const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};return e.replace(/[&<>"'`]/g,n=>t[n]||n)}function ee(e){if(!e)return!1;if(/^(\.{0,2}\/|[a-zA-Z0-9_-])/.test(e)&&!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(e))return!0;try{const t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"}catch{return!1}}const Qe="240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";async function Le(e){const{getAppConfig:t}=await S(async()=>{const{getAppConfig:i}=await Promise.resolve().then(()=>A);return{getAppConfig:i}},void 0,import.meta.url),s=t().adminPasswordHash||Qe;return await X(e)===s}async function Be(e){const{setAppConfig:t}=await S(async()=>{const{setAppConfig:s}=await Promise.resolve().then(()=>A);return{setAppConfig:s}},void 0,import.meta.url),n=await X(e);t({adminPasswordHash:n})}function H(e){try{return JSON.parse(localStorage.getItem("english_quiz_admins")||"[]").includes(e)}catch{return!1}}function $e(e,t){try{const n=JSON.parse(localStorage.getItem("english_quiz_admins")||"[]");t&&!n.includes(e)&&n.push(e),localStorage.setItem("english_quiz_admins",JSON.stringify(n))}catch{}}const Re=Object.freeze(Object.defineProperty({__proto__:null,escapeHtml:I,formatTime:_,generateQuestionId:ke,generateQuizBankId:Ee,generateUserId:we,hasSensitiveWords:Se,isAdminUser:H,isValidUrl:ee,setAdminPassword:Be,setAdminUser:$e,sha256:X,shuffle:Y,validateName:Ie,verifyAdminPassword:Le},Symbol.toStringTag,{value:"Module"}));function _e(){const e=document.getElementById("app");if(!e)return;const t=w();if(!t){y("name-entry");return}if(V(t.id)){e.innerHTML=`
      <div class="phone-container flex items-center justify-center p-6">
        <div class="card-candy text-center p-8 w-full">
          <div class="text-5xl mb-4">🚫</div>
          <h2 class="text-xl font-bold text-candy-text mb-2">账户已被禁用</h2>
          <p class="text-candy-text-secondary text-sm">您的账户已被管理员禁用。</p>
        </div>
      </div>`;return}const n=U(),s=H(t.id),i=`
    <img src="${n.bannerUrl&&ee(n.bannerUrl)?I(n.bannerUrl):"banner.gif"}" alt="Banner"
         class="w-full rounded-2xl object-cover max-h-48"
         onerror="this.style.display='none';document.getElementById('fallback-banner')?.classList.remove('hidden')" />
    <div id="fallback-banner" class="hidden w-full rounded-2xl bg-gradient-to-br from-candy-primary via-candy-primary-light to-candy-border-strong p-6 text-white text-center">
      <div class="text-4xl mb-2">🍬</div>
      <h2 class="text-xl font-black">${I(n.welcomeTitle)}</h2>
      <p class="text-sm opacity-80 mt-1">${I(n.welcomeSubtitle)}</p>
    </div>`;e.innerHTML=`
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 横幅 -->
      <div class="mb-4 animate-fade-in-up">
        ${i}
      </div>

      <!-- 用户信息条 -->
      <div class="flex items-center justify-between mb-6 px-2 animate-fade-in-up delay-100">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-candy-primary to-candy-primary-light flex items-center justify-center text-white font-bold text-sm">
            ${t.name.charAt(0).toUpperCase()}
          </div>
          <span class="font-bold text-candy-text">${t.name}</span>
          ${s?'<span class="text-xs bg-candy-highlight text-candy-text px-2 py-1 rounded-full font-bold">管理员</span>':""}
        </div>
        <div class="flex items-center gap-2">
          <button id="switch-user-btn" class="text-xs text-candy-text-muted underline">切换用户</button>
        </div>
      </div>

      <!-- 功能按钮区 -->
      <div class="flex flex-col gap-3 flex-1">
        <button id="btn-quiz-bank" class="btn-candy btn-strawberry w-full text-lg animate-fade-in-up delay-200">
          📚 题库练习
        </button>
        <button id="btn-wrong" class="btn-candy btn-grape w-full text-lg animate-fade-in-up delay-300">
          📝 错题重刷
        </button>
        <button id="btn-leaderboard" class="btn-candy btn-mint w-full text-lg animate-fade-in-up delay-400">
          🏆 排行榜<span class="text-xs opacity-60">（仅本机）</span>
        </button>
        ${s?`
        <button id="btn-admin" class="btn-candy btn-lemon w-full text-lg animate-fade-in-up delay-500">
          ⚙️ 管理面板
        </button>`:`
        <button id="btn-admin-login" class="btn-candy btn-outline w-full text-sm animate-fade-in-up delay-500">
          🔑 管理员入口
        </button>`}
      </div>

      <!-- 管理员登录弹窗 -->
      <div id="admin-login-modal" class="hidden fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
        <div class="bg-white rounded-t-3xl w-full max-w-[480px] p-6 animate-fade-in-up">
          <h3 class="text-lg font-black text-candy-text mb-4">管理员验证</h3>
          <input id="admin-password-input" type="password" placeholder="请输入管理员密码"
            class="w-full px-4 py-3 rounded-2xl border-2 border-candy-border text-candy-text text-center outline-none focus:border-candy-primary" />
          <p id="admin-password-error" class="text-candy-primary text-sm mt-2 hidden"></p>
          <div class="flex gap-3 mt-4">
            <button id="cancel-admin-login-btn" class="btn-candy btn-outline flex-1">取消</button>
            <button id="confirm-admin-login-btn" class="btn-candy btn-strawberry flex-1">确认</button>
          </div>
        </div>
      </div>

      <!-- 主题切换 -->
      <div class="card-candy mt-4 p-3 animate-fade-in-up delay-500">
        <p class="text-xs text-candy-text-muted mb-2 text-center">🎨 配色方案</p>
        <div class="flex justify-center gap-3" id="theme-swatches">
          ${O.map(m=>`
            <div class="theme-swatch ${he()===m.id?"active":""}"
                 data-theme-id="${m.id}"
                 title="${m.name}"
                 style="background: linear-gradient(135deg, ${m.primary}, ${m.primaryLight})">
            </div>
          `).join("")}
        </div>
        <p class="text-xs text-candy-text-muted text-center mt-1" id="theme-name-label">${J().emoji} ${J().name}</p>
      </div>

      <!-- 底部提示 -->
      <p class="text-center text-xs text-candy-text-light mt-4 animate-fade-in-up delay-500">
        点击题库练习开始刷题吧~
      </p>
    </div>`,document.getElementById("btn-quiz-bank")?.addEventListener("click",()=>y("quiz-bank")),document.getElementById("btn-wrong")?.addEventListener("click",()=>y("wrong-questions")),document.getElementById("btn-leaderboard")?.addEventListener("click",()=>y("leaderboard")),document.getElementById("btn-admin")?.addEventListener("click",()=>y("admin")),document.getElementById("switch-user-btn")?.addEventListener("click",()=>{confirm("确定要切换用户吗？")&&S(async()=>{const{setCurrentUser:m}=await Promise.resolve().then(()=>A);return{setCurrentUser:m}},void 0,import.meta.url).then(({setCurrentUser:m})=>{m(null),y("name-entry")})});const o=document.getElementById("admin-login-modal"),l=document.getElementById("btn-admin-login"),d=document.getElementById("cancel-admin-login-btn"),r=document.getElementById("confirm-admin-login-btn"),c=document.getElementById("admin-password-input"),u=document.getElementById("admin-password-error");l?.addEventListener("click",()=>{o?.classList.remove("hidden"),setTimeout(()=>c?.focus(),200)}),d?.addEventListener("click",()=>o?.classList.add("hidden")),o?.addEventListener("click",m=>{m.target===o&&o.classList.add("hidden")}),r?.addEventListener("click",async()=>{const m=c?.value.trim()||"";await Le(m)?($e(t.id,!0),o?.classList.add("hidden"),_e()):u&&(u.textContent="密码错误",u.classList.remove("hidden"))}),c?.addEventListener("keydown",m=>{m.key==="Enter"&&r?.click()}),document.querySelectorAll(".theme-swatch").forEach(m=>{m.addEventListener("click",()=>{const x=m.dataset.themeId;if(!x)return;const p=O.find(W=>W.id===x);if(!p)return;Pe(x),ve(p),document.querySelectorAll(".theme-swatch").forEach(W=>W.classList.remove("active")),m.classList.add("active");const h=document.getElementById("theme-name-label");h&&(h.textContent=`${p.emoji} ${p.name}`)})})}function Ue(){const e=document.getElementById("app");if(!e)return;e.innerHTML=`
    <div class="phone-container flex flex-col items-center justify-center min-h-screen p-6">
      <div class="card-candy w-full p-8 animate-fade-in-up text-center">
        <!-- 糖果图标 -->
        <div class="text-5xl mb-4">🍬</div>
        <h1 class="text-2xl font-black text-candy-primary mb-2">英语刷题助手</h1>
        <p class="text-candy-text-secondary text-sm mb-6">Welcome! 请先给自己取个名字吧~</p>

        <div class="mb-4">
          <input
            id="name-input"
            type="text"
            placeholder="输入你的名字"
            maxlength="15"
            class="w-full px-5 py-3 rounded-2xl border-2 border-candy-border bg-candy-bg-light text-candy-text text-center text-lg font-semibold outline-none transition-all focus:border-candy-primary focus:bg-white"
            autocomplete="off"
          />
          <p class="text-xs text-candy-text-muted mt-2">最多5个中文字或10个英文字母</p>
        </div>

        <p id="name-error" class="text-candy-primary text-sm mb-4 hidden"></p>

        <button id="confirm-name-btn" class="btn-candy btn-strawberry w-full">
          开始学习 ✨
        </button>
      </div>
    </div>`;const t=document.getElementById("name-input"),n=document.getElementById("name-error"),s=document.getElementById("confirm-name-btn"),a=()=>{const i=t.value.trim(),o=Ie(i);if(!o.valid){n.textContent=o.error,n.classList.remove("hidden"),t.classList.add("animate-shake"),setTimeout(()=>t.classList.remove("animate-shake"),500);return}if(Se(i)){n.textContent="该名字不被允许，请换一个",n.classList.remove("hidden");return}n.classList.add("hidden");const l={id:we(),name:i,createdAt:Date.now()};K(l),y("home")};s.addEventListener("click",a),t.addEventListener("keydown",i=>{i.key==="Enter"&&a()}),setTimeout(()=>t.focus(),300)}const He=JSON.stringify({name:"示例英语题库",questions:[{type:"single-choice",question:"What is the capital of the United Kingdom?",options:["Manchester","London","Liverpool","Birmingham"],answer:1},{type:"single-choice",question:'Which word means "愉快的" in English?',options:["Sad","Angry","Happy","Tired"],answer:2},{type:"single-choice",question:'"She ___ to school every day." Choose the correct form.',options:["go","goes","going","gone"],answer:1},{type:"single-choice",question:'What is the plural form of "child"?',options:["Childs","Childes","Children","Childrens"],answer:2},{type:"single-choice",question:"Which sentence is grammatically correct?",options:["He don't like apples.","He doesn't like apples.","He not like apples.","He doesn't likes apples."],answer:1},{type:"matching",question:"请将左侧英文单词与右侧中文释义匹配",left:["apple","banana","cherry","grape"],right:["樱桃","香蕉","苹果","葡萄"],pairs:[[0,2],[1,1],[2,0],[3,3]]},{type:"matching",question:"请将左侧动词与右侧过去式匹配",left:["eat","go","see","take"],right:["went","saw","ate","took"],pairs:[[0,2],[1,0],[2,1],[3,3]]},{type:"sentence-order",question:"我喜欢在周末读书",words:["I","like","reading","books","on","weekends"],answer:[0,1,2,3,4,5]},{type:"sentence-order",question:"她每天早晨喝一杯咖啡",words:["She","drinks","a","cup","of","coffee","every","morning"],answer:[0,1,2,3,4,5,6,7]},{type:"sentence-order",question:"他们正在公园里踢足球",words:["They","are","playing","football","in","the","park"],answer:[0,1,2,3,4,5,6]}]},null,2);let Ce=null,de=!1;function We(){de||(de=!0,window.addEventListener("remote-quizzes-loaded",()=>{document.getElementById("app")?.querySelector("#bank-list")&&j()}))}function te(){return Ce}function j(){const e=document.getElementById("app");if(!e)return;We();const t=w();if(!t){y("name-entry");return}const n=C(),s=H(t.id),a=n.length===0?`<div class="text-center py-12 text-candy-text-muted">
        <div class="text-5xl mb-3">📭</div>
        <p class="font-semibold">还没有题库哦~</p>
        <p class="text-sm mt-1">${s?"点击下方按钮导入题库":"请联系管理员导入题库"}</p>
      </div>`:n.map((u,m)=>{const x=u.id.startsWith("remote_");return`
      <div class="card-candy mb-3 animate-fade-in-up delay-${m%5*100} cursor-pointer hover:shadow-lg transition-shadow" data-bank-id="${u.id}">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="font-bold text-candy-text text-lg">
              ${u.name}
              ${x?'<span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold">📡 云端</span>':""}
            </h3>
            <p class="text-sm text-candy-text-muted mt-1">${u.questions.length} 道题目</p>
          </div>
          <div class="flex items-center gap-2">
            ${s&&!x?`<button class="delete-bank-btn text-candy-primary text-sm px-2 py-1" data-bank-id="${u.id}">删除</button>`:""}
            <span class="text-candy-primary text-2xl">→</span>
          </div>
        </div>
      </div>`}).join("");e.innerHTML=`
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 顶部导航 -->
      <div class="flex items-center gap-3 mb-4 animate-fade-in-up">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text">题库列表</h1>
      </div>

      <!-- 题库列表 -->
      <div class="flex-1" id="bank-list">
        ${a}
      </div>

      ${s?`
      <div class="mt-4 space-y-2 animate-fade-in-up delay-300">
        <button id="import-bank-btn" class="btn-candy btn-strawberry w-full">
          📥 导入题库 (JSON)
        </button>
        <button id="load-sample-btn" class="btn-candy btn-mint w-full text-sm">
          🎁 加载示例题库（体验三种题型）
        </button>
        <p class="text-xs text-candy-text-muted text-center mt-2">
          支持包含单选题、消消乐、还原句子的混合题库
        </p>
      </div>`:""}

      <!-- 导入弹窗 -->
      <div id="import-modal" class="hidden fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
        <div class="bg-white rounded-t-3xl w-full max-w-[480px] p-6 animate-fade-in-up">
          <h3 class="text-lg font-black text-candy-text mb-4">导入题库</h3>
          <textarea id="import-json" class="w-full h-40 p-3 rounded-2xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary resize-none" placeholder='粘贴JSON格式的题库数据...'></textarea>
          <p id="import-error" class="text-candy-primary text-sm mt-2 hidden"></p>
          <div class="flex gap-3 mt-4">
            <button id="cancel-import-btn" class="btn-candy btn-outline flex-1">取消</button>
            <button id="confirm-import-btn" class="btn-candy btn-strawberry flex-1">确认导入</button>
          </div>
        </div>
      </div>
    </div>`,document.getElementById("back-home-btn")?.addEventListener("click",()=>y("home")),document.querySelectorAll("[data-bank-id]").forEach(u=>{u.addEventListener("click",m=>{if(m.target.classList.contains("delete-bank-btn"))return;const p=u.dataset.bankId;p&&(Ce=p,y("quiz"))})}),document.querySelectorAll(".delete-bank-btn").forEach(u=>{u.addEventListener("click",m=>{m.stopPropagation();const x=u.dataset.bankId;x&&confirm("确定删除该题库吗？")&&(Z(x),j())})});const i=document.getElementById("import-modal"),o=document.getElementById("import-bank-btn"),l=document.getElementById("cancel-import-btn"),d=document.getElementById("confirm-import-btn"),r=document.getElementById("import-json"),c=document.getElementById("import-error");o?.addEventListener("click",()=>{i?.classList.remove("hidden"),setTimeout(()=>r?.focus(),200)}),document.getElementById("load-sample-btn")?.addEventListener("click",()=>{r&&(r.value=He,i?.classList.remove("hidden"),setTimeout(()=>r?.focus(),200))}),l?.addEventListener("click",()=>i?.classList.add("hidden")),i?.addEventListener("click",u=>{u.target===i&&i.classList.add("hidden")}),d?.addEventListener("click",()=>{if(!(!r||!c))try{const u=JSON.parse(r.value.trim());if(!u.name||!Array.isArray(u.questions))throw new Error("题库格式错误：需要 name 和 questions 数组");const m=u.questions.map(p=>{const h={id:p.id||ke()};if(p.type==="single-choice")return{...h,type:"single-choice",question:String(p.question),options:p.options,answer:Number(p.answer),explanation:p.explanation?String(p.explanation):void 0};if(p.type==="matching")return{...h,type:"matching",question:String(p.question),left:p.left,right:p.right,pairs:p.pairs,explanation:p.explanation?String(p.explanation):void 0};if(p.type==="sentence-order")return{...h,type:"sentence-order",question:String(p.question),words:p.words,answer:p.answer,explanation:p.explanation?String(p.explanation):void 0};throw new Error(`未知题型: ${p.type}`)}),x={id:Ee(),name:String(u.name),questions:m,createdAt:Date.now()};S(async()=>{const{saveQuizBank:p}=await Promise.resolve().then(()=>A);return{saveQuizBank:p}},void 0,import.meta.url).then(({saveQuizBank:p})=>{p(x),i?.classList.add("hidden"),r.value="",j()})}catch(u){c&&(c.textContent=`导入失败：${u.message}`,c.classList.remove("hidden"))}})}let f;function Ge(){if(!document.getElementById("app"))return;if(!w()){y("name-entry");return}if(sessionStorage.getItem("wrong_questions_mode")==="true"){sessionStorage.removeItem("wrong_questions_mode"),oe();return}const s=te(),i=C().find(o=>o.id===s);if(!i){oe();return}Je(i.questions)}function Je(e){f={questions:[...e],currentIndex:0,answers:[],startTime:Date.now(),timerInterval:null,elapsedSeconds:0,answeredCorrect:[],isWrongQuestionsMode:!1,wrongBankIdMap:{}},Ae()}function oe(){if(!w())return;let t={};try{const n=sessionStorage.getItem("wrong_questions_bank_map");n&&(t=JSON.parse(n))}catch{}S(async()=>{const{getSelectedWrongQuestions:n}=await Promise.resolve().then(()=>ut);return{getSelectedWrongQuestions:n}},void 0,import.meta.url).then(({getSelectedWrongQuestions:n})=>{const s=n();if(!s||s.length===0){y("wrong-questions");return}f={questions:[...s],currentIndex:0,answers:[],startTime:Date.now(),timerInterval:null,elapsedSeconds:0,answeredCorrect:[],isWrongQuestionsMode:!0,wrongBankIdMap:t},Ae()})}function Ae(){Ze(),z()}function Ze(){f.timerInterval=setInterval(()=>{f.elapsedSeconds=Math.floor((Date.now()-f.startTime)/1e3);const e=document.getElementById("quiz-timer");e&&(e.textContent=_(f.elapsedSeconds))},500)}function Fe(){f.timerInterval&&(clearInterval(f.timerInterval),f.timerInterval=null)}function z(){const e=document.getElementById("app");if(!e)return;const t=f.questions[f.currentIndex];if(!t){at();return}const n=f.questions.length,s=f.currentIndex+1,a=f.currentIndex/n*100,i=w(),o=i?ye(i.id,t.id):0;let l;switch(t.type){case"single-choice":l=Ke(t);break;case"matching":l=Xe(t);break;case"sentence-order":l=nt(t);break;default:l="<p>未知题型</p>"}e.innerHTML=`
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 顶部栏 -->
      <div class="flex items-center justify-between mb-3">
        <button id="quit-quiz-btn" class="text-sm text-candy-text-muted underline">退出</button>
        <div class="flex items-center gap-2">
          <span class="text-xs text-candy-text-muted">${s}/${n}</span>
          <span id="quiz-timer" class="font-bold text-candy-primary text-sm">${_(f.elapsedSeconds)}</span>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-candy mb-4">
        <div class="progress-candy-fill" style="width:${a}%"></div>
      </div>

      <!-- 题型标签 -->
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs px-3 py-1 rounded-full bg-candy-border text-candy-primary font-bold">
          ${rt(t.type)}
        </span>
        ${o>0?`<span class="text-xs px-3 py-1 rounded-full bg-candy-highlight text-candy-text font-bold">做错${o}次</span>`:""}
      </div>

      <!-- 题目内容 -->
      <div class="flex-1">
        ${l}
      </div>

      <!-- 底部按钮 -->
      <div class="mt-4">
        <button id="submit-answer-btn" class="btn-candy btn-strawberry w-full" style="display:none">
          确认答案
        </button>
        <button id="next-question-btn" class="btn-candy btn-mint w-full" style="display:none">
          下一题 →
        </button>
      </div>
    </div>`,document.getElementById("quit-quiz-btn")?.addEventListener("click",()=>{confirm("确定要退出答题吗？当前进度不会保存。")&&(Fe(),y(f.isWrongQuestionsMode?"wrong-questions":"quiz-bank"))}),t.type==="single-choice"?Ve(t):t.type==="matching"?et(t):t.type==="sentence-order"&&st(t)}function Ke(e){const t=e.options.map((n,s)=>`
    <button class="option-btn single-option" data-index="${s}">
      <span class="inline-block w-7 h-7 rounded-full bg-candy-border text-candy-primary text-sm font-bold leading-7 text-center mr-3">${String.fromCharCode(65+s)}</span>
      ${n}
    </button>
  `).join("");return`
    <div class="card-candy">
      <h3 class="text-lg font-bold text-candy-text mb-4">${e.question}</h3>
      <div id="single-options">${t}</div>
      <div id="explanation-area" class="hidden mt-4 p-3 rounded-xl bg-candy-bg-light border border-candy-border text-sm text-candy-text-secondary leading-relaxed"></div>
    </div>`}let $=null,q=!1;function Ve(e){const t=document.querySelectorAll(".single-option"),n=document.getElementById("submit-answer-btn"),s=document.getElementById("next-question-btn");$=null,q=!1,t.forEach(a=>{a.addEventListener("click",()=>{q||a.hasAttribute("disabled")||(t.forEach(i=>i.classList.remove("selected")),a.classList.add("selected"),$=Number(a.dataset.index),n&&(n.style.display=""),s&&(s.style.display="none"))})}),n?.addEventListener("click",()=>{if($===null||q)return;q=!0,n&&(n.style.display="none"),t.forEach(i=>{i.disabled=!0});const a=$===e.answer;Ye(e,a),s&&(s.style.display="")},{once:!0}),s?.addEventListener("click",()=>{f.currentIndex++,$=null,q=!1,z()})}function Ye(e,t){if(document.querySelectorAll(".single-option").forEach((s,a)=>{s.disabled=!0,a===e.answer&&(s.classList.add("correct"),s.innerHTML+=" ✓"),a===$&&!t&&(s.classList.add("wrong"),s.classList.add("animate-shake"),s.innerHTML+=" ✗")}),f.answers.push($),f.answeredCorrect.push(t),!t){const s=w();s&&R(s.id,e.id,se(e.id))}ne(e.explanation)}let b;function Xe(e){b={leftSelected:null,rightSelected:null,matched:new Set,pairs:e.pairs};const t=e.left.map((s,a)=>`
    <div class="matching-item matching-left p-3 rounded-xl border-2 border-candy-border bg-white text-center font-semibold text-candy-text cursor-pointer transition-all"
         data-side="left" data-index="${a}">
      ${s}
    </div>
  `).join(""),n=Y(e.right.map((s,a)=>({item:s,origIdx:a}))).map(({item:s,origIdx:a})=>`
    <div class="matching-item matching-right p-3 rounded-xl border-2 border-candy-border bg-white text-center font-semibold text-candy-text cursor-pointer transition-all"
         data-side="right" data-index="${a}">
      ${s}
    </div>
  `).join("");return`
    <div class="card-candy">
      <h3 class="text-lg font-bold text-candy-text mb-2">${e.question}</h3>
      <p class="text-xs text-candy-text-muted mb-4">点击左侧再点击右侧进行匹配</p>
      <div class="flex gap-3">
        <div class="flex-1 flex flex-col gap-2" id="matching-left">${t}</div>
        <div class="flex-1 flex flex-col gap-2" id="matching-right">${n}</div>
      </div>
      <div id="explanation-area" class="hidden mt-4 p-3 rounded-xl bg-candy-bg-light border border-candy-border text-sm text-candy-text-secondary leading-relaxed"></div>
    </div>`}function et(e){const t=document.getElementById("submit-answer-btn"),n=document.getElementById("next-question-btn");t&&(t.style.display="none");const s=document.querySelectorAll(".matching-left"),a=document.querySelectorAll(".matching-right");function i(d,r){return b.pairs.some(([c,u])=>{const m=`${c}-${u}`;return b.matched.has(m)&&(d==="left"?c===r:u===r)})}s.forEach(d=>{d.addEventListener("click",()=>{const r=Number(d.dataset.index);i("left",r)||(s.forEach(c=>c.classList.remove("matching-selected")),d.classList.add("matching-selected"),b.leftSelected=r,o())})}),a.forEach(d=>{d.addEventListener("click",()=>{const r=Number(d.dataset.index);i("right",r)||(a.forEach(c=>c.classList.remove("matching-selected")),d.classList.add("matching-selected"),b.rightSelected=r,o())})});function o(){if(b.leftSelected===null||b.rightSelected===null)return;const d=b.pairs.find(([r,c])=>r===b.leftSelected&&c===b.rightSelected);if(d){const r=`${d[0]}-${d[1]}`;b.matched.add(r),s.forEach(c=>{Number(c.dataset.index)===d[0]&&(c.classList.add("matching-matched"),c.classList.remove("matching-selected"))}),a.forEach(c=>{Number(c.dataset.index)===d[1]&&(c.classList.add("matching-matched"),c.classList.remove("matching-selected"))}),b.leftSelected=null,b.rightSelected=null,b.matched.size===e.pairs.length&&l(e,n)}else s.forEach(r=>{r.classList.contains("matching-selected")&&(r.classList.add("animate-shake"),setTimeout(()=>r.classList.remove("animate-shake"),500))}),a.forEach(r=>{r.classList.contains("matching-selected")&&(r.classList.add("animate-shake"),setTimeout(()=>r.classList.remove("animate-shake"),500))}),b.leftSelected=null,b.rightSelected=null,s.forEach(r=>r.classList.remove("matching-selected")),a.forEach(r=>r.classList.remove("matching-selected"))}function l(d,r){const c=[];b.matched.forEach(m=>{const[x,p]=m.split("-").map(Number);c.push([x,p])});const u=b.matched.size===d.pairs.length&&d.pairs.every(([m,x])=>b.matched.has(`${m}-${x}`));if(f.answers.push(c),f.answeredCorrect.push(u),!u){const m=w();m&&R(m.id,d.id,se(d.id))}tt(d),s.forEach(m=>{m.style.pointerEvents="none"}),a.forEach(m=>{m.style.pointerEvents="none"}),d.explanation?(ne(d.explanation),r&&(r.style.display="")):setTimeout(()=>{f.currentIndex++,z()},600)}n?.addEventListener("click",()=>{f.currentIndex++,z()})}function tt(e){const t=document.querySelectorAll(".matching-left"),n=document.querySelectorAll(".matching-right");e.pairs.forEach(([s,a])=>{const i=b.matched.has(`${s}-${a}`);t.forEach(o=>{Number(o.dataset.index)===s&&(o.classList.add(i?"correct":"wrong"),o.classList.remove("matching-matched","matching-selected"),o.style.pointerEvents="none")}),n.forEach(o=>{Number(o.dataset.index)===a&&(o.classList.add(i?"correct":"wrong"),o.classList.remove("matching-matched","matching-selected"),o.style.pointerEvents="none")})})}let E;function nt(e){E={selectedOrder:[],availableIndices:e.words.map((n,s)=>s)};const t=Y(e.words.map((n,s)=>({word:n,origIdx:s}))).map(({word:n,origIdx:s})=>`
    <span class="word-chip word-available" data-index="${s}">${n}</span>
  `).join("");return`
    <div class="card-candy">
      <h3 class="text-lg font-bold text-candy-text mb-1">还原句子</h3>
      <p class="text-sm text-candy-primary font-semibold mb-4">${e.question}</p>

      <!-- 已选区域 -->
      <div id="sentence-result" class="min-h-[52px] p-3 rounded-2xl border-2 border-dashed border-candy-border-strong bg-candy-bg-light mb-4 flex flex-wrap gap-2 items-center">
        <span class="text-sm text-candy-text-light">按正确顺序点击下方单词...</span>
      </div>

      <!-- 待选单词 -->
      <div id="sentence-words" class="flex flex-wrap gap-2">
        ${t}
      </div>

      <div id="explanation-area" class="hidden mt-4 p-3 rounded-xl bg-candy-bg-light border border-candy-border text-sm text-candy-text-secondary leading-relaxed"></div>
    </div>`}function st(e){const t=document.getElementById("submit-answer-btn"),n=document.getElementById("next-question-btn"),s=document.getElementById("sentence-result"),a=document.getElementById("sentence-words");function i(){if(!s||!a)return;const{selectedOrder:o,availableIndices:l}=E;o.length===0?s.innerHTML='<span class="text-sm text-candy-text-light">按正确顺序点击下方单词...</span>':(s.innerHTML=o.map((d,r)=>`
        <span class="word-chip selected-for-order cursor-pointer" data-remove="${r}">${e.words[d]}</span>
      `).join(""),s.querySelectorAll("[data-remove]").forEach(d=>{d.addEventListener("click",()=>{const r=Number(d.dataset.remove),c=E.selectedOrder.splice(r,1)[0];E.availableIndices.push(c),E.availableIndices.sort((u,m)=>u-m),i()})})),a.innerHTML=l.map(d=>`
      <span class="word-chip word-available cursor-pointer" data-index="${d}">${e.words[d]}</span>
    `).join(""),a.querySelectorAll(".word-available").forEach(d=>{d.addEventListener("click",()=>{const r=Number(d.dataset.index),c=E.availableIndices.indexOf(r);c>=0&&(E.availableIndices.splice(c,1),E.selectedOrder.push(r),i())})}),o.length===e.words.length?t&&(t.style.display=""):t&&(t.style.display="none")}i(),t?.addEventListener("click",()=>{const o=[...E.selectedOrder],l=it(o,e.answer);if(f.answers.push(o),f.answeredCorrect.push(l),!l){const d=w();d&&R(d.id,e.id,se(e.id))}if(s){const d=e.answer.map(r=>e.words[r]).join(" ");l?s.innerHTML='<div class="text-candy-accent font-bold animate-bounce-in">✓ 正确！</div>':s.innerHTML=`
          <div class="text-candy-primary font-bold animate-shake">✗ 错误</div>
          <div class="text-sm text-candy-text-secondary mt-1">正确顺序：${d}</div>`}ne(e.explanation),t&&(t.style.display="none"),a&&a.querySelectorAll(".word-available").forEach(d=>d.style.pointerEvents="none"),s&&s.querySelectorAll(".selected-for-order").forEach(d=>d.style.pointerEvents="none"),n&&(n.style.display="")},{once:!0}),n?.addEventListener("click",()=>{f.currentIndex++,z()})}function at(){Fe();const e=f.elapsedSeconds,t=f.answeredCorrect.filter(Boolean).length,n=f.questions.length,s=w(),a=C();if(f.isWrongQuestionsMode){if(s){const i=new Map;f.questions.forEach((o,l)=>{const d=f.wrongBankIdMap[o.id]||"__unknown__",r=i.get(d)||{correct:0,total:0};r.total+=1,f.answeredCorrect[l]&&(r.correct+=1),i.set(d,r)}),S(async()=>{const{saveQuizRecord:o}=await Promise.resolve().then(()=>A);return{saveQuizRecord:o}},void 0,import.meta.url).then(({saveQuizRecord:o})=>{i.forEach((l,d)=>{const r=a.find(c=>c.id===d);o({userId:s.id,userName:s.name,quizBankId:d,quizBankName:r?.name||"错题重刷",correctCount:l.correct,totalCount:l.total,timeSeconds:e,timestamp:Date.now()})})})}sessionStorage.setItem("quiz_result",JSON.stringify({correctCount:t,totalCount:n,timeSeconds:e,quizBankId:"",quizBankName:"错题重刷",isWrongQuestionsMode:!0}))}else{const i=te(),o=a.find(l=>l.id===i);s&&o&&S(async()=>{const{saveQuizRecord:l}=await Promise.resolve().then(()=>A);return{saveQuizRecord:l}},void 0,import.meta.url).then(({saveQuizRecord:l})=>{l({userId:s.id,userName:s.name,quizBankId:o.id,quizBankName:o.name,correctCount:t,totalCount:n,timeSeconds:e,timestamp:Date.now()})}),sessionStorage.setItem("quiz_result",JSON.stringify({correctCount:t,totalCount:n,timeSeconds:e,quizBankId:i||"",quizBankName:o?.name||"未知题库",isWrongQuestionsMode:!1}))}y("quiz-result")}function ne(e){const t=document.getElementById("explanation-area");t&&e&&(t.innerHTML=`<span class="font-bold text-candy-primary">💡 解析：</span>${e}`,t.classList.remove("hidden"))}function se(e){return f.isWrongQuestionsMode?f.wrongBankIdMap[e]||"":te()||""}function rt(e){switch(e){case"single-choice":return"单选题";case"matching":return"消消乐";case"sentence-order":return"还原句子";default:return e}}function it(e,t){return e.length!==t.length?!1:e.every((n,s)=>n===t[s])}function dt(){const e=document.getElementById("app");if(!e)return;const t=sessionStorage.getItem("quiz_result");if(!t){y("home");return}const n=JSON.parse(t),s=n.totalCount>0?Math.round(n.correctCount/n.totalCount*100):0,a=N(n.quizBankId).slice(0,10),i=l=>l>=90?"🌟":l>=70?"👍":l>=50?"💪":"📚",o=a.length>0?a.map((l,d)=>`
      <div class="flex items-center justify-between py-2 px-3 ${d===0?"bg-candy-highlight/20 rounded-xl":""}">
        <div class="flex items-center gap-2">
          <span class="text-lg font-black ${d===0?"text-candy-highlight":d===1?"text-[#C0C0C0]":d===2?"text-[#CD7F32]":"text-candy-text-muted"}">
            ${d+1}
          </span>
          <span class="font-semibold text-candy-text text-sm">${l.userName}</span>
        </div>
        <div class="text-right text-xs">
          <span class="font-bold text-candy-primary">${l.correctCount}/${l.totalCount}</span>
          <span class="text-candy-text-muted ml-1">${_(l.timeSeconds)}</span>
        </div>
      </div>
    `).join(""):'<p class="text-center text-candy-text-muted text-sm py-4">暂无排行记录</p>';e.innerHTML=`
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 结果卡片 -->
      <div class="card-candy text-center mb-4 animate-bounce-in">
        <div class="text-5xl mb-3">${i(s)}</div>
        <h2 class="text-xl font-black text-candy-text mb-2">答题完成！</h2>
        <p class="text-sm text-candy-text-secondary mb-4">${n.quizBankName}</p>

        <div class="flex gap-4 mb-4">
          <div class="flex-1 bg-candy-bg-light rounded-2xl p-3">
            <p class="text-3xl font-black text-candy-primary">${n.correctCount}<span class="text-lg text-candy-text-muted">/${n.totalCount}</span></p>
            <p class="text-xs text-candy-text-secondary mt-1">正确题数</p>
          </div>
          <div class="flex-1 bg-candy-accent/10 rounded-2xl p-3">
            <p class="text-3xl font-black text-candy-accent">${s}<span class="text-lg">%</span></p>
            <p class="text-xs text-candy-text-secondary mt-1">正确率</p>
          </div>
          <div class="flex-1 bg-candy-highlight/20 rounded-2xl p-3">
            <p class="text-3xl font-black text-candy-highlight">${_(n.timeSeconds)}</p>
            <p class="text-xs text-candy-text-secondary mt-1">用时</p>
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div class="card-candy mb-4 animate-fade-in-up delay-200">
        <h3 class="font-black text-candy-text text-lg mb-3">🏆 排行榜 (${n.quizBankName})</h3>
        ${o}
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col gap-3 mt-auto animate-fade-in-up delay-300">
        <button id="retry-btn" class="btn-candy btn-strawberry w-full">
          🔄 ${n.isWrongQuestionsMode?"再次重刷":"再刷一次"}
        </button>
        ${n.isWrongQuestionsMode?`
        <button id="back-wrong-btn" class="btn-candy btn-grape w-full">
          📝 回到错题集
        </button>`:`
        <button id="back-bank-btn" class="btn-candy btn-grape w-full">
          📚 回到题库
        </button>`}
        <button id="back-home-btn" class="btn-candy btn-outline w-full">
          🏠 回到主页
        </button>
      </div>
    </div>`,document.getElementById("retry-btn")?.addEventListener("click",()=>{n.isWrongQuestionsMode&&sessionStorage.setItem("wrong_questions_mode","true"),y("quiz")}),document.getElementById("back-bank-btn")?.addEventListener("click",()=>y("quiz-bank")),document.getElementById("back-wrong-btn")?.addEventListener("click",()=>y("wrong-questions")),document.getElementById("back-home-btn")?.addEventListener("click",()=>y("home"))}let qe=[];function ot(){return qe}function ae(){const e=document.getElementById("app");if(!e)return;const t=w();if(!t){y("name-entry");return}const n=fe(t.id),s=C(),a=[];for(const l of n)for(const d of s){const r=d.questions.find(c=>c.id===l.questionId);if(r){a.push({entry:l,question:r,bankName:d.name});break}}const i=a.length===0?`<div class="text-center py-12 text-candy-text-muted">
        <div class="text-5xl mb-3">🎉</div>
        <p class="font-semibold">太棒了！没有错题~</p>
        <p class="text-sm mt-1">继续保持！</p>
      </div>`:a.map(({entry:l,question:d,bankName:r},c)=>`
      <div class="card-candy mb-3 animate-fade-in-up delay-${c%5*100}">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-0.5 rounded-full bg-candy-border text-candy-primary font-bold">${ct(d.type)}</span>
              <span class="text-xs text-candy-text-muted">${r}</span>
            </div>
            <p class="text-sm text-candy-text font-semibold truncate">${lt(d)}</p>
            <p class="text-xs text-candy-primary mt-1">做错 <span class="font-bold">${l.wrongCount}</span> 次</p>
          </div>
          <button class="master-btn flex-shrink-0 ml-3 px-3 py-1.5 rounded-xl bg-candy-accent text-white text-xs font-bold hover:bg-candy-accent/80 transition-colors"
                  data-question-id="${l.questionId}">
            已掌握
          </button>
        </div>
      </div>`).join(""),o=a.length>0;e.innerHTML=`
    <div class="phone-container flex flex-col min-h-screen p-4">
      <div class="flex items-center gap-3 mb-4 animate-fade-in-up">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text">错题集</h1>
        <span class="text-sm text-candy-text-muted">(${a.length}道)</span>
      </div>

      <div class="flex-1" id="wrong-list">
        ${i}
      </div>

      ${o?`
      <div class="mt-4 animate-fade-in-up delay-300">
        <button id="redo-all-btn" class="btn-candy btn-strawberry w-full">
          🔄 重刷全部错题
        </button>
      </div>`:""}
    </div>`,document.getElementById("back-home-btn")?.addEventListener("click",()=>y("home")),document.querySelectorAll(".master-btn").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.questionId;d&&t&&(pe(t.id,d),ae())})}),document.getElementById("redo-all-btn")?.addEventListener("click",()=>{qe=a.map(({question:d})=>d);const l={};a.forEach(({entry:d})=>{l[d.questionId]=d.quizBankId}),sessionStorage.setItem("wrong_questions_bank_map",JSON.stringify(l)),sessionStorage.setItem("wrong_questions_mode","true"),y("quiz")})}function ct(e){switch(e){case"single-choice":return"单选";case"matching":return"消消乐";case"sentence-order":return"排序";default:return e}}function lt(e){switch(e.type){case"single-choice":return e.question.length>30?e.question.slice(0,30)+"...":e.question;case"matching":return e.question.length>30?e.question.slice(0,30)+"...":e.question;case"sentence-order":return e.question.length>30?e.question.slice(0,30)+"...":e.question;default:return"未知题型"}}const ut=Object.freeze(Object.defineProperty({__proto__:null,getSelectedWrongQuestions:ot,renderWrongQuestions:ae},Symbol.toStringTag,{value:"Module"}));function mt(){const e=document.getElementById("app");if(!e)return;const t=C();if(t.length===0){e.innerHTML=`
      <div class="phone-container flex flex-col min-h-screen p-4">
        <div class="flex items-center gap-3 mb-4">
          <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
          <h1 class="text-xl font-black text-candy-text">排行榜</h1>
        </div>
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center text-candy-text-muted">
            <div class="text-5xl mb-3">🏆</div>
            <p class="font-semibold">还没有题库</p>
            <p class="text-sm mt-1">请先导入题库开始练习</p>
          </div>
        </div>
      </div>`,document.getElementById("back-home-btn")?.addEventListener("click",()=>y("home"));return}const n=t.map((o,l)=>`
    <button class="leaderboard-tab px-4 py-2 rounded-full text-sm font-bold transition-all ${l===0?"bg-candy-primary text-white":"bg-candy-border text-candy-primary"}"
            data-bank-id="${o.id}">
      ${o.name}
    </button>
  `).join(""),s=t[0],a=N(s.id),i=a.length>0?a.map((o,l)=>`
      <div class="flex items-center justify-between py-3 px-4 ${l===0?"bg-candy-highlight/20 rounded-2xl":""} ${l<3?"mb-2":"mb-1"}">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black
            ${l===0?"bg-candy-highlight text-white":l===1?"bg-[#C0C0C0] text-white":l===2?"bg-[#CD7F32] text-white":"bg-candy-bg-light text-candy-text-secondary"}">
            ${l+1}
          </span>
          <div>
            <p class="font-semibold text-candy-text text-sm">${o.userName}</p>
            <p class="text-xs text-candy-text-muted">${_(o.timeSeconds)}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold text-candy-primary">${o.correctCount}/${o.totalCount}</p>
          <p class="text-xs text-candy-text-muted">${Math.round(o.correctCount/o.totalCount*100)}%</p>
        </div>
      </div>
    `).join(""):'<p class="text-center text-candy-text-muted text-sm py-8">暂无记录，快去刷题吧！</p>';e.innerHTML=`
    <div class="phone-container flex flex-col min-h-screen p-4">
      <div class="flex items-center gap-3 mb-4">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text">排行榜</h1>
      </div>

      <!-- 题库标签 -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-4" id="leaderboard-tabs">
        ${n}
      </div>

      <!-- 排行榜列表 -->
      <div class="flex-1" id="leaderboard-list">
        ${i}
      </div>
    </div>`,document.getElementById("back-home-btn")?.addEventListener("click",()=>y("home")),document.querySelectorAll(".leaderboard-tab").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.bankId;if(!l)return;document.querySelectorAll(".leaderboard-tab").forEach(c=>{c.classList.remove("bg-candy-primary","text-white"),c.classList.add("bg-candy-border","text-candy-primary")}),o.classList.add("bg-candy-primary","text-white"),o.classList.remove("bg-candy-border","text-candy-primary");const d=N(l),r=document.getElementById("leaderboard-list");r&&(r.innerHTML=d.length>0?d.map((c,u)=>`
            <div class="flex items-center justify-between py-3 px-4 ${u===0?"bg-candy-highlight/20 rounded-2xl":""} ${u<3?"mb-2":"mb-1"}">
              <div class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black
                  ${u===0?"bg-candy-highlight text-white":u===1?"bg-[#C0C0C0] text-white":u===2?"bg-[#CD7F32] text-white":"bg-candy-bg-light text-candy-text-secondary"}">
                  ${u+1}
                </span>
                <div>
                  <p class="font-semibold text-candy-text text-sm">${c.userName}</p>
                  <p class="text-xs text-candy-text-muted">${_(c.timeSeconds)}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-candy-primary">${c.correctCount}/${c.totalCount}</p>
                <p class="text-xs text-candy-text-muted">${Math.round(c.correctCount/c.totalCount*100)}%</p>
              </div>
            </div>
          `).join(""):'<p class="text-center text-candy-text-muted text-sm py-8">暂无记录，快去刷题吧！</p>')})})}function B(){const e=document.getElementById("app");if(!e)return;const t=w();if(!t||!H(t.id)){y("home");return}const n=U(),s=T(),a=D(),i=C(),o=s.length===0?'<p class="text-sm text-candy-text-muted text-center py-4">黑名单为空</p>':s.map(r=>`
      <div class="flex items-center justify-between py-2 px-3 bg-candy-bg-light rounded-xl mb-2">
        <div>
          <p class="font-semibold text-candy-text text-sm">${r.userName}</p>
          <p class="text-xs text-candy-text-muted">ID: ${r.userId}</p>
        </div>
        <button class="unblock-btn px-3 py-1 rounded-xl bg-candy-accent text-white text-xs font-bold" data-user-id="${r.userId}">
          解除
        </button>
      </div>
    `).join(""),l=a.length===0?'<p class="text-sm text-candy-text-muted text-center py-4">暂无用户</p>':a.map(r=>{const c=s.some(u=>u.userId===r.id);return`
      <div class="flex items-center justify-between py-2 px-3 bg-white rounded-xl mb-2 border border-candy-border">
        <div>
          <p class="font-semibold text-candy-text text-sm">${r.name} ${c?'<span class="text-xs text-candy-primary">(已拉黑)</span>':""}</p>
          <p class="text-xs text-candy-text-muted">ID: ${r.id}</p>
        </div>
        ${c?"":`
        <button class="block-btn px-3 py-1 rounded-xl bg-candy-primary text-white text-xs font-bold" data-user-id="${r.id}" data-user-name="${r.name}">
          拉黑
        </button>`}
      </div>`}).join(""),d=i.length===0?'<p class="text-sm text-candy-text-muted text-center py-4">暂无题库</p>':i.map(r=>`
      <div class="flex items-center justify-between py-2 px-3 bg-white rounded-xl mb-2 border border-candy-border">
        <div>
          <p class="font-semibold text-candy-text text-sm">${r.name}</p>
          <p class="text-xs text-candy-text-muted">${r.questions.length}道题</p>
        </div>
        <button class="delete-bank-btn px-3 py-1 rounded-xl bg-candy-primary text-white text-xs font-bold" data-bank-id="${r.id}">
          删除
        </button>
      </div>
    `).join("");e.innerHTML=`
    <div class="phone-container flex flex-col min-h-screen p-4">
      <div class="flex items-center gap-3 mb-4">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text">管理面板</h1>
      </div>

      <div class="space-y-4">
        <!-- 主页外观设置 -->
        <div class="card-candy animate-fade-in-up">
          <h3 class="font-black text-candy-text mb-3">🎨 主页外观</h3>

          <p class="text-xs text-candy-text-secondary mb-2">📷 横幅图（将 banner.gif 放在根目录，或填写图片URL）</p>
          <div class="flex gap-2 mb-3">
            <input id="banner-input" type="text" value="${I(n.bannerUrl)}" placeholder="banner.gif"
              class="flex-1 px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary" />
            <button id="save-banner-btn" class="btn-candy btn-strawberry text-sm px-4">保存</button>
          </div>
          ${ee(n.bannerUrl)?`<img src="${I(n.bannerUrl)}" class="w-full rounded-xl max-h-32 object-cover mb-2" onerror="this.style.display='none'" />`:""}
          <button id="reset-banner-btn" class="text-xs text-candy-text-muted underline">重置为 banner.gif</button>

          <div class="mt-4 pt-4 border-t border-candy-border">
            <p class="text-xs text-candy-text-secondary mb-2">✏️ 欢迎文字（图片不可用时显示）</p>
            <input id="welcome-title-input" type="text" value="${I(n.welcomeTitle)}" placeholder="欢迎标题"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <input id="welcome-subtitle-input" type="text" value="${I(n.welcomeSubtitle)}" placeholder="欢迎副标题"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <button id="save-welcome-btn" class="btn-candy btn-strawberry text-sm px-4">保存欢迎文字</button>
          </div>

          <div class="mt-4 pt-4 border-t border-candy-border">
            <p class="text-xs text-candy-text-secondary mb-2">🔐 修改管理员密码</p>
            <input id="admin-old-pwd" type="password" placeholder="当前密码"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <input id="admin-new-pwd" type="password" placeholder="新密码（至少6位）"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <p id="pwd-msg" class="text-xs text-candy-primary mb-2 hidden"></p>
            <button id="change-pwd-btn" class="btn-candy btn-strawberry text-sm px-4">修改密码</button>
          </div>
        </div>

        <!-- 题库管理 -->
        <div class="card-candy animate-fade-in-up delay-100">
          <h3 class="font-black text-candy-text mb-3">📚 题库管理 (${i.length}个)</h3>
          <div id="banks-list">${d}</div>
        </div>

        <!-- 用户管理 -->
        <div class="card-candy animate-fade-in-up delay-200">
          <h3 class="font-black text-candy-text mb-3">👥 用户管理 (${a.length}人)</h3>
          <div id="users-list">${l}</div>
        </div>

        <!-- 黑名单 -->
        <div class="card-candy animate-fade-in-up delay-300">
          <h3 class="font-black text-candy-text mb-3">🚫 黑名单 (${s.length}人)</h3>
          <div id="blacklist-list">${o}</div>
        </div>
      </div>
    </div>`,document.getElementById("back-home-btn")?.addEventListener("click",()=>y("home")),document.getElementById("save-banner-btn")?.addEventListener("click",()=>{const r=document.getElementById("banner-input");r&&(M({bannerUrl:r.value.trim()||"banner.gif"}),B())}),document.getElementById("reset-banner-btn")?.addEventListener("click",()=>{M({bannerUrl:"banner.gif"}),B()}),document.getElementById("save-welcome-btn")?.addEventListener("click",()=>{const r=document.getElementById("welcome-title-input"),c=document.getElementById("welcome-subtitle-input");M({welcomeTitle:r?.value.trim()||"英语刷题助手",welcomeSubtitle:c?.value.trim()||"Sweet English, Sweet Learning!"}),B()}),document.getElementById("change-pwd-btn")?.addEventListener("click",async()=>{const r=document.getElementById("admin-old-pwd")?.value||"",c=document.getElementById("admin-new-pwd")?.value.trim()||"",u=document.getElementById("pwd-msg"),m=h=>{u&&(u.textContent=h,u.classList.remove("hidden"))};if(c.length<6){m("新密码至少6位");return}const{verifyAdminPassword:x}=await S(async()=>{const{verifyAdminPassword:h}=await Promise.resolve().then(()=>Re);return{verifyAdminPassword:h}},void 0,import.meta.url);if(!await x(r)){m("当前密码错误");return}await Be(c),localStorage.removeItem("english_quiz_admins"),m("密码修改成功！下次访问管理面板请用新密码。"),document.getElementById("admin-old-pwd").value="",document.getElementById("admin-new-pwd").value="",setTimeout(()=>u?.classList.add("hidden"),3e3)}),document.querySelectorAll(".block-btn").forEach(r=>{r.addEventListener("click",()=>{const c=r,u=c.dataset.userId,m=c.dataset.userName;u&&m&&confirm(`确定拉黑用户「${m}」吗？将删除其所有数据。`)&&(xe(u,m),me(u),B())})}),document.querySelectorAll(".unblock-btn").forEach(r=>{r.addEventListener("click",()=>{const c=r.dataset.userId;c&&confirm("确定解除拉黑吗？")&&(ge(c),B())})}),document.querySelectorAll(".delete-bank-btn").forEach(r=>{r.addEventListener("click",()=>{const c=r.dataset.bankId;c&&confirm("确定删除该题库吗？此操作不可撤销。")&&(Z(c),B())})})}Ne();L("home",_e);L("name-entry",Ue);L("quiz-bank",j);L("quiz",Ge);L("quiz-result",dt);L("wrong-questions",ae);L("leaderboard",mt);L("admin",B);function pt(){le();const e=w();if(e&&V(e.id)){const n=document.getElementById("app");n&&(n.innerHTML=`
        <div class="phone-container flex items-center justify-center p-6">
          <div class="card-candy text-center p-8 w-full">
            <div class="text-5xl mb-4">🚫</div>
            <h2 class="text-xl font-bold text-candy-text mb-2">账户已被禁用</h2>
            <p class="text-candy-text-secondary text-sm">您的账户已被管理员禁用，无法使用本应用。</p>
          </div>
        </div>`);return}y(e?"home":"name-entry")}window.__navigate=e=>{y(e)};pt();
