/**
 * EXPLORE PESISIR BARAT - INTERACTIVE SCRIPTS
 * Author: Aditiya Pratama (Portfolio Showcase)
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initSearchFilter();
    initCategoryTabs();
    initMapPins();
    initPariAI();
    initBookingModal();
});

// 1. Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('pb-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.style.background = 'rgba(8, 41, 50, 0.95)';
            header.style.backdropFilter = 'blur(16px)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            header.style.padding = '14px 30px';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'none';
            header.style.padding = '22px 30px';
        }
    });

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('pb-nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isFlex = navMenu.style.display === 'flex';
            navMenu.style.display = isFlex ? 'none' : 'flex';
            if (!isFlex) {
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '20px';
                navMenu.style.right = '20px';
                navMenu.style.flexDirection = 'column';
                navMenu.style.background = '#0a3d46';
                navMenu.style.padding = '20px';
                navMenu.style.borderRadius = '16px';
            }
        });
    }
}

// 2. Search & Booking Bar Logic
function initSearchFilter() {
    const searchForm = document.getElementById('search-booking-form');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destSelect = document.getElementById('search-destination').value;
        const dateVal = document.getElementById('search-date').value;
        const peopleVal = document.getElementById('search-people').value;

        // Filter destination cards
        const cards = document.querySelectorAll('.pb-card');
        let matchCount = 0;

        cards.forEach(card => {
            const cardDest = card.getAttribute('data-dest');
            if (destSelect === 'all' || cardDest === destSelect || destSelect.includes(cardDest)) {
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show Toast
        const formattedDate = dateVal ? new Date(dateVal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Hari ini';
        showToast(`Ditemukan ${matchCount} pilihan untuk ${peopleVal} orang pada ${formattedDate}`);

        // Smooth scroll to destinations section
        const destSection = document.getElementById('destinasi');
        if (destSection) {
            destSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// 3. Category Filter Tabs
function initCategoryTabs() {
    const filterBtns = document.querySelectorAll('.dest-filter-btn');
    const cards = document.querySelectorAll('.pb-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 4. Interactive 3D Map Pins Data & Switcher
const mapSpotsData = {
    'tanjung-setia': {
        title: 'Pantai Tanjung Setia (Krui Pro WSL)',
        desc: 'Spot surfing paling termasyhur di Sumatera dengan ombak kidal (left-hander) Karang Nyimbor setinggi 3-6 meter. Menjadi arena kompetisi surfing tingkat dunia WSL tiap tahunnya.',
        wave: 'Left-hand Reef Break',
        diff: 'Intermediate to Pro',
        season: 'April - Oktober (Dry Season)'
    },
    'pulau-pisang': {
        title: 'Pulau Pisang (The Emerald of Sumatra)',
        desc: 'Pulau terisolir berpasir putih selembut tepung dengan kawanan lumba-lumba bebas, mercusuar peninggalan Belanda, dan spot surfing Banana Island Lefts yang menantang.',
        wave: 'Point Break & Snorkeling Lagoon',
        diff: 'All Levels (Surfing: Advanced)',
        season: 'Sepanjang Tahun (Lumba-lumba: Pagi Hari)'
    },
    'pantai-mandiri': {
        title: 'Pantai Mandiri (Black Pearl Sand)',
        desc: 'Pantai pasir hitam eksotis tanpa karang tajam dengan deburan ombak beach break cepat. Sangat ideal untuk menikmati sunset spektakuler dan latihan aerial surfing.',
        wave: 'Fast Shifty Beach Break',
        diff: 'Beginner - Intermediate',
        season: 'Mei - September'
    },
    'labuhan-jukung': {
        title: 'Pantai Labuhan Jukung (Krui Town Hub)',
        desc: 'Pusat denyut pariwisata Krui dengan pemandangan Gunung Pesagi, taman rekreasi keluarga tepi pantai, kafe sunset, serta sentra kuliner Gulai Taboh & olahan Ikan Tuhuk.',
        wave: 'Gentle Bay Shorebreak',
        diff: 'Family & Beginner',
        season: 'Sepanjang Tahun'
    },
    'way-nipah': {
        title: 'Air Terjun Way Nipah (Curup Way Bertih)',
        desc: 'Air terjun alami setinggi 30 meter di kaki gugusan Bukit Barisan Selatan dengan kolam air toska alami yang sejuk untuk relaksasi dan ekowisata trekking.',
        wave: 'Freshwater Cascades & Natural Pool',
        diff: 'Trekking Ringan (15 Menit)',
        season: 'Sepanjang Tahun'
    }
};

function initMapPins() {
    const pins = document.querySelectorAll('.pb-map-pin');
    const titleEl = document.getElementById('map-spot-title');
    const descEl = document.getElementById('map-spot-desc');
    const waveEl = document.getElementById('map-spot-wave');
    const diffEl = document.getElementById('map-spot-diff');
    const seasonEl = document.getElementById('map-spot-season');

    pins.forEach(pin => {
        pin.addEventListener('click', () => {
            pins.forEach(p => p.classList.remove('active'));
            pin.classList.add('active');

            const spotKey = pin.getAttribute('data-pin');
            const data = mapSpotsData[spotKey];
            if (data && titleEl) {
                titleEl.textContent = data.title;
                descEl.textContent = data.desc;
                waveEl.textContent = data.wave;
                diffEl.textContent = data.diff;
                seasonEl.textContent = data.season;
            }
        });
    });
}

// 5. Tanya Pari AI Chat Assistant (Intelligent Travel Bot)
const pariKnowledge = [
    {
        keywords: ['pemula', 'belajar', 'beginner', 'spot pemula'],
        reply: "Untuk peselancar pemula, spot terbaik di Krui adalah **Pantai Labuhan Jukung** saat ombak sedang ramah, atau **Pantai Mandiri** di tepi pasir karena dasarnya adalah pasir halus tanpa karang tajam! Anda juga bisa menyewa instruktur berlisensi di area Tanjung Setia untuk sesi pemula."
    },
    {
        keywords: ['pisang', 'pulau pisang', 'rute', 'menyeberang', 'kapal', 'boat'],
        reply: "Untuk menuju **Pulau Pisang**, Anda bisa naik perahu jukung tradisional dari **Dermaga Tembakak** (sekitar 30 menit berkendara dari pusat Krui). Waktu penyeberangan hanya sekitar 20-30 menit dengan tarif Rp 25.000 - Rp 50.000 per orang. Jika beruntung di pagi hari, Anda akan disambut kawanan lumba-lumba liar! 🐬"
    },
    {
        keywords: ['musim', 'kapan', 'waktu terbaik', 'ombak', 'wsl', 'bulan'],
        reply: "Musim ombak puncak di Pesisir Barat berlangsung pada **April hingga Oktober** (musim kemarau/dry season) dengan angin lepas pantai (offshore) yang stabil dan gelombang 3 hingga 6 meter! Kejuaraan bergengsi **WSL Krui Pro** biasanya dihelat sekitar bulan Mei/Juni di Pantai Tanjung Setia."
    },
    {
        keywords: ['kuliner', 'makanan', 'ikan', 'tuhuk', 'taboh', 'makan'],
        reply: "Wajib coba **Gulai Taboh Ikan Tuhuk**! Ikan Tuhuk adalah sebutan lokal untuk Blue Marlin segar hasil tangkapan nelayan samudra Krui, dimasak kuah santan bumbu kuning kaya rempah. Anda bisa menikmatinya di warung makan sekitar Labuhan Jukung atau Pasar Krui."
    },
    {
        keywords: ['biaya', 'tarif', 'harga', 'penginapan', 'homestay', 'hotel'],
        reply: "Tarif akomodasi di Krui sangat ramah kantong! Homestay lokal mulai dari **Rp 150.000 - Rp 300.000/malam**, sedangkan Surf Resort & Camp tepi pantai berkisar antara **Rp 450.000 - Rp 1.200.000/malam** sudah termasuk fasilitas sarapan dan akses langsung ke bibir pantai."
    },
    {
        keywords: ['jalan', 'rute', 'transportasi', 'dari bandar lampung', 'bandara', 'radin inten'],
        reply: "Dari Bandara Radin Inten II Bandar Lampung ke Krui, jarak tempuh sekitar **5 - 6 jam** via Jalan Lintas Barat Sumatera melalui Kota Agung - TNBBS. Anda bisa menggunakan travel reguler (Krui Putra / Simpati) dengan tarif sekitar Rp 120.000 - Rp 150.000 per kursi."
    }
];

function initPariAI() {
    const toggleBtn = document.getElementById('pari-ai-toggle');
    const chatbox = document.getElementById('pari-chatbox');
    const closeBtn = document.getElementById('pari-close-btn');
    const form = document.getElementById('pari-form');
    const input = document.getElementById('pari-input');
    const messages = document.getElementById('pari-messages');
    const chips = document.querySelectorAll('.pari-chip');

    if (!toggleBtn || !chatbox) return;

    // Toggle Chat
    toggleBtn.addEventListener('click', () => {
        chatbox.classList.toggle('active');
        if (chatbox.classList.contains('active')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatbox.classList.remove('active');
    });

    // Handle Quick Chips
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            sendUserMessage(prompt);
        });
    });

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        sendUserMessage(text);
        input.value = '';
    });

    function sendUserMessage(text) {
        // Append user bubble
        appendMessage(text, 'user');

        // Thinking indicator
        const thinkingId = 'thinking-' + Date.now();
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'chat-msg bot';
        thinkingDiv.id = thinkingId;
        thinkingDiv.innerHTML = `
            <div class="chat-avatar"><i class="fas fa-robot"></i></div>
            <div class="chat-bubble"><i class="fas fa-spinner fa-spin"></i> Pari AI sedang mencari info...</div>
        `;
        messages.appendChild(thinkingDiv);
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            const element = document.getElementById(thinkingId);
            if (element) element.remove();

            const botAnswer = generateAIAnswer(text);
            appendMessage(botAnswer, 'bot');
        }, 800);
    }

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `chat-msg ${sender}`;
        
        const avatar = sender === 'bot' 
            ? `<div class="chat-avatar"><i class="fas fa-robot"></i></div>` 
            : `<div class="chat-avatar" style="background: #0284c7;"><i class="fas fa-user"></i></div>`;
            
        div.innerHTML = `
            ${avatar}
            <div class="chat-bubble">${formatMarkdown(text)}</div>
        `;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function generateAIAnswer(query) {
        const q = query.toLowerCase();
        for (const item of pariKnowledge) {
            if (item.keywords.some(k => q.includes(k))) {
                return item.reply;
            }
        }
        return `Pesisir Barat (Krui) memiliki pesona alam dan surfing yang luar biasa! Untuk informasi spesifik mengenai "${query}", Anda juga dapat langsung berkonsultasi dengan pemandu lokal kami atau klik tombol <strong>Pesan Sekarang</strong> di bagian atas! 🏄‍♂️✨`;
    }

    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
}

// 6. Booking Modal Functionality
function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.getElementById('close-booking-modal');
    const openBtns = document.querySelectorAll('.open-booking-modal');
    const form = document.getElementById('booking-form-submit');
    const destSelect = document.getElementById('book-dest');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetName = btn.getAttribute('data-target-name');
            if (targetName && destSelect) {
                for (let option of destSelect.options) {
                    if (option.text.includes(targetName) || option.value.includes(targetName)) {
                        option.selected = true;
                        break;
                    }
                }
            }
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('book-name').value;
            const dest = destSelect.value;
            const date = document.getElementById('book-date').value;

            modal.classList.remove('active');
            showToast(`Terima kasih, ${name}! Reservasi untuk ${dest} pada ${date} berhasil dicatat.`);
            form.reset();
        });
    }
}

// Helper: Toast Notification
function showToast(message) {
    const toast = document.getElementById('pb-toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
