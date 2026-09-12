# ENCRYPTION BASED ON ENIGMA MACHINE (C & Web UI)

This repository contains an implementation of an encryption algorithm inspired by the historic **Enigma Machine**. It features both the original C implementation and a modern, full-featured web front-end (HTML/JS/TS) with support for expanded alphabets, password-based key derivation, and 159-rotor cascade encryption.

---

## Modern Web Features (JavaScript / TypeScript)

- **Dynamic 159-Rotor Cascade System**: Number of rotors automatically matches the character set size ($ROTOR_SIZE = 159$).
- **Password-Derived Proportional Keys**: Key derivation scales non-linearly according to the password, message length, and character positions.
- **Symmetric / Reciprocal Encryption**: Encryption is involutive ($E(E(m, k), k) = m$). Encrypting a ciphertext using the same password in the UI instantly restores the original plaintext.
- **Full Printable Character Set**: Supports ASCII printable characters, spaces, punctuation, and common accented characters (`À-ÿ`).
- **Single-Input In-Place UI**: The encryption result overwrites the input field directly for seamless encryption/decryption cycles.

---

## Como Funciona o Algoritmo 

### 1. O Alfabeto (A Roda de 159 Caracteres)
O sistema define um conjunto de 159 caracteres conhecidos. O número total de rotores é sempre **exatamente igual ao número de caracteres do alfabeto** ($ROTOR_SIZE = 159$).

### 2. Derivação de Chave pela Senha (`deriveRotors`)
A senha digitada pelo usuário é combinada não-linearmente com:
- O caractere correspondente da senha
- O índice do caractere atual no texto (`charIndex`)
- O tamanho total da mensagem (`msgLength`)
- O índice do rotor ($0 \dots 158$)

Isso garante que senhas diferentes e mensagens de tamanhos diferentes produzam configurações de rotores totalmente únicas.

### 3. O Circuito Simétrico de 319 Passos
Para cada caractere da mensagem:
1. **Ida (`rotorForward`)**: O sinal numérico passa sequencialmente pelos rotores $0 \to 158$, deslocando a posição.
2. **Reflector (`reflector`)**: O sinal bate em um espelho involutivo no final da linha ($158 - \text{letra}$).
3. **Volta (`rotorBackward`)**: O sinal retorna pelos rotores em ordem inversa $158 \to 0$, aplicando o deslocamento inverso.

Como a volta desfaz a ida e o refletor é simétrico, **criptografar a mensagem cifrada com a mesma senha restaura a mensagem original**.

### 4. Stepping (Mecanismo de Engrenagens)
Após cada caractere processado, o rotor $n$ avança uma posição a cada $(n + 1)$ passos do contador global. Isso garante que a mesma letra repetida (ex: `"AAAAAA"`) gere caracteres cifrados totalmente diferentes.

---

## 🚀 Usage

### 1. Web Front-End (Browser)

Simply open `index.html` in any web browser, or serve it via GitHub Pages:

1. Type your message in the **Message** field.
2. Enter your secret key in the **Password** field.
3. Click **Encrypt** to encrypt the text in-place.
4. Click **Encrypt** again with the same password to decrypt it back to the original message.

### 2. C Command Line Interface (CLI)

1. Clone this repository:
    ```bash
    git clone git@github.com:Marleyedrg/encryption_in_C.git
    cd encryption_in_C
    ```

2. Compile the C source code:
    ```bash
    gcc app.c -o app
    ```

3. Run the CLI:
    ```bash
    ./app "hello" 14 5 3
    ```

---

## 🤝 Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
