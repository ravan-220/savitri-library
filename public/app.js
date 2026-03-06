// Data
let students = [
    { id: 16, name: 'Jitendra Meghwal', start: '01/02/2026', end: '01/03/2026', phone: '9462376154', due: '3000', status: 'Pending' },
    { id: 19, name: 'Vikas Sankhla', start: '06/02/2026', end: '08/03/2026', phone: '9588811700', due: '0', status: 'Paid' }
];

window.handleLogin = () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    if(user === 'admin' && pass === '1234') {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboardMain').classList.remove('hidden');
        renderAdmin();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
};

window.renderAdmin = () => {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="glass-card p-6 text-center border-l-4 border-indigo-500">
                <p class="text-[10px] font-bold text-gray-500 uppercase">Members</p>
                <h3 class="text-2xl font-black">${students.length}</h3>
            </div>
            <div class="glass-card p-6 text-center border-l-4 border-emerald-500">
                <p class="text-[10px] font-bold text-gray-500 uppercase">Revenue</p>
                <h3 class="text-2xl font-black text-emerald-400">₹78,450</h3>
            </div>
        </div>
        <div class="space-y-4">
            ${students.map(s => `
                <div class="glass-card p-5">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-black italic">${s.name}</h4>
                            <p class="text-[10px] text-gray-500">ID: ${s.id} | ${s.phone}</p>
                        </div>
                        <span class="id-badge">${s.status}</span>
                    </div>
                    <button onclick="window.open('https://wa.me/91${s.phone}')" class="w-full bg-emerald-600/10 text-emerald-500 py-3 rounded-xl mt-4 text-[10px] font-black uppercase">Send Fee Reminder</button>
                </div>
            `).join('')}
        </div>
    `;
};

window.logout = () => location.reload();
