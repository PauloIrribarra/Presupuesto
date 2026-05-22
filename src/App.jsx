import { useEffect, useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import AuthGate from './components/AuthGate';
import CategoryMovementChart from './components/CategoryMovementChart';
import Metric from './components/Metric';
import MovementForm from './components/MovementForm';
import MovementHistory from './components/MovementHistory';
import { AUTH_ENABLED, HAS_SUPABASE_CONFIG } from './config';
import { CLP, categories } from './constants';
import { formatCycleRange, getCurrentCycle, isDateInCycle } from './dateUtils';
import { loadState, loadTheme, saveBudget, saveTheme } from './storage';
import { supabase } from './supabaseClient';

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
	const [movementError, setMovementError] = useState('');
	const [session, setSession] = useState(null);
	const [isAuthReady, setIsAuthReady] = useState(!AUTH_ENABLED);

	useEffect(() => {
		if (!AUTH_ENABLED || !supabase) return undefined;

		let isMounted = true;

		supabase.auth.getSession().then(({ data }) => {
			if (!isMounted) return;
			setSession(data.session);
			setIsAuthReady(true);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			setSession(nextSession);
			setIsAuthReady(true);
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const persist = (nextBudget) => {
		setBudget(nextBudget);
		saveBudget(nextBudget);
	};

	const toggleTheme = () => {
		const nextMode = !isDarkMode;
		setIsDarkMode(nextMode);
		saveTheme(nextMode);
	};

	const signOut = async () => {
		if (!supabase) return;
		await supabase.auth.signOut();
	};

	const cycle = useMemo(() => getCurrentCycle(budget.payday), [budget.payday]);
	const cycleMovements = useMemo(
		() => budget.movements.filter((movement) => isDateInCycle(movement.date, cycle)),
		[budget.movements, cycle],
	);
	const cycleLabel = useMemo(() => formatCycleRange(cycle), [cycle]);

	const totals = useMemo(() => {
		const income = cycleMovements
			.filter((movement) => movement.type === 'income')
			.reduce((sum, movement) => sum + movement.amount, 0);
		const expenses = cycleMovements
			.filter((movement) => movement.type === 'expense')
			.reduce((sum, movement) => sum + movement.amount, 0);
		const currentBalance = income - expenses;

		return {
			income,
			expenses,
			currentBalance,
			dailyAvailable: currentBalance / cycle.remainingDays,
			remainingDays: cycle.remainingDays,
		};
	}, [cycle.remainingDays, cycleMovements]);

	const categoryExpenseData = useMemo(
		() => getCategoryMovementData(cycleMovements, 'expense'),
		[cycleMovements],
	);

	const categoryIncomeData = useMemo(
		() => getCategoryMovementData(cycleMovements, 'income'),
		[cycleMovements],
	);

	const updateDraft = (changes) => {
		setMovementError('');
		setDraft((currentDraft) => ({ ...currentDraft, ...changes }));
	};

	const updatePayday = (value) => {
		const payday = Math.min(Math.max(Number(value), 1), 31);
		if (!payday) return;

		persist({ ...budget, payday });
	};

	const addMovement = (event) => {
		event.preventDefault();
		const amount = Number(draft.amount);
		if (!amount || amount < 1) {
			setMovementError('Ingresa un monto valido.');
			return;
		}

		if (draft.type === 'expense' && amount > totals.currentBalance) {
			setMovementError(
				`El gasto supera tu saldo actual disponible (${CLP.format(totals.currentBalance)}).`,
			);
			return;
		}

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

		setMovementError('');
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
			payday: budget.payday,
			month: budget.month,
			movements: [],
		};

		persist(initialState);
	};

	if (AUTH_ENABLED && !HAS_SUPABASE_CONFIG) {
		return <AuthGate isDarkMode={isDarkMode} configMissing />;
	}

	if (AUTH_ENABLED && !isAuthReady) {
		return (
			<main
				className={`flex min-h-screen items-center justify-center px-4 text-sm font-semibold ${
					isDarkMode ? 'dark bg-emerald-950 text-emerald-100' : 'bg-[#f6f7f2] text-emerald-900'
				}`}
			>
				Cargando sesion...
			</main>
		);
	}

	if (AUTH_ENABLED && !session) {
		return <AuthGate isDarkMode={isDarkMode} />;
	}

	return (
		<main
			className={`min-h-screen overflow-x-hidden px-3 py-4 text-slate-900 transition-colors sm:px-6 sm:py-6 lg:px-8 ${
				isDarkMode ? 'dark bg-emerald-950' : 'bg-[#f6f7f2]'
			}`}
		>
			<div className='relative mx-auto w-full max-w-7xl'>
				<div className='flex min-w-0 flex-1 flex-col gap-5 sm:gap-6'>
					<PanelGeneral
						budget={budget}
						categoryExpenseData={categoryExpenseData}
						categoryIncomeData={categoryIncomeData}
						cycleLabel={cycleLabel}
						cycleMovements={cycleMovements}
						draft={draft}
						error={movementError}
						isCategoryOpen={isCategoryOpen}
						isDarkMode={isDarkMode}
						totals={totals}
						onAddMovement={addMovement}
						onCategoryChange={(category) => {
							updateDraft({ category });
							setIsCategoryOpen(false);
						}}
						onCategoryToggle={() => setIsCategoryOpen((open) => !open)}
						onDeleteMovement={deleteMovement}
						onDraftChange={updateDraft}
						onPaydayChange={updatePayday}
						onResetData={resetData}
						onSignOut={AUTH_ENABLED ? signOut : undefined}
						onToggleTheme={toggleTheme}
						userEmail={session?.user?.email}
					/>
				</div>
			</div>
		</main>
	);
}

function PanelGeneral({
	budget,
	categoryExpenseData,
	categoryIncomeData,
	cycleLabel,
	cycleMovements,
	draft,
	error,
	isCategoryOpen,
	isDarkMode,
	totals,
	onAddMovement,
	onCategoryChange,
	onCategoryToggle,
	onDeleteMovement,
	onDraftChange,
	onPaydayChange,
	onResetData,
	onSignOut,
	onToggleTheme,
	userEmail,
}) {
	return (
		<>
			<AppHeader
				payday={budget.payday}
				cycleLabel={cycleLabel}
				isDarkMode={isDarkMode}
				onPaydayChange={onPaydayChange}
				onResetData={onResetData}
				onSignOut={onSignOut}
				onToggleTheme={onToggleTheme}
				userEmail={userEmail}
			/>

			<section className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
				<Metric
					title='Saldo actual'
					value={CLP.format(totals.currentBalance)}
					strong
				/>
				<Metric
					title='Gastado este ciclo'
					value={CLP.format(totals.expenses)}
				/>
				<Metric
					title='Ingresos extra'
					value={CLP.format(totals.income)}
				/>
				<Metric
					title='Disponible diario'
					value={CLP.format(totals.dailyAvailable)}
					hint={`${totals.remainingDays} dias restantes del ciclo`}
				/>
			</section>

			<section className='grid min-w-0 gap-5 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] lg:gap-6'>
				<div className='min-w-0 space-y-5 sm:space-y-6'>
					<MovementForm
						draft={draft}
						error={error}
						isCategoryOpen={isCategoryOpen}
						onCategoryToggle={onCategoryToggle}
						onCategoryChange={onCategoryChange}
						onDraftChange={onDraftChange}
						onSubmit={onAddMovement}
					/>
				</div>

				<div className='min-w-0 space-y-5 sm:space-y-6'>
					<CategoryMovementChart
						data={categoryExpenseData}
						title='Gastos por categoria'
						emptyMessage='Aun no hay gastos registrados para este ciclo.'
						barClassName='bg-[#b86f6f]'
					/>
					<CategoryMovementChart
						data={categoryIncomeData}
						title='Ingresos por categoria'
						emptyMessage='Aun no hay ingresos registrados para este ciclo.'
						barClassName='bg-emerald-600'
					/>

					<MovementHistory
						movements={cycleMovements}
						onDelete={onDeleteMovement}
					/>
				</div>
			</section>
		</>
	);
}

function getCategoryMovementData(movements, type) {
	const items = categories
		.map((category) => {
			const categoryMovements = movements
				.filter(
					(movement) =>
						movement.type === type &&
						movement.category === category,
				)
				.sort((a, b) => b.date.localeCompare(a.date));

			return {
				category,
				movements: categoryMovements,
				total: categoryMovements.reduce((sum, movement) => sum + movement.amount, 0),
			};
		})
		.filter((item) => item.total > 0)
		.sort((a, b) => b.total - a.total);
	const total = items.reduce((sum, item) => sum + item.total, 0);
	const max = Math.max(...items.map((item) => item.total), 0);

	return { items, total, max };
}

export default App;
