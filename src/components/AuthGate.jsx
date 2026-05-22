import { useState } from 'react';
import { supabase } from '../supabaseClient';

function AuthGate({ isDarkMode, configMissing = false }) {
	const [mode, setMode] = useState('sign-in');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isSignUp = mode === 'sign-up';

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (configMissing || !supabase) return;

		setIsSubmitting(true);
		setMessage('');

		const credentials = { email, password };
		const { error } = isSignUp
			? await supabase.auth.signUp(credentials)
			: await supabase.auth.signInWithPassword(credentials);

		if (error) {
			setMessage(error.message);
			setIsSubmitting(false);
			return;
		}

		setMessage(
			isSignUp
				? 'Cuenta creada. Revisa tu correo si Supabase pide confirmacion.'
				: 'Sesion iniciada.',
		);
		setIsSubmitting(false);
	};

	return (
		<main
			className={`flex min-h-screen items-center justify-center px-4 py-8 text-slate-900 transition-colors ${
				isDarkMode ? 'dark bg-emerald-950' : 'bg-[#f6f7f2]'
			}`}
		>
			<section className='w-full max-w-md rounded-lg border border-emerald-500/30 bg-white p-6 shadow-[0_0_24px_rgba(16,185,129,0.16)] dark:bg-emerald-950/70'>
				<h1 className='text-center text-2xl font-semibold text-slate-950 dark:text-emerald-50'>
					{configMissing ? 'Configura Supabase' : isSignUp ? 'Crear cuenta' : 'Iniciar sesion'}
				</h1>

				{configMissing ? (
					<p className='mt-4 text-sm leading-6 text-slate-600 dark:text-emerald-200'>
						Activa las variables VITE_SUPABASE_URL y
						VITE_SUPABASE_PUBLISHABLE_KEY para usar el login.
					</p>
				) : (
					<form
						className='mx-auto mt-5 flex w-full max-w-xs flex-col gap-4'
						onSubmit={handleSubmit}
					>
						<label className='flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-emerald-100'>
							Correo
							<input
								type='email'
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								autoComplete='email'
								required
								className='min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-white dark:text-slate-950 dark:placeholder:text-slate-400 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
							/>
						</label>

						<label className='flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-emerald-100'>
							Contrasena
							<span className='relative'>
								<input
									type={isPasswordVisible ? 'text' : 'password'}
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									autoComplete={isSignUp ? 'new-password' : 'current-password'}
									minLength='6'
									required
									className='w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 pr-11 text-slate-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-700 dark:bg-white dark:text-slate-950 dark:placeholder:text-slate-400 dark:focus:border-emerald-300 dark:focus:ring-emerald-800'
								/>
								<button
									type='button'
									onClick={() => setIsPasswordVisible((visible) => !visible)}
									aria-label={
										isPasswordVisible ? 'Ocultar contrasena' : 'Mostrar contrasena'
									}
									title={isPasswordVisible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
									className='absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100'
								>
									{isPasswordVisible ? (
										<svg
											viewBox='0 0 24 24'
											aria-hidden='true'
											className='h-4 w-4'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
										>
											<path d='M3 3l18 18' />
											<path d='M10.6 10.6a2 2 0 0 0 2.8 2.8' />
											<path d='M9.5 5.3A10.8 10.8 0 0 1 12 5c5 0 9 4.5 10 7a12.8 12.8 0 0 1-3.2 4.4' />
											<path d='M6.4 6.4A12.6 12.6 0 0 0 2 12c1 2.5 5 7 10 7a10.8 10.8 0 0 0 5.6-1.6' />
										</svg>
									) : (
										<svg
											viewBox='0 0 24 24'
											aria-hidden='true'
											className='h-4 w-4'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
										>
											<path d='M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z' />
											<circle cx='12' cy='12' r='3' />
										</svg>
									)}
								</button>
							</span>
						</label>

						<button
							type='submit'
							disabled={isSubmitting}
							className='mx-auto w-full max-w-44 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400'
						>
							{isSubmitting ? 'Procesando...' : isSignUp ? 'Crear cuenta' : 'Entrar'}
						</button>
					</form>
				)}

				{message && (
					<p className='mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100'>
						{message}
					</p>
				)}

				{!configMissing && (
					<button
						type='button'
						onClick={() => {
							setMode(isSignUp ? 'sign-in' : 'sign-up');
							setMessage('');
						}}
						className='mt-5 text-sm font-semibold text-emerald-700 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-50'
					>
						{isSignUp ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}
					</button>
				)}
			</section>
		</main>
	);
}

export default AuthGate;
