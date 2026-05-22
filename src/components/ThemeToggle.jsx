function ThemeToggle({ isDarkMode, onToggle }) {
	return (
		<button
			type='button'
			role='switch'
			aria-checked={isDarkMode}
			aria-label='Cambiar tema'
			onClick={onToggle}
			className={`relative h-8 w-16 self-start rounded-full border p-1 transition ${
				isDarkMode
					? 'border-emerald-500 bg-emerald-950'
					: 'border-emerald-200 bg-white'
			}`}
		>
			<span className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-amber-400'>
				<SunIcon />
			</span>
			<span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-emerald-200'>
				<MoonIcon />
			</span>
			<span
				className={`absolute top-1 h-6 w-6 rounded-full bg-emerald-600 shadow-sm transition ${
					isDarkMode ? 'left-9' : 'left-1'
				}`}
			/>
		</button>
	);
}

function SunIcon() {
	return (
		<svg
			aria-hidden='true'
			className='h-4 w-4'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			strokeWidth='2'
		>
			<circle cx='12' cy='12' r='4' />
			<path d='M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' />
		</svg>
	);
}

function MoonIcon() {
	return (
		<svg
			aria-hidden='true'
			className='h-4 w-4'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			strokeWidth='2'
		>
			<path d='M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a7 7 0 1 0 11 11Z' />
		</svg>
	);
}

export default ThemeToggle;
