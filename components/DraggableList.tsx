import {
    closestCenter,
    DndContext,
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
import type { Clause } from '@prisma/client';
import { SortableItem } from './SortableItem';

interface DraggableListProps {
    items: Clause[];
    setItems: (items: Clause[]) => void;
    onEdit: (item: Clause) => void;
    onDelete: (item: Clause) => void;
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
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex).map(
                (item, index) => ({
                    ...item,
                    order: index,
                })
            );

            setItems(newItems);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className='space-y-2'>
                    {items.map((item) => (
                        <SortableItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            onEdit={() => onEdit(item)}
                            onDelete={() => onDelete(item)}
                            isFormContext={isFormContext}
                            preventRefresh={preventRefresh}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
