document.addEventListener('DOMContentLoaded', () => {

  // Observer for Entrance Animations (scroll-fade)
  const fadeElements = document.querySelectorAll('.scroll-fade');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Trigger specific logic based on section
        if (entry.target.classList.contains('progress-container')) {
          const bar = entry.target.querySelector('.progress-bar');
          if(bar) bar.style.width = '75%';
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // Advanced Parallax System
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  let scrollY = window.scrollY;
  let requestId = null;

  function updateParallax() {
    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-depth'));
      // The larger the depth, the faster it translates
      const movement = -(scrollY * depth);
      const currentTransform = layer.style.transform;
      
      // Preserve existing translate/scale from anti-gravity if needed?
      // Since anti-gravity is via animation, we need to apply parallax to a wrapper to avoid collision
      layer.style.transform = `translate3d(0, ${movement}px, 0)`;
    });
    requestId = null;
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if(!requestId) {
      requestId = requestAnimationFrame(updateParallax);
    }
  }, { passive: true });


  // Fake Live Activity Feed Manager
  const activityNames = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Casey"];
  const activityActions = ["unlocked 500 Data Credits", "reached Level 3", "referred a friend! +250 XP", "monetized weekly dataset"];
  const activityContainer = document.getElementById('live-activity');

  function triggerFakeActivity() {
    if(!activityContainer) return;

    const name = activityNames[Math.floor(Math.random() * activityNames.length)];
    const action = activityActions[Math.floor(Math.random() * activityActions.length)];

    const item = document.createElement('div');
    item.className = 'activity-item glass';
    item.innerHTML = `
      <div class="activity-icon"></div>
      <div><strong>${name}</strong> just ${action}</div>
    `;

    activityContainer.appendChild(item);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        item.classList.add('show');
      });
    });

    // Remove after 4 seconds
    setTimeout(() => {
      item.classList.remove('show');
      setTimeout(() => {
        item.remove();
      }, 500); // Wait for transition
    }, 4000);

    // Schedule next
    const nextTime = Math.random() * 5000 + 3000; // 3 to 8 seconds
    setTimeout(triggerFakeActivity, nextTime);
  }

  setTimeout(triggerFakeActivity, 2000);

  // Modal & Verification Logic
  const btnStart = document.getElementById('btn-start');
  const modalOverlay = document.getElementById('verification-modal');
  const btnClose = document.getElementById('btn-close');
  const btnMute = document.getElementById('btn-mute');
  const audio = document.getElementById('ambient-audio');
  
  const formState = document.getElementById('modal-state-form');
  const processingState = document.getElementById('modal-state-processing');
  const successState = document.getElementById('modal-state-success');
  const verifyForm = document.getElementById('verification-form');
  const progressText = document.getElementById('processing-text');
  const progressFill = document.getElementById('modal-progress');

  const multiTexts = [
    "Verifying Game ID...",
    "Conectando a los servidores...",
    "Verificando ID do Jogo...",
    "Validating secure handshake...",
    "गेम आईडी सत्यापित कर रहा है...",
    "Establishing pipeline..."
  ];

  let isAuthenticated = false;
  let pendingVerificationFlow = false;

  const authModal = document.getElementById('auth-modal');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  const authForm = document.getElementById('auth-form');
  const authSwitchBtn = document.getElementById('auth-switch-btn');
  const authTitle = document.getElementById('auth-title');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authSwitchText = document.getElementById('auth-switch-text');
  const navLoginBtn = document.getElementById('nav-login-btn');

  let isSignUpMode = false;

  function openAuthModal() {
    if(authModal) authModal.classList.add('show');
  }

  function closeAuthModal() {
    if(authModal) authModal.classList.remove('show');
    if(authForm) authForm.reset();
  }

  if (navLoginBtn) {
    navLoginBtn.addEventListener('click', () => {
      if (!isAuthenticated) {
        pendingVerificationFlow = false;
        openAuthModal();
      } else {
        alert("Session active. You are already securely logged in.");
      }
    });
  }

  if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if(e.target === authModal) closeAuthModal();
    });
  }

  if (authSwitchBtn) {
    authSwitchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isSignUpMode = !isSignUpMode;
      authTitle.innerText = isSignUpMode ? "Create Account" : "Welcome Back";
      authSubmitBtn.innerText = isSignUpMode ? "Register" : "Sign In";
      authSwitchText.innerText = isSignUpMode ? "Already have an account?" : "Don't have an account?";
      authSwitchBtn.innerText = isSignUpMode ? "Sign In" : "Sign Up";
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btnOriginalText = authSubmitBtn.innerText;
      authSubmitBtn.innerText = "Authenticating...";
      authSubmitBtn.disabled = true;

      // Simulate a network request
      setTimeout(() => {
        isAuthenticated = true;
        navLoginBtn.innerText = "My Account";
        navLoginBtn.classList.remove('btn-glass');
        navLoginBtn.classList.add('btn-glow');
        navLoginBtn.style.background = 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))';
        
        closeAuthModal();
        authSubmitBtn.innerText = btnOriginalText;
        authSubmitBtn.disabled = false;
        
        if (pendingVerificationFlow) {
          openVerificationModal();
          pendingVerificationFlow = false;
        }
      }, 1500);
    });
  }

  function openVerificationModal() {
    modalOverlay.classList.add('show');
    if (!audioPlaying && audio) {
      audio.play().catch(e => console.log('Audio autoplay blocked', e));
      audioPlaying = true;
      btnMute.innerHTML = '🔊';
    }
  }

  function handleStartEarning() {
    if (isAuthenticated) {
      openVerificationModal();
    } else {
      pendingVerificationFlow = true;
      openAuthModal();
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
    setTimeout(() => {
      formState.classList.add('active');
      formState.classList.remove('hidden');
      processingState.classList.remove('active');
      processingState.classList.add('hidden');
      successState.classList.remove('active');
      successState.classList.add('hidden');
      if(progressFill) progressFill.style.width = '0%';
      if(verifyForm) verifyForm.reset();
      
      clearInterval(timerInterval);
      const timerEl = document.getElementById('countdown-timer');
      if (timerEl) timerEl.innerText = '59:59';
      
      adWatchCount = 0;
      shareCount = 0;
      if (btnWatchAd) {
        btnWatchAd.style.display = 'block';
        btnWatchAd.innerHTML = "▶ Unlock Now";
        btnWatchAd.disabled = true;
        btnWatchAd.style.opacity = '0.5';
      }
      const rewardEl = document.getElementById('reward-amount');
      if (rewardEl) rewardEl.innerText = "100 Diamonds/UC";

      if (btnShare) {
        btnShare.innerText = "📱 Share to 2 Friends";
        btnShare.classList.add('btn-glass');
        btnShare.style.background = '';
        btnShare.style.color = '';
        btnShare.disabled = false;
      }
      if (offerTitle) offerTitle.innerText = "Double Your Reward?";
      if (offerDesc) offerDesc.innerHTML = "Earn <strong>200 Diamonds/UC</strong> by completing the tasks below!";
    }, 400); // Wait for fade out
  }

  if (btnStart) btnStart.addEventListener('click', handleStartEarning);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if(e.target === modalOverlay) closeModal();
    });
  }

  if (btnMute && audio) {
    btnMute.addEventListener('click', () => {
      audio.muted = !audio.muted;
      btnMute.innerHTML = audio.muted ? '🔇' : '🔊';
    });
  }

  if (verifyForm) {
    verifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const gameId = document.getElementById('game-id').value.trim();
      const username = document.getElementById('username').value.trim();
      
      // Basic validation: Game ID must be numeric (at least 5 digits), Username must be at least 3 chars
      if (!/^\d{5,20}$/.test(gameId)) {
        alert("Verification Failed: Invalid Game ID. Please ensure your ID contains only valid numbers.");
        return;
      }
      if (username.length < 3) {
        alert("Verification Failed: Username too short. Minimum 3 characters required.");
        return;
      }
      
      formState.classList.remove('active');
      setTimeout(() => formState.classList.add('hidden'), 200);

      setTimeout(() => {
        processingState.classList.remove('hidden');
        processingState.classList.add('active');
        
        let progress = 0;
        let textIndex = 0;
        
        const textInterval = setInterval(() => {
          textIndex = (textIndex + 1) % multiTexts.length;
          progressText.innerText = multiTexts[textIndex];
        }, 700);

        const progressInterval = setInterval(() => {
          progress += Math.random() * 15;
          if(progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            clearInterval(textInterval);
            
            setTimeout(() => {
              processingState.classList.remove('active');
              processingState.classList.add('hidden');
              successState.classList.remove('hidden');
              successState.classList.add('active');

              startTimer();
            }, 500);
          }
          if(progressFill) progressFill.style.width = `${progress}%`;
        }, 400);
        
      }, 200);
    });
  }

  let timerInterval;

  function startTimer() {
    let timeLeft = 3599; // 59:59
    const timerEl = document.getElementById('countdown-timer');
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      let m = Math.floor(timeLeft / 60);
      let s = timeLeft % 60;
      if(timerEl) timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      if (timeLeft <= 0) clearInterval(timerInterval);
    }, 1000);
  }

  const btnShare = document.getElementById('btn-share');
  const btnWatchAd = document.getElementById('btn-watch-ad');
  const offerTitle = document.getElementById('offer-title');
  const offerDesc = document.getElementById('offer-desc');

  let adWatchCount = 0;
  let shareCount = 0;
  
  const adModal = document.getElementById('ad-modal');
  const btnCloseAd = document.getElementById('btn-close-ad');
  const adTimerEl = document.getElementById('ad-timer');
  
  let adInterval;
  let adCompleted = false;
  
  if (btnWatchAd) {
    // Hidden / Disabled by default until shares are complete
    btnWatchAd.disabled = true;
    btnWatchAd.style.opacity = '0.5';

    btnWatchAd.addEventListener('click', () => {
      // 1. Display Ad Modal overlay
      if(adModal) adModal.classList.add('show');
      
      // 2. Initialize timer values
      adCompleted = false;
      let adTimeLeft = 30; // 30 seconds required
      if(adTimerEl) adTimerEl.innerText = adTimeLeft;
      if(btnCloseAd) btnCloseAd.style.background = 'rgba(255,255,255,0.2)';

      // 3. Start 30s Countdown
      clearInterval(adInterval);
      adInterval = setInterval(() => {
        adTimeLeft--;
        if(adTimerEl) adTimerEl.innerText = adTimeLeft;
        
        if (adTimeLeft <= 0) {
          clearInterval(adInterval);
          adCompleted = true;
          if(adTimerEl) adTimerEl.innerText = '0';
          if(btnCloseAd) btnCloseAd.style.background = 'rgba(0, 255, 100, 0.8)'; // Safe to close indicator
        }
      }, 1000);
    });
  }

  // Handle premature Ad closing
  if (btnCloseAd) {
    btnCloseAd.addEventListener('click', () => {
      if (!adCompleted) {
        alert("Warning: You must watch the complete ad (30 seconds) to receive your reward!");
        return; // Stops modal from closing!
      }
      
      // Close modal
      if(adModal) adModal.classList.remove('show');
      
      // Apply the actual rewards upon successful completion
      adWatchCount++;
      const rewardEl = document.getElementById('reward-amount');

      if (adWatchCount === 1) {
        if (offerTitle) offerTitle.innerText = "Amazing! Keep Going.";
        if (offerDesc) offerDesc.innerHTML = "You're eligible for <strong>400 Diamonds/UC</strong>! Keep unlocking to reach the max tier.";
        if (btnWatchAd) btnWatchAd.innerHTML = "▶ Unlock Another (400 UC)";
        if (rewardEl) rewardEl.innerText = "200 Diamonds/UC";
      } else if (adWatchCount >= 2) {
        if (offerTitle) offerTitle.innerText = "Max Reward Unlocked!";
        if (offerDesc) offerDesc.innerHTML = "You've secured <strong>400 Diamonds/UC</strong> in the next payout.";
        if (btnWatchAd) btnWatchAd.style.display = 'none';
        if (rewardEl) rewardEl.innerText = "400 Diamonds/UC";
      }
    });
  }

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      // Redirect to WhatsApp
      const shareUrl = "Claim your free 400 Diamonds/UC now! Check this out right away: https://nexus-mobile-rewards.dev";
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`, '_blank');
      
      shareCount++;
      
      if (shareCount === 1) {
        btnShare.innerText = "📱 Shared (1/2) - Share Again";
      } else if (shareCount >= 2) {
        btnShare.innerText = "✔ Tasks Completed!";
        btnShare.classList.remove('btn-glass');
        btnShare.style.background = 'rgba(0, 255, 100, 0.2)';
        btnShare.style.color = '#fff';
        btnShare.disabled = true;
        
        // Enable Ad Button
        if (btnWatchAd) {
          btnWatchAd.disabled = false;
          btnWatchAd.style.opacity = '1';
        }
      }
    });
  }

});
