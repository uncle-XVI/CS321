/**
 * Fitness Tracker App – JavaScript
 * Author: Xiaoyue Yang
 * Date: 2026-04-06
 * Description: Hard-coded workout planner with three views (Workout Plan table,
 *              Calendar grouped by day, and Make Schedule form). No database. 
 *              The app allows adding/deleting
 *              exercises and switching views without page reload.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Hard-coded workout plans (initial data)
    let workoutPlans = [
        { id: Date.now() + 1, workoutType: 'pull', exerciseName: 'Pull-ups', repsSets: '3x8', dayOfWeek: 'Monday' },
        { id: Date.now() + 2, workoutType: 'push', exerciseName: 'Bench Press', repsSets: '4x10', dayOfWeek: 'Tuesday' },
        { id: Date.now() + 3, workoutType: 'lowerbody', exerciseName: 'Squats', repsSets: '3x12', dayOfWeek: 'Wednesday' },
        { id: Date.now() + 4, workoutType: 'cardio', exerciseName: 'Running', repsSets: '30 min', dayOfWeek: 'Friday' }
    ];

    function generateId() {
        return Date.now() + Math.floor(Math.random() * 10000);
    }

    //Document elements
    const planSection = document.querySelector('.plan_section');
    const workoutTypeSelect = document.querySelector('select[name="workouts"]');
    const exerciseNameInput = document.querySelector('input[name="exercises"]');
    const repsSetsInput = document.querySelector('input[name="details"]');
    const daySelect = document.querySelector('select[name="days"]');
    const addButton = document.querySelector('.button');

    // Navigation links
    const navLinks = document.querySelectorAll('.navibar a');
    const workoutPlanLink = navLinks[0];   // "Workout Plan"
    const calendarLink = navLinks[1];      // "Calendar"
    const makeScheduleLink = navLinks[2];  // "Make Schedule"

    // Dynamic views container (for Workout Plan and Calendar)
    const dynamicViewsContainer = document.createElement('div');
    dynamicViewsContainer.id = 'dynamic-views';
    //changable only to make it appear on the screen, not for styling
    dynamicViewsContainer.style.marginLeft = '450px';
    dynamicViewsContainer.style.marginTop = '20px';

    if (planSection && planSection.parentNode) {
        planSection.parentNode.insertBefore(dynamicViewsContainer, planSection.nextSibling);
    } else {
        document.body.appendChild(dynamicViewsContainer);
    }

    const workoutPlanView = document.createElement('div');
    workoutPlanView.id = 'workout-plan-view';
    workoutPlanView.style.display = 'none';

    const calendarView = document.createElement('div');
    calendarView.id = 'calendar-view';
    calendarView.style.display = 'none';

    dynamicViewsContainer.appendChild(workoutPlanView);
    dynamicViewsContainer.appendChild(calendarView);

    // Helper to create table cells
    function createCell(content) {
        const td = document.createElement('td');
        td.textContent = content;
        return td;
    }

    //Render workout plan table
    function renderWorkoutPlan() {
        if (!workoutPlanView) return;
        if (workoutPlans.length === 0) {
            workoutPlanView.innerHTML = '<p>No workout plans yet. Add some using "Make Schedule".</p>';
            return;
        }
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Workout Type', 'Exercise Name', 'Reps/Sets', 'Day', 'Action'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        workoutPlans.forEach(plan => {
            const row = document.createElement('tr');
            row.appendChild(createCell(plan.workoutType));
            row.appendChild(createCell(plan.exerciseName));
            row.appendChild(createCell(plan.repsSets));
            row.appendChild(createCell(plan.dayOfWeek));
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deletePlanById(plan.id));
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        workoutPlanView.innerHTML = '';
        workoutPlanView.appendChild(table);
    }

    // Render calendar view grouped by day of the week
    function renderCalendar() {
        if (!calendarView) return;
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const grouped = {};
        daysOfWeek.forEach(day => { grouped[day] = []; });
        workoutPlans.forEach(plan => {
            if (grouped[plan.dayOfWeek]) grouped[plan.dayOfWeek].push(plan);
            else grouped[plan.dayOfWeek] = [plan];
        });
        calendarView.innerHTML = '';
        const container = document.createElement('div');
        for (let day of daysOfWeek) {
            const card = document.createElement('div');
            const title = document.createElement('h3');
            title.textContent = day;
            card.appendChild(title);
            const list = grouped[day];
            if (list.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'No workouts scheduled';
                card.appendChild(p);
            } else {
                const ul = document.createElement('ul');
                list.forEach(plan => {
                    const li = document.createElement('li');
                    li.textContent = `${plan.exerciseName} (${plan.workoutType}) – ${plan.repsSets}`;
                    ul.appendChild(li);
                });
                card.appendChild(ul);
            }
            container.appendChild(card);
        }
        calendarView.appendChild(container);
    }

    // Delete a workout plan 
    function deletePlanById(id) {
        workoutPlans = workoutPlans.filter(plan => plan.id !== id);
        const view = getCurrentActiveView();
        if (view === 'workout') {
            renderWorkoutPlan();
        } else if (view === 'calendar') {
            renderCalendar();
        }
    }

    // View management
    let activeView = 'makeschedule'; // 'workout', 'calendar', or 'makeschedule'

    function getCurrentActiveView() {
        return activeView;
    }

    function setActiveView(view) {
        activeView = view;
        // Hide both dynamic views
        workoutPlanView.style.display = 'none';
        calendarView.style.display = 'none';
        // Show the selected view and control the form visibility
        if (view === 'workout') {
            workoutPlanView.style.display = 'block';
            if (planSection) planSection.style.display = 'none';
            renderWorkoutPlan();
        } else if (view === 'calendar') {
            calendarView.style.display = 'block';
            if (planSection) planSection.style.display = 'none';
            renderCalendar();
        } else if (view === 'makeschedule') {
            if (planSection) planSection.style.display = 'block';
            dynamicViewsContainer.style.display = 'block'; 
        }
    }

    // Add exercise 
    function addWorkoutPlan() {
        const workoutType = workoutTypeSelect ? workoutTypeSelect.value : 'pull';
        const exerciseName = exerciseNameInput ? exerciseNameInput.value.trim() : '';
        const repsSets = repsSetsInput ? repsSetsInput.value.trim() : '';
        const dayOfWeek = daySelect ? daySelect.value : 'Monday';
        if (exerciseName === '') {
            alert('Please enter an exercise name.');
            return;
        }
        if (repsSets === '') {
            alert('Please enter reps/sets (e.g., 3x10).');
            return;
        }
        const newPlan = { id: generateId(), workoutType, exerciseName, repsSets, dayOfWeek };
        workoutPlans.push(newPlan);
        if (exerciseNameInput) exerciseNameInput.value = '';
        if (repsSetsInput) repsSetsInput.value = '';
        // Re-render the current view if it shows data (workout or calendar)
        if (activeView === 'workout') {
            renderWorkoutPlan();
        } else if (activeView === 'calendar') {
            renderCalendar();
        }
    }

    // Event listeners 
    if (workoutPlanLink) {
        workoutPlanLink.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveView('workout');
        });
    }
    if (calendarLink) {
        calendarLink.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveView('calendar');
        });
    }
    if (makeScheduleLink) {
        makeScheduleLink.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveView('makeschedule');
        });
    }
    if (addButton) {
        addButton.addEventListener('click', addWorkoutPlan);
    }

    // INITIALIZATION 
    setActiveView('makeschedule');
});