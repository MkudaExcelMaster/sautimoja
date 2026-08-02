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
                    joinDate: row.created_at || row.updated_at || "",
                    birthDate: row.dob || "",
                    mrithi: row.guardian || "",
                    photo: row.photo_url || "",

                    hisaAnzia: Number(row.hisa_anzia || 0),
                    afya: Number(row.afya_leo || 0),
                    jamii: Number(row.jamii_leo || 0),
                    faini1: Number(row.faini_1 || 0),
                    faini2: Number(row.faini_2 || 0),
                    faini3: Number(row.faini_3 || 0),
                    mkopoHisa: Number(row.mkopo_hisa_mpya || 0),
                    hisaLipwa: Number(row.hisa_inayolipwa_leo || 0),
                    mkopoJamii: Number(row.mkopo_jamii_mpya || 0),
                    jamiiLipwa: Number(row.jamii_inayolipwa_leo || 0)
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

        const imageSrc = data.photo 
            ? data.photo 
            : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

        // Format Tarehe (ISO timestamp -> YYYY-MM-DD)
        const formattedJoinDate = data.joinDate ? String(data.joinDate).split('T')[0] : '';
        const formattedBirthDate = data.birthDate ? String(data.birthDate).split('T')[0] : '';

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
                        <input type="date" class="join-date" title="Tarehe ya Kujiunga" value="${formattedJoinDate}" style="flex: 1;">
                    </div>
                    <div style="display: flex; gap: 5px; margin-top: 5px;">
                        <input type="date" class="member-birthdate" placeholder="Tarehe ya Kuzaliwa" value="${formattedBirthDate}" style="flex: 1;" title="Tarehe ya Kuzaliwa">
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
    const rawId = String(parseInt(memberId, 10)); // Ondoa leading zeros kwa ajili ya DB
    if (!membersData[memberId]) membersData[memberId] = {};

    membersData[memberId].name = card.querySelector(".member-name").value;
    membersData[memberId].phone = card.querySelector(".member-phone").value;
    membersData[memberId].gender = card.querySelector(".member-gender").value;
    
    const dobValue = card.querySelector(".member-birthdate").value;
    membersData[memberId].birthDate = dobValue;
    membersData[memberId].mrithi = card.querySelector(".member-mrithi").value;

    const { error } = await db
        .from("members")
        .upsert([{
            id: rawId,
            name: membersData[memberId].name,
            phone: membersData[memberId].phone,
            gender: membersData[memberId].gender,
            dob: dobValue ? dobValue : null, // Zuia kosa la string tupu ""
            guardian: membersData[memberId].mrithi
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

    const rawId = String(parseInt(memberId, 10)); // DB inatumia ID kama '1', '10' badala ya '001'

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

    const updatedDataLocal = {
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

    const dobValue = card.querySelector(".member-birthdate").value;

    const payloadSupabase = {
        id: rawId,
        name: card.querySelector(".member-name").value,
        phone: card.querySelector(".member-phone").value,
        gender: card.querySelector(".member-gender").value,
        dob: dobValue ? dobValue : null, // Zuia tarehe kuleta error 400
        guardian: card.querySelector(".member-mrithi").value,
        photo_url: existing.photo || "",
        
        hisa_anzia: updatedDataLocal.hisaAnzia,
        afya_leo: updatedDataLocal.afya,
        jamii_leo: updatedDataLocal.jamii,
        faini_1: updatedDataLocal.faini1,
        faini_2: updatedDataLocal.faini2,
        faini_3: updatedDataLocal.faini3,
        mkopo_hisa_mpya: updatedDataLocal.mkopoHisa,
        hisa_inayolipwa_leo: updatedDataLocal.hisaLipwa,
        mkopo_jamii_mpya: updatedDataLocal.mkopoJamii,
        jamii_inayolipwa_leo: updatedDataLocal.jamiiLipwa,
        updated_at: new Date().toISOString()
    };

    // Hifadhi Supabase
    const { error } = await db
        .from("members")
        .upsert([payloadSupabase]);

    if (error) {
        alert("Hitilafu wakati wa kuhifadhi Supabase: " + error.message);
        return;
    }

    // Sasisha local memory
    membersData[memberId] = {
        ...membersData[memberId],
        ...updatedDataLocal,
        name: payloadSupabase.name,
        phone: payloadSupabase.phone,
        gender: payloadSupabase.gender,
        birthDate: payloadSupabase.dob,
        mrithi: payloadSupabase.guardian
    };

    // Sasisha fomu ya "Hisa Anzia"
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
   DASHBOARD KUU
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

        const rawId = String(parseInt(memberId, 10));
        await db.from("members").upsert([{ id: rawId, photo_url: photoData }]);
    };
    reader.readAsDataURL(file);
}

function searchMember() {
    // Kagua ikiwa mtumiaji aliyeingia ni Admin
    const isAdmin = currentUser && currentUser.role === "admin";
    if (!isAdmin) return; // Kama siyo Admin, search haifanyi kazi

    const searchInput = document.getElementById("searchMember");
    if (!searchInput) return;

    const search = searchInput.value.toLowerCase();
    document.querySelectorAll(".member-card").forEach(card => {
        const id = card.getAttribute("data-member") ? card.getAttribute("data-member").toLowerCase() : "";
        const nameInput = card.querySelector(".member-name");
        const name = nameInput ? nameInput.value.toLowerCase() : "";
        
        card.style.display = id.includes(search) || name.includes(search) ? "block" : "none";
    });
}

function initializeApp() {
    createMembersCards();

    // Kuhesabu upya kila kadi wakati wa kuanza
    document.querySelectorAll(".member-card").forEach(card => {
        calculateMember(card);
    });

    updateDashboard();
}

/* =====================================
   MFUMO WA LOGIN NA UTAMBULISHO (ROLES)
===================================== */
let currentUser = null;

async function handleLogin() {
    const inputUser = document.getElementById("loginUsername").value.trim();
    const inputPass = document.getElementById("loginPassword").value.trim();

    if (!inputUser || !inputPass) {
        alert("Tafadhali ingiza Namba ya simu au Jina na Password!");
        return;
    }

    try {
        // Tumia RPC function tuliyoitengeneza Supabase
        const { data, error } = await db.rpc('check_member_login', {
            user_input: inputUser,
            user_pass: inputPass
        });

        if (error || !data || data.length === 0) {
            alert("Mtumiaji au Neno la siri (Password) siyo sahihi!");
            return;
        }

        const user = data[0];

        // Login Imefanikiwa
        currentUser = user;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("appSection").style.display = "block";
        document.getElementById("currentUserInfo").textContent = `Umeingia kama: ${user.name || 'Mwanakikundi'} (${user.role === 'admin' ? 'ADMIN' : 'MEMBER'})`;

        // Zichore au zivute kadi kutoka Supabase
        await loadMembersFromSupabase();

        // Rekebisha Muonekano wa kadi kulingana na Role
        applyRolePermissions();

    } catch (err) {
        alert("Hitilafu wakati wa kuingia: " + err.message);
        }
}

function applyRolePermissions() {
    const isAdmin = currentUser && currentUser.role === "admin";
    const searchInput = document.getElementById("searchMember");
    
    // Njia sahihi ya kuipata Dashboard Kuu pekee
    const dashboardSection = document.querySelector(".dashboard-container");

    if (!isAdmin) {
        // 1. Ficha Dashboard Kuu kwa Member
        if (dashboardSection) {
            dashboardSection.style.display = "none";
        }

        // 2. Ficha batani zote za Admin (Export, Backup, Funga Data)
        document.querySelectorAll(".controls-container button").forEach(btn => btn.style.display = "none");
        
        // 3. Kuzuia na kulemaza kisanduku cha Search kwa Member
        if (searchInput) {
            searchInput.value = "";
            searchInput.disabled = true;
            searchInput.placeholder = "Kutafuta kumeruhusiwa kwa Admin pekee";
        }

        // 4. Weka format ya ID ya Mwanachama
        const formattedIdWithZeros = String(currentUser.id).padStart(3, "0");
        const rawIdString = String(currentUser.id);

        // 5. Onyesha kadi ya mwanachama pekee na kulemaza inputs zote
        document.querySelectorAll(".member-card").forEach(card => {
            const cardId = card.getAttribute("data-member");
            
            if (cardId === formattedIdWithZeros || cardId === rawIdString) {
                card.style.display = "block";
                card.querySelectorAll("input, select, textarea, button").forEach(element => {
                    element.disabled = true;
                });
            } else {
                card.style.display = "none";
            }
        });
    } else {
        // Kama ni Admin: Onyesha Dashboard Kuu
        if (dashboardSection) {
            dashboardSection.style.display = "block";
        }

        if (searchInput) {
            searchInput.disabled = false;
            searchInput.placeholder = "Tafuta Mwanachama...";
        }

        document.querySelectorAll(".member-card").forEach(card => {
            card.style.display = "block";
            card.querySelectorAll("input, select, textarea, button").forEach(element => element.disabled = false);
        });

        document.querySelectorAll(".controls-container button").forEach(btn => btn.style.display = "inline-block");
    }
}

function handleLogout() {
    currentUser = null;
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
}

/* =====================================
   SAVE ALL DATA (FUNGA DATA ZOTE ZA LEO)
===================================== */
async function saveAllData() {
    try {
        const cards = document.querySelectorAll(".member-card");
        let saveCount = 0;

        for (const card of cards) {
            const memberId = card.getAttribute("data-member");
            if (!memberId) continue;

            const name = card.querySelector(".member-name")?.value || "";
            const phone = card.querySelector(".member-phone")?.value || "";
            const gender = card.querySelector(".member-gender")?.value || "";
            let dob = card.querySelector(".member-birthdate")?.value || null;
            if (dob === "") dob = null; // Zuia Error ya Invalid Date Syntax

            const guardian = card.querySelector(".member-mrithi")?.value || "";
            const photoUrl = card.querySelector(`#photo-${memberId}`)?.src || "";

            const hisaAnzia = Number(card.querySelector(".hisaAnzia")?.value || 0);
            const afyaLeo = Number(card.querySelector(".afya")?.value || 0);
            const jamiiLeo = Number(card.querySelector(".jamii")?.value || 0);
            const faini1 = Number(card.querySelector(".faini1")?.value || 0);
            const faini2 = Number(card.querySelector(".faini2")?.value || 0);
            const faini3 = Number(card.querySelector(".faini3")?.value || 0);
            const mkopoHisaMpya = Number(card.querySelector(".mkopoHisa")?.value || 0);
            const hisaInayolipwaLeo = Number(card.querySelector(".hisaLipwa")?.value || 0);
            const mkopoJamiiMpya = Number(card.querySelector(".mkopoJamii")?.value || 0);
            const jamiiInayolipwaLeo = Number(card.querySelector(".jamiiLipwa")?.value || 0);

            const { error } = await db.from("members").upsert({
                id: parseInt(memberId, 10),
                name,
                phone,
                gender,
                dob,
                guardian,
                photo_url: photoUrl,
                hisa_anzia: hisaAnzia,
                afya_leo: afyaLeo,
                jamii_leo: jamiiLeo,
                faini_1: faini1,
                faini_2: faini2,
                faini_3: faini3,
                mkopo_hisa_mpya: mkopoHisaMpya,
                hisa_inayolipwa_leo: hisaInayolipwaLeo,
                mkopo_jamii_mpya: mkopoJamiiMpya,
                jamii_inayolipwa_leo: jamiiInayolipwaLeo,
                updated_at: new Date().toISOString()
            });

            if (!error) saveCount++;
        }

        alert(`Imefanikiwa kuokoa data za wanakikundi ${saveCount} kwenye Supabase!`);
    } catch (err) {
        alert("Hitilafu wakati wa kuhifadhi data: " + err.message);
    }
}

/* =====================================
   EXPORT EXCEL (EXPORT DATA ZOTE EXCEL)
===================================== */
async function exportExcel() {
    if (typeof ExcelJS === "undefined") {
        alert("Library ya ExcelJS bado haijapakiwa. Tafadhali subiri sekunde chache au urudishe peji upya.");
        return;
    }

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Wanakikundi Cashflow");

        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Jina la Mwanachama", key: "name", width: 25 },
            { header: "Namba ya Simu", key: "phone", width: 15 },
            { header: "Jinsia", key: "gender", width: 12 },
            { header: "Hisa Anzia", key: "hisa_anzia", width: 15 },
            { header: "Afya", key: "afya_leo", width: 15 },
            { header: "Jamii", key: "jamii_leo", width: 15 },
            { header: "Faini Total", key: "faini_total", width: 15 },
            { header: "Mkopo Hisa Mpya", key: "mkopo_hisa", width: 18 },
            { header: "Hisa Iliyolipwa", key: "hisa_lipwa", width: 18 },
            { header: "Mkopo Jamii Mpya", key: "mkopo_jamii", width: 18 },
            { header: "Jamii Iliyolipwa", key: "jamii_lipwa", width: 18 }
        ];

        document.querySelectorAll(".member-card").forEach(card => {
            const memberId = card.getAttribute("data-member");
            const name = card.querySelector(".member-name")?.value || "";
            const phone = card.querySelector(".member-phone")?.value || "";
            const gender = card.querySelector(".member-gender")?.value || "";

            const hisaAnzia = Number(card.querySelector(".hisaAnzia")?.value || 0);
            const afya = Number(card.querySelector(".afya")?.value || 0);
            const jamii = Number(card.querySelector(".jamii")?.value || 0);
            const f1 = Number(card.querySelector(".faini1")?.value || 0);
            const f2 = Number(card.querySelector(".faini2")?.value || 0);
            const f3 = Number(card.querySelector(".faini3")?.value || 0);
            const mkopoHisa = Number(card.querySelector(".mkopoHisa")?.value || 0);
            const hisaLipwa = Number(card.querySelector(".hisaLipwa")?.value || 0);
            const mkopoJamii = Number(card.querySelector(".mkopoJamii")?.value || 0);
            const jamiiLipwa = Number(card.querySelector(".jamiiLipwa")?.value || 0);

            worksheet.addRow({
                id: memberId,
                name: name,
                phone: phone,
                gender: gender,
                hisa_anzia: hisaAnzia,
                afya_leo: afya,
                jamii_leo: jamii,
                faini_total: f1 + f2 + f3,
                mkopo_hisa: mkopoHisa,
                hisa_lipwa: hisaLipwa,
                mkopo_jamii: mkopoJamii,
                jamii_lipwa: jamiiLipwa
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `Sauti_Moja_Ripoti_${new Date().toISOString().slice(0, 10)}.xlsx`);

    } catch (err) {
        alert("Hitilafu kwenye ku-export Excel: " + err.message);
    }
}
