import AmountInput from './AmountInput';
import CategoryPicker from './CategoryPicker';
import Input from './Input';

function MovementForm({
	draft,
	isCategoryOpen,
	onCategoryToggle,
	onCategoryChange,
	onDraftChange,
	onSubmit,
}) {
	return (
		<form
			onSubmit={onSubmit}
			className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'
		>
			<h2 className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
				Nuevo movimiento
			</h2>
			<div className='mt-4 grid gap-4'>
				<div className='grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-emerald-900/80'>
					{['expense', 'income'].map((type) => (
						<button
							key={type}
							type='button'
							onClick={() => onDraftChange({ type })}
							className={`rounded-md px-3 py-2 text-sm font-semibold ${
								draft.type === type
									? 'bg-white text-slate-950 shadow-sm dark:bg-emerald-700 dark:text-white dark:shadow-none'
									: 'text-slate-600 dark:text-emerald-200'
							}`}
						>
							{type === 'expense' ? 'Gasto' : 'Ingreso'}
						</button>
					))}
				</div>

				<AmountInput
					label='Monto'
					value={draft.amount}
					onChange={(amount) => onDraftChange({ amount })}
					placeholder='$12.000 CLP'
				/>

				<CategoryPicker
					value={draft.category}
					isOpen={isCategoryOpen}
					onToggle={onCategoryToggle}
					onChange={onCategoryChange}
				/>

				<Input
					label='Fecha'
					type='date'
					value={draft.date}
					onChange={(date) => onDraftChange({ date })}
				/>

				<Input
					label='Nota'
					value={draft.note}
					onChange={(note) => onDraftChange({ note })}
					placeholder='Supermercado, sueldo, cuenta de luz...'
				/>

				<button className='rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500'>
					Agregar movimiento
				</button>
			</div>
		</form>
	);
}

export default MovementForm;
