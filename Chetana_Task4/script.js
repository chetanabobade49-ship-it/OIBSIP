// ── Helpers ──────────────────────────────────────────────
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'msg ' + type;
  el.style.display = 'block';
}
function hideMsg(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// ── Register ──────────────────────────────────────────────
function registerPatient(e) {
  e.preventDefault();
  hideMsg('reg-msg');

  const name     = document.getElementById('r-name').value.trim();
  const age      = document.getElementById('r-age').value.trim();
  const email    = document.getElementById('r-email').value.trim();
  const username = document.getElementById('r-user').value.trim();
  const password = document.getElementById('r-pass').value;
  const confirm  = document.getElementById('r-confirm').value;

  if (!name || !age || !email || !username || !password || !confirm)
    return showMsg('reg-msg', 'All fields are required.', 'err');

  if (password !== confirm)
    return showMsg('reg-msg', 'Passwords do not match.', 'err');

  const patients = JSON.parse(localStorage.getItem('hp_patients') || '[]');

  if (patients.find(p => p.username === username))
    return showMsg('reg-msg', 'Username already taken. Try another.', 'err');

  // Save patient record
  patients.push({ name, age, email, username, password,
    patientId: 'PID-' + Date.now().toString().slice(-6),
    bloodGroup: 'B+', ward: 'General' });
  localStorage.setItem('hp_patients', JSON.stringify(patients));

  showMsg('reg-msg', 'Registered! Redirecting to login…', 'ok');
  setTimeout(() => { window.location.href = "index.html"; }, 1400);
}

// ── Login ─────────────────────────────────────────────────
function loginPatient(e) {
  e.preventDefault();
  hideMsg('login-msg');

  const username = document.getElementById('l-user').value.trim();
  const password = document.getElementById('l-pass').value;

  if (!username || !password)
    return showMsg('login-msg', 'Enter username and password.', 'err');

  const patients = JSON.parse(localStorage.getItem('hp_patients') || '[]');
  const patient  = patients.find(p => p.username === username && p.password === password);

  if (!patient)
    return showMsg('login-msg', 'Incorrect username or password.', 'err');

  // Store session
  sessionStorage.setItem('hp_session', patient.username);
  window.location.href = 'dashboard.html';
}

// ── Dashboard ─────────────────────────────────────────────
function loadDashboard() {
  const loggedIn = sessionStorage.getItem('hp_session');
  if (!loggedIn) return window.location.replace("index.html");

  const patients = JSON.parse(localStorage.getItem('hp_patients') || '[]');
  const p = patients.find(x => x.username === loggedIn);
  if (!p) return logoutPatient();

  // Fill patient info
  document.getElementById('d-name').textContent      = p.name;
  document.getElementById('d-email').textContent     = p.email;
  document.getElementById('d-pid').textContent       = p.patientId;
  document.getElementById('d-age').textContent       = p.age + ' yrs';
  document.getElementById('d-blood').textContent     = p.bloodGroup;
  document.getElementById('d-ward').textContent      = p.ward;
  document.getElementById('d-welcome').textContent   = 'Welcome back, ' + p.name.split(' ')[0] + '!';

  // Set avatar initials
  const initials = p.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('d-avatar').textContent = initials;
}

// ── Logout ────────────────────────────────────────────────
function logoutPatient() {
  sessionStorage.removeItem('hp_session');
  window.location.replace("index.html");
}