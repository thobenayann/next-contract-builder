'use client';

import { useMediaQuery } from '@/app/_lib/hooks/use-media-query';

export const useIsMobile = () => {
    return useMediaQuery('(max-width: 767px)');
};
