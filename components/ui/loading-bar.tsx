'use client';

import { motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const LoadingBar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true);
        };

        const handleStop = () => {
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 300); // Petit délai pour une meilleure UX
            return () => clearTimeout(timeout);
        };

        // Déclencher le chargement quand le pathname ou les searchParams changent
        handleStart();
        handleStop();

        // Cleanup
        return () => {
            setIsLoading(false);
        };
    }, [pathname, searchParams]);

    if (!isLoading) return null;

    return (
        <motion.div
            className='fixed top-0 left-0 right-0 z-50'
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <motion.div
                className='h-1 bg-purple-500'
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
        </motion.div>
    );
};
