import argon2 from 'argon2';
import readline from 'readline';
import fs from 'fs';

const FILE_PATH = 'password_hash.txt';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (fs.existsSync(FILE_PATH)) {
    const savedHash = fs.readFileSync(FILE_PATH, 'utf8');
    rl.question('Підтвердіть пароль: ', async (confirmPassword) => {
        if (await argon2.verify(savedHash, confirmPassword)) {
            console.log('Пароль підтверджено!');
        } else {
            console.log('Помилка: невірний пароль!');
        }
        rl.close();
    });
} else {
    rl.question('Введіть новий пароль: ', async (password) => {
        rl.question('Підтвердіть пароль: ', async (confirmPassword) => {
            if (password !== confirmPassword) {
                console.log('Помилка: паролі не співпадають!');
                rl.close();
                return;
            }
            try {
                const hash = await argon2.hash(password);
                fs.writeFileSync(FILE_PATH, hash);
                console.log('Пароль збережено!');
            } catch (err) {
                console.error('Помилка збереження пароля:', err);
            }
            rl.close();
        });
    });
}
