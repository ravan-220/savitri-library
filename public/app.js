// Initial Data
let students = [];
let attendance = [];
let totalSeats = 50;
const whatsappNo = "7023909061";

// Login Function - Fixed & Verified
window.processLogin = () => {
    const userField = document.getElementById('username');
    const passField = document.getElementById('password');
    const err = document.getElementById('login-err');
    
    const user = userField.value.trim();
    const pass = passField.value.trim();

    // 1. Admin Login (Username: admin, Password: 1234)
    if(user === 'admin' && pass === '1234') {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        renderAdminDashboard();
        return;
    } 

    // 2. Student Login (Check by Phone)
    const student = students.find(s => s.phone === user);
    if(student && pass === '1234') {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        renderStudentDashboard(student);
        return;
    }

    // Login Failed
    if(err) {
        err.classList.remove('hidden');
        err.innerText = "Invalid Login! (Use admin/1234)";
    }
};

// Admin Dashboard with Square Icons Grid
window.renderAdminDashboard = () => {
    const main = document.getElementById('view-dashboard');
    const totalRevenue = students.reduce((sum, s) => sum + Number(s.fee || 0), 0);
    
    // UI Cleanup
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('view-active'));
    main.classList.add('view-active');

    main.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black italic uppercase text-white tracking-tighter">Admin Dashboard</h2>
            <button onclick="logout()" class="text-[9px] font-black bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full uppercase border border-rose-500/20">Exit</button>
        </div>

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-[#1a1c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                <p class="text-[9px] font-black uppercase text-gray-500 mb-1 tracking-widest">Members</p>
                <h3 class="text-2xl font-black text-white">${students.length}</h3>
            </div>
            <div class="bg-[#1a1c2c] p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                <p class="text-[9px] font-black uppercase text-gray-500 mb-1 tracking-widest">Earnings</p>
                <h3 class="text-2xl font-black text-emerald-400">₹${totalRevenue}</h3>
            </div>
        </div>

        <!-- Square Feature Icons (The 4 Main Features) -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Add Student Square -->
            <div onclick="toggleModal(true)" class="aspect-square bg-[#1a1c2c] rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer border border-white/5 hover:border-indigo-500/30 active:scale-95 transition-all shadow-lg">
                <div class="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-user-plus text-indigo-400 text-2xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-white">Add Member</span>
            </div>

            <!-- Members List Square -->
            <div onclick="showMembersList()" class="aspect-square bg-[#1a1c2c] rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer border border-white/5 hover:border-emerald-500/30 active:scale-95 transition-all shadow-lg">
                <div class="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-list-ul text-emerald-400 text-2xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-white">Members</span>
            </div>

            <!-- Seat Grid Square -->
            <div onclick="showSeatMatrix()" class="aspect-square bg-[#1a1c2c] rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer border border-white/5 hover:border-amber-500/30 active:scale-95 transition-all shadow-lg">
                <div class="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-th text-amber-400 text-2xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-white">Seat Grid</span>
            </div>

            <!-- Attendance Logs Square -->
            <div onclick="showAttendanceLogs()" class="aspect-square bg-[#1a1c2c] rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer border border-white/5 hover:border-blue-500/30 active:scale-95 transition-all shadow-lg">
                <div class="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-clipboard-check text-blue-400 text-2xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-white">Logs</span>
            </div>
        </div>

        <!-- Dynamic Area for List/Grid -->
        <div id="dynamicContent" class="mt-8 pb-10"></div>
    `;
};

// Feature: Show Members List
window.showMembersList = () => {
    const target = document.getElementById('dynamicContent');
    target.innerHTML = `
        <div class="flex justify-between items-center mb-4 px-2">
            <h3 class="text-xs font-black uppercase italic text-slate-400">Registered Students</h3>
        </div>
        ${students.length === 0 ? '<p class="text-center text-gray-600 py-10 italic text-[10px]">No members found. Add one!</p>' : ''}
        ${students.map(s => `
            <div class="bg-[#1a1c2c] p-5 rounded-3xl mb-3 flex justify-between items-center border border-white/5">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-bold">${s.name.charAt(0)}</div>
                    <div>
                        <h4 class="font-black text-white text-sm tracking-tight">${s.name}</h4>
                        <p class="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">${s.phone} | Seat: ${s.seat}</p>
                    </div>
                </div>
                <button onclick="deleteStudent('${s.id}')" class="bg-rose-500/10 text-rose-500 p-2 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </div>
        `).join('')}
    `;
    target.scrollIntoView({ behavior: 'smooth' });
};

// Feature: Seat Matrix
window.showSeatMatrix = () => {
    const target = document.getElementById('dynamicContent');
    let grid = `<div class="grid grid-cols-5 gap-2 mt-4">`;
    for(let i=1; i<=totalSeats; i++) {
        const taken = students.find(s => Number(s.seat) === i);
        grid += `
            <div class="aspect-square rounded-xl border flex items-center justify-center text-[10px] font-black transition-all
                ${taken ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}">
                ${i}
            </div>
        `;
    }
    grid += `</div>`;
    target.innerHTML = `<h3 class="text-xs font-black uppercase italic text-slate-400 px-2">Seat Status Matrix</h3>` + grid;
    target.scrollIntoView({ behavior: 'smooth' });
};

// Attendance Logs
window.showAttendanceLogs = () => {
    const target = document.getElementById('dynamicContent');
    target.innerHTML = `
        <h3 class="text-xs font-black uppercase italic text-slate-400 px-2 mb-4">Daily Logs</h3>
        <div class="space-y-2">
            ${attendance.length === 0 ? '<p class="text-gray-500 text-[10px] italic px-2">No activity recorded today.</p>' : ''}
            ${attendance.map(a => `<div class="bg-[#1a1c2c] p-3 rounded-xl border border-white/5 text-[10px] font-bold text-white flex justify-between">
                <span>${a.id}</span>
                <span class="text-indigo-400">${a.date}</span>
            </div>`).join('')}
        </div>
    `;
    target.scrollIntoView({ behavior: 'smooth' });
};

// UI Helpers
window.toggleModal = (show) => {
    document.getElementById('modal').classList.toggle('hidden', !show);
};

window.logout = () => {
    location.reload();
};

// Form Logic
document.getElementById('addForm').onsubmit = (e) => {
    e.preventDefault();
    const student = {
        id: 'STU-' + Math.floor(1000 + Math.random() * 9000),
        name: document.getElementById('m-name').value,
        phone: document.getElementById('m-phone').value,
        fee: document.getElementById('m-fee').value,
        seat: students.length + 1
    };
    students.push(student);
    toggleModal(false);
    renderAdminDashboard();
    showMembersList();
    e.target.reset();
};

window.deleteStudent = (id) => {
    if(confirm('Are you sure you want to remove this member?')) {
        students = students.filter(s => s.id !== id);
        renderAdminDashboard();
        showMembersList();
    }
};
