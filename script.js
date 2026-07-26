// CND ya Supabase lazima iwe kwenye index.html au uimport Supabase client
const SUPABASE_URL = "https://nkdvoqbbzgjdkvvccbej.supabase.co";
const SUPABASE_KEY = "sb_publishable__6o1FK6fIdXD9st9G8QJ9w_ZLqH6lxC";

// Kuanzisha Supabase Client
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const membersContainer = document.getElementById("membersContainer");
let membersData = {};

/* =====================================
   FORMAT NUMBER
===================================== */
function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

/* =====================================
   LOAD MEMBERS FROM SUPABASE (Database)
===================================== */
async function loadMembersFromSupabase() {
    try {
        console.log("Inapakua data kutoka Supabase...");
        
        // Kuvuta data zote kutoka table ya 'members'
        const { data, error } = await db
            .from("members")
            .select("*");

        if (error) {
            throw error;
        }

        membersData = {};

        if (data && data.length > 0) {
            data.forEach(row => {
                const memberId = String(row.id).padStart(3, "0");
                membersData[memberId] = {
                    name: row.name || "",
                    phone: row.phone || "",
                    gender: row.gender || "",
                    joinDate: row.joinDate || "",
                    birthDate: row.birthDate || "",
                    mrithi: row.mrithi || "",
                    photo: row.photo || "",

                    hisaAnzia: Number(row.hisaAnzia || 0),
                    afya: Number(row.afya || 0),
                    jamii: Number(row.jamii || 0),
                    faini1: Number(row.faini1 || 0),
                    faini2: Number(row.faini2 || 0),
                    faini3: Number(row.faini3 || 0),
                    mkopoHisa: Number(row.mkopoHisa || 0),
                    hisaLipwa: Number(row.hisaLipwa || 0),
                    mkopoJamii: Number(row.mkopoJamii || 0),
                    jamiiLipwa: Number(row.jamiiLipwa || 0)
                };
            });
            console.log("Data za Supabase zimepakiwa kikamilifu!");
        } else {
            console.warn("Hakuna data kwenye Supabase bado.");
        }

        initializeApp();

    } catch (error) {
        console.error("Hitilafu wakati wa kusoma Supabase:", error.message);
        alert("Imeshindwa kuvuta data kutoka mtandaoni: " + error.message);
        initializeApp();
    }
}

/* =====================================
   CREATE MEMBERS CARDS (Kujenga Kadi 120)
===================================== */
function createMembersCards() {
    membersContainer.innerHTML = ""; // Kusafisha eneo kwanza
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= 120; i++) {
        const memberId = String(i).padStart(3, "0");
        const data = membersData[memberId] || {};
        const card = document.createElement("div");

        card.className = "member-card";
        card.setAttribute("data-member", memberId);

        const imageSrc = data.photo ? data.photo : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

        card.innerHTML = `
        <div class="member-header">
            <div class="member-photo">
                <img id="photo-${memberId}" src="${imageSrc}" alt="Photo" style="width:100px; height:100px; object-fit:cover; border-radius:50%;">
            </div>
            <div class="member-info">
                <h2>Mwanakikundi ${memberId}</h2>
                <input type="text" class="member-name" placeholder="Jina la Mwanachama" value="${data.name || ''}">
                <input type="text" class="member-phone" placeholder="Namba ya Simu" value="${data.phone || ''}">
                <div style="display: flex; gap: 5px;">
                    <select class="member-gender" style="flex: 1;">
                        <option value="">Chagua Jinsia</option>
                        <option value="Mwanaume" ${data.gender === "Mwanaume" ? "selected" : ""}>Mwanaume</option>
                        <option value="Mwanamke" ${data.gender === "Mwanamke" ? "selected" : ""}>Mwanamke</option>
                    </select>
                    <input type="date" class="join-date" title="Tarehe ya Kujiunga" value="${data.joinDate || ''}" style="flex: 1;">
                </div>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <input type="text" class="member-birthdate" placeholder="Tarehe ya Kuzaliwa" value="${data.birthDate || ''}" style="flex: 1;" title="Tarehe ya Kuzaliwa">
                    <input type="text" class="member-mrithi" placeholder="Jina la Mrithi" value="${data.mrithi || ''}" style="flex: 1;" title="Jina la Mrithi">
                </div>
                <input type="file" class="member-photo-input" accept="image/*" style="margin-top:5px;">
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
                    <div><label>Hisa ya Leo (+)</label><input type="number" class="hisaWiki" value="0"></div>
                    <div><label>Afya ya Leo (+)</label><input type="number" class="afya" value="0"></div>
                    <div><label>Jamii ya Leo (+)</label><input type="number" class="jamii" value="0"></div>
                    <div><label>Faini I (+)</label><input type="number" class="faini1" value="0"></div>
                    <div><label>Faini II (+)</label><input type="number" class="faini2" value="0"></div>
                    <div><label>Faini III (+)</label><input type="number" class="faini3" value="0"></div>
                    <div><label>Mkopo Hisa Mpya (+)</label><input type="number" class="mkopoHisa" value="0"></div>
                    <div><label>Hisa Inayolipwa Leo (+)</label><input type="number" class="hisaLipwa" value="0"></div>
                    <div><label>Mkopo Jamii Mpya (+)</label><input type="number" class="mkopoJamii" value="0"></div>
                    <div><label>Jamii Inayolipwa Leo (+)</label><input type="number" class="jamiiLipwa" value="0"></div>
                </div>
                <button class="save-member" style="background-color: #10B981; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; margin-top: 10px; width: 100%;">💾 Funga & Hifadhi Supabase</button>
            </div>
        </div>`;

        fragment.appendChild(card);
    }
    membersContainer.appendChild(fragment);
}

/* =====================================
   EVENT DELEGATION
===================================== */
membersContainer.addEventListener("input", (event) => {
    const card = event.target.closest(".member-card");
    if (!card) return;
    calculateMember(card);
});

membersContainer.addEventListener("change", (event) => {
    const card = event.target.closest(".member-card");
    if (!card) return;

    if (event.target.classList.contains("member-photo-input")) {
        const memberId = card.getAttribute("data-member");
        savePhoto(event, memberId);
    } else {
        saveBasicInfo(card);
    }
});

membersContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("save-member")) {
        const card = event.target.closest(".member-card");
        const memberId = card.getAttribute("data-member");
        processTodayData(memberId);
    }
});

/* =====================================
   SAVE BASIC INFO TO SUPABASE
===================================== */
async function saveBasicInfo(card) {
    const memberId = card.getAttribute("data-member");
    if (!membersData[memberId]) membersData[memberId] = {};

    membersData[memberId].name = card.querySelector(".member-name").value;
    membersData[memberId].phone = card.querySelector(".member-phone").value;
    membersData[memberId].gender = card.querySelector(".member-gender").value;
    membersData[memberId].joinDate = card.querySelector(".join-date").value;
    membersData[memberId].birthDate = card.querySelector(".member-birthdate").value;
    membersData[memberId].mrithi = card.querySelector(".member-mrithi").value;

    // Hifadhi Taarifa za Msingi Supabase
    const { error } = await db
        .from("members")
        .upsert([{
            id: memberId,
            name: membersData[memberId].name,
            phone: membersData[memberId].phone,
            gender: membersData[memberId].gender,
            joinDate: membersData[memberId].joinDate,
            birthDate: membersData[memberId].birthDate,
            mrithi: membersData[memberId].mrithi
        }]);

    if (error) {
        console.error("Supabase Save Error:", error.message);
    }
}

/* =====================================
   PROCESS TODAY'S DATA & SAVE TO SUPABASE
===================================== */
async function processTodayData(memberId) {
    const card = document.querySelector(`[data-member="${memberId}"]`);
    if (!card) return;

    const existing = membersData[memberId] || {
        hisaAnzia: 0, afya: 0, jamii: 0, faini1: 0, faini2: 0, faini3: 0,
        mkopoHisa: 0, hisaLipwa: 0, mkopoJamii: 0, jamiiLipwa: 0
    };

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

    const updatedData = {
        id: memberId,
        name: card.querySelector(".member-name").value,
        phone: card.querySelector(".member-phone").value,
        gender: card.querySelector(".member-gender").value,
        joinDate: card.querySelector(".join-date").value,
        birthDate: card.querySelector(".member-birthdate").value,
        mrithi: card.querySelector(".member-mrithi").value,
        photo: existing.photo || "",
        
        hisaAnzia: (existing.hisaAnzia || 0) + leoHisa,
        afya: (existing.afya || 0) + leoAfya,
        jamii: (existing.jamii || 0) + leoJamii,
        faini1: (existing.faini1 || 0) + leoFaini1,
        faini2: (existing.faini2 || 0) + leoFaini2,
        faini3: (existing.faini3 || 0) + leoFaini3,
        mkopoHisa: (existing.mkopoHisa || 0) + leoMkopoHisa,
        hisaLipwa: (existing.hisaLipwa || 0) + leoHisaLipwa,
        mkopoJamii: (existing.mkopoJamii || 0) + leoMkopoJamii,
        jamiiLipwa: (existing.jamiiLipwa || 0) + leoJamiiLipwa
    };

    // Hifadhi data mpya Supabase (Upsert inahuisha iliyopo au inatengeneza mpya)
    const { error } = await db
        .from("members")
        .upsert([updatedData]);

    if (error) {
        alert("Hitilafu wakati wa kuhifadhi Supabase: " + error.message);
        return;
    }

    membersData[memberId] = updatedData;

    // Sasisha fomu ya "Hisa Anzia" ionyeshe thamani mpya
    card.querySelector(".hisaAnzia").value = membersData[memberId].hisaAnzia;

    // Kusafisha input za leo zirudi kuwa 0
    card.querySelectorAll(".grid input:not(.hisaAnzia)").forEach(input => input.value = 0);

    calculateMember(card);
    updateDashboard();

    alert(`Mabadiliko ya Mwanakikundi ${memberId} yamehifadhiwa mtandaoni (Supabase)!`);
}

/* =====================================
   CALCULATE MEMBER
===================================== */
function calculateMember(card) {
    const memberId = card.getAttribute("data-member");
    const mData = membersData[memberId] || {};
    const getLeo = cls => Number(card.querySelector(cls)?.value || 0);

    const totalShares = (mData.hisaAnzia || 0) + getLeo(".hisaWiki");
    const totalHealth = (mData.afya || 0) + getLeo(".afya");
    const totalCommunity = (mData.jamii || 0) + getLeo(".jamii");
    const totalFines = (mData.faini1 || 0) + (mData.faini2 || 0) + (mData.faini3 || 0) + getLeo(".faini1") + getLeo(".faini2") + getLeo(".faini3");
    
    const debtShares = ((mData.mkopoHisa || 0) + getLeo(".mkopoHisa")) - ((mData.hisaLipwa || 0) + getLeo(".hisaLipwa"));
    const debtCommunity = ((mData.mkopoJamii || 0) + getLeo(".mkopoJamii")) - ((mData.jamiiLipwa || 0) + getLeo(".jamiiLipwa"));
    
    const totalLoans = (mData.mkopoHisa || 0) + (mData.mkopoJamii || 0) + getLeo(".mkopoHisa") + getLeo(".mkopoJamii");
    const totalPaid = (mData.hisaLipwa || 0) + (mData.jamiiLipwa || 0) + getLeo(".hisaLipwa") + getLeo(".jamiiLipwa");
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

/* =====================================
   DASHBOARD KUU (Mfumo wa Uhasibu wa Cash Flow)
===================================== */
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
    const totalLoans = loanShares + loanCommunity;
    const totalPaid = sharesPaid + communityPaid;
    const totalDebt = sharesBalance + communityBalance;

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
    
    setDash("totalLoans", totalLoans);
    setDash("totalPaidLoans", totalPaid);
    setDash("totalDebt", totalDebt);
}

function savePhoto(event, memberId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
        if (!membersData[memberId]) membersData[memberId] = {};
        const photoData = e.target.result;
        membersData[memberId].photo = photoData;
        
        document.getElementById(`photo-${memberId}`).src = photoData;

        // Hifadhi Picha Supabase
        await db.from("members").upsert([{ id: memberId, photo: photoData }]);
    };
    reader.readAsDataURL(file);
}

function searchMember() {
    const search = document.getElementById("searchMember").value.toLowerCase();
    document.querySelectorAll(".member-card").forEach(card => {
        const id = card.getAttribute("data-member").toLowerCase();
        const name = card.querySelector(".member-name").value.toLowerCase();
        card.style.display = id.includes(search) || name.includes(search) ? "block" : "none";
    });
}

async function exportExcel() {
    if (typeof ExcelJS === "undefined") {
        alert("Maktaba ya ExcelJS haijapatikana!");
        return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Wanakikundi");
    const today = new Date().toLocaleDateString("sw-TZ");

    worksheet.mergeCells("A1:T1");
    worksheet.getCell("A1").value = "SAUTI MOJA VIJANA GROUP HOLILI";
    worksheet.mergeCells("A2:T2");
    worksheet.getCell("A2").value = "TAARIFA ZA WANAKIKUNDI";
    worksheet.mergeCells("A3:T3");
    worksheet.getCell("A3").value = `TAREHE: ${today}`;

    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Jina", key: "name", width: 30 },
        { header: "Simu", key: "phone", width: 20 },
        { header: "Jinsia", key: "gender", width: 15 },
        { header: "Tarehe ya Kuzaliwa", key: "birthDate", width: 18 },
        { header: "Jina la Mrithi", key: "mrithi", width: 25 },
        { header: "Tarehe ya Kujiunga", key: "joinDate", width: 20 },
        { header: "Jumla Hisa", key: "hisaAnzia", width: 15 },
        { header: "Afya", key: "afya", width: 12 },
        { header: "Jamii", key: "jamii", width: 12 },
        { header: "Faini I", key: "faini1", width: 12 },
        { header: "Faini II", key: "faini2", width: 12 },
        { header: "Faini III", key: "faini3", width: 12 },
        { header: "Mkopo Hisa", key: "mkopoHisa", width: 15 },
        { header: "Hisa Lipwa", key: "hisaLipwa", width: 15 },
        { header: "Mkopo Jamii", key: "mkopoJamii", width: 15 },
        { header: "Jamii Lipwa", key: "jamiiLipwa", width: 15 },
        { header: "Baki Mkopo Hisa", key: "debtShares", width: 18 },
        { header: "Baki Mkopo Jamii", key: "debtCommunity", width: 18 },
        { header: "Jumla ya Deni Kuu", key: "totalDebt", width: 18 }
    ];

    const headerRow = worksheet.getRow(5);
    headerRow.values = worksheet.columns.map(c => c.header);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.alignment = { horizontal: "center" };

    headerRow.eachCell(cell => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2563EB" } };
    });

    Object.entries(membersData).forEach(([id, m]) => {
        const debtShares = (m.mkopoHisa || 0) - (m.hisaLipwa || 0);
        const debtCommunity = (m.mkopoJamii || 0) - (m.jamiiLipwa || 0);
        const totalDebt = debtShares + debtCommunity;

        worksheet.addRow({
            id, name: m.name || "", phone: m.phone || "", gender: m.gender || "",
            birthDate: m.birthDate || "", mrithi: m.mrithi || "", joinDate: m.joinDate || "",
            hisaAnzia: m.hisaAnzia || 0, afya: m.afya || 0, jamii: m.jamii || 0,
            faini1: m.faini1 || 0, faini2: m.faini2 || 0, faini3: m.faini3 || 0,
            mkopoHisa: m.mkopoHisa || 0, hisaLipwa: m.hisaLipwa || 0,
            mkopoJamii: m.mkopoJamii || 0, jamiiLipwa: m.jamiiLipwa || 0,
            debtShares, debtCommunity, totalDebt
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SAUTI_MOJA_WANAKIKUNDI.xlsx";
    link.click();
}

/* =====================================
   INITIALIZE APP RUNNER
===================================== */
function initializeApp() {
    createMembersCards();
    document.querySelectorAll(".member-card").forEach(card => {
        calculateMember(card);
    });
    updateDashboard();
}

// Mfumo unapoanza, unasoma data kutoka Supabase
window.addEventListener("DOMContentLoaded", loadMembersFromSupabase);
