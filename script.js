const keys = document.querySelectorAll('.key');
const piano = document.getElementById('piano');
const finalScreen = document.getElementById('final');

/*
  Sequência fixa (5 acertos)
*/
const sequence = [0, 2, 1, 4, 3];
let userIndex = 0;
let acceptingInput = false;

/* Audio */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(freq) {
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.35);
}

/* Frequências */
const sounds = [
  261, 293, 329, 349, 392, 440, // brancas
  277, 311, 370                // pretas
];

/* Mostrar sequência */
function playSequence() {
  acceptingInput = false;
  let i = 0;

  const interval = setInterval(() => {
    const index = sequence[i];
    const key = document.querySelector(`[data-key="${index}"]`);

    key.classList.add('active');
    playNote(sounds[index]);

    setTimeout(() => key.classList.remove('active'), 400);

    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      acceptingInput = true;
    }
  }, 700);
}

/* Clique */
keys.forEach(key => {
  key.addEventListener('click', () => {
    if (!acceptingInput) return;

    const index = Number(key.dataset.key);
    playNote(sounds[index]);

    key.classList.add('active');
    setTimeout(() => key.classList.remove('active'), 200);

    if (index === sequence[userIndex]) {
      userIndex++;

      if (userIndex === sequence.length) {
        setTimeout(showFinal, 700);
      }
    } else {
      userIndex = 0;
      acceptingInput = false;
      setTimeout(playSequence, 1200);
    }
  });
});

/* Final */
function showFinal() {
  piano.style.opacity = '0';

  setTimeout(() => {
    piano.style.display = 'none';
    finalScreen.style.display = 'flex';
  }, 600);
}

/* Início */
setTimeout(playSequence, 1200);
