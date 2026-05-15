import { useState } from 'react';

const steps = [
	'Define tu dia de pago.',
	'Ingresa tu sueldo como Ingreso.',
	'Registra cada gasto durante el ciclo.',
	'Revisa el saldo y el disponible diario.',
	'Si sobra saldo, pasalo a ahorro.',
];

function InfoButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				type='button'
				aria-label='Ver instructivo'
				title='Como usar la app'
				onClick={() => setIsOpen(true)}
				className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-lg font-black leading-none text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.22)] transition hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-[0_0_16px_rgba(52,211,153,0.45)] dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/70'
			>
				!
			</button>

			{isOpen && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/55 px-4 backdrop-blur-sm'
					onClick={() => setIsOpen(false)}
				>
					<section
						role='dialog'
						aria-modal='true'
						aria-labelledby='info-title'
						className='w-full max-w-sm rounded-lg border border-emerald-400/70 bg-white p-5 text-slate-900 shadow-[0_0_28px_rgba(52,211,153,0.35)] dark:bg-emerald-950 dark:text-emerald-50'
						onClick={(event) => event.stopPropagation()}
					>
						<div className='flex items-start justify-between gap-4'>
							<div>
								<p className='text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300'>
									Instructivo
								</p>
								<h2 id='info-title' className='mt-1 text-lg font-semibold'>
									Como usar la app
								</h2>
							</div>
							<button
								type='button'
								aria-label='Cerrar instructivo'
								onClick={() => setIsOpen(false)}
								className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-900 dark:hover:text-emerald-50'
							>
								x
							</button>
						</div>

						<ol className='mt-4 space-y-3 text-sm text-slate-600 dark:text-emerald-100'>
							{steps.map((step, index) => (
								<li key={step} className='flex gap-3'>
									<span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-50'>
										{index + 1}
									</span>
									<span className='pt-0.5'>{step}</span>
								</li>
							))}
						</ol>
					</section>
				</div>
			)}
		</>
	);
}

export default InfoButton;
