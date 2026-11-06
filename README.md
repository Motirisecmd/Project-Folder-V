# NutriTrack - Pure Vanilla Calorie & Macro Tracker

NutriTrack is a fast, responsive, and lightweight daily calorie and macronutrient tracker built entirely with vanilla web technologies (HTML5, CSS3, and ES6+ JavaScript). It requires zero backend infrastructure, storing all data persistently in the browser using the Web Storage API (`localStorage`).

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- **Daily Calorie Dashboard**:
  - Live animated SVG circular gauge showing remaining and consumed calories against your target.
  - Linear progress bar and visual status alerts (*On Track*, *Nearly Reached*, *Goal Exceeded*).
- **Macronutrient Breakdown**:
  - Monitors **Protein**, **Carbohydrates**, and **Fats** in grams.
  - Computes macro progress bars, total caloric contribution, and percentage share.
- **Hydration Tracker**:
  - Quick-add buttons for logging water intake (`+250 ml`, `+500 ml`, `-250 ml`, and reset).
- **Categorized Meals**:
  - Dedicated sections for **Breakfast 🍳**, **Lunch 🥗**, **Dinner 🍲**, and **Snacks & Drinks 🍎**.
  - Detailed food logs displaying calories, serving multipliers, time logged, and macro breakdowns.
  - Inline edit and delete capabilities for every item.
- **Quick-Add Food Presets**:
  - Preloaded with common whole foods (Oatmeal, Boiled Eggs, Grilled Chicken, Rice, Greek Yogurt, Salmon, etc.).
  - Ability to save any custom meal entry as a reusable quick preset.
- **Pure HTML5 Canvas Weekly Trend Chart**:
  - Custom-drawn 7-day bar chart comparing daily intake with your target goal without any external charting libraries.
  - Crisp rendering on High-DPI / Retina screens with current day highlight.
- **Date Navigation**:
  - Seamlessly browse past days or future plans using the date picker or previous/next buttons.
- **Goal Settings & Data Management**:
  - Fully customizable daily goals for calories, protein, carbs, fats, and water.
  - **Export backup (JSON)** and **Import backup (JSON)** for data portability across devices.
  - Clear day or full factory reset options.

---

## 🛠️ Tech Stack & Philosophy

- **100% Vanilla HTML5, CSS3 & JavaScript**
- **No frameworks or libraries** (No React, Vue, jQuery, or Chart.js)
- **No Tailwind CSS** (Handcrafted responsive CSS styles)
- **No CSS Variables** (Standard, universal CSS rules)
- **Zero backend required** (All persistence handled locally via `window.localStorage`)

---

## 🚀 Getting Started

No build tools, bundlers, or servers required!

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/calorie-tracker.git
   ```
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Safari, Edge):
   - Double click `index.html`, or
   - Right click and select **Open with > Your Preferred Browser**.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

