export const CLP = new Intl.NumberFormat('es-CL', {
	style: 'currency',
	currency: 'CLP',
	maximumFractionDigits: 0,
});

export const categories = [
	'Cuentas',
	'Comida',
	'Suscripciones',
	'Negocios',
	'Webeo',
	'Ahorro',
	'Otros',
];

export const monthKey = new Date().toISOString().slice(0, 7);
export const DEFAULT_PAYDAY = 25;
export const SHOW_RESET_BUTTON = true;
