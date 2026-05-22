import { CLP } from '../constants';

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

export default MovementCard;
