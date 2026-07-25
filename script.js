// =====================================
// SUPABASE CONFIGURATION
// =====================================
const SUPABASE_URL = "https://nkdvoqbbzgjdkvvccbej.supabase.co";
const SUPABASE_KEY = "sb_publishable__6o1FK6fIdXD9st9G8QJ9w_ZLqH6lxC";

// Hakikisha Supabase Client inaanzishwa salama
let supabase;
if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let membersData = {};

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

/* =====================================
   FETCH MEMBERS FROM SUPABASE
===================================== */
async function loadMembersFromSupabase() {
    try {
        if (!supabase) return initializeApp();
        
        const { data, error } = await supabase.from('members').select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            membersData = {};
            data.forEach(m => {
                membersData[m.id] = {
                    name: m.name || "",
                    phone: m.phone || "",
                    gender: m.gender || "",
                    joinDate: m.join_date || "",
                    birthDate: m.birth_date || "",
                    mrithi: m.mrithi || "",
                    photo: m.photo || "",
                    hisaAnzia: m.hisa_anzia || 0,
                    afya: m.afya || 0,
                    jamii: m.jamii || 0,
                    faini1: m.faini1 || 0,
                    faini2: m.faini2 || 0,
                    faini3: m.faini3 || 0,
                    mkopoHisa: m.mkopo_hisa || 0,
                    hisaLipwa: m.hisa_lipwa || 0,
                    mkopoJamii: m.mkopo_jamii || 0,
                    jamiiLipwa: m.jamii_lipwa || 0
                };
            });
        }
        initializeApp();
    } catch (err) {
        console.error("Error loading from Supabase:", err.message);
        initializeApp();
    }
}

/* =====================================
   LOGIN & SECURITY
===================================== */
function checkLogin() {
    const session = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const loginPage = document.getElementById("loginPage");
    const mainPage = document.getElementById("mainPage");
    const adminPanel = document.getElementById("adminPanel");
    const roleBadge = document.getElementById("roleBadge");

    if (!session) {
        if (loginPage) loginPage.style.display = "block";
        if (mainPage) mainPage.style.display = "none";
        return false;
    } else {
        if (loginPage) loginPage.style.display = "none";
        if (mainPage) mainPage.style.display = "block";
        
        const isAdmin = session.role === "admin";
        if (adminPanel) adminPanel.style.display = isAdmin ? "block" : "none";
        
        if (roleBadge) {
            roleBadge.textContent = isAdmin ? "KATIBU (ADMIN)" : "MWANACHAMA";
            roleBadge.className = `badge position-absolute top-0 end-0 m-3 p-2 ${isAdmin ? 'bg-danger' : 'bg-success'}`;
        }
        return true;
    }
}

function login(event) {
    if (event) event.preventDefault();
    
    const userRole = document.getElementById("userRole") ? document.getElementById("userRole").value : "mwanachama";
    const passwordInput = document.getElementById("loginPassword") ? document.getElementById("loginPassword").value.trim() : "";
    const loginError = document.getElementById("loginError");

    if (userRole === "katibu") {
        if (passwordInput === "holili2026") { 
            sessionStorage.setItem("loggedInUser", JSON.stringify({ role: "admin", id: "katibu" }));
            if (loginError) loginError.style.display = "none";
            checkLogin();
            createMembersCards();
            updateDashboard();
        } else {
            if (loginError) loginError.style.display = "block";
        }
    } else {
        sessionStorage.setItem("loggedInUser", JSON.stringify({ role: "member", id: "mwanachama" }));
        if (loginError) loginError.style.display = "none";
        checkLogin();
        createMembersCards();
        updateDashboard();
    }
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.reload();
}

/* =====================================
   UI BUILDER
===================================== */
function createMembersCards() {
    const membersList = document.getElementById("membersList");
    if (!membersList) return;
    
    membersList.innerHTML = "";
    const session = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!session) return;

    const fragment = document.createDocumentFragment();
    const isAdmin = session.role === "admin";

    const memberKeys = Object.keys(membersData).length > 0 ? Object.keys(membersData) : Array.from({length: 10}, (_, i) => String(i + 1).padStart(3, "0"));

    memberKeys.forEach(memberId => {
        const data = membersData[memberId] || {};
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-4";

        const imageSrc = data.photo ? data.photo : "https://via.placeholder.com/100";

        col.innerHTML = `
        <div class="member-card card h-100" data-member="${memberId}">
            <div class="card-header-custom">
                <span>ID: ${memberId}</span>
                <span class="badge bg-primary">${data.gender || 'Mwanachama'}</span>
            </div>
            <div class="card-body">
                <img src="${imageSrc}" alt="Photo" class="member-photo">
                <h5 class="card-title text-center fw-bold mb-3">${data.name || 'Mwanakikundi ' + memberId}</h5>
                
                <div class="summary-badge"><span>Simu:</span> <span>${data.phone || 'N/A'}</span></div>
                <div class="summary-badge"><span>Mrithi:</span> <span>${data.mrithi || 'N/A'}</span></div>
                
                <hr>
                
                <div class="results-grid">
                    <div class="summary-badge"><span>Jumla ya Hisa:</span> <span class="resultTotalShares text-primary fw-bold">0 TSh</span></div>
                    <div class="summary-badge"><span>Jumla ya Afya:</span> <span class="resultHealth text-success fw-bold">0 TSh</span></div>
                    <div class="summary-badge"><span>Jumla ya Jamii:</span> <span class="resultCommunity text-info fw-bold">0 TSh</span></div>
                    <div class="summary-badge"><span>Jumla ya Faini:</span> <span class="resultFines text-danger fw-bold">0 TSh</span></div>
                    <div class="summary-badge"><span>Deni Hisa:</span> <span class="resultDebtShares text-warning fw-bold">0 TSh</span></div>
                    <div class="summary-badge"><span>Deni Jamii:</span> <span class="resultDebtCommunity text-warning fw-bold">0 TSh</span></div>
                </div>

                ${isAdmin ? `
                <button class="btn btn-sm btn-outline-success w-100 mt-3 btn-enter-data" data-bs-toggle="modal" data-bs-target="#dataModal" data-id="${memberId}">
                    <i class="fa-solid fa-plus-circle"></i> Ingiza Data za Leo
                </button>
                ` : ''}
            </div>
        </div>`;

        fragment.appendChild(col);
    });
    
    membersList.appendChild(fragment);
    document.querySelectorAll(".member-card").forEach(calculateMemberCard);
}

/* =====================================
   SAVE DATA TO SUPABASE
===================================== */
async function processTodayData(event) {
    if(event) event.preventDefault();
    
    const memberId = document.getElementById("dataMemberId")?.value;
    if (!memberId) return;

    const existing = membersData[memberId] || {};

    const leoHisa = Number(document.getElementById("d_hisa")?.value || 0);
    const leoAfya = Number(document.getElementById("d_afya")?.value || 0);
    const leoJamii = Number(document.getElementById("d_jamii")?.value || 0);
    const leoFaini1 = Number(document.getElementById("d_faini1")?.value || 0);
    const leoFaini2 = Number(document.getElementById("d_faini2")?.value || 0);
    const leoFaini3 = Number(document.getElementById("d_faini3")?.value || 0);
    const leoMkopoHisa = Number(document.getElementById("d_mkopo_hisa")?.value || 0);
    const leoHisaLipwa = Number(document.getElementById("d_hisa_lipwa")?.value || 0);
    const leoMkopoJamii = Number(document.getElementById("d_mkopo_jamii")?.value || 0);
    const leoJamiiLipwa = Number(document.getElementById("d_jamii_lipwa")?.value || 0);

    const payload = {
        id: memberId,
        name: existing.name || `Mwanakikundi ${memberId}`,
        phone: existing.phone || "",
        gender: existing.gender || "",
        join_date: existing.joinDate || "",
        birth_date: existing.birthDate || "",
        mrithi: existing.mrithi || "",
        hisa_anzia: (existing.hisaAnzia || 0) + leoHisa,
        afya: (existing.afya || 0) + leoAfya,
        jamii: (existing.jamii || 0) + leoJamii,
        faini1: (existing.faini1 || 0) + leoFaini1,
        faini2: (existing.faini2 || 0) + leoFaini2,
        faini3: (existing.faini3 || 0) + leoFaini3,
        mkopo_hisa: (existing.mkopoHisa || 0) + leoMkopoHisa,
        hisa_lipwa: (existing.hisaLipwa || 0) + leoHisaLipwa,
        mkopo_jamii: (existing.mkopoJamii || 0) + leoMkopoJamii,
        jamii_lipwa: (existing.jamiiLipwa || 0) + leoJamiiLipwa
    };

    if (supabase) {
        const { error } = await supabase.from('members').upsert([payload]);
        if (error) {
            alert("Imeshindikana kuhifadhi Supabase: " + error.message);
            return;
        }
    }

    alert(`Taarifa za Mwanakikundi ${memberId} zimehifadhiwa Live!`);
    
    const modalEl = document.getElementById('dataModal');
    if (window.bootstrap && modalEl) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if(modal) modal.hide();
    }
    
    loadMembersFromSupabase();
}

/* =====================================
   CALCULATIONS & DASHBOARD
===================================== */
function calculateMemberCard(card) {
    const memberId = card.getAttribute("data-member");
    const db = membersData[memberId] || {};

    const totalShares = (db.hisaAnzia || 0);
    const totalHealth = (db.afya || 0);
    const totalCommunity = (db.jamii || 0);
    const totalFines = (db.faini1 || 0) + (db.faini2 || 0) + (db.faini3 || 0);
    
    const debtShares = (db.mkopoHisa || 0) - (db.hisaLipwa || 0);
    const debtCommunity = (db.mkopoJamii || 0) - (db.jamiiLipwa || 0);

    const setTxt = (cls, val) => {
        const el = card.querySelector(cls);
        if (el) el.textContent = formatNumber(val) + " TSh";
    };

    setTxt(".resultTotalShares", totalShares);
    setTxt(".resultHealth", totalHealth);
    setTxt(".resultCommunity", totalCommunity);
    setTxt(".resultFines", totalFines);
    setTxt(".resultDebtShares", debtShares);
    setTxt(".resultDebtCommunity", debtCommunity);
}

function updateDashboard() {
    let rawShares = 0, health = 0, rawCommunity = 0, fines = 0;
    let loanShares = 0, sharesPaid = 0, loanCommunity = 0, communityPaid = 0;

    Object.values(membersData).forEach(m => {
        rawShares += (m.hisaAnzia || 0);
        health += (m.afya || 0);
        rawCommunity += (m.jamii || 0);
        fines += (m.faini1 || 0) + (m.faini2 || 0) + (m.faini3 || 0);
        loanShares += (m.mkopoHisa || 0);
        sharesPaid += (m.hisaLipwa || 0);
        loanCommunity += (m.mkopoJamii || 0);
        communityPaid += (m.jamiiLipwa || 0);
    });

    const setDash = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatNumber(val) + " TSh";
    };

    setDash("totalHisa", rawShares);
    setDash("totalAfya", health);
    setDash("totalJamii", rawCommunity);
    setDash("totalFaini", fines);

    setDash("grandTotalMkopo", loanShares + loanCommunity);
    setDash("totalMkopoHisa", loanShares);
    setDash("totalMkopoJamii", loanCommunity);

    setDash("grandTotalLipwa", sharesPaid + communityPaid);
    setDash("totalHisaLipwa", sharesPaid);
    setDash("totalJamiiLipwa", communityPaid);

    setDash("grandTotalDeni", (loanShares - sharesPaid) + (loanCommunity - communityPaid));
    setDash("totalBakiHisa", loanShares - sharesPaid);
    setDash("totalBakiJamii", loanCommunity - communityPaid);
}

/* =====================================
   EVENT LISTENERS & EXPORT EXCEL
===================================== */
document.addEventListener("DOMContentLoaded", () => {
    const userRoleSelect = document.getElementById("userRole");
    const passwordField = document.getElementById("passwordField");
    
    if (userRoleSelect && passwordField) {
        userRoleSelect.addEventListener("change", function () {
            if (this.value === "katibu") {
                passwordField.style.display = "block";
            } else {
                passwordField.style.display = "none";
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }

    document.getElementById("btnLogout")?.addEventListener("click", logout);
    document.getElementById("btnExport")?.addEventListener("click", exportExcel);
    document.getElementById("btnPrint")?.addEventListener("click", () => window.print());
    document.getElementById("dataForm")?.addEventListener("submit", processTodayData);

    const dataModal = document.getElementById('dataModal');
    if (dataModal) {
        dataModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const memberId = button.getAttribute('data-id');
            const hiddenInput = document.getElementById('dataMemberId');
            if (hiddenInput) hiddenInput.value = memberId;
        });
    }

    document.getElementById("searchInput")?.addEventListener("input", function (e) {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll(".member-card").forEach(card => {
            const text = card.textContent.toLowerCase();
            card.parentElement.style.display = text.includes(term) ? "block" : "none";
        });
    });

    loadMembersFromSupabase();
});

async function exportExcel() {
    if (typeof XLSX === "undefined") return alert("SheetJS haijapatikana!");
    const headers = ["ID", "Jina", "Simu", "Jinsia", "Tarehe ya Kuzaliwa", "Jina la Mrithi", "Tarehe ya Kujiunga", "Jumla Hisa", "Afya", "Jamii", "Faini I", "Faini II", "Faini III", "Mkopo Hisa", "Hisa Lipwa", "Mkopo Jamii", "Jamii Lipwa", "Baki Mkopo Hisa", "Baki Mkopo Jamii", "Jumla ya Deni Kuu"];
    const rows = [["SAUTI MOJA VIJANA GROUP HOLILI"], ["TAARIFA ZA WANAKIKUNDI"], [`TAREHE: ${new Date().toLocaleDateString("sw-TZ")}`], [], headers];

    Object.entries(membersData).forEach(([id, m]) => {
        const debtShares = (m.mkopoHisa || 0) - (m.hisaLipwa || 0);
        const debtCommunity = (m.mkopoJamii || 0) - (m.jamiiLipwa || 0);
        rows.push([id, m.name, m.phone, m.gender, m.birthDate, m.mrithi, m.joinDate, m.hisaAnzia, m.afya, m.jamii, m.faini1, m.faini2, m.faini3, m.mkopoHisa, m.hisaLipwa, m.mkopoJamii, m.jamiiLipwa, debtShares, debtCommunity, debtShares + debtCommunity]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wanakikundi");
    XLSX.writeFile(workbook, "SAUTI_MOJA_WANAKIKUNDI.xlsx");
}

function initializeApp() {
    if (!checkLogin()) return;
    createMembersCards();
    updateDashboard();
}
