// =====================================
// SUPABASE CONFIGURATION
// =====================================
const SUPABASE_URL = "https://nkdvoqbbzgjdkvvccbej.supabase.co";
const SUPABASE_KEY = "sb_publishable__6o1FK6fIdXD9st9G8QJ9w_ZLqH6lxC";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const membersContainer = document.getElementById("membersContainer");
let membersData = {};

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

/* =====================================
   FETCH MEMBERS FROM SUPABASE (LIVE DATA)
===================================== */
async function loadMembersFromSupabase() {
    try {
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
    const loginSection = document.getElementById("loginSection");
    const mainContent = document.getElementById("mainContent");

    if (!session) {
        if (loginSection) loginSection.style.display = "block";
        if (mainContent) mainContent.style.display = "none";
        return false;
    } else {
        if (loginSection) loginSection.style.display = "none";
        if (mainContent) mainContent.style.display = "block";
        return true;
    }
}

function login(event) {
    if (event) event.preventDefault();
    const usernameInput = document.getElementById("usernameInput").value.trim().toLowerCase();
    const passwordInput = document.getElementById("passwordInput").value.trim();

    if (!usernameInput || !passwordInput) {
        alert("Tafadhali jaza ID na Neno la Siri!");
        return;
    }

    if (usernameInput === "katibu" && passwordInput === "holili2026") {
        sessionStorage.setItem("loggedInUser", JSON.stringify({ role: "admin", id: "katibu" }));
        initializeApp();
        return;
    }

    const memberId = usernameInput.padStart(3, "0");
    const member = membersData[memberId];

    if (member) {
        const cleanedDbPhone = String(member.phone || "").replace(/\s+/g, "");
        const cleanedInputPassword = passwordInput.replace(/\s+/g, "");

        if (cleanedDbPhone && cleanedDbPhone === cleanedInputPassword) {
            sessionStorage.setItem("loggedInUser", JSON.stringify({ role: "member", id: memberId }));
            initializeApp();
            return;
        }
    }

    alert("ID au Neno la Siri si sahihi!");
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    initializeApp();
}

/* =====================================
   UI BUILDER
===================================== */
function createMembersCards() {
    membersContainer.innerHTML = "";
    const session = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!session) return;

    const fragment = document.createDocumentFragment();
    const isAdmin = session.role === "admin";

    const startIdx = isAdmin ? 1 : parseInt(session.id);
    const endIdx = isAdmin ? 120 : parseInt(session.id);

    const adminControls = document.querySelectorAll(".admin-only, #searchMember, button[onclick='saveAllData()'], button[onclick='backupData()'], .backup-restore-section");
    adminControls.forEach(el => {
        if (el) el.style.display = isAdmin ? "inline-block" : "none";
    });

    for (let i = startIdx; i <= endIdx; i++) {
        const memberId = String(i).padStart(3, "0");
        const data = membersData[memberId] || {};
        const card = document.createElement("div");

        card.className = "member-card";
        card.setAttribute("data-member", memberId);

        const imageSrc = data.photo ? data.photo : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
        const disabledAttr = isAdmin ? "" : "disabled";

        card.innerHTML = `
        <div class="member-header">
            <div class="member-photo">
                <img id="photo-${memberId}" src="${imageSrc}" alt="Photo" style="width:100px; height:100px; object-fit:cover; border-radius:50%;">
            </div>
            <div class="member-info">
                <h2>Mwanakikundi ${memberId}</h2>
                <input type="text" class="member-name" placeholder="Jina la Mwanachama" value="${data.name || ''}" ${disabledAttr}>
                <input type="text" class="member-phone" placeholder="Namba ya Simu" value="${data.phone || ''}" ${disabledAttr}>
                <div style="display: flex; gap: 5px;">
                    <select class="member-gender" style="flex: 1;" ${disabledAttr}>
                        <option value="">Chagua Jinsia</option>
                        <option value="Mwanaume" ${data.gender === "Mwanaume" ? "selected" : ""}>Mwanaume</option>
                        <option value="Mwanamke" ${data.gender === "Mwanamke" ? "selected" : ""}>Mwanamke</option>
                    </select>
                    <input type="date" class="join-date" title="Tarehe ya Kujiunga" value="${data.joinDate || ''}" style="flex: 1;" ${disabledAttr}>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <input type="text" class="member-birthdate" placeholder="Tarehe ya Kuzaliwa" value="${data.birthDate || ''}" style="flex: 1;" ${disabledAttr}>
                    <input type="text" class="member-mrithi" placeholder="Jina la Mrithi" value="${data.mrithi || ''}" style="flex: 1;" ${disabledAttr}>
                </div>
                ${isAdmin ? `<input type="file" class="member-photo-input" accept="image/*" style="margin-top:5px;">` : ''}
            </div>
        </div>

        <div class="member-summary">
            <div class="member-results">
                <h3>MATOKEO YA MWANACHAMA (JUMLA KUU)</h3>
                <div class="results-grid">
                    <div class="result-item"><span>Jumla ya Hisa</span><strong class="resultTotalShares">0</strong></div>
                    <div class="result-item"><span>Jumla ya Afya</span><strong class="resultHealth">0</strong></div>
                    <div class="result-item"><span>Jumla ya Jamii</span><strong class="resultCommunity">0</strong></div>
                    <div class="result-item"><span>Jumla ya Faini</span><strong class="resultFines">0</strong></div>
                    <div class="result-item"><span>Baki Mkopo Hisa</span><strong class="resultDebtShares">0</strong></div>
                    <div class="result-item"><span>Baki Mkopo Jamii</span><strong class="resultDebtCommunity">0</strong></div>
                    <div class="result-item"><span>Jumla Mikopo</span><strong class="resultLoans">0</strong></div>
                    <div class="result-item"><span>Jumla Iliyolipwa</span><strong class="resultPaid">0</strong></div>
                    <div class="result-item"><span>Jumla Madeni</span><strong class="resultDebt">0</strong></div>
                </div>

                <h4 style="margin-top:15px; color:#2563EB;">INGIZA DATA ZA LEO / WIKI HII:</h4>
                <div class="grid">
                    <div><label>Hisa Anzia (Jumla)</label><input type="number" class="hisaAnzia" value="${data.hisaAnzia || 0}" disabled></div>
                    <div><label>Hisa ya Leo (+)</label><input type="number" class="hisaWiki" value="0" ${disabledAttr}></div>
                    <div><label>Afya ya Leo (+)</label><input type="number" class="afya" value="0" ${disabledAttr}></div>
                    <div><label>Jamii ya Leo (+)</label><input type="number" class="jamii" value="0" ${disabledAttr}></div>
                    <div><label>Faini I (+)</label><input type="number" class="faini1" value="0" ${disabledAttr}></div>
                    <div><label>Faini II (+)</label><input type="number" class="faini2" value="0" ${disabledAttr}></div>
                    <div><label>Faini III (+)</label><input type="number" class="faini3" value="0" ${disabledAttr}></div>
                    <div><label>Mkopo Hisa Mpya (+)</label><input type="number" class="mkopoHisa" value="0" ${disabledAttr}></div>
                    <div><label>Hisa Inayolipwa Leo (+)</label><input type="number" class="hisaLipwa" value="0" ${disabledAttr}></div>
                    <div><label>Mkopo Jamii Mpya (+)</label><input type="number" class="mkopoJamii" value="0" ${disabledAttr}></div>
                    <div><label>Jamii Inayolipwa Leo (+)</label><input type="number" class="jamiiLipwa" value="0" ${disabledAttr}></div>
                </div>
                ${isAdmin ? `<button class="save-member" style="background-color: #10B981; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; margin-top: 10px; width: 100%;">💾 Funga & Hifadhi Supabase Live</button>` : ''}
            </div>
        </div>`;

        fragment.appendChild(card);
    }
    membersContainer.appendChild(fragment);
}

/* =====================================
   SAVE DATA TO SUPABASE
===================================== */
async function processTodayData(memberId) {
    const card = document.querySelector(`[data-member="${memberId}"]`);
    if (!card) return;

    const existing = membersData[memberId] || {};

    const leoHisa = Number(card.querySelector(".hisaWiki").value || 0);
    const leoAfya = Number(card.querySelector(".afya").value || 0);
    const leoJamii = Number(card.querySelector(".jamii").value || 0);
    const leoFaini1 = Number(card.querySelector(".faini1").value || 0);
    const leoFaini2 = Number(card.querySelector(".faini2").value || 0);
    const leoFaini3 = Number(card.querySelector(".faini3").value || 0);
    const leoMkopoHisa = Number(card.querySelector(".mkopoHisa").value || 0);
    const leoHisaLipwa = Number(card.querySelector(".hisaLipwa").value || 0);
    const leoMkopoJamii = Number(card.querySelector(".mkopoJamii").value || 0);
    const leoJamiiLipwa = Number(card.querySelector(".jamiiLipwa").value || 0);

    const payload = {
        id: memberId,
        name: card.querySelector(".member-name").value,
        phone: card.querySelector(".member-phone").value,
        gender: card.querySelector(".member-gender").value,
        join_date: card.querySelector(".join-date").value,
        birth_date: card.querySelector(".member-birthdate").value,
        mrithi: card.querySelector(".member-mrithi").value,
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

    // Upsert to Supabase
    const { error } = await supabase.from('members').upsert([payload]);

    if (error) {
        alert("Imeshindikana kuhifadhi Supabase: " + error.message);
        return;
    }

    alert(`Taarifa za Mwanakikundi ${memberId} zimehifadhiwa Live!`);
    loadMembersFromSupabase();
}

/* =====================================
   CALCULATIONS & DASHBOARD
===================================== */
function calculateMember(card) {
    const memberId = card.getAttribute("data-member");
    const db = membersData[memberId] || {};
    const getLeo = cls => Number(card.querySelector(cls)?.value || 0);

    const totalShares = (db.hisaAnzia || 0) + getLeo(".hisaWiki");
    const totalHealth = (db.afya || 0) + getLeo(".afya");
    const totalCommunity = (db.jamii || 0) + getLeo(".jamii");
    const totalFines = (db.faini1 || 0) + (db.faini2 || 0) + (db.faini3 || 0) + getLeo(".faini1") + getLeo(".faini2") + getLeo(".faini3");
    
    const debtShares = ((db.mkopoHisa || 0) + getLeo(".mkopoHisa")) - ((db.hisaLipwa || 0) + getLeo(".hisaLipwa"));
    const debtCommunity = ((db.mkopoJamii || 0) + getLeo(".mkopoJamii")) - ((db.jamiiLipwa || 0) + getLeo(".jamiiLipwa"));
    
    const totalLoans = (db.mkopoHisa || 0) + (db.mkopoJamii || 0) + getLeo(".mkopoHisa") + getLeo(".mkopoJamii");
    const totalPaid = (db.hisaLipwa || 0) + (db.jamiiLipwa || 0) + getLeo(".hisaLipwa") + getLeo(".jamiiLipwa");
    const totalDebt = debtShares + debtCommunity;

    card.querySelector(".resultTotalShares").textContent = formatNumber(totalShares);
    card.querySelector(".resultHealth").textContent = formatNumber(totalHealth);
    card.querySelector(".resultCommunity").textContent = formatNumber(totalCommunity);
    card.querySelector(".resultFines").textContent = formatNumber(totalFines);
    card.querySelector(".resultDebtShares").textContent = formatNumber(debtShares);
    card.querySelector(".resultDebtCommunity").textContent = formatNumber(debtCommunity);
    card.querySelector(".resultLoans").textContent = formatNumber(totalLoans);
    card.querySelector(".resultPaid").textContent = formatNumber(totalPaid);
    card.querySelector(".resultDebt").textContent = formatNumber(totalDebt);
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

    const activeShares = (rawShares + sharesPaid) - loanShares;
    const activeCommunity = (rawCommunity + communityPaid) - loanCommunity;
    const sharesBalance = loanShares - sharesPaid;
    const communityBalance = loanCommunity - communityPaid;

    const setDash = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatNumber(val);
    };

    setDash("totalShares", activeShares);
    setDash("totalHealth", health);
    setDash("totalCommunity", activeCommunity);
    setDash("totalFines", fines);
    setDash("totalLoanShares", loanShares);
    setDash("totalSharesPaid", sharesPaid);
    setDash("totalSharesBalance", sharesBalance);
    setDash("totalLoanCommunity", loanCommunity);
    setDash("totalCommunityPaid", communityPaid);
    setDash("totalCommunityBalance", communityBalance);
    setDash("totalLoans", loanShares + loanCommunity);
    setDash("totalPaidLoans", sharesPaid + communityPaid);
    setDash("totalDebt", sharesBalance + communityBalance);
}

/* =====================================
   EVENT LISTENERS & EXPORT EXCEL
===================================== */
membersContainer.addEventListener("input", e => {
    const card = e.target.closest(".member-card");
    if (card) calculateMember(card);
});

membersContainer.addEventListener("click", e => {
    if (e.target.classList.contains("save-member")) {
        const card = e.target.closest(".member-card");
        processTodayData(card.getAttribute("data-member"));
    }
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
    document.querySelectorAll(".member-card").forEach(calculateMember);
    updateDashboard();
}

window.addEventListener("DOMContentLoaded", loadMembersFromSupabase);
