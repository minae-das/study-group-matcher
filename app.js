async function api(path, opts={}){
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function refresh(){
  const groups = await api('/api/groups');
  const events = await api('/api/events');

  document.getElementById('groupSelect').innerHTML = groups.map(g=>`<option value="${g.id}">${g.name} — ${g.subject}</option>`).join('');

  const lists = document.getElementById('lists');
  const groupsHtml = groups.map(g=>`<div class="card"><strong>${g.name}</strong> — ${g.subject}<div>${g.description||''}</div></div>`).join('') || '<p>No groups yet.</p>';
  const eventsHtml = events.map(e=>`<div class="card">${new Date(e.time).toLocaleString()} — <strong>${e.title}</strong> (<em>${groups.find(g=>g.id===e.groupId)?.name||e.groupId}</em>)<div>${e.location||''}</div></div>`).join('') || '<p>No upcoming events.</p>';

  lists.innerHTML = '<h3>Groups</h3>'+groupsHtml+'<h3>Upcoming Events</h3>'+eventsHtml;
}

document.getElementById('groupForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  await api('/api/groups', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: fd.get('name'), subject: fd.get('subject'), description: fd.get('description') }) });
  e.target.reset();
  refresh();
});

document.getElementById('memberForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  await api('/api/members', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: fd.get('name'), email: fd.get('email') }) });
  e.target.reset();
  alert('Member added');
});

document.getElementById('eventForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  await api('/api/events', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ groupId: fd.get('groupId'), title: fd.get('title'), time: fd.get('time'), location: fd.get('location') }) });
  e.target.reset();
  refresh();
});

window.addEventListener('load', ()=>{ refresh().catch(err=>{document.getElementById('lists').innerText='Failed to load: '+err.message}) });
