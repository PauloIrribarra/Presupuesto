const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const toDateKey = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
};

export const getDaysInMonth = (year, monthIndex) =>
	new Date(year, monthIndex + 1, 0).getDate();

export const clampPaydayForMonth = (year, monthIndex, payday) =>
	Math.min(payday, getDaysInMonth(year, monthIndex));

export const getCurrentCycle = (payday, today = new Date()) => {
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();
	const currentPayday = new Date(
		currentYear,
		currentMonth,
		clampPaydayForMonth(currentYear, currentMonth, payday),
	);

	const startsThisMonth = today >= currentPayday;
	const start = startsThisMonth
		? currentPayday
		: new Date(
				currentYear,
				currentMonth - 1,
				clampPaydayForMonth(currentYear, currentMonth - 1, payday),
			);
	const nextPayday = startsThisMonth
		? new Date(
				currentYear,
				currentMonth + 1,
				clampPaydayForMonth(currentYear, currentMonth + 1, payday),
			)
		: currentPayday;
	const end = new Date(nextPayday);
	end.setDate(nextPayday.getDate() - 1);

	return {
		start,
		end,
		startKey: toDateKey(start),
		endKey: toDateKey(end),
		remainingDays: Math.max(
			Math.floor((end.getTime() - today.getTime()) / MS_PER_DAY) + 1,
			1,
		),
	};
};

export const isDateInCycle = (date, cycle) =>
	date >= cycle.startKey && date <= cycle.endKey;

export const formatCycleRange = (cycle) => {
	const formatter = new Intl.DateTimeFormat('es-CL', {
		day: 'numeric',
		month: 'short',
	});

	return `${formatter.format(cycle.start)} - ${formatter.format(cycle.end)}`;
};
