import { useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import CategoryMovementChart from './components/CategoryMovementChart';
import Metric from './components/Metric';
import MovementForm from './components/MovementForm';
import MovementHistory from './components/MovementHistory';
import { CLP, categories, monthKey } from './constants';
import { clearBudget, loadState, loadTheme, saveBudget, saveTheme } from './storage';

const getDefaultDraft = () => ({
	type: 'expense',
	amount: '',
	category: 'Comida',
	note: '',
	date: new Date().toISOString().slice(0, 10),
});

function App() {
	const [budget, setBudget] = useState(loadState);
	const [isDarkMode, setIsDarkMode] = useState(loadTheme);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [draft, setDraft] = useState(getDefaultDraft);

	const persist = (nextBudget) => {
		setBudget(nextBudget);
		saveBudget(nextBudget);
	};

	const toggleTheme = () => {
		const nextMode = !isDarkMode;
		setIsDarkMode(nextMode);
		saveTheme(nextMode);
	};

	const totals = useMemo(() => {
		const income = budget.movements
			.filter((movement) => movement.type === 'income')
			.reduce((sum, movement) => sum + movement.amount, 0);
		const expenses = budget.movements
			.filter((movement) => movement.type === 'expense')
			.reduce((sum, movement) => sum + movement.amount, 0);
		const currentBalance = income - expenses;
		const today = new Date();
		const lastDay = new Date(
			today.getFullYear(),
			today.getMonth() + 1,
			0,
		).getDate();
		const remainingDays = Math.max(lastDay - today.getDate() + 1, 1);

		return {
			income,
			expenses,
			currentBalance,
			dailyAvailable: currentBalance / remainingDays,
			remainingDays,
		};
	}, [budget]);

	const categoryExpenseData = useMemo(
		() => getCategoryMovementData(budget, 'expense'),
		[budget],
	);

	const categoryIncomeData = useMemo(
		() => getCategoryMovementData(budget, 'income'),
		[budget],
	);

	const updateDraft = (changes) => {
		setDraft((currentDraft) => ({ ...currentDraft, ...changes }));
	};

	const addMovement = (event) => {
		event.preventDefault();
		const amount = Number(draft.amount);
		if (!amount || amount < 1) return;

		persist({
			...budget,
			movements: [
				{
					id: crypto.randomUUID(),
					...draft,
					amount,
				},
				...budget.movements,
			],
		});

		updateDraft({ amount: '', note: '' });
	};

	const deleteMovement = (id) => {
		persist({
			...budget,
			movements: budget.movements.filter((movement) => movement.id !== id),
		});
	};

	const resetData = () => {
		const initialState = {
			month: monthKey,
			movements: [],
		};

		clearBudget();
		setBudget(initialState);
	};

	return (
		<main
			className={`min-h-screen overflow-x-hidden px-3 py-4 text-slate-900 transition-colors sm:px-6 sm:py-6 lg:px-8 ${
				isDarkMode ? 'dark bg-emerald-950' : 'bg-[#f6f7f2]'
			}`}
		>
			<div className='mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6'>
				<AppHeader
					month={budget.month}
					isDarkMode={isDarkMode}
					onMonthChange={(month) => persist({ ...budget, month })}
					onResetData={resetData}
					onToggleTheme={toggleTheme}
				/>

				<section className='grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4'>
					<Metric
						title='Saldo actual'
						value={CLP.format(totals.currentBalance)}
						strong
					/>
					<Metric
						title='Gastado este mes'
						value={CLP.format(totals.expenses)}
					/>
					<Metric
						title='Ingresos extra'
						value={CLP.format(totals.income)}
					/>
					<Metric
						title='Disponible diario'
						value={CLP.format(totals.dailyAvailable)}
						hint={`${totals.remainingDays} dias restantes`}
					/>
				</section>

				<section className='grid min-w-0 gap-5 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] lg:gap-6'>
					<div className='min-w-0 space-y-5 sm:space-y-6'>
						<MovementForm
							draft={draft}
							isCategoryOpen={isCategoryOpen}
							onCategoryToggle={() => setIsCategoryOpen((open) => !open)}
							onCategoryChange={(category) => {
								updateDraft({ category });
								setIsCategoryOpen(false);
							}}
							onDraftChange={updateDraft}
							onSubmit={addMovement}
						/>
					</div>

					<div className='min-w-0 space-y-5 sm:space-y-6'>
						<CategoryMovementChart
							data={categoryExpenseData}
							title='Gastos por categoria'
							emptyMessage='Aun no hay gastos registrados para este mes.'
							barClassName='bg-[#b86f6f]'
						/>
						<CategoryMovementChart
							data={categoryIncomeData}
							title='Ingresos por categoria'
							emptyMessage='Aun no hay ingresos registrados para este mes.'
							barClassName='bg-emerald-600'
						/>

						<MovementHistory
							movements={budget.movements}
							onDelete={deleteMovement}
						/>
					</div>
				</section>
			</div>
		</main>
	);
}

function getCategoryMovementData(budget, type) {
	const items = categories
		.map((category) => {
			const movements = budget.movements
				.filter(
					(movement) =>
						movement.type === type &&
						movement.category === category &&
						movement.date.startsWith(budget.month),
				)
				.sort((a, b) => b.date.localeCompare(a.date));

			return {
				category,
				movements,
				total: movements.reduce((sum, movement) => sum + movement.amount, 0),
			};
		})
		.filter((item) => item.total > 0)
		.sort((a, b) => b.total - a.total);
	const total = items.reduce((sum, item) => sum + item.total, 0);
	const max = Math.max(...items.map((item) => item.total), 0);

	return { items, total, max };
}

export default App;
