import { useState } from 'react';
import { CLP } from '../constants';

function CategoryMovementChart({ data, title, emptyMessage, barClassName }) {
	const hasItems = data.items.length > 0;
	const [openCategory, setOpenCategory] = useState(null);
	const topItem = data.items[0];

	return (
		<section className='min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/70 dark:shadow-none'>
			<div className='flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between'>
				<div className='min-w-0'>
					<h2 className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
						{title}
					</h2>
					<p className='text-sm text-slate-500 dark:text-emerald-200'>
						Ranking del ciclo activo
					</p>
				</div>
				<div className='rounded-lg bg-slate-50 px-3 py-2 text-left sm:text-right dark:bg-emerald-900/50'>
					<p className='text-xs font-semibold text-slate-500 dark:text-emerald-300'>
						Total
					</p>
					<p className='text-lg font-semibold text-slate-950 dark:text-emerald-50'>
						{CLP.format(data.total)}
					</p>
				</div>
			</div>

			{hasItems ? (
				<div className='mt-5 space-y-4'>
					<TopCategorySummary item={topItem} total={data.total} barClassName={barClassName} />
					{data.items.map(({ category, movements, total }) => (
						<CategoryRankingItem
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

function TopCategorySummary({ item, total, barClassName }) {
	const percent = total ? (item.total / total) * 100 : 0;

	return (
		<div className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/40'>
			<div className='flex items-start justify-between gap-3'>
				<div className='min-w-0'>
					<p className='text-xs font-semibold text-slate-500 dark:text-emerald-300'>
						Mayor categoria
					</p>
					<p className='mt-1 truncate text-xl font-semibold text-slate-950 dark:text-emerald-50'>
						{item.category}
					</p>
				</div>
				<div className='shrink-0 text-right'>
					<p className='text-2xl font-semibold text-slate-950 dark:text-emerald-50'>
						{percent.toFixed(0)}%
					</p>
					<p className='text-xs font-semibold text-slate-500 dark:text-emerald-300'>
						{CLP.format(item.total)}
					</p>
				</div>
			</div>
			<div className='mt-4 h-3 overflow-hidden rounded-full bg-white dark:bg-emerald-950/70'>
				<div
					className={`h-full rounded-full ${barClassName}`}
					style={{ width: `${Math.max(percent, 4)}%` }}
				/>
			</div>
		</div>
	);
}

function CategoryRankingItem({
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
		<div className='rounded-lg border border-slate-100 bg-white p-3 dark:border-emerald-900 dark:bg-emerald-950/40'>
			<button
				type='button'
				onClick={onToggle}
				className='w-full text-left'
				aria-expanded={isOpen}
			>
				<div className='grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center'>
					<span className='flex min-w-0 items-center gap-2 text-left font-semibold text-slate-800 dark:text-emerald-100'>
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
					<span className='flex items-baseline gap-2 pl-6 sm:justify-end sm:pl-0'>
						<span className='text-xl font-semibold text-slate-950 dark:text-emerald-50'>
							{percent.toFixed(0)}%
						</span>
						<span className='text-sm font-semibold text-slate-500 dark:text-emerald-200'>
							{CLP.format(total)}
						</span>
					</span>
					<div className='h-3 overflow-hidden rounded-full bg-slate-100 sm:col-span-2 dark:bg-emerald-900/80'>
						<div
							className={`h-full rounded-full transition ${barClassName}`}
							style={{ width: `${width}%` }}
						/>
					</div>
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
