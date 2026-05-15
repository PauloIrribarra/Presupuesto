import { useState } from 'react';
import { CLP } from '../constants';

function CategoryMovementChart({ data, title, emptyMessage, barClassName }) {
	const hasItems = data.items.length > 0;
	const [openCategory, setOpenCategory] = useState(null);

	return (
		<section className='min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'>
			<div className='flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
				<div className='min-w-0'>
					<h2 className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
						{title}
					</h2>
					<p className='text-sm text-slate-500 dark:text-emerald-200'>
						Total agrupado del mes activo
					</p>
				</div>
				<p className='text-sm font-semibold text-slate-700 dark:text-emerald-100'>
					Total: {CLP.format(data.total)}
				</p>
			</div>

			{hasItems ? (
				<div className='mt-5 space-y-4'>
					{data.items.map(({ category, movements, total }) => (
						<CategoryBar
							key={category}
							category={category}
							movements={movements}
							total={total}
							max={data.max}
							overallTotal={data.total}
							barClassName={barClassName}
							isOpen={openCategory === category}
							onToggle={() =>
								setOpenCategory(openCategory === category ? null : category)
							}
						/>
					))}
				</div>
			) : (
				<div className='mt-5 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-emerald-800 dark:text-emerald-200'>
					{emptyMessage}
				</div>
			)}
		</section>
	);
}

function CategoryBar({
	category,
	movements,
	total,
	max,
	overallTotal,
	barClassName,
	isOpen,
	onToggle,
}) {
	const width = max ? Math.max((total / max) * 100, 8) : 0;
	const percent = overallTotal ? (total / overallTotal) * 100 : 0;

	return (
		<div className='rounded-lg border border-slate-100 p-3 dark:border-emerald-900'>
			<button
				type='button'
				onClick={onToggle}
				className='w-full text-left'
				aria-expanded={isOpen}
			>
				<div className='mb-2 grid gap-1 text-sm sm:flex sm:items-center sm:justify-between sm:gap-3'>
					<span className='flex min-w-0 items-center gap-2 font-semibold text-slate-800 dark:text-emerald-100'>
						<span
							className={`shrink-0 text-slate-400 transition dark:text-emerald-400 ${
								isOpen ? 'rotate-90' : ''
							}`}
						>
							&gt;
						</span>
						<span className='truncate'>{category}</span>
						<span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-emerald-900 dark:text-emerald-200'>
							{movements.length}
						</span>
					</span>
					<span className='pl-6 text-xs font-semibold text-slate-500 sm:shrink-0 sm:pl-0 sm:text-sm dark:text-emerald-200'>
						{CLP.format(total)} - {percent.toFixed(1)}%
					</span>
				</div>
				<div className='h-9 overflow-hidden rounded-lg bg-slate-100 dark:bg-emerald-900/80'>
					<div
						className={`flex h-full items-center rounded-lg px-3 text-xs font-semibold text-white transition ${barClassName}`}
						style={{ width: `${width}%` }}
					/>
				</div>
			</button>

			{isOpen && (
				<div className='mt-3 divide-y divide-slate-100 rounded-lg bg-slate-50 dark:divide-emerald-900 dark:bg-emerald-900/50'>
					{movements.map((movement) => (
						<div
							key={movement.id}
							className='grid gap-1 px-3 py-3 text-sm sm:grid-cols-[96px_1fr_auto] sm:items-center sm:gap-3'
						>
							<span className='text-slate-500 dark:text-emerald-300'>{movement.date}</span>
							<span className='min-w-0 font-medium text-slate-800 dark:text-emerald-100'>
								{movement.note || 'Sin nota'}
							</span>
							<span className='font-semibold text-slate-950 sm:text-right dark:text-emerald-50'>
								{CLP.format(movement.amount)}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default CategoryMovementChart;
