'use client';

import { useMediaQuery } from '@/app/_lib/hooks/use-media-query';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import * as React from 'react';

interface ResponsiveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const ResponsiveDialog = ({
    isOpen,
    onClose,
    title,
    description,
    children,
}: ResponsiveDialogProps) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                {children}
            </DrawerContent>
        </Drawer>
    );
};
