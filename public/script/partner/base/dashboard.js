const placeId = window.activePlaceId;
const money=v=>`₺${v.toLocaleString('tr-TR')}`;

const today= new Date();
const todayStr=today.toISOString().slice(0,10);
const start = new Date(today.getTime()-6*864e5);
const startStr=start.toISOString().slice(0,10);
const tomorrowStr=new Date(today.getTime()+864e5).toISOString().slice(0,10);

fetch(`/_json/place/${placeId}/orders?createdAt[after]=${startStr}&createdAt[strictly_before]=${tomorrowStr}&pagination=false`,{headers:{accept:'application/ld+json'}})
    .then(r=>r.ok?r.json():Promise.reject())
    .then(({"hydra:member":orders=[]})=>{
        const DAY=864e5;
        const dailyCount=Array(7).fill(0);
        const dailyRevenue=Array(7).fill(0);
        const labels=Array.from({length:7},(_,i)=>{
            const d=new Date(start.getTime()+i*DAY);
            return d.toLocaleDateString('tr-TR',{month:'2-digit',day:'2-digit'});
        });
        const statusCounts={pending:0,delivered:0,cancelled_user:0,cancelled_business:0};
        const productMap=Object.create(null);
        let todayRev=0,todayCnt=0,totalRev7=0,totalCnt7=0;
        const todayRows=[];
        const base=new Date(startStr+'T00:00:00');

        orders.forEach(o=>{
            const dStr=o.createdAt.slice(0,10);
            const idx=Math.round((new Date(dStr+'T00:00:00')-base)/DAY);
            if(idx>=0&&idx<7){dailyCount[idx]++; dailyRevenue[idx]+=o.grandTotal||0;}

            if(statusCounts[o.status]!=null) statusCounts[o.status]++;
            totalRev7+=o.grandTotal||0; totalCnt7++;
            if(dStr===todayStr){todayRev+=o.grandTotal||0;todayCnt++;todayRows.push(o);}

            (o.items||[]).forEach(it=>{
                const rec=productMap[it.productDescription||'—']??(productMap[it.productDescription||'—']={qty:0,rev:0});
                rec.qty+=it.quantity; rec.rev+=it.quantity*it.unitPrice;
            });
        });

        new ApexCharts(document.querySelector('#weeklyChart'),{
            chart:{type:'line',height:220,toolbar:{show:true},foreColor:'#6c757d'},
            series:[{name:'Sipariş',data:dailyCount}],
            xaxis:{categories:labels},
            yaxis:{labels:{formatter:v=>parseInt(v)},min:0,tickAmount:Math.max(...dailyCount)||1},
            stroke:{curve:'smooth',width:3},
            fill:{opacity:0.2},
            grid:{strokeDashArray:4},
            tooltip:{theme:'dark',y:{formatter:v=>`${v} adet`}},
            markers:{size:4,hover:{sizeOffset:2}}
        }).render();

        document.getElementById('todayRevenue').textContent=money(todayRev);
        document.getElementById('todayOrderCount').textContent=todayCnt;
        document.getElementById('weekRevenue').textContent=money(totalRev7);
        document.getElementById('weekOrders').textContent=totalCnt7;

        const daysActive=dailyCount.filter(c=>c>0).length||1;
        const avgCnt=totalCnt7/daysActive;
        const avgRev=totalRev7/daysActive;
        const diffCnt=todayCnt-avgCnt;
        const diffRev=todayRev-avgRev;
        document.getElementById('comparisonMsg').textContent=`Bugün, son 7 gün içindeki sipariş alınan günlerin ortalamasına göre ${diffCnt>=0?'+':''}${diffCnt.toFixed(0)} sipariş ve ${diffRev>=0?'+':''}${money(Math.abs(diffRev).toFixed(0))} ${diffRev>=0?'fazla':'az'} ciro.`;

        const tracked=statusCounts.pending+statusCounts.delivered+statusCounts.cancelled_user+statusCounts.cancelled_business;
        const success=tracked?Math.round((statusCounts.delivered/tracked)*100):0;
        const sr=document.getElementById('successRate');
        sr.textContent=`${success}%`;
        sr.className='mb-0 '+(success>=70?'text-success':success>=40?'text-warning':'text-danger');

        const mapTR={pending:'Bekliyor',delivered:'Teslim Edildi',cancelled_user:'Kullanıcı İptali',cancelled_business:'İşletme İptali'};
        document.getElementById('statusList').innerHTML=Object.entries(mapTR).map(([k,v])=>`<li class="list-group-item d-flex justify-content-between align-items-center">${v}<span class="badge bg-secondary">${statusCounts[k]}</span></li>`).join('');

        const top=Object.entries(productMap).sort((a,b)=>b[1].qty-a[1].qty).slice(0,7);
        document.querySelector('#topProductsTable tbody').innerHTML=top.length?top.map(([n,o])=>`<tr><td>${n}</td><td>${o.qty}</td><td>${money(o.rev)}</td></tr>`).join(''):`<tr><td colspan="3" class="text-center text-muted">Kayıt yok</td></tr>`;

        document.querySelector('#todayOrdersTable tbody').innerHTML=todayRows.length?todayRows.map(o=>`<tr><td>${o.id.slice(0,6)}…</td><td>${(o.user?.id||'—').slice(0,6)}</td><td>${money(o.grandTotal)}</td><td><span class="badge bg-info">${mapTR[o.status]}</span></td></tr>`).join(''):`<tr><td colspan="4" class="text-center text-muted">Kayıt yok</td></tr>`;
    });