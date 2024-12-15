import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface Item {
    id: string;
    title: string;
    content: string;
    order: number;
}

interface DraggableListProps {
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    onEdit: (item: Item) => void;
    onDelete: (item: Item) => void;
}

export function DraggableList({
    items,
    setItems,
    onEdit,
    onDelete,
}: DraggableListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Distance minimale pour activer le drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id
                );
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const handleEditClick = (e: React.MouseEvent, item: Item) => {
        e.stopPropagation();
        onEdit(item);
    };

    const handleDeleteClick = (e: React.MouseEvent, item: Item) => {
        e.stopPropagation();
        onDelete(item);
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
                <ul className="space-y-2">
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            <div className="flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {item.title}
                                </h3>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) =>
                                            handleEditClick(e, item)
                                        }
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Éditer</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) =>
                                            handleDeleteClick(e, item)
                                        }
                                        className="text-gray-600 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">
                                            Supprimer
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </SortableItem>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
}
