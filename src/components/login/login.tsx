'use client';
import { loginForm } from '@/app/api/login';
import React, { useState } from 'react'
import { z } from 'zod'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const schema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Must contain at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function ExempleForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true);
        const result = schema.safeParse(formData)

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            setErrors({
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
            })
            setIsLoading(false);
        } else {
            setErrors({})
            try {
                const res = await loginForm(formData);
                if (res) {
                    console.log('Login successful');
                    router.push('/profile');
                } else {
                    setErrors({ email: "Email ou mot de passe incorrect" });
                }
            } catch (error) {
                console.error('Login error:', error);
                setErrors({ email: "Une erreur s'est produite" });
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-3xl font-bold">Login</h1>
                <div className="flex flex-col gap-9 w-full"></div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                    <div className='flex flex-col gap-2'>
                        <input
                            type="text"
                            name='email'
                            placeholder="Email or Username"
                            className="border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2 rounded"
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <input
                            type="password"
                            name='password'
                            placeholder="Password"
                            className="border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2 rounded"
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>
                    
                    <Button
                        type="submit"
                        variant="default"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </main>
        </div>
    );
}