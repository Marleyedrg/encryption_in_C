// enigma.ts
// Criptografia estilo Enigma com ROTOR_SIZE rotores (1 por caractere do alfabeto).
// Simétrica e reversível: criptografar o texto cifrado com a mesma senha restaura o texto original.

// ── 1. ALFABETO E TAMANHO DOS ROTORES ──────────────────────────────
const ALPHABET =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`' +
  'abcdefghijklmnopqrstuvwxyz{|}~' +
  'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß' +
  'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ';

const ROTOR_SIZE = ALPHABET.length; // Exatamente 159 rotores
const MAX_INDEX  = ROTOR_SIZE - 1;  // Índice 158

const CHAR_TO_INDEX = new Map<string, number>();
for (let i = 0; i < ALPHABET.length; i++) {
  CHAR_TO_INDEX.set(ALPHABET[i], i);
}

// ── 2. ESTADO DOS ROTORES ──────────────────────────────────────────
const rotors: number[] = new Array(ROTOR_SIZE).fill(1);

// ── 3. DERIVAÇÃO PROPORCIONAL DE CHAVE ──────────────────────────────
function deriveRotors(password: string, charIndex: number, msgLength: number): void {
  const pwdLen = password.length;
  if (pwdLen === 0) return;

  for (let r = 0; r < ROTOR_SIZE; r++) {
    const pwdChar = password[(charIndex + r) % pwdLen];
    const pwdVal = CHAR_TO_INDEX.get(pwdChar) ?? (pwdChar.codePointAt(0)! % ROTOR_SIZE);

    const mix =
      (pwdVal + 1) * (r * r + 3 * r + 7) +
      (charIndex + 1) * pwdLen +
      msgLength * (r + 7);

    rotors[r] = (mix % ROTOR_SIZE);
  }
}

// ── 4. SUBPROGRAMAS DOS ROTORES (IDA E VOLTA) ───────────────────────
function rotorForward(position: number, letter: number): number {
  letter = letter + position;
  if (letter > MAX_INDEX) {
    letter = letter - ROTOR_SIZE;
  }
  return letter % ROTOR_SIZE;
}

function rotorBackward(position: number, letter: number): number {
  letter = letter - position;
  if (letter < 0) {
    letter = (letter % ROTOR_SIZE + ROTOR_SIZE) % ROTOR_SIZE;
  }
  return letter % ROTOR_SIZE;
}

// ── 5. STEPPING (MECANISMO DE ENGRENAGENS) ─────────────────────────
function stepping(counter: number): void {
  if (counter === 0) return;

  for (let n = 1; n < ROTOR_SIZE; n++) {
    if (counter % (n + 1) === 0) {
      rotors[n] = (rotors[n] + 1) % ROTOR_SIZE;
    }
  }
}

// ── 6. REFLECTOR (ESPELHO INVOLUTIVO) ──────────────────────────────
function reflector(letter: number): number {
  letter = letter + (ROTOR_SIZE - 1);

  if (letter > MAX_INDEX) {
    letter = MAX_INDEX - (letter - MAX_INDEX);
  }

  return (letter + ROTOR_SIZE) % ROTOR_SIZE;
}

// ── 7. FUNÇÃO PRINCIPAL DE CRIPTOGRAFIA / DESCRIPTOGRAFIA ──────────
export function encrypt(phrase: string, password: string): string {
  const chars = [...phrase];
  const msgLength = chars.length;
  let counter = 0;

  for (let i = 0; i < chars.length; i++) {
    const idx = CHAR_TO_INDEX.get(chars[i]);
    if (idx === undefined) {
      continue;
    }

    deriveRotors(password, i, msgLength);

    let currentLetter = idx;

    // FASE 1: Ida pelos 159 rotores (0 -> 158)
    for (let r = 0; r < ROTOR_SIZE; r++) {
      currentLetter = rotorForward(rotors[r], currentLetter);
    }

    // FASE 2: Espelhamento no Reflector
    currentLetter = reflector(currentLetter);

    // FASE 3: Volta oposta pelos 159 rotores (158 -> 0)
    for (let r = ROTOR_SIZE - 1; r >= 0; r--) {
      currentLetter = rotorBackward(rotors[r], currentLetter);
    }

    chars[i] = ALPHABET[currentLetter];

    counter += 1;
    if (counter > ROTOR_SIZE) {
      counter = counter - ROTOR_SIZE;
    }
    stepping(counter);
  }

  return chars.join('');
}

// ── 8. CONEXÃO COM A INTERFACE (UI) ────────────────────────────────
export function runEncryption(): void {
  const phraseInput = document.getElementById('phrase') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  const phrase = phraseInput.value;
  const password = passwordInput.value;

  if (!phrase) return;

  if (!password) {
    passwordInput.classList.add('error');
    passwordInput.placeholder = 'password is required!';
    passwordInput.focus();
    return;
  }
  passwordInput.classList.remove('error');

  try {
    const encrypted = encrypt(phrase, password);
    phraseInput.value = encrypted;
  } catch (e) {
    phraseInput.value = (e as Error).message;
  }
}
