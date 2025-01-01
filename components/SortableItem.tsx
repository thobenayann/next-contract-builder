import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Clause } from '@prisma/client';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface SortableItemProps {
    id: string;
    item: Clause;
    onEdit: () => void;
    onDelete: () => void;
    isFormContext?: boolean;
    preventRefresh?: boolean;
}

export const SortableItem = ({
    id,
    item,
    onEdit,
    onDelete,
    isFormContext = false,
    preventRefresh = false,
}: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 rounded-lg border bg-card p-4 ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <div {...attributes} {...listeners}>
                <GripVertical className='h-5 w-5 cursor-grab' />
            </div>
            <div className='flex-1'>
                <h4 className='font-medium'>{item.title}</h4>
            </div>
            <div className='flex items-center gap-2'>
                {!isFormContext && (
                    <Button variant='ghost' size='icon' onClick={onEdit}>
                        <Pencil className='h-4 w-4' />
                    </Button>
                )}
                <Button variant='ghost' size='icon' onClick={onDelete}>
                    <Trash2 className='h-4 w-4 text-red-500' />
                </Button>
            </div>
        </div>
    );
};
