import { useLayoutEffect, useMemo, useRef } from 'react';
import { CLP } from '../constants';

const formatAmount = (value) => {
	if (!value) return '';

	return `${CLP.format(Number(value))} CLP`;
};

const getDigitCount = (value) => value.replace(/\D/g, '').length;

const getCursorPosition = (value, digitCount) => {
	if (digitCount <= 0) {
		const firstDigitIndex = value.search(/\d/);
		return firstDigitIndex === -1 ? 0 : firstDigitIndex;
	}

	let digitsSeen = 0;

	for (let index = 0; index < value.length; index += 1) {
		if (/\d/.test(value[index])) {
			digitsSeen += 1;
		}

		if (digitsSeen === digitCount) {
			return index + 1;
		}
	}

	return value.length;
};

function AmountInput({ label, value, onChange, placeholder }) {
	const inputRef = useRef(null);
	const cursorDigitCount = useRef(null);
	const formattedValue = useMemo(() => formatAmount(value), [value]);

	useLayoutEffect(() => {
		if (cursorDigitCount.current === null || document.activeElement !== inputRef.current) {
			return;
		}

		const position = getCursorPosition(formattedValue, cursorDigitCount.current);
		inputRef.current.setSelectionRange(position, position);
		cursorDigitCount.current = null;
	}, [formattedValue]);

	const handleChange = (event) => {
		const cursorPosition = event.target.selectionStart ?? event.target.value.length;
		const amount = event.target.value.replace(/\D/g, '');

		cursorDigitCount.current = getDigitCount(
			event.target.value.slice(0, cursorPosition),
		);
		onChange(amount);
	};

	return (
		<label className='flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-emerald-100'>
			{label}
			<input
				ref={inputRef}
				type='text'
				inputMode='numeric'
				value={formattedValue}
				onChange={handleChange}
				placeholder={placeholder}
				className='min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-50 dark:placeholder:text-emerald-300/60 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
			/>
		</label>
	);
}

export default AmountInput;
