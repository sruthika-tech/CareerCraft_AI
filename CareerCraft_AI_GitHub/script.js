const $=id=>document.getElementById(id);
let resume={};

function val(id){return $(id).value.trim()}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function lines(text){return String(text||"").split(/\n+/).map(x=>x.trim()).filter(Boolean)}
function bulletize(text){
  const arr=lines(text);
  if(!arr.length)return "";
  return `<ul>${arr.map(x=>`<li>${esc(x.replace(/^[-•]\s*/,""))}</li>`).join("")}</ul>`;
}
function section(title,html){return html?`<h4>${title}</h4>${html}`:""}

function render(){
  const r=resume;
  if(!r.name){$("resumePreview").innerHTML=`<div class="empty-preview"><div>✦</div><h3>Your resume will appear here</h3><p>Fill in the form and click “Generate My Resume”.</p></div>`;return}
  $("resumePreview").innerHTML=`<div class="cv">
    <h1>${esc(r.name)}</h1><div class="role">${esc(r.role)}</div>
    <div class="contact">${[r.email,r.phone,r.location,r.link].filter(Boolean).map(esc).join("  ·  ")}</div>
    <hr>
    ${section("PROFILE",`<p>${esc(r.summary)}</p>`)}
    ${section("EDUCATION",`<div class="edu">${esc(r.education)}</div>`)}
    ${section("SKILLS",`<p>${esc(r.skills)}</p>`)}
    ${section("EXPERIENCE",bulletize(r.experience))}
    ${section("PROJECTS",bulletize(r.projects))}
    ${section("CERTIFICATIONS",bulletize(r.certifications))}
    ${section("ACHIEVEMENTS",bulletize(r.achievements))}
  </div>`;
}

$("resumeForm").addEventListener("submit",e=>{
  e.preventDefault();
  resume={name:val("name"),role:val("role"),email:val("email"),phone:val("phone"),location:val("location"),link:val("link"),summary:val("summary"),education:val("education"),skills:val("skills"),experience:val("experience"),projects:val("projects"),certifications:val("certifications"),achievements:val("achievements")};
  localStorage.setItem("careercraft_resume",JSON.stringify(resume));
  render();
  document.querySelector(".preview-panel").scrollIntoView({behavior:"smooth",block:"start"});
});

$("demoBtn").addEventListener("click",()=>{
  const demo={name:"Sruthika Ramavath",role:"Cybersecurity Student | Software Developer",email:"sruthika@example.com",phone:"+91 98765 43210",location:"Hyderabad, India",link:"linkedin.com/in/sruthika",summary:"B.Tech Computer Science (Cyber Security) student with hands-on experience building web applications and practical security-focused projects. Interested in software development, cybersecurity and intelligent career tools.",education:"B.Tech in Computer Science & Engineering (Cyber Security) — JNTUH\n2025 – 2029",skills:"Python, Java, C, HTML, CSS, JavaScript, SQL, Git, Cybersecurity, Problem Solving",experience:"Developed student-focused software projects and collaborated on technical presentations and hackathon concepts.\nPracticed frontend development and backend fundamentals through academic and personal projects.",projects:"CareerCraft AI — Built a browser-based resume builder with ATS keyword analysis and print-ready resume generation using HTML, CSS and JavaScript.\nSmartMove AI — Designed a smart vehicle safety concept combining road intelligence and driver drowsiness detection.",certifications:"Introduction to Cybersecurity — Online Learning\nPython Programming — Online Learning",achievements:"Participated in hackathon ideation and software project development.\nPresented technology concepts and academic projects."};
  Object.keys(demo).forEach(k=>{const el=$(k);if(el)el.value=demo[k]});
  resume=demo;localStorage.setItem("careercraft_resume",JSON.stringify(resume));render();
});

$("printBtn").addEventListener("click",()=>window.print());

const stopwords=new Set(("the and for with that this from your you are our was were have has had will can into about their they them then than using used use as an a an to of in on at by is be or it its we i job work role team company looking required preferred").split(" "));
function keywords(text){
  return [...new Set((text.toLowerCase().match(/[a-z][a-z+#.-]{2,}/g)||[]).filter(w=>!stopwords.has(w)))];
}
$("checkBtn").addEventListener("click",()=>{
  const job=val("jobText");
  if(!job){$("result").innerHTML='<div class="result-empty">Paste a job description first.</div>';return}
  const resumeText=Object.values(resume).join(" ").toLowerCase();
  const ks=keywords(job);
  const matched=ks.filter(k=>resumeText.includes(k));
  const missing=ks.filter(k=>!resumeText.includes(k)).slice(0,18);
  const score=ks.length?Math.round(matched.length/ks.length*100):0;
  const strengths=matched.slice(0,12);
  $("result").innerHTML=`<div class="score"><div class="score-num">${score}%</div><div><div class="score-label">ATS keyword match</div><small>${matched.length} of ${ks.length} detected keywords found</small></div></div>
  <h4>MATCHED KEYWORDS</h4><div>${strengths.length?strengths.map(x=>`<span class="tag">${esc(x)}</span>`).join(""):"No strong keyword matches yet."}</div>
  <h4>KEYWORDS TO CONSIDER</h4><div>${missing.length?missing.map(x=>`<span class="tag miss">${esc(x)}</span>`).join(""):"Great — no major missing keywords detected."}</div>
  <h4>TIP</h4><p class="small">Only add keywords that genuinely describe your skills or experience. Never copy requirements you cannot support.</p>`;
});

try{resume=JSON.parse(localStorage.getItem("careercraft_resume")||"{}");render()}catch(e){}
