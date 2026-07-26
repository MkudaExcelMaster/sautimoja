// CND ya Supabase lazima iwe kwenye index.html au uimport Supabase client
const SUPABASE_URL = "https://nkdvoqbbzgjdkvvccbej.supabase.co";
const SUPABASE_KEY = "sb_publishable__6o1FK6fIdXD9st9G8QJ9w_ZLqH6lxC";

// Kuanzisha Supabase Client
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const membersContainer = document.getElementById("membersContainer");
let membersData = JSON.parse(localStorage.getItem("membersData")) || {};

/* =====================================
   FORMAT NUMBER
===================================== */
function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

/* =====================================
   LOAD MEMBERS FROM EXCEL (wanakikundi.xlsx)
==================================== */
async function loadMembersFromExcel() {
    // Kama tayari kuna data kwenye localStorage, tunaruka kusoma Excel ili kuzuia overwrite
    if (Object.keys(membersData).length > 0) {
        initializeApp();
        return;
    }

    try {
        // Soma faili la Excel lililopo kwenye folda moja na system files
        const response = await fetch("wanakikundi.xlsx");
        if (!response.ok) throw new Error("Faili la wanakikundi.xlsx halijapatikana kwenye folda husika.");
        
        const arrayBuffer = await response.arrayBuffer();

        if (typeof XLSX === "undefined") {
            console.error("Maktaba ya SheetJS (XLSX) haijapakiwa kwenye index.html!");
            initializeApp();
            return;
        }

        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Geuza rows zote kuwa Array ya Objects
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach(row => {
            // MABORESHO: Kusoma headers zako hasa kama zilivyo (ID, JINA, SIMU...)
            const rawId = row["ID"] || row["id"];
            if (!rawId) return;
            
            // Format ID iwe tarakimu 3 mfano "001"
            const memberId = String(rawId).padStart(3, "0");

            membersData[memberId] = {
                name: row["JINA"] || row["Jina"] || "",
                phone: row["SIMU"] || row["Simu"] || "",
                gender: row["JINSIA"] || row["Jinsia"] || "", 
                joinDate: row["TAREHE YA KUJIUNGA"] || "",      
                birthDate: row["TAREHE YA KUZALIWA"] || "",
                mrithi: row["JINA LA MRITHI"] || "",
                photo: "",

                // Anzisha hesabu za fedha zikiwa 0
                hisaAnzia: 0, afya: 0, jamii: 0, faini1: 0, faini2: 0, faini3: 0,
                mkopoHisa: 0, hisaLipwa: 0, mkopoJamii: 0, jamiiLipwa: 0
            };
        });

        // Hifadhi data zilizopatikana kwenye LocalStorage ya kivinjari
        localStorage.setItem("membersData", JSON.stringify(membersData));
        console.log("Data za Excel zimepakiwa kikamilifu kulingana na muundo wako!");
        initializeApp();

    } catch (error) {
        console.warn("Ilani: " + error.message + " Mfumo unafungua data tupu.");
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

        // Logic ya kushughulikia picha isipokuwepo (weka picha tupu au avatar)
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
                <button class="save-member" style="background-color: #10B981; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; margin-top: 10px; width: 100%;">💾 Funga & Fanya Mabadiliko ya Leo</button>
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

function saveBasicInfo(card) {
    const memberId = card.getAttribute("data-member");
    if (!membersData[memberId]) membersData[memberId] = {};

    membersData[memberId].name = card.querySelector(".member-name").value;
    membersData[memberId].phone = card.querySelector(".member-phone").value;
    membersData[memberId].gender = card.querySelector(".member-gender").value;
    membersData[memberId].joinDate = card.querySelector(".join-date").value;
    membersData[memberId].birthDate = card.querySelector(".member-birthdate").value;
    membersData[memberId].mrithi = card.querySelector(".member-mrithi").value;

    localStorage.setItem("membersData", JSON.stringify(membersData));
}

/* =====================================
   PROCESS TODAY'S DATA
===================================== */
function processTodayData(memberId) {
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

    membersData[memberId] = {
        ...existing,
        name: card.querySelector(".member-name").value,
        phone: card.querySelector(".member-phone").value,
        gender: card.querySelector(".member-gender").value,
        joinDate: card.querySelector(".join-date").value,
        birthDate: card.querySelector(".member-birthdate").value,
        mrithi: card.querySelector(".member-mrithi").value,
        
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

    localStorage.setItem("membersData", JSON.stringify(membersData));

    // Sasisha fomu ya "Hisa Anzia" ionyeshe thamani mpya
    card.querySelector(".hisaAnzia").value = membersData[memberId].hisaAnzia;

    // Kusafisha input za leo zirudi kuwa 0
    card.querySelectorAll(".grid input:not(.hisaAnzia)").forEach(input => input.value = 0);

    calculateMember(card);
    updateDashboard();

    alert(`Mabadiliko ya Mwanakikundi ${memberId} yamefungwa!`);
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

    // MABORESHO YA CASH FLOW:
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

function saveAllData() {
    document.querySelectorAll(".member-card").forEach(card => {
        const memberId = card.getAttribute("data-member");
        const inputHisa = Number(card.querySelector(".hisaWiki").value || 0);
        const inputAfya = Number(card.querySelector(".afya").value || 0);
        const inputJamii = Number(card.querySelector(".jamii").value || 0);
        const inputFaini1 = Number(card.querySelector(".faini1").value || 0);
        const inputFaini2 = Number(card.querySelector(".faini2").value || 0);
        const inputFaini3 = Number(card.querySelector(".faini3").value || 0);
        const inputMkopoHisa = Number(card.querySelector(".mkopoHisa").value || 0);
        const inputHisaLipwa = Number(card.querySelector(".hisaLipwa").value || 0);
        const inputMkopoJamii = Number(card.querySelector(".mkopoJamii").value || 0);
        const inputJamiiLipwa = Number(card.querySelector(".jamiiLipwa").value || 0);

        if(inputHisa > 0 || inputAfya > 0 || inputJamii > 0 || inputFaini1 > 0 || inputFaini2 > 0 || inputFaini3 > 0 || inputMkopoHisa > 0 || inputHisaLipwa > 0 || inputMkopoJamii > 0 || inputJamiiLipwa > 0) {
            processTodayData(memberId);
        }
    });
    alert("Data zote zilizoingizwa leo zimefungwa rasmi!");
}

function savePhoto(event, memberId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        if (!membersData[memberId]) membersData[memberId] = {};
        try {
            membersData[memberId].photo = e.target.result;
            localStorage.setItem("membersData", JSON.stringify(membersData));
            document.getElementById(`photo-${memberId}`).src = e.target.result;
        } catch (error) {
            alert("LocalStorage imejaa! Picha hii ni kubwa mno.");
        }
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

function backupData() {
    const data = JSON.stringify(membersData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SAUTI_MOJA_BACKUP.json";
    a.click();
    URL.revokeObjectURL(url);
}

function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            membersData = JSON.parse(e.target.result);
            localStorage.setItem("membersData", JSON.stringify(membersData));
            alert("Backup imerudishwa. Mfumo uta-refresh.");
            location.reload();
        } catch (error) {
            alert("Faili si sahihi.");
        }
    };
    reader.readAsText(file);
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
    // MABORESHO: Tunapiga hesabu kadi zote baada ya fomu kuandaliwa vizuri kwenye DOM
    document.querySelectorAll(".member-card").forEach(card => {
        calculateMember(card);
    });
    updateDashboard();
}

// Mfumo unaanza kwa kusoma faili la Excel kwanza
window.addEventListener("DOMContentLoaded", loadMembersFromExcel);
