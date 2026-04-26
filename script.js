// بيانات تجريبية لمحاكاة البطاقات
        var studentData = {
            name: "أحمد محمد",
            major: "الذكاء الاصطناعي",
            skill: "Python & Machine Learning",
            rating: "⭐⭐⭐⭐⭐"
        };

        var grid = document.getElementById('studentsGrid');
        var loadMoreBtn = document.getElementById('loadMoreBtn');

        function createCard() {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="student-info">
                        <span class="student-name">${studentData.name}</span>
                        <span class="student-major">${studentData.major}</span>
                    </div>
                    <div class="student-img"></div>
                </div>
                <div class="card-body">
                    <p class="student-skill"><strong>المهارة:</strong> ${studentData.skill}</p>
                    <div class="stars">${studentData.rating}</div>
                </div>
            `;
            return card;
        }

        function loadSixCards() {
            if (!grid) return;
            for (let i = 0; i < 6; i++) {
                grid.appendChild(createCard());
            }
        }

        // تحميل أول 6 بطاقات عند فتح الصفحة
        if (grid) loadSixCards();

        // زر عرض المزيد
        if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadSixCards);

function openAuthPopup() {
    document.getElementById("authPopup").classList.remove("hidden");
}

function closeAuthPopup() {
    document.getElementById("authPopup").classList.add("hidden");
}

function goLogin() {
    window.location.href = "login.html";
}

function goRegister() {
    window.location.href = "register.html";
}

// تحويل زر تسجيل الدخول ل بطاقة المستخدم
async function loadUserHeader() {
    const token = localStorage.getItem("token");
    const authArea = document.getElementById("authArea");
    if (!authArea) return;

    if (!token) {
        authArea.innerHTML = `
            <button class="login-card" onclick="location.href='login.html'">تسجيل الدخول</button>
        `;
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/auth/profile", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (data.status !== "success") return;

        const user = data.user;

        const img =
            user.gender === "ذكر"
                ? "http://localhost:3000/profile_photo/male1.png"
                : user.gender === "أنثى"
                ? "http://localhost:3000/profile_photo/female.png"
                : "http://localhost:3000/profile_photo/not.png";

        authArea.innerHTML = `
            <div onclick="window.location.href='profile.html'"
                 style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                <img src="${img}"
                     style="width:45px;height:45px;border-radius:50%;border:2px solid var(--neon-blue);object-fit:cover;">
                <div style="text-align:right;">
                    <div style="color:white; font-weight:bold; font-size:0.95rem;">${user.name || user.username}</div>
                    <div style="color:#aaa; font-size:0.78rem;">${user.email}</div>
                </div>
            </div>
        `;

    } catch (err) {
        console.error("Error loading header:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadUserHeader);
