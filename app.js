/* ==========================================================================
   SÖZÜN GÜCÜ | SÖZLÜ İLETİŞİM ENGELLERİ PORTALI JAVASCRIPT
   İnteraktif Simülatörler, Teleprompter, Sayaç ve Arka Plan Efekti
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // 1. DİNAMİK PARÇACIK TUVALİ (ARKA PLAN İLETİŞİM AĞI)
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 45);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const isLight = document.body.getAttribute('data-theme') === 'light';
        ctx.fillStyle = isLight ? 'rgba(99, 102, 241, 0.4)' : 'rgba(34, 211, 238, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Parçacıkları bağlayan iletişim çizgileri
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const isLight = document.body.getAttribute('data-theme') === 'light';
            const alpha = (1 - dist / 130) * (isLight ? 0.15 : 0.22);
            ctx.strokeStyle = isLight ? `rgba(99, 102, 241, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // -------------------------------------------------------------------------
  // 2. TEMA DEĞİŞTİRME & TAM EKRAN (AKILLI TAHTA) MODU
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('sozun-gucu-theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('sozun-gucu-theme', nextTheme);
      showToast(`Tema değiştirildi: ${nextTheme === 'dark' ? 'Koyu Gece' : 'Aydınlık'}`);
    });
  }

  // Tam Ekran Düğmesi
  const fullscreenBtn = document.getElementById('fullscreen-toggle-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        showToast('Akıllı Tahta / Tam Ekran Moduna Geçildi');
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          showToast('Tam Ekrandan Çıkıldı');
        }
      }
    });
  }

  // Mobil Menü
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
    // Menüdeki bir linke tıklanınca kapat
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('mobile-open'));
    });
  }

  // -------------------------------------------------------------------------
  // 3. ENGELLER ATLASI KATEGORİ FİLTRELEME
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('#barrier-filter-tabs .filter-tab-btn');
  const barrierCards = document.querySelectorAll('#barriers-container .barrier-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      barrierCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 4. KULAKTAN KULAĞA MESAJ BOZULMASI (TELEPHONE GAME DENEYİ)
  // -------------------------------------------------------------------------
  const telephoneSteps = [
    {
      role: "1. Konuşmacı",
      badge: "Kaynak",
      flaw: "flaw-clean",
      flawText: "Orijinal ve Duru",
      text: "“Yarın edebiyat öğretmeni ikinci ders saatinde kütüphanede konuşma sınavı değerlendirmesini yapacak.”",
      truth: 100,
      bias: 0,
      comment: "Kaynak konuşmacı mesajı net ve yalın bir şekilde aktardı. Bilgi kaybı yok."
    },
    {
      role: "2. Dinleyici",
      badge: "Dikkatsiz",
      flaw: "flaw-loss",
      flawText: "Ayrıntı Kaybı",
      text: "“Edebiyat öğretmeni yarın kütüphanede bir sınav yapacakmış galiba.”",
      truth: 70,
      bias: 15,
      comment: "Zaman (ikinci ders saati) ve sınavın 'konuşma sınavı değerlendirmesi' olduğu bilgisi unutuldu. Alıcı seçici dinleme yaptı."
    },
    {
      role: "3. Aktarıcı",
      badge: "Önyargılı",
      flaw: "flaw-bias",
      flawText: "Duygusal Çarpıtma",
      text: "“Yarın kütüphanede edebiyattan çok zor bir sınav varmış, hoca herkesi bırakacakmış!”",
      truth: 40,
      bias: 55,
      comment: "Önyargı ve sınav korkusu devreye girdi. Olmayan bir bilgi ('herkesi bırakacakmış') mesaja şahsi kaygılarla eklendi."
    },
    {
      role: "4. Aktarıcı",
      badge: "Fısıltı",
      flaw: "flaw-bias",
      flawText: "Kaotik Sapma",
      text: "“Duydunuz mu, edebiyat öğretmeni kütüphanede bütün sınıfa sıfır vermiş!”",
      truth: 20,
      bias: 80,
      comment: "Zaman kipi tamamen değişti; yarınki sınav geçmişte yaşanmış bir felakete dönüştü."
    },
    {
      role: "5. Alıcı",
      badge: "Dedikodu",
      flaw: "flaw-bias",
      flawText: "Tam Deformasyon",
      text: "“Okul kütüphanesinde edebiyat dersinde büyük kriz çıkmış, müdür bile olaya karışmış!”",
      truth: 5,
      bias: 95,
      comment: "Orijinal mesajla tek ortak kelime 'kütüphane' kaldı. İletişim engelleri basit bir sınav duyurusunu şehir efsanesine dönüştürdü!"
    }
  ];

  let currentTeleStep = 0;
  const teleContainer = document.getElementById('telephone-flow-container');
  const teleNextBtn = document.getElementById('telephone-next-btn');
  const teleResetBtn = document.getElementById('telephone-reset-btn');
  const distTruthBar = document.getElementById('dist-truth-bar');
  const distTruthText = document.getElementById('dist-truth-text');
  const distBiasBar = document.getElementById('dist-bias-bar');
  const distBiasText = document.getElementById('dist-bias-text');
  const teleCommentary = document.getElementById('telephone-commentary');

  function renderTelephoneSteps() {
    if (!teleContainer) return;
    teleContainer.innerHTML = '';

    telephoneSteps.forEach((step, idx) => {
      const node = document.createElement('div');
      node.className = `phone-node ${idx <= currentTeleStep ? 'active-step' : ''}`;
      node.innerHTML = `
        <div class="node-role-badge">
          <div>${step.role}</div>
          <small style="color: var(--accent-cyan);">${step.badge}</small>
        </div>
        <div class="node-text">${step.text}</div>
        <div class="node-flaw-tag ${step.flaw}">${step.flawText}</div>
      `;
      teleContainer.appendChild(node);
    });

    const activeData = telephoneSteps[currentTeleStep];
    if (distTruthBar) distTruthBar.style.width = `${activeData.truth}%`;
    if (distTruthText) distTruthText.textContent = `${activeData.truth}%`;
    if (distBiasBar) distBiasBar.style.width = `${activeData.bias}%`;
    if (distBiasText) distBiasText.textContent = `${activeData.bias}%`;
    if (teleCommentary) {
      teleCommentary.innerHTML = `<strong>Adım ${currentTeleStep + 1} Analizi:</strong> ${activeData.comment}`;
    }

    if (teleNextBtn) {
      if (currentTeleStep >= telephoneSteps.length - 1) {
        teleNextBtn.textContent = '🎉 Deney Tamamlandı';
        teleNextBtn.disabled = true;
      } else {
        teleNextBtn.textContent = 'Bir Sonraki Adıma Aktar ➡️';
        teleNextBtn.disabled = false;
      }
    }
  }

  if (teleNextBtn) {
    teleNextBtn.addEventListener('click', () => {
      if (currentTeleStep < telephoneSteps.length - 1) {
        currentTeleStep++;
        renderTelephoneSteps();
      }
    });
  }

  if (teleResetBtn) {
    teleResetBtn.addEventListener('click', () => {
      currentTeleStep = 0;
      renderTelephoneSteps();
      showToast('Kulaktan Kulağa deneyi sıfırlandı');
    });
  }
  renderTelephoneSteps();

  // -------------------------------------------------------------------------
  // 5. 28 KİŞİLİK SINIF ETKİLEŞİMİ (ŞANSLI NUMARA ÇARKI & TEST)
  // -------------------------------------------------------------------------
  const classQuestions = [
    {
      q: "1. Arkadaşın seninle konuşurken göz teması kurmayıp sürekli telefonundaki bildirimlere bakıyorsa, aranızda hangi iletişim engeli oluşur?",
      choices: [
        "A) Fiziksel ve Akustik Engel",
        "B) İlgisizlik ve Psikolojik / Dinlememe Engeli",
        "C) Dilsel ve Semantik Engel",
        "D) Kültürel Beden Dili Farkı"
      ],
      correct: 1,
      exp: "Doğru! Dinlememek, ilgiyi başka yere vermek karşı tarafa değersizlik hissettirir ve en yaygın psikolojik iletişim engelidir."
    },
    {
      q: "2. Bir bilişim uzmanının yaşlı bir komşusuna 'Modeminizin gateway IP konfigürasyonunda paket kaybı ve latency oluşmuş' demesi hangi engeli doğurur?",
      choices: [
        "A) Ağdalı Dil ve Mesleki Jargon (Semantik) Engeli",
        "B) Fiziksel Mesafe Engeli",
        "C) Savunmacı Dinleme",
        "D) Aşırı Yorgunluk"
      ],
      correct: 0,
      exp: "Doğru! Karşımızdakinin bilmediği terimlerle konuşmak semantik bir duvardır. Duru ve yalın Türkçe kullanılmalıdır."
    },
    {
      q: "3. Sınıfta bir arkadaşın kürsüde konuşurken 'Ben bu konuyu zaten biliyorum, bana yeni bir şey katamaz' diyerek dinlemeyi bırakmak ne tür bir engeldir?",
      choices: [
        "A) Çevresel Gürültü",
        "B) Önyargı ve Zihinsel Filtreleme Engeli",
        "C) Diksiyon Yetersizliği",
        "D) Kanal Uyumsuzluğu"
      ],
      correct: 1,
      exp: "Doğru! Önyargı, zihnin kapılarını peşinen kapatarak iletişimi daha başlamadan öldüren psikolojik bir engeldir."
    },
    {
      q: "4. Yunus Emre'nin 'Söz ola kese savaşı, söz ola kestire başı' dizesi iletişimin hangi temel gerçeğini vurgular?",
      choices: [
        "A) Sözün yapıcı veya yıkıcı devasa bir güce sahip olduğunu",
        "B) İnsanların daima sessiz kalması gerektiğini",
        "C) Sözlü iletişimin önemsiz olduğunu",
        "D) Konuşurken sadece yabancı kelimelerin seçilmesi gerektiğini"
      ],
      correct: 0,
      exp: "Harika! Doğru ve özenle seçilmiş söz gönül köprüsü kurarken, dikkatsiz ve kırıcı sözler büyük çatışmalara sebep olur."
    },
    {
      q: "5. Biraz önce yaptığımız 'Kulaktan Kulağa' deneyinde orijinal mesajın bambaşka bir dedikoduya dönüşmesinin temel sebebi nedir?",
      choices: [
        "A) Havada ses dalgalarının yok olması",
        "B) İnsanların mesajı kendi önyargıları, dikkatsizlikleri ve abartılarıyla aktarması",
        "C) Kütüphanenin çok uzak bir yer olması",
        "D) Harflerin alfabetik sırasının karışması"
      ],
      correct: 1,
      exp: "Tebrikler! İnsanlar duyduklarını olduğu gibi değil; kendi duygu, korku ve önyargı filtrelerinden geçirerek aktarır."
    }
  ];

  let currentClassQIndex = 0;
  let classScore = 0;
  let currentLuckySeat = null;

  const luckySeatNumber = document.getElementById('lucky-seat-number');
  const luckySeatText = document.getElementById('lucky-seat-text');
  const reSpinSeatBtn = document.getElementById('re-spin-seat-btn');

  const quizCurrentNum = document.getElementById('quiz-current-num');
  const quizTotalNum = document.getElementById('quiz-total-num');
  const quizScoreEl = document.getElementById('quiz-score');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizChoicesContainer = document.getElementById('quiz-choices-container');
  const quizExplanationBox = document.getElementById('quiz-explanation-box');
  const feedbackText = document.getElementById('feedback-text');
  const quizNextBtn = document.getElementById('quiz-next-question-btn');
  const quizResultBox = document.getElementById('quiz-result-box');
  const quizBody = document.getElementById('quiz-body');
  const finalScoreVal = document.getElementById('final-score-val');
  const quizRestartBtn = document.getElementById('quiz-restart-btn');

  if (quizTotalNum) quizTotalNum.textContent = classQuestions.length;

  // 1 - 28 Arası Rastgele Numara Çekme & Animasyon
  function rollLuckySeat(callback) {
    if (!luckySeatNumber) return;

    luckySeatNumber.classList.add('rolling');
    if (luckySeatText) {
      luckySeatText.innerHTML = `🎲 <em>1-28 arasından şanslı numara çekiliyor...</em>`;
    }

    let counter = 0;
    const rollInterval = setInterval(() => {
      const tempNum = Math.floor(Math.random() * 28) + 1;
      luckySeatNumber.textContent = tempNum;
      counter++;

      if (counter >= 10) {
        clearInterval(rollInterval);
        const finalSeat = Math.floor(Math.random() * 28) + 1;
        currentLuckySeat = finalSeat;
        luckySeatNumber.textContent = finalSeat;
        luckySeatNumber.classList.remove('rolling');

        if (luckySeatText) {
          luckySeatText.innerHTML = `🎯 Bu soruyu <strong>${finalSeat} Numaralı</strong> sırada oturan arkadaşımız cevaplıyor!`;
        }

        if (callback) callback(finalSeat);
      }
    }, 60);
  }

  if (reSpinSeatBtn) {
    reSpinSeatBtn.addEventListener('click', () => {
      rollLuckySeat((num) => {
        showToast(`Yeni şanslı kişi: ${num} Numaralı sıra! 🎲`);
      });
    });
  }

  function loadClassQuestion(index) {
    if (!quizQuestionText) return;
    const qData = classQuestions[index];
    if (quizCurrentNum) quizCurrentNum.textContent = index + 1;
    quizQuestionText.textContent = qData.q;
    if (quizChoicesContainer) quizChoicesContainer.innerHTML = '';
    if (quizExplanationBox) quizExplanationBox.style.display = 'none';

    // Her yeni soruda 1-28 rastgele sıra çekilir
    rollLuckySeat();

    qData.choices.forEach((choice, cIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleClassAnswer(cIdx, qData.correct, qData.exp));
      quizChoicesContainer.appendChild(btn);
    });
  }

  function handleClassAnswer(selectedIndex, correctIndex, exp) {
    const allOptions = quizChoicesContainer.querySelectorAll('.quiz-option-btn');
    allOptions.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIndex) {
        btn.classList.add('opt-correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('opt-wrong');
      }
    });

    if (selectedIndex === correctIndex) {
      classScore += 20;
      if (quizScoreEl) quizScoreEl.textContent = classScore;
      feedbackText.innerHTML = `👏 <strong>Tebrikler ${currentLuckySeat} numara!</strong> ${exp}`;
    } else {
      feedbackText.innerHTML = `💡 <strong>Sağlık olsun ${currentLuckySeat} numara!</strong> ${exp}`;
    }

    if (quizExplanationBox) quizExplanationBox.style.display = 'flex';
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      if (currentClassQIndex < classQuestions.length - 1) {
        currentClassQIndex++;
        loadClassQuestion(currentClassQIndex);
      } else {
        // Quiz bitti
        if (quizBody) quizBody.style.display = 'none';
        if (quizExplanationBox) quizExplanationBox.style.display = 'none';
        if (quizResultBox) {
          quizResultBox.style.display = 'block';
          if (finalScoreVal) finalScoreVal.textContent = classScore;
        }
      }
    });
  }

  if (quizRestartBtn) {
    quizRestartBtn.addEventListener('click', () => {
      currentClassQIndex = 0;
      classScore = 0;
      if (quizScoreEl) quizScoreEl.textContent = '0';
      if (quizResultBox) quizResultBox.style.display = 'none';
      if (quizBody) quizBody.style.display = 'block';
      loadClassQuestion(0);
      showToast('Sınıf testi ve çark yeniden başlatıldı! 🎯');
    });
  }

  // İlk soruyu ve ilk şanslı numarayı yükle
  loadClassQuestion(0);
  // -------------------------------------------------------------------------
  // 8. EDEBİ ALINTILARI PANODAN KOPYALAMA
  // -------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.quote-copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const quote = btn.getAttribute('data-quote');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(quote).then(() => {
          showToast('Alıntı panoya kopyalandı! 📋');
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 11. YARDIMCI TOAST BİLDİRİMİ
  // -------------------------------------------------------------------------
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

});
