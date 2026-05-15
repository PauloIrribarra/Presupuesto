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

export default Metric;
