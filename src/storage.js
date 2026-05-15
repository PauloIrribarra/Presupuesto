import { DEFAULT_PAYDAY, monthKey } from './constants';

export const loadState = () => {
	const saved = localStorage.getItem('presupuesto-app');
	if (!saved) {
		return {
			payday: DEFAULT_PAYDAY,
			month: monthKey,
			movements: [],
		};
	}

	const state = JSON.parse(saved);

	return {
		payday: state.payday ?? DEFAULT_PAYDAY,
		month: state.month ?? monthKey,
		movements: state.movements ?? [],
	};
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
