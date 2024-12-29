let habits = [];

// Load habits from localStorage
function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    habits = savedHabits ? JSON.parse(savedHabits) : [];
    displayHabits();
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Add new habit
function addHabit() {
    const input = document.getElementById('habitInput');
    const habitName = input.value.trim();
    
    if (habitName) {
        habits.push({
            name: habitName,
            completed: false,
            date: new Date().toISOString().split('T')[0]
        });
        saveHabits();
        displayHabits();
        input.value = '';
    }
}

// Toggle habit completion
function toggleHabit(index) {
    habits[index].completed = !habits[index].completed;
    saveHabits();
    displayHabits();
}

// Display habits
function displayHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';
    
    habits.forEach((habit, index) => {
        const div = document.createElement('div');
        div.className = `p-4 rounded-xl border ${habit.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} transition-colors shadow-sm`;
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="relative">
                    <input type="checkbox" 
                           class="w-6 h-6 rounded-lg border-gray-300 text-blue-500 focus:ring-blue-500"
                           ${habit.completed ? 'checked' : ''} 
                           onclick="toggleHabit(${index})">
                </div>
                <div class="flex flex-col flex-1">
                    <span class="text-base text-gray-800 leading-tight ${habit.completed ? 'line-through text-gray-500' : ''}">${habit.name}</span>
                    <span class="text-xs text-gray-500">${habit.date}</span>
                </div>
            </div>
        `;
        habitList.appendChild(div);
    });
}

// Initialize app
loadHabits();
