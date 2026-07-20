import { createBrowserClient } from "@supabase/ssr";
const U="https://veencuxfwptbvmeperds.supabase.co";
const A="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZW5jdXhmd3B0YnZtZXBlcmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MjEzOTAsImV4cCI6MjA5OTE5NzM5MH0.ZJm2VsH6BRCX0fcEMreP4Es5iS_Na9BhbkzoQSD045c";
const APP="http://localhost:3000";
const jar={};
const sb=createBrowserClient(U,A,{cookies:{getAll:()=>Object.entries(jar).map(([n,v])=>({name:n,value:v})),setAll:cs=>cs.forEach(({name,value})=>{jar[name]=value})}});
await sb.auth.signInWithPassword({email:"gemtest@rewire.app",password:"GemTest2026!"});
const cookie=Object.entries(jar).map(([n,v])=>`${n}=${v}`).join("; ");
const post=(p,b)=>fetch(`${APP}${p}`,{method:"POST",headers:{"Content-Type":"application/json",cookie},body:JSON.stringify(b)});
let ok=0;
for(let i=1;i<=4;i++){
  const t=Date.now();
  const r=await post("/api/habit",{habitName:"Doomscrolling",category:"screen_time",goalType:"reduce",currentAmount:"2h/day",targetAmount:"30m",motivation:"sleep better and be present",triggers:["evenings","boredom"],timeframeDays:30});
  const j=await r.json();
  console.log(`plan #${i} (${((Date.now()-t)/1000).toFixed(1)}s) ->`, r.status, j.ok?"OK":"FAIL "+(j.error?.code||""));
  if(j.ok){ok++; await fetch(`${APP}/api/habit`,{method:"DELETE",headers:{cookie}});}
}
console.log(`\nRESULT: ${ok}/4 plans succeeded`);
