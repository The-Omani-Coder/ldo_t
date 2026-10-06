// خريطة تقسيم المواد الكاملة الموزعة والمحققة بدقة حسب طلبكِ يا ريناس
const globalSubjects = {
    allCommon: ["إسلامية", "عربي", "إنجليزي", "دراسات", "رياضيات", "علوم", "مهارات", "رياضة", "موسيقى", "فنون", "تقنية معلومات"],
    grade11_12_common: ["إسلامية", "عربي", "إنجليزي"],
    scientific: ["كيمياء", "فيزياء", "أحياء", "رياضيات", "رياضة", "تقنية معلومات", "فنون", "موسيقى"],
    literary: ["جغرافيا", "علوم بيئة", "هذا وطني", "رياضة", "فنون", "موسيقى", "تقنية معلومات"]
};

let currentTab = 'main';
let currentAIMode = 'chat';

// إظهار وإخفاء اختيار المسار العلمي والأدبي فقط لصف 11 و 12
function toggleStreamSelect() {
    const grade = document.getElementById('reg-grade').value;
    const streamSelect = document.getElementById('reg-stream');
    if (grade === "11" || grade === "12") {
        streamSelect.style.display = "block";
    } else {
        streamSelect.style.display = "none";
    }
}

// معالجة وحفظ بيانات الطالب وتفعيل لوحة التحكم فوراً
function handleLogin() {
    const name = document.getElementById('reg-name').value.trim();
    const grade = document.getElementById('reg-grade').value;
    const stream = document.getElementById('reg-stream').value;
    const semester = document.getElementById('reg-semester').value;

    if (!name || !grade) {
        alert("من فضلك، أدخل الاسم واختر الصف الدراسي لفتح المنصة!");
        return;
    }

    localStorage.setItem('student_name', name);
    localStorage.setItem('student_grade', grade);
    localStorage.setItem('student_stream', (grade === "11" || grade === "12") ? stream : "عام");
    localStorage.setItem('student_semester', semester);

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';

    renderDashboard();
    updateChatWelcomeMessage(); // تحديث رسالة الترحيب في الشات باسم المستخدم الجديد
}

// عرض اللوحة العلوية ومعلومات الطالب الحالية الفصليين والمسارات
function renderDashboard() {
    const name = localStorage.getItem('student_name');
    const grade = localStorage.getItem('student_grade');
    const stream = localStorage.getItem('student_stream');
    const sem = localStorage.getItem('student_semester');

    document.getElementById('welcome-text').innerHTML = `أهلاً بكِ يا قائدة الإبداع، ${name} ✨`;
    document.getElementById('user-info-sub').innerHTML = `الصف: ${grade} | المسار: ${stream} | الفصل الدراسي: ${sem === "1" ? "الأول" : "الثاني"}`;

    renderSubjects();
}

// دالة ذكية لتحديث رسالة الترحيب داخل الشات تلقائياً حسب الاسم المسجل!
function updateChatWelcomeMessage() {
    const name = localStorage.getItem('student_name') || "المبدع";
    const chatMessages = document.getElementById('chat-messages');
    
    // إعادة تعيين رسالة الترحيب بالاسم الديناميكي الجديد
    chatMessages.innerHTML = `
        <div class="msg system-msg">
            <p>مرحباً بك يا مبدع المنصة <strong>${name}</strong>! أنا محرك <strong>AI Architect</strong> الذكي الخاص بفريق QUANTIX.</p>
            <p class="hint">💡 <strong>وضعية الشات:</strong> تحدث معي وسأبسط لك أي درس لتخرج فاهماً تماماً بنصائح ذكية.</p>
            <p class="hint">📐 <strong>وضعية المهندس:</strong> اكتب أمر بناء (مثال: <em>"صمم غرفة فيزياء"</em>) لتوليدها فوراً!</p>
        </div>
    `;
}

// بناء بطاقات المواد ديناميكياً وعرضها مع الأيقونات والمختبرات الافتراضية للـ 3D والصفوف
function renderSubjects() {
    const grid = document.getElementById('subjects-grid');
    grid.innerHTML = "";
    
    const grade = parseInt(localStorage.getItem('student_grade'));
    const stream = localStorage.getItem('student_stream');
    
    let listToRender = [];

    if (grade < 11) {
        listToRender = globalSubjects.allCommon;
    } else {
        if (stream === "علمي") {
            listToRender = [...globalSubjects.grade11_12_common, ...globalSubjects.scientific];
        } else {
            listToRender = [...globalSubjects.grade11_12_common, ...globalSubjects.literary];
        }
    }
    
    listToRender = [...new Set(listToRender)];

    listToRender.forEach(sub => {
        let typeText = "قسم المواد العامة";
        let iconClass = "fa-book";

        if(["كيمياء", "فيزياء", "أحياء", "علوم"].includes(sub)) { iconClass = "fa-flask-vial"; typeText = "مختبر علمي ثلاثي الأبعاد"; }
        if(["رياضيات"].includes(sub)) { iconClass = "fa-calculator"; }
        if(["تقنية معلومات"].includes(sub)) { iconClass = "fa-laptop-code"; }
        if(["موسيقى", "فنون"].includes(sub)) { iconClass = "fa-palette"; }

        let targetContext = "محتوى المادة الدراسية";
        if(currentTab === 'rooms') targetContext = "غرفة 3D الافتراضية التفاعلية";
        if(currentTab === 'videos') targetContext = "مكتبة الفيديوهات التعليمية الموقوتة";

        grid.innerHTML += `
            <div class="subject-card" onclick="alert('جاري فتح ${sub} - ${targetContext}')">
                <i class="fa-solid ${iconClass}"></i>
                <h4>${sub}</h4>
                <p>${typeText}</p>
            </div>
        `;
    });
}

// نظام التنقل الكامل والرجوع الشامل بين أقسام وخانات المنصة
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.sidebar-menu a').forEach(el => el.classList.remove('active'));
    document.getElementById(`menu-${tab}`).classList.add('active');

    const grid = document.getElementById('subjects-grid');
    
    if (tab === 'main' || tab === 'rooms' || tab === 'videos') {
        renderSubjects();
    } else if (tab === 'summaries') {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px;">
                <h3>📚 ركن ملخصات QUANTIX الحصرية والذكية</h3>
                <p style="color:var(--text-muted); margin-top:10px;">كل ملخصاتكم المُرتبة بتلقوها مجهزة هنا بصيغة ملفات تفاعلية.</p>
            </div>`;
    } else if (tab === 'reports') {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px;">
                <h3>📊 سجل الدرجات والتقارير المتقدمة</h3>
                <p style="color:var(--text-muted); margin-top:10px;">هنا يتم رصد قياس مستوى استيعاب الطلاب ونتائجهم لحظياً عبر الروبوت.</p>
            </div>`;
    }
}

// التحكم بنافذة الروبوت التفاعلي المطور (فتح وإغلاق)
function toggleAIChat() {
    const chat = document.getElementById('ai-chat-window');
    chat.style.display = (chat.style.display === 'none') ? 'flex' : 'none';
}

// التبديل بين وضعية الشات والمحاكاة التوليدية المعمارية للروبوت
function switchAIMode(mode) {
    currentAIMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    if(mode === 'chat') {
        document.getElementById('mode-chat').classList.add('active');
        document.getElementById('chat-input').placeholder = "اكتب سؤالك العلمي أو اطلب نصيحة دراسية...";
    } else {
        document.getElementById('mode-architect').classList.add('active');
        document.getElementById('chat-input').placeholder = "أمر بناء: (مثال: صمم لي غرفة كيمياء لصف 11)...";
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') sendChatMessage();
}

// محرك إرسال الرسائل وتحليل الأوامر وصنع غرف الـ 3D تلقائياً بذكاء وبدون تعليق المفتاح الخارجي
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msgText = input.value.trim();
    if (!msgText) return;

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML += `<div class="msg user-msg">${msgText}</div>`;
    input.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typingId = "typing-" + Date.now();
    chatMessages.innerHTML += `<div class="msg system-msg" id="${typingId}"><i class="fa-solid fa-gear fa-spin"></i> جاري معالجة الأمر في QUANTIX Core...</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        const typingElement = document.getElementById(typingId);
        if(typingElement) typingElement.remove();

        if (currentAIMode === 'architect' || msgText.includes('غرفة') || msgText.includes('صمم') || msgText.includes('ابني') || msgText.includes('3d')) {
            // محرك البناء المعماري الذكي البنيوي الداخلي الحامي للمشروع
            generate3DArchitectAsset(msgText, chatMessages);
        } else {
            // محرك المحادثة الفعال المتجاوب ذكياً وبدون أخطاء برمجية خارج الحدود
            generateSmartConversation(msgText, chatMessages);
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// دالة محرك الـ AI Architect التوليدي للغرف والمجسمات بداخل نافذة الشات
function generate3DArchitectAsset(prompt, container) {
    let subjectTitle = "مختبر علمي افتراضي متكامل";
    let iconClass = "fa-cubes";
    let details = "تم إنشاء وتوليد أبعاد وهيكلة الغرفة الفراغية بنجاح بواسطة خوارزميات QUANTIX AI التوليدية.";

    if (prompt.includes('فيزياء') || prompt.includes('فزياء')) {
        subjectTitle = "غرفة الفيزياء ثلاثية الأبعاد | الفصل الأول";
        iconClass = "fa-atom";
        details = "مجهزة بمحاكاة القوى المغناطيسية وحركة الجسيمات لصف عاشر بنسب مضلعات محسنة وسريعة.";
    } else if (prompt.includes('كيمياء') || prompt.includes('كمياء')) {
        subjectTitle = "غرفة الكيمياء ثلاثية الأبعاد | المعمل الافتراضي";
        iconClass = "fa-flask-vial";
        details = "تم توليد مجسمات الروابط والجزيئات الكيميائية التفاعلية لصف 11 مسار علمي بدقة كاملة.";
    } else if (prompt.includes('رياضيات') || prompt.includes('حساب')) {
        subjectTitle = "غرفة الهندسة والرياضيات الفراغية";
        iconClass = "fa-calculator";
        details = "توليد فوري للمحاور الهندسية والمجسمات الفراغية ثلاثية الأبعاد لتحليل هندسي متكامل.";
    }

    container.innerHTML += `
        <div class="generated-room-card">
            <h4><i class="fa-solid fa-wand-magic-sparkles" style="color:var(--neon-blue)"></i> تم توليد الغرفة بواسطة AI Architect</h4>
            <div class="room-preview-box">
                <div class="grid-overlay"></div>
                <div class="room-assets">
                    <i class="fa-solid ${iconClass}"></i>
                    <h5 style="margin-top:10px; color:#fff;">${subjectTitle}</h5>
                </div>
            </div>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">${details}</p>
            <button class="btn-enter-room" onclick="alert('جاري نقلك للغرفة الـ 3D التوليدية الحية للمادة!')">ادخل الغرفة الافتراضية الآن <i class="fa-solid fa-vr-cardboard"></i></button>
        </div>
    `;
}

// دالة المحادثة الذكية: تبسيط المفاهيم الصعبة وإعطاء نصائح دراسية لضمان الفهم بناء على مدخلات الطالب
function generateSmartConversation(userInput, container) {
    let aiResponse = "";
    
    if(userInput.includes('صعب') || userInput.includes('ما فاهم') || userInput.includes('صعوبة')) {
        aiResponse = `
            <p><strong>مرحباً بك يا مبدع! لا تقلق أبداً، الصعوبة هي الخطوة الأولى للفهم الحقيقي الشامل. 🦾✨</strong></p>
            <p>بصفتي مستشارك الذكي، قمت بتحليل مستوى المادة وتبسيطها لك في نقاط ذكية لتخرج فاهماً الدرس تماماً:</p>
            <ul>
                <li>تخيل المفاهيم كمجسمات مرئية يمكنك فكها وتركيبها بيدك.</li>
                <li>افتح أولاً <em>"ملخصات QUANTIX الحصرية"</em> المتواجدة بالمنصة للحصول على خريطة الدرس الذهنية المبسطة.</li>
                <li>انتقل فوراً لـ <strong>"غرفة الـ 3D الافتراضية"</strong> للمادة لتتفاعل مع الدرس بنفسك وتجرب محاكاته.</li>
            </ul>
            <p style="color:var(--neon-blue); font-size:12px; margin-top:8px;">💡 نصيحة: أنا متواجد معك دائماً، اسألني عن أي جزئية محددة وسأعيد شرحها بطريقة أسهل!</p>
        `;
    } else if(userInput.includes('اختبار') || userInput.includes('تجميعات')) {
        aiResponse = `
            <p><strong>مستعد للتفوق واكتساح الاختبارات القادمة؟ بالطبع أنت كفو لها! 📊🚀</strong></p>
            <p>لقد جهزنا تجميعات شاملة واحترافية للاختبارات النهائية بالمنصة. نصيحتي الذكية لك أثناء الحل:</p>
            <ul>
                <li>ابدأ دوماً بحل الأسئلة المقالية لتنشيط استيعاب القوانين الرياضية والعلمية.</li>
                <li>استعين بمحاكاة غرف الـ 3D للتأكد من تخيلك الفراغي لأي رسم بياني أو مجسم مرفق بالاختبار.</li>
            </ul>
            <p>هل تحب أن أطرح عليك الآن سؤالاً تجريبياً تفاعلياً لتقييم مستواك وتدريبك؟ قُل لي أنا جاهز!</p>
        `;
    } else {
        aiResponse = `
            <p>سؤالك فنان ويدل على شغفك العلمي! كذكاء اصطناعي مخصص لفريق QUANTIX، أفهم تماماً ما تبحث عنه لتسهيل دروسك بنجاح.</p>
            <p>المفاهيم العلمية تصبح أسهل بمرتين عندما نربطها بالواقع ثلاثي الأبعاد. هل تريد مني تحويل هذا المفهوم إلى <strong>أمر بناء معماري</strong> لترى مجسمه في معملك الافتراضي؟ فقط أخبرني بما يدور في ذهنك!</p>
        `;
    }

    container.innerHTML += `
        <div class="msg system-msg">
            <div class="ai-chat-response-body">
                ${aiResponse}
            </div>
        </div>
    `;
}

// تسجيل الخروج والمسح التام للجلسة والعودة لشاشة الدخول الرئيسية
function handleLogout() {
    localStorage.clear();
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}