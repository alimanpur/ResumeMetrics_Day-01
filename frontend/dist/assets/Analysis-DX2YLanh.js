import{i as e,t}from"./react-B8IZ02wI.js";import{t as n}from"./createLucideIcon-BJDyQzNW.js";import{a as r,n as i,o as a,r as o,s,t as c}from"./RadarChart-xp9THwPH.js";import{t as l}from"./clock-tnn5jJrM.js";import{t as u}from"./download-C41yDB-X.js";import{t as d}from"./file-text-DslHwgVv.js";import{n as f,r as p,t as m}from"./error-state-CdnH_6Lj.js";import{A as h,B as g,H as ee,M as _,f as v,i as y,m as b,n as x}from"./index-DiVnqtKK.js";import{i as S}from"./analysis-BZfNSZen.js";import{r as C}from"./resume-Bkki22xd.js";import{A as w,F as T,c as te,k as E}from"./generateCategoricalChart-0lH0l7q2.js";import{n as D,r as O,t as k}from"./BarChart-CZz2jC3H.js";var A=n(`check`,[[`path`,{d:`M20 6 9 17l-5-5`,key:`1gmf2c`}]]),j=e(t(),1),M=_(),N=[`Overview`,`ATS Compatibility`,`Keywords`,`Structure`,`Patches`],P=[`Uploading Resume`,`Validating File`,`Extracting Text`,`OCR Verification`,`Section Detection`,`Experience Parsing`,`Education Parsing`,`Skills Extraction`,`Keyword Matching`,`ATS Rule Engine`,`Semantic Intelligence`,`Achievement Detection`,`Job Match Engine`,`Benchmarking`,`Generating Suggestions`,`Preparing Report`,`Complete`];function F(){let{id:e}=ee(),t=e,[n,_]=(0,j.useState)(`Overview`),[y,x]=(0,j.useState)(!1),F=(0,j.useRef)(null),{data:R,isLoading:z,error:B}=h({queryKey:[`analysis`,t],queryFn:()=>S(t),enabled:!!t,refetchInterval:e=>{let t=e?.state;if(!t)return!1;let n=t.data,r=n?.data?.data?.status||n?.data?.status;return r===`PENDING`||r===`PROCESSING`?2e3:!1}}),V=R?.data?.data||R?.data||{},H=V.resumeId||V?.resume?.id,U=V.status,{data:W}=h({queryKey:[`resume`,H],queryFn:()=>C(H),enabled:!!H&&!z});if((0,j.useEffect)(()=>{function e(e){F.current&&!F.current.contains(e.target)&&x(!1)}if(y)return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[y]),z)return(0,M.jsxs)(`div`,{className:`px-8 py-10`,children:[(0,M.jsxs)(`div`,{className:`mb-8`,children:[(0,M.jsx)(`div`,{className:`h-6 w-32 animate-pulse bg-ink/10`}),(0,M.jsx)(`div`,{className:`mt-2 h-10 w-64 animate-pulse bg-ink/10`}),(0,M.jsx)(`div`,{className:`mt-2 h-4 w-96 animate-pulse bg-ink/10`})]}),(0,M.jsxs)(`div`,{className:`mb-8 grid grid-cols-4 gap-px border border-border bg-border`,children:[(0,M.jsx)(f,{}),(0,M.jsx)(f,{}),(0,M.jsx)(f,{}),(0,M.jsx)(f,{})]}),(0,M.jsx)(p,{})]});if(B||!V||!V.id)return(0,M.jsx)(`div`,{className:`px-8 py-10`,children:(0,M.jsx)(m,{title:`Analysis not found`,message:`This analysis doesn't exist or has been deleted.`,action:()=>window.location.href=`/history`,actionLabel:`Go to History`})});if(U===`PENDING`||U===`PROCESSING`){let e=U===`PROCESSING`?Math.min(P.length-1,Math.floor(P.length*.6)):2;return(0,M.jsxs)(`div`,{className:`px-8 py-10`,children:[(0,M.jsxs)(`div`,{className:`mb-10 max-w-3xl`,children:[(0,M.jsx)(`span`,{className:`font-mono text-[11px] uppercase tracking-widest text-ink/40`,children:`Analysis in Progress`}),(0,M.jsx)(`h1`,{className:`mt-2 font-serif text-4xl italic`,children:`Processing your resume...`}),(0,M.jsx)(`p`,{className:`mt-2 text-sm text-ink/60`,children:`Our AI engine is analyzing your resume. This usually takes a few seconds.`})]}),(0,M.jsxs)(`div`,{className:`rounded-sm bg-ink p-6`,children:[(0,M.jsxs)(`div`,{className:`mb-4 flex items-center justify-between font-mono text-xs text-paper`,children:[(0,M.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,M.jsx)(l,{className:`size-3 animate-spin`}),`AI Analysis Engine`]}),(0,M.jsxs)(`span`,{className:`text-paper/40`,children:[`status: `,U]})]}),(0,M.jsx)(`div`,{className:`space-y-2 font-mono text-xs`,children:P.map((t,n)=>{let r=n<e,i=n===e;return(0,M.jsxs)(`div`,{className:`flex items-center justify-between ${r?`text-paper/80`:i?`text-accent`:`text-paper/30`}`,children:[(0,M.jsxs)(`span`,{className:`flex items-center gap-2`,children:[r?(0,M.jsx)(A,{className:`size-3`}):i?(0,M.jsx)(l,{className:`size-3 animate-spin`}):(0,M.jsx)(l,{className:`size-3`}),t]}),i&&(0,M.jsx)(`span`,{className:`animate-pulse`,children:`processing...`}),r&&(0,M.jsx)(`span`,{className:`text-paper/60`,children:`done`})]},n)})}),(0,M.jsx)(`div`,{className:`mt-5 h-1 bg-paper/10`,children:(0,M.jsx)(`div`,{className:`h-full bg-accent transition-all duration-500`,style:{width:`${e/P.length*100}%`}})})]})]})}if(U===`FAILED`)return(0,M.jsx)(`div`,{className:`px-8 py-10`,children:(0,M.jsx)(m,{title:`Analysis Failed`,message:V.errorMessage||`The analysis could not be completed. Please try uploading your resume again.`,action:()=>window.location.href=`/upload`,actionLabel:`Try Again`})});let G=V,K=W?.data?.data||W?.data?.resume||{},q=G.scores||{},J=G.atsScores||[],Y=G.semanticScores||[],X=G.keywords||{aligned:[],missing:[]},Z=G.structure||[],Q=G.patches||[];function ne(){let e={resumeName:K.fileName||G.resume?.fileName||`Untitled Resume`,atsScore:G.atsScore,overallScore:G.overallScore,scores:{ats:G.atsScore,keyword:G.keywordScore,formatting:G.formattingScore,readability:G.readabilityScore,overall:G.overallScore,quality:G.qualityScore},semanticScores:Y,atsScores:J,strengths:G.strengths,weaknesses:G.weaknesses,keywords:X,missingKeywords:G.missingKeywords,missingSkills:G.missingSkills,structure:Z,suggestions:G.suggestionsData||G.improvementSuggestions,recommendations:G.improvementSuggestions,date:G.createdAt?new Date(G.createdAt).toISOString():new Date().toISOString(),userName:K.user?.name||G.user?.name||`User`};$(new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),`${K.fileName||`resume`}-analysis.json`),x(!1)}function re(){let e=G.createdAt?new Date(G.createdAt).toLocaleDateString(`en-US`,{month:`long`,day:`numeric`,year:`numeric`}):new Date().toLocaleDateString(),t=`# Resume Analysis Report

**Resume:** ${K.fileName||`Untitled Resume`}
**Date:** ${e}
**ATS Score:** ${G.atsScore||0}/100
**Overall Score:** ${G.overallScore||0}/100

## Scores

| Metric | Score |
|--------|-------|
| Overall | ${G.overallScore||0}/100 |
| ATS Pass-rate | ${G.atsScore||0}/100 |
| Keyword Density | ${G.keywordScore||0}/100 |
| Formatting | ${G.formattingScore||0}/100 |
| Readability | ${G.readabilityScore||0}/100 |
| Quality | ${G.qualityScore||0}/100 |

## Semantic Analysis

${(Y||[]).map(e=>`- **${e.axis}**: ${e.v}/100`).join(`
`)}

## Strengths

${(G.strengths?.skills||[]).map(e=>`- ${e}`).join(`
`)||`- No strengths recorded`}

## Weaknesses

${(G.weaknesses||[]).map(e=>`- **${e.area}**: ${e.suggestion}`).join(`
`)||`- No weaknesses recorded`}

## Keywords Aligned

${(X.aligned||[]).map(e=>`- ${e}`).join(`
`)||`- None`}

## Missing Keywords

${(X.missing||[]).map(e=>`- ${e}`).join(`
`)||`- None`}

## Recommendations

${(G.improvementSuggestions||[]).map((e,t)=>`${t+1}. **${e.category}** (${e.severity||`medium`}): ${e.suggestion}`).join(`
`)||`- None`}

---
*Generated by ResuMetrics*
`;$(new Blob([t],{type:`text/markdown`}),`${K.fileName||`resume`}-analysis.md`),x(!1)}function ie(){let e=G.createdAt?new Date(G.createdAt).toLocaleDateString(`en-US`,{month:`long`,day:`numeric`,year:`numeric`}):new Date().toLocaleDateString(),t=(Y||[]).map(e=>`<tr><td>${e.axis}</td><td>${e.v}/100</td></tr>`).join(``),n=(G.strengths?.skills||[]).map(e=>`<li>${e}</li>`).join(``),r=(G.weaknesses||[]).map(e=>`<li><strong>${e.area}</strong>: ${e.suggestion}</li>`).join(``),i=(X.aligned||[]).map(e=>`<span class="kw ok">${e}</span>`).join(` `),a=(X.missing||[]).map(e=>`<span class="kw warn">${e}</span>`).join(` `),o=(G.improvementSuggestions||[]).map(e=>`<li><strong>${e.category}</strong> (${e.severity||`medium`}): ${e.suggestion}</li>`).join(``),s=`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume Analysis Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; padding: 48px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 28px; font-style: italic; margin-bottom: 8px; }
    h2 { font-size: 18px; font-style: italic; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e5e1; }
    h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 8px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
    .score-card { border: 1px solid #e5e5e1; padding: 16px; text-align: center; }
    .score-value { font-size: 36px; font-style: italic; }
    .score-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e5e1; }
    th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; }
    ul { margin: 8px 0 8px 20px; font-size: 13px; line-height: 1.8; }
    .kw { display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: 12px; margin: 2px; }
    .kw.ok { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .kw.warn { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e5e1; font-size: 11px; color: #999; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Resume Analysis Report</h1>
  <div class="meta">
    <strong>Resume:</strong> ${K.fileName||`Untitled Resume`}<br/>
    <strong>Date:</strong> ${e}<br/>
    <strong>Target Role:</strong> ${G.targetRole||`Not specified`}
  </div>

  <div class="score-grid">
    <div class="score-card">
      <div class="score-value">${G.overallScore||0}</div>
      <div class="score-label">Overall</div>
    </div>
    <div class="score-card">
      <div class="score-value">${G.atsScore||0}</div>
      <div class="score-label">ATS Score</div>
    </div>
    <div class="score-card">
      <div class="score-value">${G.keywordScore||0}</div>
      <div class="score-label">Keywords</div>
    </div>
    <div class="score-card">
      <div class="score-value">${G.formattingScore||0}</div>
      <div class="score-label">Formatting</div>
    </div>
  </div>

  <h2>ATS Score Breakdown</h2>
  <table>
    <thead><tr><th>System</th><th>Score</th><th>Issues</th></tr></thead>
    <tbody>
      ${(J||[]).map(e=>`<tr><td>${e.name}</td><td>${e.score}%</td><td>${(e.issues||[]).join(`, `)||`None`}</td></tr>`).join(``)}
    </tbody>
  </table>

  <h2>Semantic Analysis</h2>
  <table>
    <thead><tr><th>Axis</th><th>Score</th></tr></thead>
    <tbody>${t}</tbody>
  </table>

  <h2>Strengths</h2>
  <ul>${n}</ul>

  <h2>Weaknesses</h2>
  <ul>${r}</ul>

  <h2>Keyword Analysis</h2>
  <h3>Aligned</h3>
  <div>${i}</div>
  <h3 style="margin-top: 12px;">Missing</h3>
  <div>${a}</div>

  <h2>Recommendations</h2>
  <ul>${o}</ul>

  <div class="footer">
    Generated by ResuMetrics on ${new Date().toLocaleDateString(`en-US`,{month:`long`,day:`numeric`,year:`numeric`})}
  </div>
</body>
</html>`,c=window.open(``,`_blank`,`width=900,height=700`);c.document.write(s),c.document.close(),setTimeout(()=>c.print(),300),x(!1)}function $(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n)}return(0,M.jsxs)(`div`,{className:`px-8 py-10`,children:[(0,M.jsxs)(`div`,{className:`mb-8 flex flex-wrap items-end justify-between gap-4`,children:[(0,M.jsxs)(`div`,{children:[(0,M.jsx)(g,{to:`/history`,className:`font-mono text-[11px] uppercase tracking-widest text-ink/40 hover:text-ink`,children:`← History`}),(0,M.jsx)(`h1`,{className:`mt-2 font-serif text-4xl italic`,children:K.fileName||G.resume?.fileName||`Resume Analysis`}),(0,M.jsxs)(`div`,{className:`mt-2 flex items-center gap-3 text-xs text-ink/60`,children:[(0,M.jsxs)(`span`,{className:`font-mono`,children:[`ID `,K.id||G.resume?.id]}),(0,M.jsx)(`span`,{children:`·`}),(0,M.jsx)(`span`,{children:K.targetRole||G.targetRole||`No target role`}),(0,M.jsx)(`span`,{children:`·`}),(0,M.jsx)(`span`,{children:G.createdAt?new Date(G.createdAt).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):``})]})]}),(0,M.jsxs)(`div`,{className:`flex gap-2`,children:[(0,M.jsxs)(`div`,{className:`relative`,ref:F,children:[(0,M.jsxs)(`button`,{onClick:()=>x(!y),className:`inline-flex items-center gap-2 border border-border bg-paper px-4 py-2 text-sm hover:bg-paper-2`,children:[(0,M.jsx)(u,{className:`size-4`}),` Export `,(0,M.jsx)(v,{className:`size-3`})]}),y&&(0,M.jsxs)(`div`,{className:`absolute right-0 top-full z-50 mt-1 w-44 rounded border border-border bg-paper py-1 shadow-lg`,children:[(0,M.jsxs)(`button`,{onClick:ie,className:`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2`,children:[(0,M.jsx)(d,{className:`size-4`}),` PDF Report`]}),(0,M.jsxs)(`button`,{onClick:ne,className:`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2`,children:[(0,M.jsx)(s,{className:`size-4`}),` JSON Data`]}),(0,M.jsxs)(`button`,{onClick:re,className:`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2`,children:[(0,M.jsx)(a,{className:`size-4`}),` Markdown`]})]})]}),(0,M.jsx)(g,{to:`/compare`,className:`inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm text-paper hover:bg-ink/90`,children:`Compare versions`})]})]}),(0,M.jsxs)(`div`,{className:`grid grid-cols-4 gap-px border border-border bg-border`,children:[(0,M.jsx)(I,{label:`Overall`,value:q.overall||0}),(0,M.jsx)(I,{label:`ATS Pass-rate`,value:q.ats||0}),(0,M.jsx)(I,{label:`Keyword Density`,value:q.keyword||0}),(0,M.jsx)(I,{label:`Structural Health`,value:q.structure||0})]}),(0,M.jsx)(`div`,{className:`mt-10 border-b border-border`,children:(0,M.jsx)(`div`,{className:`flex flex-wrap gap-6 text-sm`,children:N.map(e=>(0,M.jsx)(`button`,{onClick:()=>_(e),className:`-mb-px border-b-2 pb-3 transition-colors ${n===e?`border-ink text-ink`:`border-transparent text-ink/40 hover:text-ink`}`,children:e},e))})}),(0,M.jsxs)(`div`,{className:`mt-10`,children:[n===`Overview`&&(0,M.jsxs)(`div`,{className:`grid gap-6 lg:grid-cols-2`,children:[(0,M.jsxs)(`section`,{className:`border border-border bg-paper p-6`,children:[(0,M.jsx)(`h2`,{className:`font-serif text-2xl italic`,children:`Semantic strengths`}),(0,M.jsx)(`p`,{className:`mt-1 text-xs text-ink/50`,children:`Mapped against target role descriptions`}),(0,M.jsx)(`div`,{className:`mt-4 h-72`,children:Y.length>0?(0,M.jsx)(w,{children:(0,M.jsxs)(c,{data:Y,children:[(0,M.jsx)(r,{stroke:`#E5E5E1`}),(0,M.jsx)(o,{dataKey:`axis`,tick:{fill:`rgba(0,0,0,.6)`,fontSize:11}}),(0,M.jsx)(i,{dataKey:`v`,stroke:`oklch(0.55 0.21 262)`,fill:`oklch(0.55 0.21 262)`,fillOpacity:.2})]})}):(0,M.jsx)(`div`,{className:`flex h-full items-center justify-center text-sm text-ink/40`,children:`No semantic data available`})})]}),(0,M.jsxs)(`section`,{className:`border border-border bg-paper p-6`,children:[(0,M.jsx)(`h2`,{className:`font-serif text-2xl italic`,children:`ATS pass-rate by system`}),(0,M.jsx)(`p`,{className:`mt-1 text-xs text-ink/50`,children:`Largest parser families`}),(0,M.jsx)(`div`,{className:`mt-4 h-72`,children:J.length>0?(0,M.jsx)(w,{children:(0,M.jsxs)(k,{data:J,children:[(0,M.jsx)(O,{dataKey:`name`,tick:{fill:`rgba(0,0,0,.5)`,fontSize:10,fontFamily:`JetBrains Mono`},axisLine:!1,tickLine:!1}),(0,M.jsx)(D,{tick:{fill:`rgba(0,0,0,.4)`,fontSize:10},axisLine:!1,tickLine:!1,domain:[0,100]}),(0,M.jsx)(T,{cursor:{fill:`rgba(0,0,0,.04)`},contentStyle:{border:`1px solid #E5E5E1`,borderRadius:0,fontSize:12}}),(0,M.jsx)(te,{dataKey:`score`,children:J.map((e,t)=>(0,M.jsx)(E,{fill:e.score>=80?`oklch(0.55 0.21 262)`:e.score>=70?`#0F0F0F`:`#B45309`},t))})]})}):(0,M.jsx)(`div`,{className:`flex h-full items-center justify-center text-sm text-ink/40`,children:`No ATS data available`})})]})]}),n===`ATS Compatibility`&&(0,M.jsx)(`div`,{className:`border border-border bg-paper`,children:J.length===0?(0,M.jsx)(`div`,{className:`p-12 text-center text-sm text-ink/60`,children:`No ATS compatibility data available`}):(0,M.jsxs)(`table`,{className:`w-full text-sm`,children:[(0,M.jsx)(`thead`,{children:(0,M.jsxs)(`tr`,{className:`border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-ink/40`,children:[(0,M.jsx)(`th`,{className:`p-4`,children:`System`}),(0,M.jsx)(`th`,{children:`Parser`}),(0,M.jsx)(`th`,{children:`Pass-rate`}),(0,M.jsx)(`th`,{children:`Issues`})]})}),(0,M.jsx)(`tbody`,{children:J.map((e,t)=>(0,M.jsxs)(`tr`,{className:`border-b border-border last:border-0`,children:[(0,M.jsx)(`td`,{className:`p-4 font-medium`,children:e.name}),(0,M.jsx)(`td`,{className:`font-mono text-xs text-ink/60`,children:e.parser||`Standard`}),(0,M.jsxs)(`td`,{className:`font-mono`,children:[e.score,`%`]}),(0,M.jsx)(`td`,{children:(0,M.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:e.issues&&e.issues.length>0?e.issues.map(e=>(0,M.jsx)(`span`,{className:`border border-border bg-paper-2 px-2 py-0.5 font-mono text-[10px]`,children:e},e)):(0,M.jsx)(`span`,{className:`text-xs text-emerald-600`,children:`No issues`})})})]},t))})]})}),n===`Keywords`&&(0,M.jsxs)(`div`,{className:`grid gap-6 md:grid-cols-2`,children:[(0,M.jsx)(L,{title:`Aligned with target`,tone:`ok`,items:X.aligned||[]}),(0,M.jsx)(L,{title:`Missing or underweighted`,tone:`warn`,items:X.missing||[]})]}),n===`Structure`&&(0,M.jsxs)(`div`,{className:`border border-border bg-paper p-6`,children:[(0,M.jsx)(`h2`,{className:`font-serif text-2xl italic`,children:`Document structure`}),Z.length===0?(0,M.jsx)(`p`,{className:`mt-6 text-sm text-ink/60`,children:`No structure data available`}):(0,M.jsx)(`div`,{className:`mt-6 grid grid-cols-[160px_1fr] gap-y-3 font-mono text-xs`,children:Z.map(e=>(0,M.jsxs)(j.Fragment,{children:[(0,M.jsx)(`div`,{className:`text-ink/40 uppercase tracking-widest`,children:e.section}),(0,M.jsx)(`div`,{children:e.status})]},e.section))})]}),n===`Patches`&&(0,M.jsx)(`div`,{className:`space-y-3`,children:Q.length===0?(0,M.jsx)(`div`,{className:`border border-border bg-paper p-12 text-center text-sm text-ink/60`,children:`No patches suggested. Great job!`}):Q.map((e,t)=>(0,M.jsxs)(`details`,{className:`group border border-border bg-paper`,children:[(0,M.jsxs)(`summary`,{className:`flex cursor-pointer items-center gap-4 p-4`,children:[(0,M.jsx)(`span`,{className:`grid size-8 place-items-center ${e.severity===`high`?`bg-accent text-paper`:e.severity===`medium`?`bg-ink text-paper`:`bg-paper-2`}`,children:e.severity===`high`?(0,M.jsx)(b,{className:`size-4`}):(0,M.jsx)(A,{className:`size-4`})}),(0,M.jsxs)(`div`,{className:`flex-1`,children:[(0,M.jsx)(`div`,{className:`font-medium`,children:e.title}),(0,M.jsx)(`div`,{className:`text-xs text-ink/50`,children:e.description})]}),(0,M.jsx)(`span`,{className:`font-mono text-xs text-accent`,children:e.impact})]}),(0,M.jsx)(`div`,{className:`border-t border-border bg-paper-2 p-4 font-mono text-xs text-ink/70`,children:`Suggested diff preview · apply automatically or export as instructions.`})]},t))})]})]})}function I({label:e,value:t}){let{count:n}=x(t,0,800);return(0,M.jsxs)(`div`,{className:`bg-paper p-6 transition-all duration-200 hover:bg-paper-2`,children:[(0,M.jsx)(`div`,{className:`font-mono text-[10px] uppercase tracking-widest text-ink/40`,children:e}),(0,M.jsx)(`div`,{className:`mt-3 font-serif text-5xl`,children:Math.round(n)}),(0,M.jsx)(`div`,{className:`mt-3 h-1 bg-paper-2`,children:(0,M.jsx)(`div`,{className:`h-full bg-accent transition-all duration-1000`,style:{width:`${t}%`}})})]})}function L({title:e,tone:t,items:n}){return(0,M.jsxs)(`section`,{className:`border border-border bg-paper p-6`,children:[(0,M.jsx)(`h3`,{className:`font-serif text-2xl italic`,children:e}),n.length===0?(0,M.jsx)(`p`,{className:`mt-4 text-sm text-ink/60`,children:`No keywords in this category`}):(0,M.jsx)(`div`,{className:`mt-4 flex flex-wrap gap-2`,children:n.map(e=>(0,M.jsxs)(`span`,{className:`inline-flex items-center gap-1 border px-2.5 py-1 font-mono text-xs ${t===`ok`?`border-accent/30 bg-accent/5 text-accent`:`border-amber-500/30 bg-amber-50 text-amber-800`}`,children:[t===`ok`?(0,M.jsx)(A,{className:`size-3`}):(0,M.jsx)(y,{className:`size-3`}),` `,e]},e))})]})}export{F as default};