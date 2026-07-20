// === 1. UNGUNISHA NA SUPABASE ===
const SUPABASE_URL = "https://nkdvoqbbzgjdkvvccbej.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__6o1FK6fIdXD9st9G8QJ9w_ZLqH6lxC";

// Kutumia jina tofauti kidogo ili kuzuia mgongano wa majina (naming conflict)
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === Vigezo vya Mtumiaji ===
let currentUserRole = "mwanachama";
let allMembers = [];

// === Unapoingia kwenye ukurasa ===
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // 1. Shughulikia Login
    const userRoleSelect = document.getElementById("userRole");
    const passwordField = document.getElementById("passwordField");
    const btnLogin = document.getElementById("btnLogin");
    const logoutBtn = document.getElementById("btnLogout");

    if (userRoleSelect) {
        userRoleSelect.addEventListener("change", () => {
            if (userRoleSelect.value === "katibu") {
                passwordField.style.display = "block";
            } else {
                passwordField.style.display = "none";
            }
        });
    }

    if (btnLogin) btnLogin.addEventListener("click", performLogin);
    if (logoutBtn) logoutBtn.addEventListener("click", performLogout);

    // 2. Search function
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("input", filterMembers);

    // 3. Form submissions
    const memberForm = document.getElementById("memberForm");
    if (memberForm) memberForm.addEventListener("submit", saveMember);

    const dataForm = document.getElementById("dataForm");
    if (dataForm) dataForm.addEventListener("submit", saveDailyData);

    // Buttons za Admin
    const btnPrint = document.getElementById("btnPrint");
    if (btnPrint) btnPrint.addEventListener("click", () => window.print());

    const btnExport = document.getElementById("btnExport");
    if (btnExport) btnExport.addEventListener("click", exportToExcel);

    const btnAddNew = document.getElementById("btnAddNew");
    if (btnAddNew) {
        btnAddNew.addEventListener("click", () => {
            const form = document.getElementById("memberForm");
            if (form) form.reset();
            
            const editId = document.getElementById("editMemberId");
            if (editId) editId.value = "";
            
            const mId = document.getElementById("m_id");
            if (mId) mId.disabled = false;
            
            const modalTitle = document.getElementById("modalTitle");
            if (modalTitle) modalTitle.innerText = "Sajili Mwanachama Mpya";
        });
    }
}

// === LOGIN / LOGOUT ===
function performLogin() {
    const role = document.getElementById("userRole").value;
    const password = document.getElementById("loginPassword").value;
    const errorMsg = document.getElementById("loginError");

    if (role === "katibu") {
        if (password === "holili2026") {
            currentUserRole = "katibu";
            if (errorMsg) errorMsg.style.display = "none";
            showMainPage();
        } else {
            if (errorMsg) errorMsg.style.display = "block";
        }
    } else {
        currentUserRole = "mwanachama";
        if (errorMsg) errorMsg.style.display = "none";
        showMainPage();
    }
}

function performLogout() {
    currentUserRole = "mwanachama";
    const loginPassword = document.getElementById("loginPassword");
    if (loginPassword) loginPassword.value = "";
    
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("mainPage").style.display = "none";
}

async function showMainPage() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
    
    // Set role badge
    const roleBadge = document.getElementById("roleBadge");
    const adminPanel = document.getElementById("adminPanel");
    
    if (currentUserRole === "katibu") {
        if (roleBadge) {
            roleBadge.innerText = "Katibu (Admin)";
            roleBadge.className = "badge bg-danger position-absolute top-0 end-0 m-3 p-2";
        }
        if (adminPanel) adminPanel.style.display = "block";
    } else {
        if (roleBadge) {
            roleBadge.innerText = "Mwanachama";
            roleBadge.className = "badge bg-warning text-dark position-absolute top-0 end-0 m-3 p-2";
        }
        if (adminPanel) adminPanel.style.display = "none";
    }

    // Pakia data kutoka Database
    await fetchMembersFromDatabase();
}

// === DATABASE ACTIONS (FETCH, INSERT, UPDATE) ===

// Pakia data zote za Wanachama
async function fetchMembersFromDatabase() {
    try {
        const { data, error } = await db
            .from('members')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        allMembers = data || [];
        renderMembers();
        calculateDashboardTotals();
    } catch (err) {
        alert("Imeshindikana kupakia wanachama kutoka database: " + err.message);
    }
}

// Sajili au Hariri Mwanachama
async function saveMember(e) {
    e.preventDefault();
    const saveBtn = document.getElementById("btnSaveMember");
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = "Inahifadhi...";
    }

    const id = document.getElementById("m_id").value.trim();
    const name = document.getElementById("m_name").value.trim();
    const phone = document.getElementById("m_phone").value.trim();
    const gender = document.getElementById("m_gender").value;
    const dob = document.getElementById("m_dob").value;
    const guardian = document.getElementById("m_guardian").value.trim();
    const hisa_anz = parseFloat(document.getElementById("m_hisa_anz_val").value) || 0;

    const fileInput = document.getElementById("m_photo_file");
    let photoUrl = "";

    // Kama kuna picha imepakiwa
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}_${Date.now()}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        try {
            // Upload kwenye Supabase Storage Bucket
            const { error: uploadError } = await db.storage
                .from('member-photos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Pata Link ya Picha
            const { data } = db.storage
                .from('member-photos')
                .getPublicUrl(filePath);

            photoUrl = data.publicUrl;
        } catch (uploadErr) {
            alert("Imeshindikana kupakia picha: " + uploadErr.message);
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerText = "Hifadhi Mwanachama";
            }
            return;
        }
    }

    // Unakabili data za kuhifadhi
    const memberData = {
        id, name, phone, gender, guardian,
        dob: dob || null,
        hisa_anzia: hisa_anz
    };

    if (photoUrl) {
        memberData.photo_url = photoUrl;
    }

    try {
        const isEditing = document.getElementById("editMemberId").value !== "";

        if (isEditing) {
            // Edit
            const { error } = await db
                .from('members')
                .update(memberData)
                .eq('id', id);

            if (error) throw error;
        } else {
            // New Registration
            const exists = allMembers.some(m => m.id === id);
            if (exists) {
                alert(`Namba ya Mwanachama ${id} tayari ipo kwenye mfumo!`);
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerText = "Hifadhi Mwanachama";
                }
                return;
            }

            const { error } = await db
                .from('members')
                .insert([memberData]);

            if (error) throw error;
        }

        // Funga Modal salama
        const modalEl = document.getElementById('memberModal');
        if (modalEl) {
            const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modalInstance.hide();
        }

        await fetchMembersFromDatabase();
        alert("Mwanachama amehifadhiwa kikamilifu mtandaoni!");
    } catch (saveErr) {
        alert("Imeshindikana kuhifadhi mwanachama: " + saveErr.message);
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerText = "Hifadhi Mwanachama";
        }
    }
}

// Ingiza / Badilisha data za Leo za Mwanachama
async function saveDailyData(e) {
    e.preventDefault();
    
    const saveBtn = e.target.querySelector('button[type="submit"]') || document.querySelector("#dataForm button[type='submit']");
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = "Inahifadhi...";
    }

    const id = document.getElementById("dataMemberId").value;

    const hisa_leo = parseFloat(document.getElementById("d_hisa").value) || 0;
    const afya_leo = parseFloat(document.getElementById("d_afya").value) || 0;
    const jamii_leo = parseFloat(document.getElementById("d_jamii").value) || 0;
    const faini_1 = parseFloat(document.getElementById("d_faini1").value) || 0;
    const faini_2 = parseFloat(document.getElementById("d_faini2").value) || 0;
    const faini_3 = parseFloat(document.getElementById("d_faini3").value) || 0;
    const mkopo_hisa_mpya = parseFloat(document.getElementById("d_mkopo_hisa").value) || 0;
    const hisa_inayolipwa_leo = parseFloat(document.getElementById("d_hisa_lipwa").value) || 0;
    const mkopo_jamii_mpya = parseFloat(document.getElementById("d_mkopo_jamii").value) || 0;
    const jamii_inayolipwa_leo = parseFloat(document.getElementById("d_jamii_lipwa").value) || 0;

    try {
        const { error } = await db
            .from('members')
            .update({
                hisa_leo, afya_leo, jamii_leo,
                faini_1, faini_2, faini_3,
                mkopo_hisa_mpya, hisa_inayolipwa_leo,
                mkopo_jamii_mpya, jamii_inayolipwa_leo
            })
            .eq('id', id);

        if (error) throw error;

        // Funga Modal salama
        const modalEl = document.getElementById('dataModal');
        if (modalEl) {
            const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modalInstance.hide();
        }
        
        await fetchMembersFromDatabase();
        alert("Taarifa za leo zimehifadhiwa mtandaoni!");
    } catch (err) {
        alert("Imeshindikana kusave data za leo: " + err.message);
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerText = "Hifadhi Data za Leo";
        }
    }
}

// === RENDER MEMBERS KADI ===
function renderMembers() {
    const listContainer = document.getElementById("membersList");
    if (!listContainer) return;
    listContainer.innerHTML = "";

    allMembers.forEach(m => {
        const jumlaHisa = (m.hisa_anzia || 0) + (m.hisa_leo || 0);
        const jumlaAfya = m.afya_leo || 0;
        const jumlaJamii = m.jamii_leo || 0;
        const jumlaFaini = (m.faini_1 || 0) + (m.faini_2 || 0) + (m.faini_3 || 0);
        const bakiMkopoHisa = (m.mkopo_hisa_mpya || 0) - (m.hisa_inayolipwa_leo || 0);
        const bakiMkopoJamii = (m.mkopo_jamii_mpya || 0) - (m.jamii_inayolipwa_leo || 0);
        
        const jumlaMikopo = (m.mkopo_hisa_mpya || 0) + (m.mkopo_jamii_mpya || 0);
        const jumlaIliyolipwa = (m.hisa_inayolipwa_leo || 0) + (m.jamii_inayolipwa_leo || 0);
        const jumlaMadeni = bakiMkopoHisa + bakiMkopoJamii;

        const photoSrc = m.photo_url || "https://via.placeholder.com/150?text=Sauti+Moja";

        const editButton = currentUserRole === "katibu" ? 
            `<button class="btn btn-sm btn-outline-primary" onclick="openEditMember('${m.id}')"><i class="fa-solid fa-user-gear"></i> Hariri Profaili</button>
             <button class="btn btn-sm btn-primary" onclick="openDailyDataModal('${m.id}')"><i class="fa-solid fa-coins"></i> Ingiza Data za Leo</button>` : '';

        const card = `
            <div class="col-md-6 col-lg-4 member-item" data-name="${m.name.toLowerCase()}" data-id="${m.id}">
                <div class="member-card">
                    <div class="card-header-custom">
                        <span>Mwanakikundi ID: ${m.id}</span>
                        <span class="badge bg-secondary">${m.gender || 'Bila Jinsia'}</span>
                    </div>
                    <div class="card-body text-center">
                        <img src="${photoSrc}" class="member-photo" alt="${m.name}">
                        <h5 class="card-title text-uppercase font-weight-bold">${m.name}</h5>
                        <p class="text-muted mb-2"><i class="fa-solid fa-phone"></i> ${m.phone || 'Sio ya Simu'}</p>
                        
                        <div class="text-start mt-3">
                            <div class="summary-badge">Jumla ya Hisa: <span>${jumlaHisa.toLocaleString()} TSh</span></div>
                            <div class="summary-badge">Jumla ya Afya: <span>${jumlaAfya.toLocaleString()} TSh</span></div>
                            <div class="summary-badge">Jumla ya Jamii: <span>${jumlaJamii.toLocaleString()} TSh</span></div>
                            <div class="summary-badge">Jumla ya Faini: <span class="text-danger">${jumlaFaini.toLocaleString()} TSh</span></div>
                            <div class="summary-badge">Baki Mkopo Hisa: <span>${bakiMkopoHisa.toLocaleString()} TSh</span></div>
                            <div class="summary-badge">Baki Mkopo Jamii: <span>${bakiMkopoJamii.toLocaleString()} TSh</span></div>
                            
                            <div class="border-top pt-2 mt-2">
                                <small class="text-muted d-block">Jumla ya Mikopo: ${jumlaMikopo.toLocaleString()} TSh</small>
                                <small class="text-muted d-block">Jumla Iliyolipwa: ${jumlaIliyolipwa.toLocaleString()} TSh</small>
                                <small class="text-muted d-block text-danger fw-bold">Jumla ya Madeni: ${jumlaMadeni.toLocaleString()} TSh</small>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between mt-3">
                            ${editButton}
                        </div>
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += card;
    });
}

// === MAHESABU YA DASHBOARD YA JUMLA ===
function calculateDashboardTotals() {
    let hisa = 0, afya = 0, jamii = 0, faini = 0;
    let mkopoHisa = 0, hisaLipwa = 0, bakiHisa = 0;
    let mkopoJamii = 0, jamiiLipwa = 0, bakiJamii = 0;
    let jumlaMikopoKuu = 0, jumlaIliyolipwaKuu = 0, jumlaMadeniKuu = 0;

    allMembers.forEach(m => {
        hisa += (m.hisa_anzia || 0) + (m.hisa_leo || 0);
        afya += (m.afya_leo || 0);
        jamii += (m.jamii_leo || 0);
        faini += (m.faini_1 || 0) + (m.faini_2 || 0) + (m.faini_3 || 0);

        mkopoHisa += (m.mkopo_hisa_mpya || 0);
        hisaLipwa += (m.hisa_inayolipwa_leo || 0);
        bakiHisa += ((m.mkopo_hisa_mpya || 0) - (m.hisa_inayolipwa_leo || 0));

        mkopoJamii += (m.mkopo_jamii_mpya || 0);
        jamiiLipwa += (m.jamii_inayolipwa_leo || 0);
        bakiJamii += ((m.mkopo_jamii_mpya || 0) - (m.jamii_inayolipwa_leo || 0));
    });

    jumlaMikopoKuu = mkopoHisa + mkopoJamii;
    jumlaIliyolipwaKuu = hisaLipwa + jamiiLipwa;
    jumlaMadeniKuu = bakiHisa + bakiJamii;

    const elements = {
        totalHisa: hisa, totalAfya: afya, totalJamii: jamii, totalFaini: faini,
        totalMkopoHisa: mkopoHisa, totalHisaLipwa: hisaLipwa, totalBakiHisa: bakiHisa,
        totalMkopoJamii: mkopoJamii, totalJamiiLipwa: jamiiLipwa, totalBakiJamii: bakiJamii,
        grandTotalMkopo: jumlaMikopoKuu, grandTotalLipwa: jumlaIliyolipwaKuu, grandTotalDeni: jumlaMadeniKuu
    };

    for (const [id, val] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val.toLocaleString() + " TSh";
    }
}

// === UTAFUTAJI (SEARCH) ===
function filterMembers() {
    const queryEl = document.getElementById("searchInput");
    if (!queryEl) return;
    const query = queryEl.value.toLowerCase();
    const items = document.querySelectorAll(".member-item");

    items.forEach(item => {
        const name = item.getAttribute("data-name") || "";
        const id = item.getAttribute("data-id") || "";
        if (name.includes(query) || id.includes(query)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

// === HARIRI (EDIT) MWANACHAMA MODAL ===
function openEditMember(id) {
    const m = allMembers.find(mem => mem.id === id);
    if (!m) return;

    document.getElementById("editMemberId").value = id;
    
    const mId = document.getElementById("m_id");
    mId.value = m.id;
    mId.disabled = true; 
    
    document.getElementById("m_name").value = m.name;
    document.getElementById("m_phone").value = m.phone || "";
    document.getElementById("m_gender").value = m.gender || "Mwanaume";
    document.getElementById("m_dob").value = m.dob || "";
    document.getElementById("m_guardian").value = m.guardian || "";
    document.getElementById("m_hisa_anz_val").value = m.hisa_anzia || 0;

    document.getElementById("modalTitle").innerText = "Hariri Profaili ya Mwanachama";
    
    const modalEl = document.getElementById('memberModal');
    if (modalEl) {
        const myModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        myModal.show();
    }
}

// === DATA ZA LEO MODAL ===
function openDailyDataModal(id) {
    const m = allMembers.find(mem => mem.id === id);
    if (!m) return;

    document.getElementById("dataMemberId").value = id;
    document.getElementById("d_hisa").value = m.hisa_leo || 0;
    document.getElementById("d_afya").value = m.afya_leo || 0;
    document.getElementById("d_jamii").value = m.jamii_leo || 0;
    document.getElementById("d_faini1").value = m.faini_1 || 0;
    document.getElementById("d_faini2").value = m.faini_2 || 0;
    document.getElementById("d_faini3").value = m.faini_3 || 0;
    document.getElementById("d_mkopo_hisa").value = m.mkopo_hisa_mpya || 0;
    document.getElementById("d_hisa_lipwa").value = m.hisa_inayolipwa_leo || 0;
    document.getElementById("d_mkopo_jamii").value = m.mkopo_jamii_mpya || 0;
    document.getElementById("d_jamii_lipwa").value = m.jamii_inayolipwa_leo || 0;

    const modalEl = document.getElementById('dataModal');
    if (modalEl) {
        const myModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        myModal.show();
    }
}

// === EXPORT TO EXCEL ===
function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert("Maktaba ya XLSX haijapakiwa kwenye ukurasa!");
        return;
    }
    
    const dataToExport = allMembers.map(m => {
        const jumlaHisa = (m.hisa_anzia || 0) + (m.hisa_leo || 0);
        const jumlaFaini = (m.faini_1 || 0) + (m.faini_2 || 0) + (m.faini_3 || 0);
        const bakiMkopoHisa = (m.mkopo_hisa_mpya || 0) - (m.hisa_inayolipwa_leo || 0);
        const bakiMkopoJamii = (m.mkopo_jamii_mpya || 0) - (m.jamii_inayolipwa_leo || 0);

        return {
            "ID": m.id,
            "Jina Kamili": m.name,
            "Simu": m.phone || "",
            "Jinsia": m.gender || "",
            "Kuzaliwa": m.dob || "",
            "Mrithi": m.guardian || "",
            "Hisa Awali": m.hisa_anzia || 0,
            "Hisa ya Leo": m.hisa_leo || 0,
            "Jumla ya Hisa": jumlaHisa,
            "Afya ya Leo": m.afya_leo || 0,
            "Jamii ya Leo": m.jamii_leo || 0,
            "Faini I": m.faini_1 || 0,
            "Faini II": m.faini_2 || 0,
            "Faini III": m.faini_3 || 0,
            "Jumla ya Faini": jumlaFaini,
            "Mkopo Hisa": m.mkopo_hisa_mpya || 0,
            "Hisa Lipwa": m.hisa_inayolipwa_leo || 0,
            "Baki Mkopo Hisa": bakiMkopoHisa,
            "Mkopo Jamii": m.mkopo_jamii_mpya || 0,
            "Jamii Lipwa": m.jamii_inayolipwa_leo || 0,
            "Baki Mkopo Jamii": bakiMkopoJamii
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sauti Moja Data");
    XLSX.writeFile(workbook, "SautiMoja_Wanachama_Database.xlsx");
}
