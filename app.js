let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'All';

document.getElementById('taskForm').addEventListener('submit', function(e){
  e.preventDefault();
  const task = {
    id: Date.now(),
    title: document.getElementById('title').value,
    course: document.getElementById('course').value,
    dueDate: document.getElementById('dueDate').value,
    priority: document.getElementById('priority').value,
    completed: false
  };
  tasks.push(task);
  saveAndRender();
  this.reset();
});

function saveAndRender(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

function render(){
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  let filtered = tasks;
  const today = new Date().toISOString().split('T')[0];
  if(currentFilter==='Pending') filtered = tasks.filter(t=>!t.completed);
  if(currentFilter==='Completed') filtered = tasks.filter(t=>t.completed);
  if(currentFilter==='Overdue') filtered = tasks.filter(t=>!t.completed && t.dueDate < today);

  filtered.forEach(t=>{
    const isOverdue = !t.completed && t.dueDate < today;
    const div = document.createElement('div');
    div.className = `task ${t.priority} ${t.completed?'completed':''}`;
    div.innerHTML = `
      <div><strong>${t.title}</strong><br><small>${t.course} | Due: ${t.dueDate} | ${t.priority} ${isOverdue?'<span class="overdue">OVERDUE</span>':''}</small></div>
      <div>
        <button onclick="toggleTask(${t.id})">${t.completed?'Undo':'Done'}</button>
        <button onclick="deleteTask(${t.id})" style="background:red">Delete</button>
      </div>`;
    list.appendChild(div);
  });

  const done = tasks.filter(t=>t.completed).length;
  const pct = tasks.length? Math.round(done/tasks.length*100):0;
  document.getElementById('progressText').textContent = `${pct}% Complete (${done}/${tasks.length})`;
  document.getElementById('progressFill').style.width = pct+'%';
}

function toggleTask(id){ tasks = tasks.map(t=> t.id===id? {...t, completed:!t.completed}:t); saveAndRender(); }
function deleteTask(id){ tasks = tasks.filter(t=>t.id!==id); saveAndRender(); }
function filterTasks(f){ currentFilter=f; render(); }
function sortByPriority(){
  const order={High:1,Medium:2,Low:3};
  tasks.sort((a,b)=>order[a.priority]-order[b.priority]);
  saveAndRender();
}
render();