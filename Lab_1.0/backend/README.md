Student Notes API  — Варіант №10

 Як запустити проект

Для запуску сервера необхідно мати встановлений [Node.js](https://nodejs.org/).

1. Встановлення залежностей:
   Відкрийте термінал у папці `backend` та виконайте:
   ```bash
   npm install
   npm run dev - запуск як розробник
   npm start - старт

   Список реалізованих сутностей
У проекті реалізовано дві основні сутності:

Notes:

id — унікальний ідентифікатор (генерується на сервері);

course — назва дисципліни;

title — заголовок нотатки;

note — зміст нотатки.

Users:

id — унікальний ідентифікатор;

name — ім'я студента;

email — електронна пошта.

Приклади запитів

curl -X GET http://localhost:3000/api/notes 

curl -X DELETE http://localhost:3000/api/notes/1

curl -X GET http://localhost:3000/api/users
