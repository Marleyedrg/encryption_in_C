# ENCRYPTION IN C BASED ON ENIGMA MACHINE

This is a repository containing an implementation of a encryption C language based on Enigma machine. The Enigma machine was used during World War II to encrypt and decrypt messages. This project is a simplified and educational.

## Features

- **Encryption and Decryption:** Implementation of basic encryption and decryption functionalities.
- **Customizable Settings:** Allows customization settings such as rotors initial positions.
- **Command Line Interface (CLI):** A simple command-line interface.

## Prerequisites

- C Compiler (e.g., GCC)
- POSIX-compatible operating system

## Usage

1. Clone this repository:

    ```bash
    git clone git@github.com:Marleyedrg/encryption_in_C.git
    ```

2. Compile the source code:

    ```bash
    cd encryption_in_C
    gcc app.c -o app
    ```

3. Run the command-line interface (CLI):

    ```bash
    ./encryption_in_C [message]
    ```
  or
    ```bash
    ./encryption_in_C [message] [int(1 to 26)] [int(1 to 26)] [int(1 to 26)]
    ```

4. Follow the provided instructions to encrypt or decrypt messages.

## Examples

Here are some basic examples of using the Enigma machine via CLI:

- Encrypt a message:
    ```bash
    ./app hello 14 5 3 
    ```
OUTPUT:

\>\> WYOMH


- Decrypt a message:
    ```bash
    ./app WYOMH 14 5 3 
    ```
OUTPUT:

\>\> HELLO

## Contribution

Contributions are welcome! If you wish to improve this project, please open an issue to discuss your ideas or submit a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).
