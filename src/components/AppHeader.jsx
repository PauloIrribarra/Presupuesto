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
	onSignOut,
	onToggleTheme,
	userEmail,
}) {
	return (
		<header className='flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-5 sm:pb-6 lg:flex-row lg:items-end lg:justify-between dark:border-emerald-800/70'>
			<div className='flex min-w-0 items-center gap-3 sm:gap-4'>
				<img
					src='/logoGestión.png'
					alt='Logo Gestion de Presupuesto'
					className='h-12 w-12 shrink-0 rounded-full border border-white object-contain shadow-[0_10px_26px_rgba(15,23,42,0.18)] sm:h-16 sm:w-16 lg:h-20 lg:w-20'
				/>
				<div className='min-w-0'>
					<p className='text-xs font-semibold uppercase tracking-wide text-emerald-700 sm:text-sm dark:text-emerald-300'>
						Presupuesto personal
					</p>
					<h1 className='mt-1 text-2xl font-semibold leading-tight text-slate-950 sm:mt-2 sm:text-3xl lg:text-5xl dark:text-emerald-50'>
						Control mensual de tu dinero
					</h1>
				</div>
			</div>

			<div className='grid w-full min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:max-w-xs lg:grid-cols-1'>
				<label className='flex w-32 min-w-0 flex-col gap-2 text-sm font-medium text-slate-700 sm:w-auto dark:text-emerald-100'>
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
				<p className='rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm sm:self-end lg:self-auto dark:bg-emerald-950/60 dark:text-emerald-200 dark:shadow-none'>
					Ciclo actual: {cycleLabel}
				</p>

				<div className='flex items-center gap-3 sm:col-span-2 lg:col-span-1'>
					<ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
					<InfoButton />
					{onSignOut && (
						<button
							type='button'
							onClick={onSignOut}
							title={userEmail ? `Cerrar sesion de ${userEmail}` : 'Cerrar sesion'}
							className='rounded-lg border border-emerald-600/40 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/40 dark:text-emerald-100 dark:hover:bg-emerald-900/50'
						>
							Salir
						</button>
					)}
					{SHOW_RESET_BUTTON && (
						<div>
							<ResetDataButton onReset={onResetData} />
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

export default AppHeader;
