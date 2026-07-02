var tasks = [];

function fmt(d) {
  return d.toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

setInterval(function() {
  document.getElementById("clock").textContent = "🕐 " + fmt(new Date());
}, 1000);
document.getElementById("clock").textContent = "🕐 " + fmt(new Date());

document.getElementById("inp").addEventListener("keydown", function(e) {
  if (e.key === "Enter") addTask();
});

function addTask() {
  var text = document.getElementById("inp").value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text: text, done: false, addedAt: new Date(), doneAt: null });
  document.getElementById("inp").value = "";
  render();
}

function render() {
  var pList = document.getElementById("pendingList");
  var cList = document.getElementById("completedList");
  pList.innerHTML = cList.innerHTML = "";

  var pending   = tasks.filter(function(t) { return !t.done; });
  var completed = tasks.filter(function(t) { return  t.done; });

  document.getElementById("pc").textContent = pending.length;
  document.getElementById("cc").textContent = completed.length;

  if (!pending.length)   pList.innerHTML = '<div class="empty">No pending tasks.</div>';
  if (!completed.length) cList.innerHTML = '<div class="empty">No completed tasks.</div>';

  tasks.forEach(function(t) {
    var d = document.createElement("div");
    d.className = "card";

    var chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = t.done;
    chk.onchange = function() {
      t.done = chk.checked;
      t.doneAt = t.done ? new Date() : null;
      render();
    };

    var info = document.createElement("div");
    info.className = "info";
    info.innerHTML =
      '<div class="name' + (t.done ? " done" : "") + '">' + t.text + '</div>' +
      '<div class="date">🕐 Added: ' + fmt(t.addedAt) + '</div>' +
      (t.done && t.doneAt ? '<div class="date t">✔ Done: ' + fmt(t.doneAt) + '</div>' : "");

    var btns = document.createElement("div");
    btns.className = "btns";
    btns.innerHTML =
      '<button onclick="var v=prompt(\'\',\'' + t.text.replace(/'/g,"\\'") + '\');if(v&&v.trim()){tasks.find(x=>x.id==' + t.id + ').text=v.trim();render()}">✏️</button>' +
      '<button onclick="tasks=tasks.filter(x=>x.id!=' + t.id + ');render()">🗑️</button>';

    d.appendChild(chk);
    d.appendChild(info);
    d.appendChild(btns);
    (t.done ? cList : pList).appendChild(d);
  });
}

render();