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
    membersContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= 120; i++) {
        const memberId = String(i).padStart(3, "0");
        const data = membersData[memberId] || {};
        const card = document.createElement("div");
        card.className = "member-card";
        card.setAttribute("data-member", memberId);

        const imageSrc = data.photo 
            ? data.photo 
            : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

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
                        <p>Hisa Zote: <span class="resultTotalShares">0</span></p>
                        <p>Afya: <span class="resultHealth">0</span></p>
                        <p>Jamii: <span class="resultCommunity">0</span></p>
                        <p>Faini Zote: <span class="resultFines">0</span></p>
                        <p>Deni la Mkopo Hisa: <span class="resultDebtShares">0</span></p>
                        <p>Deni la Mkopo Jamii: <span class="resultDebtCommunity">0</span></p>
                        <p>Mikopo Yote: <span class="resultLoans">0</span></p>
                        <p>Marejesho Yote: <span class="resultPaid">0</span></p>
                        <p>Deni Lililobaki: <span class="resultDebt">0</span></p>
                    </div>

                    <div class="member-summary">
    <div class="member-results">
        <h3 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; font-size: 1.1rem; text-transform: uppercase;">
            📊 Matokeo ya Mwanachama (Jumla Kuu)
        </h3>

        <!-- GRID YA KADI ZENYE MUONEKANO WA KITAALAMU -->
        <div class="results-grid-pro">
            <div class="res-card blue">
                <span class="res-label">Hisa Zote</span>
                <strong class="resultTotalShares">0</strong>
            </div>
            <div class="res-card green">
                <span class="res-label">Afya</span>
                <strong class="resultHealth">0</strong>
            </div>
            <div class="res-card teal">
                <span class="res-label">Jamii</span>
                <strong class="resultCommunity">0</strong>
            </div>
            <div class="res-card red">
                <span class="res-label">Faini Zote</span>
                <strong class="resultFines">0</strong>
            </div>
            <div class="res-card orange">
                <span class="res-label">Deni Mkopo Hisa</span>
                <strong class="resultDebtShares">0</strong>
            </div>
            <div class="res-card purple">
                <span class="res-label">Deni Mkopo Jamii</span>
                <strong class="resultDebtCommunity">0</strong>
            </div>
            <div class="res-card dark">
                <span class="res-label">Mikopo Yote</span>
                <strong class="resultLoans">0</strong>
            </div>
            <div class="res-card indigo">
                <span class="res-label">Marejesho Yote</span>
                <strong class="resultPaid">0</strong>
            </div>
            <div class="res-card danger">
                <span class="res-label">Deni Lililobaki</span>
                <strong class="resultDebt">0</strong>
            </div>
        </div>
    </div>
</div>

                    <h4 style="margin-top:15px; color:#2563EB;">INGIZA DATA ZA LEO / WIKI HII:</h4>
                    <div class="grid">
                        <div><label>Hisa Anzia (Jumla)</label><input type="number" class="hisaAnzia" value="${data.hisaAnzia || 0}" disabled></div>
                        <div><label>Hisa ya Leo (+)</label><input type="number" class="hisaWiki" value="0"></div>
                        <div><label>Afya (Jumla)</label><input type="number" class="afya" value="${data.afya || 0}"></div>
                        <div><label>Jamii (Jumla)</label><input type="number" class="jamii" value="${data.jamii || 0}"></div>
                        <div><label>Faini I (+)</label><input type="number" class="faini1" value="${data.faini1 || 0}"></div>
                        <div><label>Faini II (+)</label><input type="number" class="faini2" value="${data.faini2 || 0}"></div>
                        <div><label>Faini III (+)</label><input type="number" class="faini3" value="${data.faini3 || 0}"></div>
                        <div><label>Mkopo Hisa Mpya (+)</label><input type="number" class="mkopoHisa" value="${data.mkopoHisa || 0}"></div>
                        <div><label>Hisa Inayolipwa Leo (+)</label><input type="number" class="hisaLipwa" value="${data.hisaLipwa || 0}"></div>
                        <div><label>Mkopo Jamii Mpya (+)</label><input type="number" class="mkopoJamii" value="${data.mkopoJamii || 0}"></div>
                        <div><label>Jamii Inayolipwa Leo (+)</label><input type="number" class="jamiiLipwa" value="${data.jamiiLipwa || 0}"></div>
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
    const rawId = String(parseInt(memberId, 10));
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
            dob: dobValue ? dobValue : null,
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

    const rawId = String(parseInt(memberId, 10));

    const existing = membersData[memberId] || {
        hisaAnzia: 0, afya: 0, jamii: 0, faini1: 0, faini2: 0, faini3: 0,
        mkopoHisa: 0, hisaLipwa: 0, mkopoJamii: 0, jamiiLipwa: 0
    };

    const leoHisa = Number(card.querySelector(".hisaWiki")?.value || 0);
    const totalAfya = Number(card.querySelector(".afya")?.value || 0);
    const totalJamii = Number(card.querySelector(".jamii")?.value || 0);
    const totalFaini1 = Number(card.querySelector(".faini1")?.value || 0);
    const totalFaini2 = Number(card.querySelector(".faini2")?.value || 0);
    const totalFaini3 = Number(card.querySelector(".faini3")?.value || 0);
    const totalMkopoHisa = Number(card.querySelector(".mkopoHisa")?.value || 0);
    const totalHisaLipwa = Number(card.querySelector(".hisaLipwa")?.value || 0);
    const totalMkopoJamii = Number(card.querySelector(".mkopoJamii")?.value || 0);
    const totalJamiiLipwa = Number(card.querySelector(".jamiiLipwa")?.value || 0);

    const updatedDataLocal = {
        hisaAnzia: (existing.hisaAnzia || 0) + leoHisa,
        afya: totalAfya,
        jamii: totalJamii,
        faini1: totalFaini1,
        faini2: totalFaini2,
        faini3: totalFaini3,
        mkopoHisa: totalMkopoHisa,
        hisaLipwa: totalHisaLipwa,
        mkopoJamii: totalMkopoJamii,
        jamiiLipwa: totalJamiiLipwa
    };

    const dobValue = card.querySelector(".member-birthdate").value;

    const payloadSupabase = {
        id: rawId,
        name: card.querySelector(".member-name").value,
        phone: card.querySelector(".member-phone").value,
        gender: card.querySelector(".member-gender").value,
        dob: dobValue ? dobValue : null,
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

    const { error } = await db.from("members").upsert([payloadSupabase]);

    if (error) {
        alert("Hitilafu wakati wa kuhifadhi Supabase: " + error.message);
        return;
    }

    membersData[memberId] = {
        ...membersData[memberId],
        ...updatedDataLocal,
        name: payloadSupabase.name,
        phone: payloadSupabase.phone,
        gender: payloadSupabase.gender,
        birthDate: payloadSupabase.dob,
        mrithi: payloadSupabase.guardian
    };

    card.querySelector(".hisaAnzia").value = membersData[memberId].hisaAnzia;
    card.querySelector(".hisaWiki").value = 0;

    calculateMember(card);
    updateDashboard();

    alert(`Data zote za Mwanakikundi ${memberId} zimehifadhiwa kikamilifu Supabase!`);
}

/* =====================================
   CALCULATE MEMBER
===================================== */
function calculateMember(card) {
    const memberId = card.getAttribute("data-member");
    const mData = membersData[memberId] || {};

    const leoHisaWiki = Number(card.querySelector(".hisaWiki")?.value || 0);
    const totalShares = (mData.hisaAnzia || 0) + leoHisaWiki;
    
    const totalHealth = Number(card.querySelector(".afya")?.value || 0);
    const totalCommunity = Number(card.querySelector(".jamii")?.value || 0);
    const totalFines = Number(card.querySelector(".faini1")?.value || 0) + Number(card.querySelector(".faini2")?.value || 0) + Number(card.querySelector(".faini3")?.value || 0);
    
    const mkopoHisaVal = Number(card.querySelector(".mkopoHisa")?.value || 0);
    const hisaLipwaVal = Number(card.querySelector(".hisaLipwa")?.value || 0);
    const mkopoJamiiVal = Number(card.querySelector(".mkopoJamii")?.value || 0);
    const jamiiLipwaVal = Number(card.querySelector(".jamiiLipwa")?.value || 0);

    const debtShares = mkopoHisaVal - hisaLipwaVal;
    const debtCommunity = mkopoJamiiVal - jamiiLipwaVal;
    
    const totalLoans = mkopoHisaVal + mkopoJamiiVal;
    const totalPaid = hisaLipwaVal + jamiiLipwaVal;
    const totalDebt = debtShares + debtCommunity;

    const setRes = (cls, val) => {
        const el = card.querySelector("." + cls);
        if (el) el.textContent = formatNumber(val);
    };

    setRes("resultTotalShares", totalShares);
    setRes("resultHealth", totalHealth);
    setRes("resultCommunity", totalCommunity);
    setRes("resultFines", totalFines);
    setRes("resultDebtShares", debtShares);
    setRes("resultDebtCommunity", debtCommunity);
    setRes("resultLoans", totalLoans);
    setRes("resultPaid", totalPaid);
    setRes("resultDebt", totalDebt);
}

/* =====================================
   DASHBOARD KUU
===================================== */
function updateDashboard() {
    let rawShares = 0, health = 0, rawCommunity = 0, fines = 0;
    let loanShares = 0, sharesPaid = 0, loanCommunity = 0, communityPaid = 0;

    document.querySelectorAll(".member-card").forEach(card => {
        const memberId = card.getAttribute("data-member");
        const mData = membersData[memberId] || {};

        const leoHisaWiki = Number(card.querySelector(".hisaWiki")?.value || 0);
        
        rawShares += (mData.hisaAnzia || 0) + leoHisaWiki;
        health += Number(card.querySelector(".afya")?.value || 0);
        rawCommunity += Number(card.querySelector(".jamii")?.value || 0);
        
        fines += Number(card.querySelector(".faini1")?.value || 0) + 
                 Number(card.querySelector(".faini2")?.value || 0) + 
                 Number(card.querySelector(".faini3")?.value || 0);
                 
        loanShares += Number(card.querySelector(".mkopoHisa")?.value || 0);
        sharesPaid += Number(card.querySelector(".hisaLipwa")?.value || 0);
        loanCommunity += Number(card.querySelector(".mkopoJamii")?.value || 0);
        communityPaid += Number(card.querySelector(".jamiiLipwa")?.value || 0);
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
    const isAdmin = currentUser && currentUser.role === "admin";
    if (!isAdmin) return;

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

/* =====================================
   INITIALIZE APP
===================================== */
function initializeApp() {
    createMembersCards();

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
        const { data, error } = await db.rpc('check_member_login', {
            user_input: inputUser,
            user_pass: inputPass
        });

        if (error || !data || data.length === 0) {
            alert("Mtumiaji au Neno la siri (Password) siyo sahihi!");
            return;
        }

        const user = data[0];

        currentUser = user;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("appSection").style.display = "block";
        document.getElementById("currentUserInfo").textContent = `Umeingia kama: ${user.name || 'Mwanakikundi'} (${user.role === 'admin' ? 'ADMIN' : 'MEMBER'})`;

        await loadMembersFromSupabase();
        applyRolePermissions();

    } catch (err) {
        alert("Hitilafu wakati wa kuingia: " + err.message);
    }
}

function applyRolePermissions() {
    const isAdmin = currentUser && currentUser.role === "admin";
    const searchInput = document.getElementById("searchMember");
    const dashboardSection = document.querySelector(".dashboard-container");

    if (!isAdmin) {
        if (dashboardSection) dashboardSection.style.display = "none";

        document.querySelectorAll(".controls-container button").forEach(btn => btn.style.display = "none");
        
        if (searchInput) {
            searchInput.value = "";
            searchInput.disabled = true;
            searchInput.placeholder = "Kutafuta kumeruhusiwa kwa Admin pekee";
        }

        const formattedIdWithZeros = String(currentUser.id).padStart(3, "0");
        const rawIdString = String(currentUser.id);

        document.querySelectorAll(".member-card").forEach(card => {
            const cardId = card.getAttribute("data-member");
            
            if (cardId === formattedIdWithZeros || cardId === rawIdString) {
                card.style.display = "block";
                card.querySelectorAll("input, select, textarea, button").forEach(element => {
                    element.disabled = true;
                });
                
                calculateMember(card);
            } else {
                card.style.display = "none";
            }
        });
    } else {
        if (dashboardSection) dashboardSection.style.display = "block";

        if (searchInput) {
            searchInput.disabled = false;
            searchInput.placeholder = "Tafuta Mwanachama...";
        }

        document.querySelectorAll(".member-card").forEach(card => {
            card.style.display = "block";
            card.querySelectorAll("input, select, textarea, button").forEach(element => element.disabled = false);
            
            calculateMember(card);
        });

        document.querySelectorAll(".controls-container button").forEach(btn => btn.style.display = "inline-block");
        
        updateDashboard();
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

            const existing = membersData[memberId] || {};

            const name = card.querySelector(".member-name")?.value || existing.name || "";
            const phone = card.querySelector(".member-phone")?.value || existing.phone || "";
            const gender = card.querySelector(".member-gender")?.value || existing.gender || "";
            let dob = card.querySelector(".member-birthdate")?.value || existing.birthDate || null;
            if (dob === "") dob = null;

            const guardian = card.querySelector(".member-mrithi")?.value || existing.mrithi || "";
            const photoUrl = card.querySelector(`#photo-${memberId}`)?.src || existing.photo || "";

            const leoHisa = Number(card.querySelector(".hisaWiki")?.value || 0);

            const { error } = await db.from("members").upsert({
                id: parseInt(memberId, 10),
                name,
                phone,
                gender,
                dob,
                guardian,
                photo_url: photoUrl,
                hisa_anzia: (existing.hisaAnzia || 0) + leoHisa,
                afya_leo: Number(card.querySelector(".afya")?.value || 0),
                jamii_leo: Number(card.querySelector(".jamii")?.value || 0),
                faini_1: Number(card.querySelector(".faini1")?.value || 0),
                faini_2: Number(card.querySelector(".faini2")?.value || 0),
                faini_3: Number(card.querySelector(".faini3")?.value || 0),
                mkopo_hisa_mpya: Number(card.querySelector(".mkopoHisa")?.value || 0),
                hisa_inayolipwa_leo: Number(card.querySelector(".hisaLipwa")?.value || 0),
                mkopo_jamii_mpya: Number(card.querySelector(".mkopoJamii")?.value || 0),
                jamii_inayolipwa_leo: Number(card.querySelector(".jamiiLipwa")?.value || 0),
                updated_at: new Date().toISOString()
            });

            if (!error) saveCount++;
        }

        alert(`Imefanikiwa kuokoa data zote za wanakikundi ${saveCount} kwenye Supabase!`);
        await loadMembersFromSupabase();
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
