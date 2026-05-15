import { useMemo, useState } from 'react';

const CLP = new Intl.NumberFormat('es-CL', {
	style: 'currency',
	currency: 'CLP',
	maximumFractionDigits: 0,
});

const categories = [
	'Comida',
	'Transporte',
	'Cuentas',
	'Salud',
	'Negocios',
	'Ocio',
	'Deudas',
	'Ahorro',
	'Otros',
];

const monthKey = new Date().toISOString().slice(0, 7);
const SHOW_RESET_BUTTON = true;

const loadState = () => {
	const saved = localStorage.getItem('presupuesto-app');
	if (!saved) {
		return {
			month: monthKey,
			movements: [],
		};
	}

	return JSON.parse(saved);
};

const loadTheme = () => localStorage.getItem('presupuesto-theme') === 'dark';

function App() {
	const [budget, setBudget] = useState(loadState);
	const [isDarkMode, setIsDarkMode] = useState(loadTheme);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [draft, setDraft] = useState({
		type: 'expense',
		amount: '',
		category: 'Comida',
		note: '',
		date: new Date().toISOString().slice(0, 10),
	});

	const persist = (nextBudget) => {
		setBudget(nextBudget);
		localStorage.setItem('presupuesto-app', JSON.stringify(nextBudget));
	};

	const toggleTheme = () => {
		const nextMode = !isDarkMode;
		setIsDarkMode(nextMode);
		localStorage.setItem('presupuesto-theme', nextMode ? 'dark' : 'light');
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

	const categoryExpenseData = useMemo(() => {
		const items = categories
			.map((category) => {
				const movements = budget.movements
					.filter(
						(movement) =>
							movement.type === 'expense' &&
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
	}, [budget.movements, budget.month]);

	const categoryIncomeData = useMemo(() => {
		const items = categories
			.map((category) => {
				const movements = budget.movements
					.filter(
						(movement) =>
							movement.type === 'income' &&
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
	}, [budget.movements, budget.month]);

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

		setDraft({
			...draft,
			amount: '',
			note: '',
		});
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

		localStorage.removeItem('presupuesto-app');
		setBudget(initialState);
	};

	return (
		<main
			className={`min-h-screen overflow-x-hidden px-3 py-4 text-slate-900 transition-colors sm:px-6 sm:py-6 lg:px-8 ${
				isDarkMode ? 'dark bg-emerald-950' : 'bg-[#f6f7f2]'
			}`}
		>
			<div className='mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6'>
				<header className='flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-5 sm:pb-6 md:flex-row md:items-end md:justify-between dark:border-emerald-800/70'>
					<div className='min-w-0'>
						<p className='text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300'>
							Presupuesto personal
						</p>
						<h1 className='mt-2 text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl md:text-5xl dark:text-emerald-50'>
							Control mensual de tu dinero
						</h1>
					</div>

					<div className='flex w-full min-w-0 flex-col gap-3 md:max-w-xs'>
						<label className='flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-emerald-100'>
							Mes activo
							<input
								type='month'
								value={budget.month}
								onChange={(event) =>
									persist({ ...budget, month: event.target.value })
								}
								className='min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-50 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
							/>
						</label>

						<button
							type='button'
							onClick={toggleTheme}
							className='rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-100 dark:hover:border-emerald-500 dark:hover:bg-emerald-800'
						>
							{isDarkMode ? 'Modo claro' : 'Modo oscuro'}
						</button>

						{SHOW_RESET_BUTTON && (
							<button
								type='button'
								onClick={resetData}
								className='rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:border-rose-700 dark:hover:bg-rose-900/50'
							>
								Reiniciar datos de prueba
							</button>
						)}
					</div>
				</header>

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
						<form
							onSubmit={addMovement}
							className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'
						>
							<h2 className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
								Nuevo movimiento
							</h2>
							<div className='mt-4 grid gap-4'>
								<div className='grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-emerald-900/80'>
									{['expense', 'income'].map((type) => (
										<button
											key={type}
											type='button'
											onClick={() => setDraft({ ...draft, type })}
											className={`rounded-md px-3 py-2 text-sm font-semibold ${
												draft.type === type
													? 'bg-white text-slate-950 shadow-sm dark:bg-emerald-700 dark:text-white dark:shadow-none'
													: 'text-slate-600 dark:text-emerald-200'
											}`}
										>
											{type === 'expense' ? 'Gasto' : 'Ingreso'}
										</button>
									))}
								</div>

								<Input
									label='Monto'
									type='number'
									min='1'
									value={draft.amount}
									onChange={(amount) => setDraft({ ...draft, amount })}
									placeholder='12000'
								/>

								<CategoryPicker
									value={draft.category}
									isOpen={isCategoryOpen}
									onToggle={() => setIsCategoryOpen((open) => !open)}
									onChange={(category) => {
										setDraft({ ...draft, category });
										setIsCategoryOpen(false);
									}}
								/>

								<Input
									label='Fecha'
									type='date'
									value={draft.date}
									onChange={(date) => setDraft({ ...draft, date })}
								/>

								<Input
									label='Nota'
									value={draft.note}
									onChange={(note) => setDraft({ ...draft, note })}
									placeholder='Supermercado, sueldo, cuenta de luz...'
								/>

								<button className='rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500'>
									Agregar movimiento
								</button>
							</div>
						</form>
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

						<section className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'>
							<div className='border-b border-slate-200 p-4 sm:p-5 dark:border-emerald-800'>
								<h2 className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
									Historial
								</h2>
							</div>

							<div className='divide-y divide-slate-100 sm:hidden dark:divide-emerald-900'>
								{budget.movements.map((movement) => (
									<MovementCard
										key={movement.id}
										movement={movement}
										onDelete={deleteMovement}
									/>
								))}
								{!budget.movements.length && (
									<p className='px-4 py-8 text-center text-sm text-slate-500 dark:text-emerald-200'>
										Aun no hay movimientos registrados.
									</p>
								)}
							</div>

							<div className='hidden overflow-x-auto sm:block'>
								<table className='w-full min-w-[680px] text-left text-sm'>
									<thead className='bg-slate-50 text-slate-500 dark:bg-emerald-900/80 dark:text-emerald-200'>
										<tr>
											<th className='px-5 py-3 font-medium'>Fecha</th>
											<th className='px-5 py-3 font-medium'>Tipo</th>
											<th className='px-5 py-3 font-medium'>Categoria</th>
											<th className='px-5 py-3 font-medium'>Nota</th>
											<th className='px-5 py-3 text-right font-medium'>
												Monto
											</th>
											<th className='px-5 py-3'></th>
										</tr>
									</thead>
									<tbody className='divide-y divide-slate-100 dark:divide-emerald-900'>
										{budget.movements.map((movement) => (
											<tr key={movement.id}>
												<td className='px-5 py-4 text-slate-600 dark:text-emerald-200'>
													{movement.date}
												</td>
												<td className='px-5 py-4'>
													<span
														className={`rounded-full px-2 py-1 text-xs font-semibold ${
															movement.type === 'expense'
																? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-200'
																: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100'
														}`}
													>
														{movement.type === 'expense' ? 'Gasto' : 'Ingreso'}
													</span>
												</td>
												<td className='px-5 py-4 text-slate-700 dark:text-emerald-100'>
													{movement.category}
												</td>
												<td className='px-5 py-4 text-slate-500 dark:text-emerald-200'>
													{movement.note || '-'}
												</td>
												<td className='px-5 py-4 text-right font-semibold text-slate-950 dark:text-emerald-50'>
													{movement.type === 'expense' ? '-' : '+'}
													{CLP.format(movement.amount)}
												</td>
												<td className='px-5 py-4 text-right'>
													<button
														type='button'
														onClick={() => deleteMovement(movement.id)}
														className='rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-50'
													>
														Eliminar
													</button>
												</td>
											</tr>
										))}
										{!budget.movements.length && (
											<tr>
												<td
													className='px-5 py-8 text-center text-slate-500 dark:text-emerald-200'
													colSpan='6'
												>
													Aun no hay movimientos registrados.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}

function Metric({ title, value, hint, strong = false }) {
	return (
		<article className='min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'>
			<p className='text-sm font-medium text-slate-500 dark:text-emerald-200'>{title}</p>
			<p
				className={`mt-2 break-words font-semibold leading-tight ${
					strong
						? 'text-2xl text-emerald-800 sm:text-3xl dark:text-emerald-200'
						: 'text-xl text-slate-950 sm:text-2xl dark:text-emerald-50'
				}`}
			>
				{value}
			</p>
			{hint && <p className='mt-2 text-sm text-slate-500 dark:text-emerald-300'>{hint}</p>}
		</article>
	);
}

function Input({ label, onChange, ...props }) {
	return (
		<label className='flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-emerald-100'>
			{label}
			<input
				{...props}
				onChange={(event) => onChange(event.target.value)}
				className='min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-50 dark:placeholder:text-emerald-300/60 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
			/>
		</label>
	);
}

function CategoryMovementChart({ data, title, emptyMessage, barClassName }) {
	const hasItems = data.items.length > 0;
	const [openCategory, setOpenCategory] = useState(null);

	return (
		<section className='min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'>
			<div className='flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
				<div className='min-w-0'>
					<h2 className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
						{title}
					</h2>
					<p className='text-sm text-slate-500 dark:text-emerald-200'>
						Total agrupado del mes activo
					</p>
				</div>
				<p className='text-sm font-semibold text-slate-700 dark:text-emerald-100'>
					Total: {CLP.format(data.total)}
				</p>
			</div>

			{hasItems ? (
				<div className='mt-5 space-y-4'>
					{data.items.map(({ category, movements, total }) => {
						const width = data.max ? Math.max((total / data.max) * 100, 8) : 0;
						const percent = data.total ? (total / data.total) * 100 : 0;
						const isOpen = openCategory === category;
						return (
							<div key={category} className='rounded-lg border border-slate-100 p-3 dark:border-emerald-900'>
								<button
									type='button'
									onClick={() => setOpenCategory(isOpen ? null : category)}
									className='w-full text-left'
									aria-expanded={isOpen}
								>
									<div className='mb-2 grid gap-1 text-sm sm:flex sm:items-center sm:justify-between sm:gap-3'>
										<span className='flex min-w-0 items-center gap-2 font-semibold text-slate-800 dark:text-emerald-100'>
											<span
												className={`shrink-0 text-slate-400 transition dark:text-emerald-400 ${
													isOpen ? 'rotate-90' : ''
												}`}
											>
												&gt;
											</span>
											<span className='truncate'>{category}</span>
											<span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-emerald-900 dark:text-emerald-200'>
												{movements.length}
											</span>
										</span>
										<span className='pl-6 text-xs font-semibold text-slate-500 sm:shrink-0 sm:pl-0 sm:text-sm dark:text-emerald-200'>
											{CLP.format(total)} - {percent.toFixed(1)}%
										</span>
									</div>
									<div className='h-9 overflow-hidden rounded-lg bg-slate-100 dark:bg-emerald-900/80'>
										<div
											className={`flex h-full items-center rounded-lg px-3 text-xs font-semibold text-white transition ${barClassName}`}
											style={{ width: `${width}%` }}
										/>
									</div>
								</button>

								{isOpen && (
									<div className='mt-3 divide-y divide-slate-100 rounded-lg bg-slate-50 dark:divide-emerald-900 dark:bg-emerald-900/50'>
										{movements.map((movement) => (
											<div
												key={movement.id}
												className='grid gap-1 px-3 py-3 text-sm sm:grid-cols-[96px_1fr_auto] sm:items-center sm:gap-3'
											>
												<span className='text-slate-500 dark:text-emerald-300'>{movement.date}</span>
												<span className='min-w-0 font-medium text-slate-800 dark:text-emerald-100'>
													{movement.note || 'Sin nota'}
												</span>
												<span className='font-semibold text-slate-950 sm:text-right dark:text-emerald-50'>
													{CLP.format(movement.amount)}
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			) : (
				<div className='mt-5 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-emerald-800 dark:text-emerald-200'>
					{emptyMessage}
				</div>
			)}
		</section>
	);
}

function CategoryPicker({ value, isOpen, onToggle, onChange }) {
	return (
		<div className='relative flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-emerald-100'>
			Categoria
			<button
				type='button'
				onClick={onToggle}
				className='flex min-w-0 items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left font-normal text-slate-900 outline-none transition hover:border-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-50 dark:hover:border-emerald-500 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
				aria-expanded={isOpen}
			>
				<span className='min-w-0 truncate'>{value}</span>
				<span
					className={`shrink-0 text-slate-400 transition dark:text-emerald-300 ${
						isOpen ? 'rotate-180' : ''
					}`}
				>
					v
				</span>
			</button>
			{isOpen && (
				<div className='absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-emerald-800 dark:bg-emerald-950'>
					{categories.map((category) => (
						<button
							key={category}
							type='button'
							onClick={() => onChange(category)}
							className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
								value === category
									? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-50'
									: 'font-medium text-slate-700 hover:bg-slate-100 dark:text-emerald-100 dark:hover:bg-emerald-900'
							}`}
						>
							{category}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

function MovementCard({ movement, onDelete }) {
	const isExpense = movement.type === 'expense';

	return (
		<article className='grid gap-3 p-4'>
			<div className='flex min-w-0 items-start justify-between gap-3'>
				<div className='min-w-0'>
					<p className='text-xs font-medium text-slate-500 dark:text-emerald-300'>{movement.date}</p>
					<p className='mt-1 truncate text-sm font-semibold text-slate-900 dark:text-emerald-50'>
						{movement.category}
					</p>
				</div>
				<span
					className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
						isExpense
							? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-200'
							: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100'
					}`}
				>
					{isExpense ? 'Gasto' : 'Ingreso'}
				</span>
			</div>

			<div className='grid gap-2'>
				<p className='min-w-0 break-words text-sm text-slate-500 dark:text-emerald-200'>
					{movement.note || 'Sin nota'}
				</p>
				<div className='flex items-center justify-between gap-3'>
					<p className='break-words text-lg font-semibold leading-tight text-slate-950 dark:text-emerald-50'>
						{isExpense ? '-' : '+'}
						{CLP.format(movement.amount)}
					</p>
					<button
						type='button'
						onClick={() => onDelete(movement.id)}
						className='shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-50'
					>
						Eliminar
					</button>
				</div>
			</div>
		</article>
	);
}

export default App;
