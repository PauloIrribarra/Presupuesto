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
	const [activeView, setActiveView] = useState('general');
	const [draft, setDraft] = useState(getDefaultDraft);
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
				<DesktopSidebar activeView={activeView} onViewChange={setActiveView} />

				<div className='flex min-w-0 flex-1 flex-col gap-5 sm:gap-6'>
					{activeView === 'general' ? (
						<PanelGeneral
							budget={budget}
							categoryExpenseData={categoryExpenseData}
							categoryIncomeData={categoryIncomeData}
							cycleLabel={cycleLabel}
							cycleMovements={cycleMovements}
							draft={draft}
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
					) : (
						<SavingsView />
					)}
				</div>
			</div>
		</main>
	);
}

function DesktopSidebar({ activeView, onViewChange }) {
	const items = [
		{ id: 'general', label: 'Panel General' },
		{ id: 'savings', label: 'Ahorros' },
	];

	return (
		<aside className='absolute right-full top-0 hidden w-48 pr-10 lg:block'>
			<nav className='flex flex-col items-center gap-7 pt-14'>
				{items.map((item) => {
					const isActive = activeView === item.id;

					return (
						<button
							key={item.id}
							type='button'
							onClick={() => onViewChange(item.id)}
							className={`group w-fit whitespace-nowrap text-center text-sm font-semibold transition ${
								isActive
									? 'text-emerald-950 drop-shadow-[0_0_8px_rgba(16,185,129,0.75)] dark:text-emerald-100'
									: 'text-emerald-700 drop-shadow-[0_0_5px_rgba(16,185,129,0.45)] hover:text-emerald-950 hover:drop-shadow-[0_0_10px_rgba(52,211,153,0.85)] dark:text-emerald-300 dark:hover:text-emerald-50'
							}`}
						>
							<span className='relative inline-block rounded-sm px-1 py-1 [text-shadow:0_0_10px_rgba(52,211,153,0.55)] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-emerald-300 after:shadow-[0_0_10px_rgba(52,211,153,0.9)] after:transition-transform group-hover:after:scale-x-100'>
								{item.label}
							</span>
						</button>
					);
				})}
			</nav>
		</aside>
	);
}

function PanelGeneral({
	budget,
	categoryExpenseData,
	categoryIncomeData,
	cycleLabel,
	cycleMovements,
	draft,
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
	onToggleTheme,
}) {
	return (
		<>
			<AppHeader
				payday={budget.payday}
				cycleLabel={cycleLabel}
				isDarkMode={isDarkMode}
				onPaydayChange={onPaydayChange}
				onResetData={onResetData}
				onToggleTheme={onToggleTheme}
			/>

			<section className='grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4'>
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

function SavingsView() {
	return (
		<section className='min-h-[360px] rounded-lg border border-emerald-500/40 bg-white p-6 shadow-[0_0_20px_rgba(16,185,129,0.16)] dark:bg-emerald-950/70'>
			<p className='text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300'>
				Ahorros
			</p>
			<h2 className='mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl dark:text-emerald-50'>
				Resumen de ahorros
			</h2>
			<p className='mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-emerald-200'>
				Esta vista queda preparada para registrar el saldo positivo de cada ciclo
				y seguir tu ahorro acumulado.
			</p>
		</section>
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
