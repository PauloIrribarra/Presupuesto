import { CLP } from '../constants';
import MovementCard from './MovementCard';

function MovementHistory({ movements, onDelete }) {
	return (
		<section className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'>
			<div className='border-b border-slate-200 p-4 sm:p-5 dark:border-emerald-800'>
				<h2 className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
					Historial
				</h2>
			</div>

			<div className='divide-y divide-slate-100 sm:hidden dark:divide-emerald-900'>
				{movements.map((movement) => (
					<MovementCard
						key={movement.id}
						movement={movement}
						onDelete={onDelete}
					/>
				))}
				{!movements.length && (
					<p className='px-4 py-8 text-center text-sm text-slate-500 dark:text-emerald-200'>
						Aun no hay movimientos registrados.
					</p>
				)}
			</div>

			<div className='hidden overflow-x-auto sm:block'>
				<table className='w-full min-w-[680px] text-left text-sm'>
					<thead className='bg-slate-50 text-slate-500 dark:bg-emerald-900/80 dark:text-emerald-200'>
						<tr>
							<th className='px-5 py-3 font-medium'>Fecha</th>
							<th className='px-5 py-3 font-medium'>Tipo</th>
							<th className='px-5 py-3 font-medium'>Categoria</th>
							<th className='px-5 py-3 font-medium'>Nota</th>
							<th className='px-5 py-3 text-right font-medium'>Monto</th>
							<th className='px-5 py-3'></th>
						</tr>
					</thead>
					<tbody className='divide-y divide-slate-100 dark:divide-emerald-900'>
						{movements.map((movement) => (
							<MovementRow
								key={movement.id}
								movement={movement}
								onDelete={onDelete}
							/>
						))}
						{!movements.length && (
							<tr>
								<td
									className='px-5 py-8 text-center text-slate-500 dark:text-emerald-200'
									colSpan='6'
								>
									Aun no hay movimientos registrados.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}

function MovementRow({ movement, onDelete }) {
	const isExpense = movement.type === 'expense';

	return (
		<tr>
			<td className='px-5 py-4 text-slate-600 dark:text-emerald-200'>
				{movement.date}
			</td>
			<td className='px-5 py-4'>
				<span
					className={`rounded-full px-2 py-1 text-xs font-semibold ${
						isExpense
							? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-200'
							: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100'
					}`}
				>
					{isExpense ? 'Gasto' : 'Ingreso'}
				</span>
			</td>
			<td className='px-5 py-4 text-slate-700 dark:text-emerald-100'>
				{movement.category}
			</td>
			<td className='px-5 py-4 text-slate-500 dark:text-emerald-200'>
				{movement.note || '-'}
			</td>
			<td className='px-5 py-4 text-right font-semibold text-slate-950 dark:text-emerald-50'>
				{isExpense ? '-' : '+'}
				{CLP.format(movement.amount)}
			</td>
			<td className='px-5 py-4 text-right'>
				<button
					type='button'
					onClick={() => onDelete(movement.id)}
					className='rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-50'
				>
					Eliminar
				</button>
			</td>
		</tr>
	);
}

export default MovementHistory;
