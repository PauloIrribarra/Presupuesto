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

export default Input;
