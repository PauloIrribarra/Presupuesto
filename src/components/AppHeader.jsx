import { SHOW_RESET_BUTTON } from '../constants';
import InfoButton from './InfoButton';
import ResetDataButton from './ResetDataButton';
import ThemeToggle from './ThemeToggle';

function AppHeader({
	payday,
	cycleLabel,
	isDarkMode,
	onPaydayChange,
	onResetData,
	onToggleTheme,
}) {
	return (
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
					Dia de pago
					<input
						type='number'
						min='1'
						max='31'
						value={payday}
						onChange={(event) => onPaydayChange(event.target.value)}
						className='min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-50 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
					/>
				</label>
				<p className='rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-200 dark:shadow-none'>
					Ciclo actual: {cycleLabel}
				</p>

				<div className='flex items-center gap-3'>
					<ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
					<InfoButton />
					{SHOW_RESET_BUTTON && (
						<div className='ml-auto'>
							<ResetDataButton onReset={onResetData} />
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

export default AppHeader;
