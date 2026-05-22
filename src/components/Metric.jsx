function Metric({ title, value, hint, strong = false }) {
	return (
		<article className='flex min-h-28 min-w-0 flex-col justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:min-h-0 sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'>
			<div className='min-w-0'>
				<p className='text-xs font-medium text-slate-500 sm:text-sm dark:text-emerald-200'>{title}</p>
				<p
					className={`mt-2 break-words font-semibold leading-tight ${
						strong
							? 'text-xl text-emerald-800 sm:text-3xl dark:text-emerald-200'
							: 'text-lg text-slate-950 sm:text-2xl dark:text-emerald-50'
					}`}
				>
					{value}
				</p>
			</div>
			<p className='mt-2 min-h-4 text-xs text-slate-500 sm:min-h-0 sm:text-sm dark:text-emerald-300'>
				{hint || ''}
			</p>
		</article>
	);
}

export default Metric;
