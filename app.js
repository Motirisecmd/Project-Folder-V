/**
 * NutriTrack - Daily Calorie & Macro Tracker
 * Pure Vanilla JavaScript with LocalStorage Persistence
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEYS = {
    SETTINGS: 'nutritrack_settings',
    DAYS: 'nutritrack_days',
    PRESETS: 'nutritrack_presets'
  };

  const DEFAULT_SETTINGS = {
    dailyCalorieGoal: 2000,
    proteinGoal: 130, // grams
    carbsGoal: 225,   // grams
    fatGoal: 65,      // grams
    waterGoal: 2500   // ml
  };

  const DEFAULT_PRESETS = [
    { name: 'Boiled Egg (1 large)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
    { name: 'Oatmeal (1 cup cooked)', calories: 158, protein: 6, carbs: 27, fat: 3.2 },
    { name: 'Grilled Chicken (150g)', calories: 248, protein: 46, carbs: 0, fat: 5.4 },
    { name: 'White Rice (1 cup cooked)', calories: 205, protein: 4.2, carbs: 45, fat: 0.4 },
    { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
    { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
    { name: 'Protein Shake (1 scoop)', calories: 120, protein: 24, carbs: 2, fat: 1.5 },
    { name: 'Salmon Fillet (150g)', calories: 312, protein: 34, carbs: 0, fat: 18 },
    { name: 'Whole Wheat Bread (1 slice)', calories: 80, protein: 4, carbs: 14, fat: 1 },
    { name: 'Peanut Butter (1 tbsp)', calories: 94, protein: 4, carbs: 3, fat: 8 },
    { name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    { name: 'Garden Salad with Dressing', calories: 130, protein: 2, carbs: 5, fat: 12 }
  ];

  // --- Application State ---
  let appState = {
    selectedDate: getFormattedDate(new Date()),
    settings: { ...DEFAULT_SETTINGS },
    days: {},
    presets: [...DEFAULT_PRESETS]
  };

  // --- Helper Functions ---
  function getFormattedDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseFormattedDate(dateStr) {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function formatDisplayDate(dateStr) {
    const todayStr = getFormattedDate(new Date());
    const targetDate = parseFormattedDate(dateStr);
    
    // Check for yesterday / tomorrow
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getFormattedDate(yesterday);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = getFormattedDate(tomorrow);

    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else if (dateStr === tomorrowStr) {
      return 'Tomorrow';
    }

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return targetDate.toLocaleDateString(undefined, options);
  }

  function getCurrentTimeStr() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // --- LocalStorage Storage Layer ---
  function loadFromStorage() {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        appState.settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(savedSettings));
      }

      const savedDays = localStorage.getItem(STORAGE_KEYS.DAYS);
      if (savedDays) {
        appState.days = JSON.parse(savedDays);
      } else {
        // Pre-populate realistic sample data for today on first launch
        seedInitialSampleData();
      }

      const savedPresets = localStorage.getItem(STORAGE_KEYS.PRESETS);
      if (savedPresets) {
        appState.presets = JSON.parse(savedPresets);
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appState.settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  function saveDays() {
    try {
      localStorage.setItem(STORAGE_KEYS.DAYS, JSON.stringify(appState.days));
    } catch (e) {
      console.error('Failed to save day entries:', e);
    }
  }

  function savePresets() {
    try {
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(appState.presets));
    } catch (e) {
      console.error('Failed to save presets:', e);
    }
  }

  function seedInitialSampleData() {
    const todayStr = getFormattedDate(new Date());
    appState.days = {
      [todayStr]: {
        water: 1250,
        meals: [
          {
            id: 'sample-1',
            meal: 'breakfast',
            name: 'Oatmeal with Blueberries & Honey',
            calories: 320,
            protein: 9,
            carbs: 58,
            fat: 5,
            servings: 1,
            time: '08:15'
          },
          {
            id: 'sample-2',
            meal: 'breakfast',
            name: 'Boiled Egg (2 eggs)',
            calories: 156,
            protein: 12.6,
            carbs: 1.2,
            fat: 10.6,
            servings: 2,
            time: '08:20'
          },
          {
            id: 'sample-3',
            meal: 'lunch',
            name: 'Grilled Chicken Breast with White Rice',
            calories: 520,
            protein: 52,
            carbs: 50,
            fat: 7,
            servings: 1,
            time: '12:45'
          }
        ]
      }
    };
    saveDays();
  }

  function getDayData(dateStr) {
    if (!appState.days[dateStr]) {
      appState.days[dateStr] = {
        water: 0,
        meals: []
      };
    }
    return appState.days[dateStr];
  }

  // --- DOM Elements ---
  const datePicker = document.getElementById('datePicker');
  const dateLabel = document.getElementById('dateLabel');
  const prevDayBtn = document.getElementById('prevDayBtn');
  const nextDayBtn = document.getElementById('nextDayBtn');
  const todayBtn = document.getElementById('todayBtn');

  // Calorie summary elements
  const calorieStatusBadge = document.getElementById('calorieStatusBadge');
  const gaugeProgress = document.getElementById('gaugeProgress');
  const caloriesRemainingVal = document.getElementById('caloriesRemainingVal');
  const caloriesRemainingLabel = document.getElementById('caloriesRemainingLabel');
  const calorieGoalVal = document.getElementById('calorieGoalVal');
  const caloriesConsumedVal = document.getElementById('caloriesConsumedVal');
  const caloriesPercentageVal = document.getElementById('caloriesPercentageVal');
  const calorieLinearBar = document.getElementById('calorieLinearBar');

  // Macro elements
  const proteinCurrentVal = document.getElementById('proteinCurrentVal');
  const proteinGoalVal = document.getElementById('proteinGoalVal');
  const proteinProgressBar = document.getElementById('proteinProgressBar');
  const proteinCaloriesVal = document.getElementById('proteinCaloriesVal');

  const carbsCurrentVal = document.getElementById('carbsCurrentVal');
  const carbsGoalVal = document.getElementById('carbsGoalVal');
  const carbsProgressBar = document.getElementById('carbsProgressBar');
  const carbsCaloriesVal = document.getElementById('carbsCaloriesVal');

  const fatCurrentVal = document.getElementById('fatCurrentVal');
  const fatGoalVal = document.getElementById('fatGoalVal');
  const fatProgressBar = document.getElementById('fatProgressBar');
  const fatCaloriesVal = document.getElementById('fatCaloriesVal');

  // Water elements
  const waterCurrentVal = document.getElementById('waterCurrentVal');
  const waterGoalVal = document.getElementById('waterGoalVal');
  const waterProgressBar = document.getElementById('waterProgressBar');
  const addWater250Btn = document.getElementById('addWater250Btn');
  const addWater500Btn = document.getElementById('addWater500Btn');
  const subWater250Btn = document.getElementById('subWater250Btn');
  const resetWaterBtn = document.getElementById('resetWaterBtn');

  // Presets container
  const presetsList = document.getElementById('presetsList');

  // Meals containers
  const breakfastList = document.getElementById('breakfastList');
  const lunchList = document.getElementById('lunchList');
  const dinnerList = document.getElementById('dinnerList');
  const snackList = document.getElementById('snackList');

  const breakfastStats = document.getElementById('breakfastStats');
  const lunchStats = document.getElementById('lunchStats');
  const dinnerStats = document.getElementById('dinnerStats');
  const snackStats = document.getElementById('snackStats');

  const breakfastMacros = document.getElementById('breakfastMacros');
  const lunchMacros = document.getElementById('lunchMacros');
  const dinnerMacros = document.getElementById('dinnerMacros');
  const snackMacros = document.getElementById('snackMacros');

  // History & Chart
  const chartGoalLabel = document.getElementById('chartGoalLabel');
  const chartAvgLabel = document.getElementById('chartAvgLabel');
  const weeklyCanvas = document.getElementById('weeklyChart');

  // Modals
  const foodModal = document.getElementById('foodModal');
  const foodModalTitle = document.getElementById('foodModalTitle');
  const foodForm = document.getElementById('foodForm');
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const closeFoodModalBtn = document.getElementById('closeFoodModalBtn');
  const cancelFoodModalBtn = document.getElementById('cancelFoodModalBtn');

  const foodEditId = document.getElementById('foodEditId');
  const foodMealSelect = document.getElementById('foodMealSelect');
  const foodTimeInput = document.getElementById('foodTimeInput');
  const foodNameInput = document.getElementById('foodNameInput');
  const foodCaloriesInput = document.getElementById('foodCaloriesInput');
  const foodProteinInput = document.getElementById('foodProteinInput');
  const foodCarbsInput = document.getElementById('foodCarbsInput');
  const foodFatInput = document.getElementById('foodFatInput');
  const foodServingsInput = document.getElementById('foodServingsInput');
  const saveAsPresetCheckbox = document.getElementById('saveAsPresetCheckbox');

  // Settings Modal
  const settingsModal = document.getElementById('settingsModal');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const settingsForm = document.getElementById('settingsForm');

  const settingCalorieGoal = document.getElementById('settingCalorieGoal');
  const settingProteinGoal = document.getElementById('settingProteinGoal');
  const settingCarbsGoal = document.getElementById('settingCarbsGoal');
  const settingFatGoal = document.getElementById('settingFatGoal');
  const settingWaterGoal = document.getElementById('settingWaterGoal');

  const exportDataBtn = document.getElementById('exportDataBtn');
  const importDataInput = document.getElementById('importDataInput');
  const clearTodayBtn = document.getElementById('clearTodayBtn');
  const resetAllDataBtn = document.getElementById('resetAllDataBtn');

  // --- Render & UI Update ---

  function updateDateUI() {
    datePicker.value = appState.selectedDate;
    dateLabel.textContent = formatDisplayDate(appState.selectedDate);
  }

  function renderDashboard() {
    updateDateUI();

    const dayData = getDayData(appState.selectedDate);
    const meals = dayData.meals || [];

    // Aggregations
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(item => {
      totalCalories += Number(item.calories) || 0;
      totalProtein += Number(item.protein) || 0;
      totalCarbs += Number(item.carbs) || 0;
      totalFat += Number(item.fat) || 0;
    });

    const calorieGoal = appState.settings.dailyCalorieGoal || 2000;
    const remainingCalories = calorieGoal - totalCalories;
    const caloriePct = Math.round((totalCalories / calorieGoal) * 100);

    // Update Calorie Display
    calorieGoalVal.textContent = `${calorieGoal.toLocaleString()} kcal`;
    caloriesConsumedVal.textContent = `${totalCalories.toLocaleString()} kcal`;
    caloriesPercentageVal.textContent = `${caloriePct}%`;

    // SVG Gauge: circumference = 2 * PI * 70 = 439.82
    const circumference = 440;
    const boundedPct = Math.min(Math.max(totalCalories / calorieGoal, 0), 1);
    const strokeOffset = circumference - (circumference * boundedPct);
    gaugeProgress.style.strokeDashoffset = strokeOffset;

    // Linear bar
    calorieLinearBar.style.width = `${Math.min(caloriePct, 100)}%`;

    if (remainingCalories >= 0) {
      caloriesRemainingVal.textContent = remainingCalories.toLocaleString();
      caloriesRemainingLabel.textContent = 'kcal left';
      caloriesRemainingVal.style.color = '#0f172a';

      if (caloriePct > 90) {
        calorieStatusBadge.textContent = 'Nearly Reached';
        calorieStatusBadge.className = 'status-badge badge-warning';
        gaugeProgress.style.stroke = '#f59e0b';
        calorieLinearBar.style.backgroundColor = '#f59e0b';
      } else {
        calorieStatusBadge.textContent = 'On Track';
        calorieStatusBadge.className = 'status-badge badge-normal';
        gaugeProgress.style.stroke = '#2563eb';
        calorieLinearBar.style.backgroundColor = '#2563eb';
      }
    } else {
      caloriesRemainingVal.textContent = `+${Math.abs(remainingCalories).toLocaleString()}`;
      caloriesRemainingLabel.textContent = 'kcal over limit';
      caloriesRemainingVal.style.color = '#dc2626';

      calorieStatusBadge.textContent = 'Goal Exceeded';
      calorieStatusBadge.className = 'status-badge badge-over';
      gaugeProgress.style.stroke = '#ef4444';
      calorieLinearBar.style.backgroundColor = '#ef4444';
    }

    // Update Macros
    const proteinGoal = appState.settings.proteinGoal || 130;
    const carbsGoal = appState.settings.carbsGoal || 225;
    const fatGoal = appState.settings.fatGoal || 65;

    proteinCurrentVal.textContent = `${Math.round(totalProtein)}g`;
    proteinGoalVal.textContent = `${proteinGoal}g`;
    const proteinPct = Math.min(Math.round((totalProtein / proteinGoal) * 100), 100);
    proteinProgressBar.style.width = `${proteinPct}%`;
    const proteinCal = Math.round(totalProtein * 4);
    const proteinCalPct = totalCalories > 0 ? Math.round((proteinCal / totalCalories) * 100) : 0;
    proteinCaloriesVal.textContent = `${proteinCal} kcal (${proteinCalPct}%)`;

    carbsCurrentVal.textContent = `${Math.round(totalCarbs)}g`;
    carbsGoalVal.textContent = `${carbsGoal}g`;
    const carbsPct = Math.min(Math.round((totalCarbs / carbsGoal) * 100), 100);
    carbsProgressBar.style.width = `${carbsPct}%`;
    const carbsCal = Math.round(totalCarbs * 4);
    const carbsCalPct = totalCalories > 0 ? Math.round((carbsCal / totalCalories) * 100) : 0;
    carbsCaloriesVal.textContent = `${carbsCal} kcal (${carbsCalPct}%)`;

    fatCurrentVal.textContent = `${Math.round(totalFat)}g`;
    fatGoalVal.textContent = `${fatGoal}g`;
    const fatPct = Math.min(Math.round((totalFat / fatGoal) * 100), 100);
    fatProgressBar.style.width = `${fatPct}%`;
    const fatCal = Math.round(totalFat * 9);
    const fatCalPct = totalCalories > 0 ? Math.round((fatCal / totalCalories) * 100) : 0;
    fatCaloriesVal.textContent = `${fatCal} kcal (${fatCalPct}%)`;

    // Update Water Tracker
    const waterCurrent = dayData.water || 0;
    const waterGoal = appState.settings.waterGoal || 2500;
    waterCurrentVal.textContent = waterCurrent.toLocaleString();
    waterGoalVal.textContent = waterGoal.toLocaleString();
    const waterPct = Math.min(Math.round((waterCurrent / waterGoal) * 100), 100);
    waterProgressBar.style.width = `${waterPct}%`;

    // Render Meals
    renderMeals(meals);

    // Render Weekly Analytics Chart
    renderWeeklyChart();
  }

  function renderMeals(meals) {
    const mealContainers = {
      breakfast: breakfastList,
      lunch: lunchList,
      dinner: dinnerList,
      snack: snackList
    };

    const mealStats = {
      breakfast: { count: 0, cals: 0, p: 0, c: 0, f: 0 },
      lunch: { count: 0, cals: 0, p: 0, c: 0, f: 0 },
      dinner: { count: 0, cals: 0, p: 0, c: 0, f: 0 },
      snack: { count: 0, cals: 0, p: 0, c: 0, f: 0 }
    };

    // Clear lists
    Object.keys(mealContainers).forEach(key => {
      mealContainers[key].innerHTML = '';
    });

    // Populate items
    meals.forEach(item => {
      const type = item.meal || 'snack';
      if (!mealStats[type]) return;

      mealStats[type].count += 1;
      mealStats[type].cals += Number(item.calories) || 0;
      mealStats[type].p += Number(item.protein) || 0;
      mealStats[type].c += Number(item.carbs) || 0;
      mealStats[type].f += Number(item.fat) || 0;

      const row = createFoodRowElement(item);
      mealContainers[type].appendChild(row);
    });

    // Update headers and empty states
    const types = ['breakfast', 'lunch', 'dinner', 'snack'];
    types.forEach(type => {
      const stats = mealStats[type];
      const countLabel = stats.count === 1 ? '1 item' : `${stats.count} items`;
      
      const statsEl = document.getElementById(`${type}Stats`);
      if (statsEl) {
        statsEl.textContent = `${countLabel} • ${stats.cals} kcal`;
      }

      const macroEl = document.getElementById(`${type}Macros`);
      if (macroEl) {
        macroEl.textContent = `P: ${Math.round(stats.p)}g • C: ${Math.round(stats.c)}g • F: ${Math.round(stats.f)}g`;
      }

      if (stats.count === 0) {
        mealContainers[type].innerHTML = `<p class="empty-meal-msg">No foods logged for ${type} yet.</p>`;
      }
    });
  }

  function createFoodRowElement(item) {
    const row = document.createElement('div');
    row.className = 'food-row';
    row.dataset.id = item.id;

    const timeDisplay = item.time ? `🕒 ${item.time} • ` : '';
    const servingsDisplay = item.servings && item.servings !== 1 ? ` (${item.servings}x)` : '';
    const macrosText = `P: ${item.protein || 0}g | C: ${item.carbs || 0}g | F: ${item.fat || 0}g`;

    row.innerHTML = `
      <div class="food-main-info">
        <div class="food-item-name">${escapeHtml(item.name)}${servingsDisplay}</div>
        <div class="food-item-meta">
          <span>${timeDisplay}${macrosText}</span>
        </div>
      </div>
      <div class="food-item-right">
        <span class="food-calories-badge">${item.calories} kcal</span>
        <div class="food-row-actions">
          <button class="row-action-btn edit-action-btn" title="Edit Item" data-id="${item.id}">✏️</button>
          <button class="row-action-btn delete-action-btn" title="Delete Item" data-id="${item.id}">🗑️</button>
        </div>
      </div>
    `;

    // Event listeners for Edit and Delete
    const editBtn = row.querySelector('.edit-action-btn');
    editBtn.addEventListener('click', () => openEditFoodModal(item));

    const deleteBtn = row.querySelector('.delete-action-btn');
    deleteBtn.addEventListener('click', () => deleteFoodItem(item.id));

    return row;
  }

  function escapeHtml(string) {
    if (!string) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderPresets() {
    presetsList.innerHTML = '';
    appState.presets.forEach(preset => {
      const chip = document.createElement('button');
      chip.className = 'preset-chip';
      chip.type = 'button';
      chip.innerHTML = `
        <span>${escapeHtml(preset.name)}</span>
        <span class="preset-cal">${preset.calories} kcal</span>
      `;
      chip.addEventListener('click', () => {
        openAddFoodModalWithPreset(preset);
      });
      presetsList.appendChild(chip);
    });
  }

  // --- HTML5 Canvas Weekly Trend Chart ---
  function renderWeeklyChart() {
    const rect = weeklyCanvas.getBoundingClientRect();
    const displayWidth = Math.floor(rect.width) || 800;
    const displayHeight = Math.floor(rect.height) || 260;

    // Handle high-DPI (Retina) displays for razor-sharp rendering
    const dpr = window.devicePixelRatio || 1;
    weeklyCanvas.width = displayWidth * dpr;
    weeklyCanvas.height = displayHeight * dpr;

    const ctx = weeklyCanvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = displayWidth;
    const height = displayHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Build 7 consecutive days ending at the currently selected date
    const selectedDateObj = parseFormattedDate(appState.selectedDate);
    const dayDataList = [];
    let totalWeekCalories = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(selectedDateObj);
      d.setDate(d.getDate() - i);
      const dateStr = getFormattedDate(d);
      const data = appState.days[dateStr];
      let dayCals = 0;
      if (data && data.meals) {
        data.meals.forEach(m => dayCals += Number(m.calories) || 0);
      }
      dayDataList.push({
        dateStr: dateStr,
        dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
        calories: dayCals,
        isSelected: dateStr === appState.selectedDate
      });
      totalWeekCalories += dayCals;
    }

    const avgCalories = Math.round(totalWeekCalories / 7);
    const calorieGoal = appState.settings.dailyCalorieGoal || 2000;

    chartGoalLabel.textContent = `${calorieGoal.toLocaleString()} kcal`;
    chartAvgLabel.textContent = `${avgCalories.toLocaleString()} kcal`;

    // Dimensions
    const paddingLeft = 55;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Max Y scale (at least goal * 1.25 or highest day * 1.15)
    const maxVal = Math.max(
      ...dayDataList.map(d => d.calories),
      calorieGoal
    );
    const yMax = Math.ceil((maxVal * 1.2) / 500) * 500 || 2500;

    // Draw Grid lines & Y-axis labels
    const gridSteps = 4;
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridSteps; i++) {
      const stepVal = Math.round((yMax / gridSteps) * i);
      const yPos = paddingTop + chartHeight - (stepVal / yMax) * chartHeight;

      ctx.beginPath();
      ctx.moveTo(paddingLeft, yPos);
      ctx.lineTo(width - paddingRight, yPos);
      ctx.stroke();

      ctx.fillText(stepVal.toLocaleString(), paddingLeft - 8, yPos);
    }

    // Draw Target Goal Line (Dashed Red/Orange)
    const goalY = paddingTop + chartHeight - (calorieGoal / yMax) * chartHeight;
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, goalY);
    ctx.lineTo(width - paddingRight, goalY);
    ctx.stroke();
    ctx.restore();

    // Goal indicator label
    ctx.fillStyle = '#b45309';
    ctx.textAlign = 'left';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Target: ${calorieGoal}`, width - paddingRight - 80, goalY - 8);

    // Draw Bars
    const barCount = dayDataList.length;
    const totalSlotWidth = chartWidth / barCount;
    const barWidth = Math.min(36, totalSlotWidth * 0.55);

    dayDataList.forEach((item, index) => {
      const slotCenterX = paddingLeft + index * totalSlotWidth + totalSlotWidth / 2;
      const barX = slotCenterX - barWidth / 2;
      const barHeight = (item.calories / yMax) * chartHeight;
      const barY = paddingTop + chartHeight - barHeight;

      // Color logic
      let barFillColor = '#2563eb';
      if (item.calories > calorieGoal) {
        barFillColor = '#ef4444'; // Red if exceeded
      } else if (item.calories > 0 && item.calories >= calorieGoal * 0.9) {
        barFillColor = '#10b981'; // Green if on track
      } else if (item.calories === 0) {
        barFillColor = '#cbd5e1';
      }

      // Draw rounded rectangle bar
      ctx.fillStyle = barFillColor;
      const radius = 6;
      if (barHeight > 4) {
        ctx.beginPath();
        ctx.moveTo(barX, paddingTop + chartHeight);
        ctx.lineTo(barX, barY + radius);
        ctx.quadraticCurveTo(barX, barY, barX + radius, barY);
        ctx.lineTo(barX + barWidth - radius, barY);
        ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + radius);
        ctx.lineTo(barX + barWidth, paddingTop + chartHeight);
        ctx.closePath();
        ctx.fill();
      } else if (item.calories > 0) {
        ctx.fillRect(barX, paddingTop + chartHeight - 4, barWidth, 4);
      }

      // If this is the currently selected date, draw a highlight ring or indicator
      if (item.isSelected) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX - 3, barY - 3, barWidth + 6, barHeight + 3);
      }

      // Value label on top of bar
      if (item.calories > 0) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.calories, slotCenterX, barY - 8);
      }

      // X-Axis Day Labels
      ctx.fillStyle = item.isSelected ? '#0f172a' : '#64748b';
      ctx.font = item.isSelected ? 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.dayName, slotCenterX, height - 16);
    });
  }

  // --- Water Intake Actions ---
  function changeWater(delta) {
    const dayData = getDayData(appState.selectedDate);
    dayData.water = Math.max(0, (dayData.water || 0) + delta);
    saveDays();
    renderDashboard();
  }

  function resetWater() {
    const dayData = getDayData(appState.selectedDate);
    dayData.water = 0;
    saveDays();
    renderDashboard();
  }

  // --- Food Modal Operations ---
  function openAddFoodModal(mealType = 'breakfast') {
    foodForm.reset();
    foodEditId.value = '';
    foodMealSelect.value = mealType;
    foodTimeInput.value = getCurrentTimeStr();
    foodServingsInput.value = 1;
    saveAsPresetCheckbox.checked = false;
    foodModalTitle.textContent = 'Log Food';
    foodModal.classList.add('active');
    foodNameInput.focus();
  }

  function openAddFoodModalWithPreset(preset) {
    openAddFoodModal('snack');
    foodNameInput.value = preset.name;
    foodCaloriesInput.value = preset.calories;
    foodProteinInput.value = preset.protein;
    foodCarbsInput.value = preset.carbs;
    foodFatInput.value = preset.fat;
  }

  function openEditFoodModal(item) {
    foodForm.reset();
    foodEditId.value = item.id;
    foodMealSelect.value = item.meal || 'breakfast';
    foodTimeInput.value = item.time || '';
    foodNameInput.value = item.name || '';
    foodCaloriesInput.value = item.calories || '';
    foodProteinInput.value = item.protein || '';
    foodCarbsInput.value = item.carbs || '';
    foodFatInput.value = item.fat || '';
    foodServingsInput.value = item.servings || 1;
    saveAsPresetCheckbox.checked = false;
    foodModalTitle.textContent = 'Edit Food Entry';
    foodModal.classList.add('active');
    foodNameInput.focus();
  }

  function closeFoodModal() {
    foodModal.classList.remove('active');
  }

  function handleFoodFormSubmit(e) {
    e.preventDefault();

    const name = foodNameInput.value.trim();
    const calories = parseFloat(foodCaloriesInput.value) || 0;
    const protein = parseFloat(foodProteinInput.value) || 0;
    const carbs = parseFloat(foodCarbsInput.value) || 0;
    const fat = parseFloat(foodFatInput.value) || 0;
    const servings = parseFloat(foodServingsInput.value) || 1;
    const meal = foodMealSelect.value;
    const time = foodTimeInput.value || getCurrentTimeStr();
    const editId = foodEditId.value;

    if (!name) return;

    const dayData = getDayData(appState.selectedDate);
    if (!dayData.meals) {
      dayData.meals = [];
    }

    if (editId) {
      // Update existing item
      const index = dayData.meals.findIndex(m => m.id === editId);
      if (index !== -1) {
        dayData.meals[index] = {
          id: editId,
          name,
          calories: Math.round(calories * servings),
          protein: Math.round(protein * servings * 10) / 10,
          carbs: Math.round(carbs * servings * 10) / 10,
          fat: Math.round(fat * servings * 10) / 10,
          servings,
          meal,
          time
        };
      }
    } else {
      // Create new item
      const newItem = {
        id: 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name,
        calories: Math.round(calories * servings),
        protein: Math.round(protein * servings * 10) / 10,
        carbs: Math.round(carbs * servings * 10) / 10,
        fat: Math.round(fat * servings * 10) / 10,
        servings,
        meal,
        time
      };
      dayData.meals.push(newItem);
    }

    // Save as reusable preset if checked
    if (saveAsPresetCheckbox.checked) {
      const existingPreset = appState.presets.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (!existingPreset) {
        appState.presets.push({
          name,
          calories: Math.round(calories),
          protein: Math.round(protein * 10) / 10,
          carbs: Math.round(carbs * 10) / 10,
          fat: Math.round(fat * 10) / 10
        });
        savePresets();
        renderPresets();
      }
    }

    saveDays();
    closeFoodModal();
    renderDashboard();
  }

  function deleteFoodItem(id) {
    const dayData = getDayData(appState.selectedDate);
    if (!dayData.meals) return;
    dayData.meals = dayData.meals.filter(m => m.id !== id);
    saveDays();
    renderDashboard();
  }

  // --- Settings Modal & Data Management ---
  function openSettingsModal() {
    settingCalorieGoal.value = appState.settings.dailyCalorieGoal;
    settingProteinGoal.value = appState.settings.proteinGoal;
    settingCarbsGoal.value = appState.settings.carbsGoal;
    settingFatGoal.value = appState.settings.fatGoal;
    settingWaterGoal.value = appState.settings.waterGoal;
    settingsModal.classList.add('active');
  }

  function closeSettingsModal() {
    settingsModal.classList.remove('active');
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    appState.settings.dailyCalorieGoal = parseInt(settingCalorieGoal.value, 10) || 2000;
    appState.settings.proteinGoal = parseInt(settingProteinGoal.value, 10) || 130;
    appState.settings.carbsGoal = parseInt(settingCarbsGoal.value, 10) || 225;
    appState.settings.fatGoal = parseInt(settingFatGoal.value, 10) || 65;
    appState.settings.waterGoal = parseInt(settingWaterGoal.value, 10) || 2500;

    saveSettings();
    closeSettingsModal();
    renderDashboard();
  }

  function exportBackup() {
    const exportData = {
      version: 1,
      exportDate: new Date().toISOString(),
      settings: appState.settings,
      days: appState.days,
      presets: appState.presets
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nutritrack_backup_${getFormattedDate(new Date())}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.settings) {
          appState.settings = Object.assign({}, DEFAULT_SETTINGS, importedData.settings);
          saveSettings();
        }
        if (importedData.days) {
          appState.days = importedData.days;
          saveDays();
        }
        if (importedData.presets) {
          appState.presets = importedData.presets;
          savePresets();
          renderPresets();
        }
        alert('Data successfully imported and restored!');
        closeSettingsModal();
        renderDashboard();
      } catch (err) {
        alert('Error importing file: Invalid JSON format.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Reset file input value so re-importing the same file triggers change
    event.target.value = '';
  }

  function clearTodayData() {
    if (confirm(`Are you sure you want to clear all logged food and water for ${formatDisplayDate(appState.selectedDate)}?`)) {
      appState.days[appState.selectedDate] = {
        water: 0,
        meals: []
      };
      saveDays();
      closeSettingsModal();
      renderDashboard();
    }
  }

  function resetAllData() {
    if (confirm('WARNING: This will permanently delete all your logged food history, macros, and reset your targets to default. Proceed?')) {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.DAYS);
      localStorage.removeItem(STORAGE_KEYS.PRESETS);
      appState.settings = { ...DEFAULT_SETTINGS };
      appState.days = {};
      appState.presets = [...DEFAULT_PRESETS];
      seedInitialSampleData();
      saveSettings();
      savePresets();
      renderPresets();
      closeSettingsModal();
      renderDashboard();
      alert('All data has been reset to defaults.');
    }
  }

  // --- Date Navigation Events ---
  function changeDateByOffset(daysOffset) {
    const current = parseFormattedDate(appState.selectedDate);
    current.setDate(current.getDate() + daysOffset);
    appState.selectedDate = getFormattedDate(current);
    renderDashboard();
  }

  function setDateToToday() {
    appState.selectedDate = getFormattedDate(new Date());
    renderDashboard();
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Date navigation
    prevDayBtn.addEventListener('click', () => changeDateByOffset(-1));
    nextDayBtn.addEventListener('click', () => changeDateByOffset(1));
    todayBtn.addEventListener('click', setDateToToday);

    datePicker.addEventListener('change', (e) => {
      if (e.target.value) {
        appState.selectedDate = e.target.value;
        renderDashboard();
      }
    });

    // Add Modal open
    openAddModalBtn.addEventListener('click', () => openAddFoodModal('breakfast'));
    closeFoodModalBtn.addEventListener('click', closeFoodModal);
    cancelFoodModalBtn.addEventListener('click', closeFoodModal);
    foodForm.addEventListener('submit', handleFoodFormSubmit);

    // "+ Add" buttons on each meal category
    document.querySelectorAll('.meal-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mealType = e.currentTarget.getAttribute('data-meal') || 'breakfast';
        openAddFoodModal(mealType);
      });
    });

    // Water tracker buttons
    addWater250Btn.addEventListener('click', () => changeWater(250));
    addWater500Btn.addEventListener('click', () => changeWater(500));
    subWater250Btn.addEventListener('click', () => changeWater(-250));
    resetWaterBtn.addEventListener('click', resetWater);

    // Settings Modal
    openSettingsBtn.addEventListener('click', openSettingsModal);
    closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
    cancelSettingsBtn.addEventListener('click', closeSettingsModal);
    settingsForm.addEventListener('submit', handleSettingsSubmit);

    // Data Management
    exportDataBtn.addEventListener('click', exportBackup);
    importDataInput.addEventListener('change', handleImportFile);
    clearTodayBtn.addEventListener('click', clearTodayData);
    resetAllDataBtn.addEventListener('click', resetAllData);

    // Close modals on clicking overlay backdrop
    window.addEventListener('click', (e) => {
      if (e.target === foodModal) {
        closeFoodModal();
      }
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });

    // Keyboard shortcuts (Escape closes modals)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeFoodModal();
        closeSettingsModal();
      }
    });

    // Window resize (rerender canvas to keep it crisp)
    window.addEventListener('resize', () => {
      renderWeeklyChart();
    });
  }

  // --- App Initialization ---
  function init() {
    loadFromStorage();
    setupEventListeners();
    renderPresets();
    renderDashboard();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
