// ====== CONFIGURATION YA SUPABASE ======
// (Hakikisha SUPABASE_URL na SUPABASE_KEY zako zipo hapa chini vizuri kama mwanzo)
const SUPABASE_URL = "https://nkdvoqbbzgjdkvvccbej.supabase.co"; 
const SUPABASE_KEY = "sb_publishable__6o1FK6fIdXD9st9G8QJ9w_ZLqH6lxC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentRole = "mwanachama";
let loggedInUserPhone = "";

// Element Selectors
const userRoleSelect = document.getElementById("userRole");
const phoneField = document.getElementById("phoneField");
const loginPhoneInput = document.getElementById("loginPhone");
const loginPasswordInput = document.getElementById("loginPassword");
const btnLogin = document.getElementById("btnLogin");
const loginError = document.getElementById("loginError");
const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");
const adminPanel = document.getElementById("adminPanel");
const groupDashboardSection = document.getElementById("groupDashboardSection");
const searchSection = document.getElementById("searchSection");
const roleBadge = document.getElementById("roleBadge");
const membersList = document.getElementById("membersList");
const listTitle = document.getElementById("listTitle");

// Badilisha muonekano kulingana na Role
userRoleSelect.addEventListener("change", () => {
    if (userRoleSelect.value === "katibu") {
        phoneField.style.display = "none"; // Katibu hahitaji namba ya simu
    } else {
        phoneField.style.display = "block"; // Mwanachama anahitaji namba ya simu
    }
});

// LOG IN LOGIC
btnLogin.addEventListener("click", async () => {
    const role = userRoleSelect.value;
    const password = loginPasswordInput.value.trim();
    const phone = loginPhoneInput.value.trim();
    
    loginError.style.display = "none";

    if (role === "katibu") {
        // Login ya Katibu
        if (password === "holili2026") {
            currentRole = "katibu";
            showMainPage();
        } else {
            loginError.style.display = "block";
        }
    } else {
        // Login ya Mwanachama kwa kutumia Simu + vijanaholili
        if (password === "vijanaholili" && phone !== "") {
            // Hakikisha namba ya simu ipo kwenye database
            const { data, error } = await _supabase
                .from('members')
                .select('*')
                .eq('phone', phone);

            if (data && data.length > 0) {
                currentRole = "mwanachama";
                loggedInUserPhone = phone;
                showMainPage();
            } else {
                loginError.innerText = "Namba hii ya simu haijasajiliwa kwenye mfumo!";
                loginError.style.display = "block";
            }
        } else {
            loginError.innerText = "Neno la siri au namba ya simu si sahihi!";
            loginError.style.display = "block";
        }
    }
});

function showMainPage() {
    loginPage.style.display = "none";
    mainPage.style.display = "block";
    
    if (currentRole === "katibu") {
        roleBadge.className = "badge bg-danger position-absolute top-0 end-0 m-3 p-2";
        roleBadge.innerText = "ROLE: KATIBU";
        adminPanel.style.display = "block";
        groupDashboardSection.style.display = "block";
        searchSection.style.style = "block";
        listTitle.innerText = "Orodha ya Wanachama Wote";
        loadAllMembersData();
    } else {
        roleBadge.className = "badge bg-success position-absolute top-0 end-0 m-3 p-2";
        roleBadge.innerText = "ROLE: MWANACHAMA";
        adminPanel.style.display = "none";
        groupDashboardSection.style.display = "none"; // Ficha dashboard ya kikundi
        searchSection.style.display = "none";        // Ficha search
        listTitle.innerText = "Taarifa Zako Binafsi";
        loadSingleMemberData(loggedInUserPhone);
    }
}

// Pakia mwanachama mmoja tu aliyeingia (Kwa usalama)
async function loadSingleMemberData(phone) {
    membersList.innerHTML = "<p class='text-center'>Inapakia taarifa zako...</p>";
    const { data, error } = await _supabase
        .from('members')
        .select('*')
        .eq('phone', phone);

    if (data && data.length > 0) {
        displayMembers(data);
    } else {
        membersList.innerHTML = "<p class='text-danger'>Hitilafu imetokea kupata data zako.</p>";
    }
}

// Pakia wanachama wote (Kwa ajili ya Katibu tu)
async function loadAllMembersData() {
    membersList.innerHTML = "<p class='text-center'>Inapakia wanachama wote...</p>";
    const { data, error } = await _supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true });

    if (data) {
        displayMembers(data);
        // Piga hesabu za jumla hapa kwa ajili ya Katibu
        calculateTotals(data);
    }
}

function displayMembers(array) {
    membersList.innerHTML = "";
    array.forEach(m => {
        const div = document.createElement("div");
        div.className = "col-md-6 col-lg-4";
        div.innerHTML = `
            <div class="card member-card p-3">
                <div class="card-header-custom">
                    <span>ID: ${m.id}</span>
                    <span class="text-secondary">${m.name}</span>
                </div>
                <div class="card-body">
                    <div class="summary-badge">Simu: <span>${m.phone || 'Haina'}</span></div>
                    <div class="summary-badge">Mrithi: <span>${m.guardian || 'Hana'}</span></div>
                    <div class="summary-badge">Hisa za Awali: <span>${m.hisa_anzia || 0} TSh</span></div>
                </div>
            </div>
        `;
        membersList.appendChild(div);
    });
}

function calculateTotals(data) {
    let totHisa = 0;
    data.forEach(m => { totHisa += Number(m.hisa_anzia || 0); });
    document.getElementById("totalHisa").innerText = totHisa + " TSh";
}

// LOGOUT LOGIC
document.getElementById("btnLogout").addEventListener("click", () => {
    window.location.reload();
});
