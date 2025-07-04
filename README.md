# XO Game (React Web)

เกม XO ที่สามารถกำหนดขนาดกระดานได้นอกจาก 3x3 เป็นขนาดใด ๆ ก็ได้ 
รองรับการเล่นกับเพื่อนหรือเล่นกับ AI (Bot) พร้อมระบบบันทึกประวัติการเล่น (History) และระบบ Replay ย้อนดูการเล่นย้อนหลัง  
พัฒนาโดยใช้ React + Vite + Node.js (Express) + MongoDB

## 🔧 Features

- ✅ เลือกขนาดกระดานได้เอง (ตั้งแต่ 3x3 ขึ้นไป)
- 🤖 เล่นกับ Bot (AI) ได้
- 👥 เล่นกับเพื่อนได้
- 💾 บันทึกประวัติการเล่น (เก็บลงฐานข้อมูล MongoDB)
- 🎥 ดู Replay เกมย้อนหลัง
- 🌙 รองรับ Dark Mode

---

## 🧠 Algorithm Design

### 1. **Check Winner (Victory Detection)**  
ใช้การวนลูปทุกตำแหน่งในกระดาน และตรวจสอบ 4 ทิศทาง:
- แนวนอน (→)
- แนวตั้ง (↓)
- แนวทแยงซ้าย-ขวา (↘)
- แนวทแยงขวา-ซ้าย (↙)

โดยจะตรวจว่าในแต่ละทิศมีเครื่องหมายเดียวกันครบตาม `winLength` (ขนาดกระดาน)

---

### 2. **AI Bot Logic**
- ถ้ามีโอกาสชนะในรอบถัดไป (win move) → เลือกชนะ
- ถ้าผู้เล่นกำลังจะชนะในรอบถัดไป → บล็อก
- ถ้าไม่มีอะไรพิเศษ → เลือกสุ่มจากตำแหน่งว่าง

---

## ⚙️ Setup & Run

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. เริ่มต้น Frontend

```bash
npm run dev
```

เปิดในเบราว์เซอร์ที่ `http://localhost:3000`

### 3. เริ่มต้น Backend Server

ติดตั้ง mongodb https://www.mongodb.com/try/download/community
Add new connection
แก้ไข URL ให้เป็นตามนี้ mongodb://localhost:27017/xo_game
จากนั้นกด Save & Connect

```bash
cd src
npm install
npm install express mongoose cors
node server.js
```

> ตรวจสอบว่า MongoDB เปิดใช้งานอยู่ที่ `mongodb://localhost:27017/xo_game`

---

## 🛠 Technologies Used

- Frontend: React.js + Vite
- Backend: Node.js + Express
- Database: MongoDB
- UI: CSS (custom), responsive, dark mode
- Router: React Router DOM

---

## 📦 Deployment Suggestions

- ใช้ Vercel หรือ Netlify สำหรับ Frontend
- ใช้ Render, Railway หรือ VPS สำหรับ Backend + MongoDB

---

## 📄 License

MIT License

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
