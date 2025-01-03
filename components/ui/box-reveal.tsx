'use client';

import { motion, useAnimation, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

interface BoxRevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    boxColor?: string;
    duration?: number;
    onAnimationComplete?: () => void;
}

export const BoxReveal = ({
    children,
    width = 'fit-content',
    boxColor,
    duration,
    onAnimationComplete,
}: BoxRevealProps) => {
    const mainControls = useAnimation();
    const slideControls = useAnimation();

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const animate = async () => {
                await Promise.all([
                    slideControls.start('visible'),
                    mainControls.start('visible'),
                ]);
                onAnimationComplete?.();
            };
            animate();
        } else {
            slideControls.start('hidden');
            mainControls.start('hidden');
        }
    }, [isInView, mainControls, slideControls, onAnimationComplete]);

    return (
        <div
            ref={ref}
            style={{ position: 'relative', width, overflow: 'hidden' }}
        >
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial='hidden'
                animate={mainControls}
                transition={{
                    duration: duration ? duration : 0.5,
                    delay: 0.25,
                }}
            >
                {children}
            </motion.div>

            <motion.div
                variants={{
                    hidden: { left: 0 },
                    visible: { left: '100%' },
                }}
                initial='hidden'
                animate={slideControls}
                transition={{
                    duration: duration ? duration : 0.5,
                    ease: 'easeIn',
                }}
                style={{
                    position: 'absolute',
                    top: 4,
                    bottom: 4,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: boxColor ? boxColor : '#5046e6',
                }}
            />
        </div>
    );
};

export default BoxReveal;