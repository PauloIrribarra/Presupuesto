import { categories } from '../constants';

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

export default CategoryPicker;
