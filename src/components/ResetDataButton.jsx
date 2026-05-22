import { useState } from 'react';

function ResetDataButton({ onReset }) {
	const [isAnimating, setIsAnimating] = useState(false);

	const handleClick = () => {
		setIsAnimating(true);
		onReset();
	};

	return (
		<button
			type='button'
			aria-label='Reiniciar datos de prueba'
			title='Reiniciar datos de prueba'
			onClick={handleClick}
			onAnimationEnd={() => setIsAnimating(false)}
			className={`group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-300 bg-rose-50 text-rose-600 transition hover:border-rose-400 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:border-rose-700 dark:hover:bg-rose-900/50 ${
				isAnimating ? 'animate-trash-bump' : ''
			}`}
		>
			<TrashIcon isAnimating={isAnimating} />
		</button>
	);
}

function TrashIcon({ isAnimating }) {
	return (
		<svg
			aria-hidden='true'
			className='h-4 w-4'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='2'
		>
			<path
				className={`origin-[12px_6px] transition-transform group-hover:-translate-y-0.5 ${
					isAnimating ? 'animate-trash-lid' : ''
				}`}
				d='M9 6h6m-4-3h2m-9 3h16'
			/>
			<path d='M7 9l1 11h8l1-11' />
			<path d='M10 12v5m4-5v5' />
		</svg>
	);
}

export default ResetDataButton;
