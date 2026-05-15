import { monthKey } from './constants';

export const loadState = () => {
	const saved = localStorage.getItem('presupuesto-app');
	if (!saved) {
		return {
			month: monthKey,
			movements: [],
		};
	}

	return JSON.parse(saved);
};

export const loadTheme = () => localStorage.getItem('presupuesto-theme') === 'dark';

export const saveBudget = (budget) => {
	localStorage.setItem('presupuesto-app', JSON.stringify(budget));
};

export const saveTheme = (isDarkMode) => {
	localStorage.setItem('presupuesto-theme', isDarkMode ? 'dark' : 'light');
};

export const clearBudget = () => {
	localStorage.removeItem('presupuesto-app');
};
