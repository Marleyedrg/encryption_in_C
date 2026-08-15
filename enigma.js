// enigma.js
// Criptografia estilo Enigma com ROTOR_SIZE rotores (1 por caractere do alfabeto).
// Simétrica e reversível: criptografar o texto cifrado com a mesma senha restaura o texto original.

// ── 1. ALFABETO E TAMANHO DOS ROTORES ──────────────────────────────
// Define o conjunto completo de caracteres imprimíveis suportados pelo sistema.
// O tamanho deste alfabeto (ROTOR_SIZE = 159) determina a quantidade exata de rotores.
const ALPHABET =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`' +
  'abcdefghijklmnopqrstuvwxyz{|}~' +
  'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß' +
  'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ';

const ROTOR_SIZE = ALPHABET.length; // Exatamente 159 rotores e posições por rotor
const MAX_INDEX  = ROTOR_SIZE - 1;  // Último índice válido (158)

// Tabela de busca rápida (Map): converte caractere → índice numérico (0 a 158)
const CHAR_TO_INDEX = new Map();
for (let i = 0; i < ALPHABET.length; i++) {
  CHAR_TO_INDEX.set(ALPHABET[i], i);
}

// ── 2. ESTADO DOS ROTORES ──────────────────────────────────────────
// Cada posição do array armazena o deslocamento numérico do rotor correspondente.
const rotors = new Array(ROTOR_SIZE).fill(1);

// ── 3. DERIVAÇÃO PROPORCIONAL DE CHAVE ──────────────────────────────
// Calcula o estado inicial de cada rotor combinando:
// - Os caracteres da senha do usuário (expandida ciclicamente)
// - O índice do caractere atual na mensagem (charIndex)
// - O tamanho total da mensagem (msgLength)
// - O índice do próprio rotor (r)
function deriveRotors(password, charIndex, msgLength) {
  const pwdLen = password.length;
  if (pwdLen === 0) return;

  for (let r = 0; r < ROTOR_SIZE; r++) {
    // Seleciona o caractere da senha proporcional ao rotor e à posição do texto
    const pwdChar = password[(charIndex + r) % pwdLen];
    const pwdVal = CHAR_TO_INDEX.get(pwdChar) ?? (pwdChar.codePointAt(0) % ROTOR_SIZE);

    // Mistura não-linear: garante que cada senha e tamanho de mensagem gere deslocamentos únicos
    const mix =
      (pwdVal + 1) * (r * r + 3 * r + 7) +
      (charIndex + 1) * pwdLen +
      msgLength * (r + 7);

    rotors[r] = (mix % ROTOR_SIZE);
  }
}

// ── 4. SUBPROGRAMAS DOS ROTORES (IDA E VOLTA) ───────────────────────
// Deslocamento para a frente (fase de ida do sinal)
function rotorForward(position, letter) {
  letter = letter + position;
  if (letter > MAX_INDEX) {
    letter = letter - ROTOR_SIZE; // Ciclo completo (wrap-around)
  }
  return letter % ROTOR_SIZE;
}

// Deslocamento para trás (fase de volta do sinal, desfazendo o avanço)
function rotorBackward(position, letter) {
  letter = letter - position;
  if (letter < 0) {
    letter = (letter % ROTOR_SIZE + ROTOR_SIZE) % ROTOR_SIZE; // Ciclo completo inverso
  }
  return letter % ROTOR_SIZE;
}

// ── 5. STEPPING (MECANISMO DE ENGRENAGENS) ─────────────────────────
// Avança o rotor 'n' a cada (n + 1) passos do contador geral.
// Simula a mecânica da Enigma onde rotores vizinhos giram em velocidades diferentes.
function stepping(counter) {
  if (counter === 0) return;

  for (let n = 1; n < ROTOR_SIZE; n++) {
    if (counter % (n + 1) === 0) {
      rotors[n] = (rotors[n] + 1) % ROTOR_SIZE;
    }
  }
}

// ── 6. REFLECTOR (ESPELHO INVOLUTIVO) ──────────────────────────────
// Troca o caractere por seu par simétrico no alfabeto.
// Satisfaz a propriedade de involução: reflector(reflector(x)) === x.
function reflector(letter) {
  letter = letter + (ROTOR_SIZE - 1);

  if (letter > MAX_INDEX) {
    letter = MAX_INDEX - (letter - MAX_INDEX);
  }

  return (letter + ROTOR_SIZE) % ROTOR_SIZE;
}

// ── 7. FUNÇÃO PRINCIPAL DE CRIPTOGRAFIA / DESCRIPTOGRAFIA ──────────
// Processa a frase caractere a caractere.
// Como o fluxo é (Ida pelos 159 rotores -> Reflector -> Volta oposta pelos 159 rotores),
// a função é 100% simétrica: encrypt(encrypt(texto, senha), senha) === texto.
function encrypt(phrase, password) {
  const chars = [...phrase];
  const msgLength = chars.length;
  let counter = 0;

  for (let i = 0; i < chars.length; i++) {
    const idx = CHAR_TO_INDEX.get(chars[i]);
    if (idx === undefined) {
      continue; // Mantém caracteres fora do alfabeto sem alterar
    }

    // Deriva os 159 rotores para este caractere específico da mensagem
    deriveRotors(password, i, msgLength);

    let currentLetter = idx;

    // FASE 1: Passa para a frente por todos os 159 rotores (0 -> 158)
    for (let r = 0; r < ROTOR_SIZE; r++) {
      currentLetter = rotorForward(rotors[r], currentLetter);
    }

    // FASE 2: Espelhamento no Reflector
    currentLetter = reflector(currentLetter);

    // FASE 3: Passa para trás por todos os 159 rotores em ordem inversa (158 -> 0)
    for (let r = ROTOR_SIZE - 1; r >= 0; r--) {
      currentLetter = rotorBackward(rotors[r], currentLetter);
    }

    // Converte o índice resultante de volta para o caractere do ALFABETO
    chars[i] = ALPHABET[currentLetter];

    // Avança o contador global e executa o stepping proporcional dos rotores
    counter += 1;
    if (counter > ROTOR_SIZE) {
      counter = counter - ROTOR_SIZE;
    }
    stepping(counter);
  }

  return chars.join('');
}

// ── 8. CONEXÃO COM A INTERFACE (UI) ────────────────────────────────
// Captura os campos da página web, valida a senha e atualiza a mensagem diretamente no input.
function runEncryption() {
  const phraseInput = document.getElementById('phrase');
  const passwordInput = document.getElementById('password');

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
    phraseInput.value = encrypted; // Sobrescreve o texto da mensagem no próprio input
  } catch (e) {
    phraseInput.value = e.message;
  }
}
