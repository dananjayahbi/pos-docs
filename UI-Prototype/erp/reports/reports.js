/* Reports & Analytics - reports.js */
'use strict';

const fmtLKR = n => '₨ ' + Number(n||0).toLocaleString('en-LK',{minimumFractionDigits:2,maximumFractionDigits:2});
const numFmt  = n => Number(n||0).toLocaleString('en-LK');

let allOrders=[],allExpenses=[],allInventory=[],allCustomers=[],allAttendance=[],allPayroll=[],allEmployees=[],allPurchaseOrders=[];
let activeReportType=null,activeReportRows=[],activeReportCols=[];

const QS = { revenue:'₨ 12,847,500.00', orders:'3,241', newCust:'847', avgOrder:'₨ 3,964.00' };

document.addEventListener('DOMContentLoaded',()=>{ setDefaultDates(); renderQuickStats(); loadAllData(); });

function setDefaultDates(){
  ['reportFrom','exportFrom'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value='2024-01-01'; });
  ['reportTo','exportTo'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value='2026-12-31'; });
}

function renderQuickStats(){
  setText('statRevenue',QS.revenue); setText('statOrders',QS.orders);
  setText('statNewCust',QS.newCust); setText('statAvgOrder',QS.avgOrder);
}

async function loadAllData(){
  const base='../../data/';
  try{
    const[ord,exp,inv,cus,att,pay,emp,po]=await Promise.all([
      fetch(base+'orders.json').then(r=>r.json()),
      fetch(base+'expenses.json').then(r=>r.json()),
      fetch(base+'inventory.json').then(r=>r.json()),
      fetch(base+'customers.json').then(r=>r.json()),
      fetch(base+'attendance.json').then(r=>r.json()),
      fetch(base+'payroll.json').then(r=>r.json()),
      fetch(base+'employees.json').then(r=>r.json()),
      fetch(base+'purchase-orders.json').then(r=>r.json()),
    ]);
    allOrders=ord.orders||[]; allExpenses=exp.expenses||[]; allInventory=inv.items||[];
    allCustomers=cus.customers||[]; allAttendance=att.attendance||[]; allPayroll=pay.payroll||[];
    allEmployees=emp.employees||[]; allPurchaseOrders=po.purchase_orders||[];
    drawSalesChart();
  }catch(e){ console.warn('Reports load error:',e); }
}

let salesChartInstance=null;

const CHART_DEMO={'Aug 25':1850000,'Sep 25':2100000,'Oct 25':1980000,'Nov 25':2450000,'Dec 25':2760000,'Jan 26':1710000};

function drawSalesChart(){
  const canvas=document.getElementById('salesChart');
  if(!canvas||typeof Chart==='undefined') return;
  // Seed with demo data; overlay real paid order totals on matching months
  const buckets={...CHART_DEMO};
  allOrders.forEach(o=>{
    const d=new Date(o.ordered_at); if(isNaN(d)) return;
    const key=d.toLocaleString('en-US',{month:'short',year:'2-digit'});
    const v=(o.payment_status==='paid'||(o.total||0)>0)?(o.total||0):0;
    if(v>0) buckets[key]=(buckets[key]||0)+v;
  });
  const sorted=Object.keys(buckets).sort((a,b)=>new Date('01 '+a)-new Date('01 '+b));
  const labels=sorted.slice(-6), values=labels.map(l=>buckets[l]||0);

  if(salesChartInstance){ salesChartInstance.destroy(); salesChartInstance=null; }

  const ctx=canvas.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,180);
  grad.addColorStop(0,'rgba(249,115,22,0.30)');
  grad.addColorStop(1,'rgba(249,115,22,0.02)');

  salesChartInstance=new Chart(ctx,{
    type:'line',
    data:{
      labels,
      datasets:[{
        label:'Revenue (₨)',
        data:values,
        fill:true,
        backgroundColor:grad,
        borderColor:'#f97316',
        borderWidth:2.5,
        pointBackgroundColor:'#f97316',
        pointBorderColor:'#fff',
        pointBorderWidth:2,
        pointRadius:4,
        pointHoverRadius:6,
        tension:0.42
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'#1f2937',
          titleColor:'#f9fafb',
          bodyColor:'#d1d5db',
          padding:10,
          callbacks:{
            label(ctx){ const v=ctx.parsed.y; return ' ₨ '+(v>=1e6?(v/1e6).toFixed(2)+'M':v>=1000?(v/1000).toFixed(1)+'K':v.toLocaleString()); }
          }
        }
      },
      scales:{
        x:{grid:{display:false},ticks:{color:'#9ca3af',font:{size:11}}},
        y:{
          grid:{color:'rgba(0,0,0,0.06)'},
          ticks:{color:'#9ca3af',font:{size:10},maxTicksLimit:4,callback(v){return v>=1e6?(v/1e6).toFixed(1)+'M':v>=1000?(v/1000).toFixed(0)+'K':v;}},
          border:{display:false}
        }
      }
    }
  });

  const lbl=document.getElementById('chartLabel');
  if(lbl&&labels.length) lbl.textContent='Monthly revenue — '+(labels.length>1?labels[0]+' to '+labels[labels.length-1]:labels[0]);
}

const REPORT_CONFIGS={
  sales:{title:'Sales Report',icon:'fa-chart-bar',
    cols:['Order ID','Customer','Date','Source','Items','Total (₨)','Payment','Status'],
    getData(f,t){return allOrders.filter(o=>inRange(new Date(o.ordered_at),f,t)).sort((a,b)=>new Date(b.ordered_at)-new Date(a.ordered_at)).map(o=>[o.id,o.customer_name,(o.ordered_at||'').split('T')[0],cap(o.source),o.items?o.items.length:0,numFmt(o.total),cap(o.payment_status),cap(o.status)]);},
    summary(r){return r.length+' order(s) in range';}},
  inventory:{title:'Inventory Report',icon:'fa-boxes-stacked',
    cols:['ID','Product','SKU','Warehouse','On Hand','Reserved','Available','Min Stock','Status'],
    getData(){return allInventory.map(i=>{const av=i.available??((i.on_hand||0)-(i.reserved||0));return[i.id,i.product||i.name||'',i.sku||'',i.warehouse||'',i.on_hand??0,i.reserved||0,av,i.min_stock||0,av<=(i.min_stock||0)?'Low Stock':'OK'];});},
    summary(r){return r.length+' item(s) · '+r.filter(x=>x[8]==='Low Stock').length+' low-stock';}},
  customers:{title:'Customer Report',icon:'fa-users',
    cols:['ID','Name','Type','City','Orders','Total Spent (₨)','Avg Order (₨)','Tier','Status'],
    getData(){return allCustomers.sort((a,b)=>(b.total_spent||0)-(a.total_spent||0)).map(c=>[c.id,((c.first_name||'')+' '+(c.last_name||'')).trim(),cap(c.customer_type),c.city||'',c.total_orders||0,numFmt(c.total_spent),numFmt(c.avg_order_value),c.loyalty_tier||'—',cap(c.status)]);},
    summary(r){return r.length+' customers · '+allCustomers.filter(c=>c.status==='active').length+' active';}},
  financial:{title:'Financial Report',icon:'fa-chart-line',
    cols:['ID','Date','Category','Vendor','Description','Amount (₨)','Method','Status'],
    getData(f,t){return allExpenses.filter(e=>inRange(new Date(e.date),f,t)).sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>[e.id,e.date,e.category||'',e.vendor_name||'',e.description||'',numFmt(e.amount),(e.payment_method||'').replace(/_/g,' '),cap(e.status)]);},
    summary(r){return r.length+' expense(s) in range';}},
  hr:{title:'HR Report',icon:'fa-id-card',
    cols:['Employee ID','Name','Date','Status','Clock In','Clock Out','Hours','Notes'],
    getData(f,t){return allAttendance.filter(a=>inRange(new Date(a.date),f,t)).sort((a,b)=>new Date(b.date)-new Date(a.date)).map(a=>[a.employee_id||'',a.employee_name||'',a.date||'',cap(a.status),a.clock_in||'—',a.clock_out||'—',a.work_hours||'—',a.notes||'']);},
    summary(r){return r.length+' attendance record(s)';}},
  purchases:{title:'Purchase Report',icon:'fa-truck',
    cols:['PO ID','Vendor','Order Date','Expected','Items','Total (₨)','Paid (₨)','Balance (₨)','Status'],
    getData(f,t){return allPurchaseOrders.filter(p=>inRange(new Date(p.order_date),f,t)).sort((a,b)=>new Date(b.order_date)-new Date(a.order_date)).map(p=>[p.id,p.vendor_name||'',p.order_date||'',p.expected_date||'',p.items_count||0,numFmt(p.total_amount),numFmt(p.paid_amount),numFmt(p.balance),cap(p.status)]);},
    summary(r){return r.length+' purchase order(s)';}}
};

function openReport(type){
  activeReportType=type;
  const cfg=REPORT_CONFIGS[type]; if(!cfg) return;
  document.getElementById('reportModalTitle').textContent=cfg.title;
  document.getElementById('reportModalIcon').className='fa '+cfg.icon;
  document.getElementById('reportSummaryBar').textContent='';
  document.getElementById('reportThead').innerHTML='<tr>'+cfg.cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>';
  document.getElementById('reportModal').classList.add('open');
  generateReport();
}

function closeReportModal(){ document.getElementById('reportModal').classList.remove('open'); activeReportType=null; activeReportRows=[]; }

function generateReport(){
  if(!activeReportType) return;
  const cfg=REPORT_CONFIGS[activeReportType]; if(!cfg) return;
  const from=new Date(document.getElementById('reportFrom').value||'2024-01-01');
  const to=eod(new Date(document.getElementById('reportTo').value||'2026-12-31'));
  const rows=cfg.getData(from,to);
  activeReportRows=rows; activeReportCols=cfg.cols;
  const tbody=document.getElementById('reportTbody');
  if(!rows.length){
    tbody.innerHTML='<tr><td colspan="'+cfg.cols.length+'" style="text-align:center;padding:2rem;color:#9ca3af;">No data for selected range.</td></tr>';
    document.getElementById('reportSummaryBar').textContent='0 records'; return;
  }
  tbody.innerHTML=rows.map(r=>'<tr>'+r.map(c=>'<td style="font-size:.875rem;">'+c+'</td>').join('')+'</tr>').join('');
  document.getElementById('reportSummaryBar').textContent=cfg.summary?cfg.summary(rows):rows.length+' record(s)';
}

function exportReportCSV(){ if(!activeReportRows.length){showToast('No data to export.','warning');return;} downloadCSV(activeReportCols,activeReportRows,activeReportType+'_report'); showToast('Report exported!','success'); }
function openExportModal(){ document.getElementById('exportModal').classList.add('open'); }
function closeExportModal(){ document.getElementById('exportModal').classList.remove('open'); }
function doExportAll(){
  const type=document.getElementById('exportType').value;
  const from=new Date(document.getElementById('exportFrom').value||'2024-01-01');
  const to=eod(new Date(document.getElementById('exportTo').value||'2026-12-31'));
  const cfg=REPORT_CONFIGS[type]; if(!cfg) return;
  const rows=cfg.getData(from,to);
  if(!rows.length){showToast('No data in range.','warning');return;}
  downloadCSV(cfg.cols,rows,type+'_report'); closeExportModal(); showToast(cfg.title+' downloaded!','success');
}
function downloadCSV(cols,rows,fname){
  const esc=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const body=[cols.map(esc).join(','),...rows.map(r=>r.map(esc).join(','))].join('\r\n');
  const url=URL.createObjectURL(new Blob([body],{type:'text/csv;charset=utf-8;'}));
  Object.assign(document.createElement('a'),{href:url,download:fname+'_'+new Date().toISOString().split('T')[0]+'.csv'}).click();
  URL.revokeObjectURL(url);
}
function cap(s){ return s?s.charAt(0).toUpperCase()+s.slice(1).replace(/_/g,' '):''; }
function eod(d){ const c=new Date(d); c.setHours(23,59,59,999); return c; }
function inRange(d,f,t){ return !isNaN(d)&&d>=f&&d<=t; }
function setText(id,v){ const el=document.getElementById(id); if(el) el.textContent=v; }
function showToast(msg,type){
  const tc=document.getElementById('toastContainer'); if(!tc) return;
  const C={success:'#16a34a',warning:'#d97706',error:'#dc2626',info:'#2563eb'};
  const t=document.createElement('div');
  t.style.cssText='background:'+(C[type]||C.info)+';color:#fff;padding:.625rem 1rem;border-radius:8px;font-size:.875rem;box-shadow:0 4px 12px rgba(0,0,0,.15);margin-top:.5rem;';
  t.textContent=msg; tc.appendChild(t); setTimeout(()=>t.remove(),3500);
}
document.addEventListener('click',e=>{ if(e.target.id==='reportModal') closeReportModal(); if(e.target.id==='exportModal') closeExportModal(); });
let rsz; window.addEventListener('resize',()=>{ clearTimeout(rsz); rsz=setTimeout(drawSalesChart,200); });
