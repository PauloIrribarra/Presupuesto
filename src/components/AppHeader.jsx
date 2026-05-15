import { SHOW_RESET_BUTTON } from '../constants';
import ThemeToggle from './ThemeToggle';

function AppHeader({ month, isDarkMode, onMonthChange, onResetData, onToggleTheme }) {
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
					Mes activo
					<input
						type='month'
						value={month}
						onChange={(event) => onMonthChange(event.target.value)}
						className='min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-50 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
					/>
				</label>

				<ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />

				{SHOW_RESET_BUTTON && (
					<button
						type='button'
						onClick={onResetData}
						className='rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:border-rose-700 dark:hover:bg-rose-900/50'
					>
						Reiniciar datos de prueba
					</button>
				)}
			</div>
		</header>
	);
}

export default AppHeader;
