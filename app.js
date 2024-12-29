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
            date: new Date().toISOString().split('T')[0],
            timer: 5, // Changed default timer from 60 to 5 seconds
            isRunning: false,
            remainingTime: 5 // Changed default remaining time to 5 seconds
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

// Adjust timer
function adjustTimer(index, seconds) {
    habits[index].timer = Math.max(0, habits[index].timer + seconds);
    habits[index].remainingTime = habits[index].timer;
    saveHabits();
    displayHabits();
}

// Toggle timer
function toggleTimer(index) {
    const habit = habits[index];
    habit.isRunning = !habit.isRunning;
    
    if (habit.isRunning) {
        habit.timerId = setInterval(() => {
            if (habit.remainingTime > 0) {
                habit.remainingTime--;
                updateTimerDisplay(index);
            } else {
                clearInterval(habit.timerId);
                habit.isRunning = false;
                habit.remainingTime = habit.timer;
                displayHabits();
            }
        }, 1000);
    } else {
        clearInterval(habit.timerId);
    }
    displayHabits();
}

// Update timer display
function updateTimerDisplay(index) {
    const timerElement = document.getElementById(`timer-${index}`);
    if (timerElement) {
        const minutes = Math.floor(habits[index].remainingTime / 60);
        const seconds = habits[index].remainingTime % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Display habits
function displayHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';
    
    habits.forEach((habit, index) => {
        const div = document.createElement('div');
        div.className = `habit-enter p-4 rounded-2xl border ${habit.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} transition-all duration-200 shadow-sm hover:shadow-md`;
        
        const timeAgo = getTimeAgo(habit.date);
        const minutes = Math.floor(habit.remainingTime / 60);
        const seconds = habit.remainingTime % 60;
        
        div.innerHTML = `
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <input type="checkbox" 
                               class="w-6 h-6 rounded-xl border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                               ${habit.completed ? 'checked' : ''} 
                               onclick="toggleHabit(${index})">
                    </div>
                    <div class="flex flex-col flex-1 min-w-0">
                        <span class="text-base text-gray-800 leading-tight ${habit.completed ? 'line-through text-gray-500' : ''} truncate">
                            ${habit.name}
                        </span>
                        <span class="text-xs text-gray-500">${timeAgo}</span>
                    </div>
                    <button onclick="deleteHabit(${index})" 
                            class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                    <button onclick="adjustTimer(${index}, -5)" 
                            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg">
                        -
                    </button>
                    <div class="flex-1 text-center">
                        <span id="timer-${index}" class="font-mono text-lg">
                            ${minutes}:${seconds.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <button onclick="adjustTimer(${index}, 5)" 
                            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg">
                        +
                    </button>
                    <button onclick="toggleTimer(${index})" 
                            class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        ${habit.isRunning ? 'Pause' : 'Start'}
                    </button>
                </div>
            </div>
        `;
        habitList.appendChild(div);
    });
}

function deleteHabit(index) {
    habits.splice(index, 1);
    saveHabits();
    displayHabits();
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Initialize app
loadHabits();
