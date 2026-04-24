// بيانات تجريبية لمحاكاة البطاقات
        const studentData = {
            name: "أحمد محمد",
            major: "الذكاء الاصطناعي",
            skill: "Python & Machine Learning",
            rating: "⭐⭐⭐⭐⭐"
        };

        const grid = document.getElementById('studentsGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

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
            for (let i = 0; i < 6; i++) {
                grid.appendChild(createCard());
            }
        }

        // تحميل أول 6 بطاقات عند فتح الصفحة
        loadSixCards();

        // زر عرض المزيد
        loadMoreBtn.addEventListener('click', loadSixCards);

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


        
