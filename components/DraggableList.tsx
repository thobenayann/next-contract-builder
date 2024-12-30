import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { DraggableClause } from '@/app/_lib/types';

import { SortableItem } from './SortableItem';
import { Button } from './ui/button';

interface DraggableListProps {
    items: DraggableClause[];
    setItems: (items: DraggableClause[]) => void;
    onEdit: (item: DraggableClause) => void;
    onDelete: (item: DraggableClause) => void;
    isFormContext?: boolean;
    preventRefresh?: boolean;
}

export const DraggableList = ({
    items,
    setItems,
    onEdit,
    onDelete,
    isFormContext = false,
    preventRefresh = false,
}: DraggableListProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const router = useRouter();

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            setItems(arrayMove(items, oldIndex, newIndex));
        }
    }

    const handleDelete = (e: React.MouseEvent, item: DraggableClause) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(item);
        if (!preventRefresh && !isFormContext) {
            router.refresh();
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <ul className='space-y-2'>
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <SortableItem id={item.id}>
                                    <div className='flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm'>
                                        <h3 className='text-lg font-medium text-gray-900'>
                                            {item.title}
                                        </h3>
                                        <div className='flex space-x-2'>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => onEdit(item)}
                                                className='text-gray-600 hover:text-blue-600'
                                            >
                                                <Pencil className='h-4 w-4' />
                                                <span className='sr-only'>
                                                    Éditer
                                                </span>
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={(e) =>
                                                    handleDelete(e, item)
                                                }
                                                className='text-gray-600 hover:text-red-600'
                                            >
                                                <Trash2 className='h-4 w-4' />
                                                <span className='sr-only'>
                                                    Supprimer
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </SortableItem>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </ul>
            </SortableContext>
        </DndContext>
    );
};
