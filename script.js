let countdownTimer = null;

function go(id) {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'countdown') startCountdown();
  if (id === 'puzzle') resetMatchGame();
}

function startCountdown() {
  let n = 3;
  const el = document.getElementById('countNumber');

  el.textContent = n;

  countdownTimer = setInterval(() => {
    n--;

    if (n <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      showPuzzle();
    } else {
      el.textContent = n;
    }
  }, 1000);
}

function showPuzzle() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  go('puzzle');
}

let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

function flipCard(card) {
  if (
    lockBoard ||
    card.classList.contains('revealed') ||
    card.classList.contains('matched')
  ) {
    return;
  }

  const pictures = {
    star: '⭐',
    heart: '💖',
    gift: '🎁'
  };

  card.textContent = pictures[card.dataset.pair];
  card.classList.add('revealed');
  card.setAttribute('aria-label', pictures[card.dataset.pair]);

  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;

    if (first.dataset.pair === second.dataset.pair) {
      first.classList.remove('revealed');
      second.classList.remove('revealed');

      first.classList.add('matched');
      second.classList.add('matched');

      first.disabled = true;
      second.disabled = true;

      matchedPairs++;
      flippedCards = [];

      document.getElementById('matchFeedback').textContent =
        matchedPairs === 3
          ? 'Yaaay! You matched them all, Mahira! 🥳💗'
          : 'Yay! That is a match! Find the next pair. 🌟';

      if (matchedPairs === 3) {
        document.getElementById('unlock').style.display = 'inline-block';
      }
    } else {
      lockBoard = true;

      document.getElementById('matchFeedback').textContent =
        'Almost! Try another pair, little star. 💕';

      setTimeout(() => {
        first.textContent = '❔';
        second.textContent = '❔';

        first.classList.remove('revealed');
        second.classList.remove('revealed');

        first.setAttribute('aria-label', 'Mystery picture');
        second.setAttribute('aria-label', 'Mystery picture');

        flippedCards = [];
        lockBoard = false;
      }, 850);
    }
  }
}

function resetMatchGame() {
  matchedPairs = 0;
  flippedCards = [];
  lockBoard = false;

  const grid = document.getElementById('matchGrid');

  const pairs = [
    'star', 'heart', 'gift',
    'gift', 'star', 'heart'
  ];

  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  [...grid.querySelectorAll('.match-card')].forEach((card, i) => {
    card.dataset.pair = pairs[i];
    card.textContent = '❔';
    card.disabled = false;

    card.classList.remove('revealed', 'matched');
    card.setAttribute('aria-label', 'Mystery picture');
  });

  document.getElementById('matchFeedback').textContent =
    'Find the matching pictures! 🌸';

  document.getElementById('unlock').style.display = 'none';
}

function openGift() {
  document.getElementById('giftEmoji').textContent = '🎊';

  setTimeout(() => {
    go('galleryScreen');
  }, 450);
}

// 🎵 Birthday music
function setMusicButton(playing) {
  const button = document.getElementById('musicBtn');
  if (button) button.textContent = playing ? '⏸️ Pause Music' : '🎵 Play Music';
}

// Called when she taps YES (a tap is required by browsers to allow sound)
function startMusic() {
  const music = document.getElementById('birthdayMusic');
  if (!music || !music.paused) return;
  music.volume = 0.7;
  music.play().then(() => setMusicButton(true)).catch(() => setMusicButton(false));
}

function toggleMusic() {
  const music = document.getElementById('birthdayMusic');
  if (!music) return;
  if (music.paused) {
    music.play().then(() => setMusicButton(true)).catch(() => {
      alert('Could not play music/birthday.mp3. Please check the file is in the music folder.');
    });
  } else {
    music.pause();
    setMusicButton(false);
  }
}
