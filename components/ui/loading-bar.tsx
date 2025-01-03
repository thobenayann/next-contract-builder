'use client';

import { useLoadingBar } from '@/app/_lib/hooks/use-loading-bar';
import { motion } from 'framer-motion';

export const LoadingBar = () => {
    const { isLoading } = useLoadingBar();

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
