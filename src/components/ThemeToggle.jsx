function ThemeToggle({ isDarkMode, onToggle }) {
	return (
		<button
			type='button'
			onClick={onToggle}
			className='rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-100 dark:hover:border-emerald-500 dark:hover:bg-emerald-800'
		>
			{isDarkMode ? 'Modo claro' : 'Modo oscuro'}
		</button>
	);
}

export default ThemeToggle;
