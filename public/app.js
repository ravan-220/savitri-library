// Data aur State Management
let students = [];
let attendance = [];
let totalSeats = 50;
const whatsappNo = "7023909061";

// Login Logic - Fixed for Admin and Student
window.processLogin = () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const err = document.getElementById('login-err');
    
    // Admin Login (User: admin, Pass: 1234)
    if(user === 'admin' && pass === '1234') {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        renderAdminDashboard();
    } 
    // Student Login (Checking via Phone)
    else {
        const student = students.find(s => s.phone === user);
        if(student && pass === '1234') {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            renderStudentDashboard(student);
        } else {
            if(err) err.classList.remove('hidden');
        }
    }
};

// Admin Dashboard Render
window.renderAdminDashboard = () => {
    const main = document.getElementById('view-dashboard');
    const totalRevenue = students.reduce((sum, s) => sum + Number(s.fee || 0), 0);
    
    // Switch View
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('view-active'));
    main.classList.add('view-active');

    main.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black italic uppercase">Admin Dashboard</h2>
        </div>

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="premium-card p-6 rounded-[2rem] text-center border-l-4 border-indigo-500">
                <i class="fas fa-users text-indigo-400 text-2xl mb-2"></i>
                <p class="text-[10px] font-black uppercase text-gray-400">Total Students</p>
                <h3 class="text-2xl font-black">${students.length}</h3>
            </div>
            <div class="premium-card p-6 rounded-[2rem] text-center border-l-4 border-emerald-500">
                <i class="fas fa-wallet text-emerald-400 text-2xl mb-2"></i>
                <p class="text-[10px] font-black uppercase text-gray-400">Total Revenue</p>
                <h3 class="text-2xl font-black text-emerald-400">₹${totalRevenue}</h3>
            </div>
        </div>

        <!-- Quick Actions (Square Icons Grid) -->
        <div class="grid grid-cols-2 gap-4 mb-8">
            <div onclick="toggleModal(true)" class="premium-card aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-600 group transition-all rounded-[2.5rem]">
                <div class="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-2">
                    <i class="fas fa-user-plus text-indigo-400 text-xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest">Add Student</span>
            </div>
            <div onclick="showSeatMatrix()" class="premium-card aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-amber-600 group transition-all rounded-[2.5rem]">
                <div class="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-2">
                    <i class="fas fa-th text-amber-400 text-xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest">Seat Grid</span>
            </div>
            <div onclick="showMembersList()" class="premium-card aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-600 group transition-all rounded-[2.5rem]">
                <div class="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-2">
                    <i class="fas fa-list text-emerald-400 text-xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest">Members</span>
            </div>
            <div onclick="showAttendanceLogs()" class="premium-card aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-blue-600 group transition-all rounded-[2.5rem]">
                <div class="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-2">
                    <i class="fas fa-clipboard-check text-blue-400 text-xl"></i>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest">Logs</span>
            </div>
        </div>

        <div id="dynamicSection" class="space-y-4">
            <!-- Dynamic content will load here -->
        </div>
    `;
};

// Feature: Show Members List
window.showMembersList = () => {
    const section = document.getElementById('dynamicSection');
    section.innerHTML = `
        <h4 class="text-xs font-black uppercase text-gray-500 tracking-widest px-2">Registered Students</h4>
        ${students.length === 0 ? '<p class="text-center text-gray-600 py-10 italic text-xs">Koi student nahi hai. Naya add karein!</p>' : ''}
        ${students.map(s => `
            <div class="premium-card p-5 rounded-2xl mb-3">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-black italic text-white">${s.name}</h4>
                        <p class="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                            Phone: ${s.phone} | Fee: ₹${s.fee}
                        </p>
                    </div>
                    <button onclick="deleteStudent('${s.id}')" class="text-rose-500 p-2"><i class="fas fa-trash"></i></button>
                </div>
                <div class="flex gap-2 mt-4">
                    <button onclick="window.open('https://wa.me/91${s.phone}')" class="flex-1 bg-emerald-600/10 text-emerald-500 py-3 rounded-xl text-[9px] font-black uppercase">WhatsApp Message</button>
                </div>
            </div>
        `).join('')}
    `;
};

// Feature: Seat Matrix
window.showSeatMatrix = () => {
    const section = document.getElementById('dynamicSection');
    let seatHtml = '<div class="grid grid-cols-5 gap-3">';
    
    for(let i=1; i<=totalSeats; i++) {
        const occupied = students.find(s => Number(s.seat) === i);
        seatHtml += `
            <div class="aspect-square rounded-xl border flex flex-col items-center justify-center text-[10px] font-bold
                ${occupied ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}">
                ${i}
                <span class="text-[7px] uppercase opacity-60">${occupied ? 'Full' : 'Open'}</span>
            </div>
        `;
    }
    seatHtml += '</div>';
    section.innerHTML = `<h3 class="text-lg font-black italic uppercase mb-4 px-2 text-white">Seat Matrix</h3>` + seatHtml;
};

// Feature: Student Panel
window.renderStudentDashboard = (student) => {
    const main = document.getElementById('view-student-portal');
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('view-active'));
    main.classList.add('view-active');

    main.innerHTML = `
        <div class="premium-card p-10 rounded-[3rem] text-center shadow-2xl">
            <div class="w-20 h-20 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4 shadow-lg shadow-indigo-500/40">
                ${student.name.charAt(0)}
            </div>
            <h2 class="text-2xl font-black italic uppercase text-white">${student.name}</h2>
            <p class="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-1">Student Portal | Welcome</p>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-8">
            <button onclick="markAttendance('${student.id}')" class="premium-card aspect-square flex flex-col items-center justify-center gap-3 hover:bg-indigo-600 group transition-all rounded-3xl">
                <i class="fas fa-calendar-check text-2xl text-indigo-400 group-hover:text-white"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">Attendance</span>
            </button>
            <div class="premium-card aspect-square flex flex-col items-center justify-center gap-3 rounded-3xl">
                <i class="fas fa-credit-card text-2xl text-emerald-400"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">Fee: ₹${student.fee}</span>
            </div>
        </div>

        <button onclick="window.open('https://wa.me/91${whatsappNo}')" class="w-full bg-[#128c7e] p-6 rounded-[2rem] flex items-center justify-between text-white shadow-2xl active:scale-95 transition-all mt-8">
            <div class="flex items-center gap-4">
                <i class="fab fa-whatsapp text-2xl"></i>
                <div class="text-left">
                    <p class="font-black italic uppercase text-sm leading-none">Support Desk</p>
                    <p class="text-[9px] font-bold opacity-70 uppercase tracking-widest mt-1">Chat with Rahul Sir</p>
                </div>
            </div>
            <i class="fas fa-chevron-right text-xs opacity-50"></i>
        </button>
    `;
};

// Functional Helpers
window.toggleModal = (show) => {
    const modal = document.getElementById('modal');
    if(modal) modal.classList.toggle('hidden', !show);
};

// Form Submission (Add Student)
document.getElementById('addForm').onsubmit = (e) => {
    e.preventDefault();
    const newStudent = {
        id: 'STU' + Math.floor(1000 + Math.random() * 9000),
        name: document.getElementById('m-name').value,
        phone: document.getElementById('m-phone').value,
        fee: document.getElementById('m-fee').value,
        seat: Math.floor(Math.random() * 50) + 1 // Random seat for demo
    };
    students.push(newStudent);
    toggleModal(false);
    e.target.reset();
    renderAdminDashboard();
    showMembersList(); // Automatically show list after adding
};

window.deleteStudent = (id) => {
    if(confirm('Remove this student?')) {
        students = students.filter(s => s.id !== id);
        renderAdminDashboard();
        showMembersList();
    }
};

window.markAttendance = (id) => {
    const today = new Date().toLocaleDateString();
    attendance.push({ id, date: today });
    alert('Attendance Marked: ' + today);
};

window.showAttendanceLogs = () => {
    const section = document.getElementById('dynamicSection');
    section.innerHTML = `
        <h3 class="text-lg font-black italic uppercase mb-4 text-white">Attendance Logs</h3>
        <div class="space-y-2">
            ${attendance.length === 0 ? '<p class="text-gray-500 text-xs italic">No logs today.</p>' : ''}
            ${attendance.map(a => `<div class="premium-card p-3 text-[10px] font-bold text-white">${a.id} - ${a.date}</div>`).join('')}
        </div>
    `;
};

window.logout = () => location.reload();
