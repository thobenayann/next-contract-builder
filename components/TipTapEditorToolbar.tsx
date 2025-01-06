'use client';

import { cn } from '@/app/_lib/utils';
import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { BsCircleFill } from 'react-icons/bs';
import {
    FaAlignCenter,
    FaAlignLeft,
    FaAlignRight,
    FaBold,
    FaHighlighter,
    FaImage,
    FaItalic,
    FaUnderline,
} from 'react-icons/fa';
import { LuHeading1, LuHeading2, LuHeading3 } from 'react-icons/lu';
import { RxLetterCaseCapitalize } from 'react-icons/rx';
import { VariableSelector } from './VariableSelector';

interface TipTapEditorToolbarProps {
    editor: Editor | null;
}

const FONT_FAMILIES = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Century Gothic', label: 'Century Gothic' },
    { value: 'Calibri', label: 'Calibri' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
] as const;

export const TipTapEditorToolbar = ({ editor }: TipTapEditorToolbarProps) => {
    const addImage = useCallback(() => {
        if (!editor) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    editor
                        .chain()
                        .focus()
                        .setImage({
                            src: e.target?.result as string,
                            alt: file.name,
                        })
                        .run();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }, [editor]);

    if (!editor) return null;

    const HeadingIcons = {
        1: LuHeading1,
        2: LuHeading2,
        3: LuHeading3,
    };

    return (
        <div className='flex items-center space-x-1 p-2 border-b dark:border-gray-800'>
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive('paragraph') ? 'bg-muted' : ''
                }`}
            >
                <RxLetterCaseCapitalize className='text-xl' />
            </button>
            {[1, 2, 3].map((level) => {
                const HeadingIcon =
                    HeadingIcons[level as keyof typeof HeadingIcons];
                return (
                    <button
                        key={level}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .setHeading({ level: level as 1 | 2 | 3 })
                                .run()
                        }
                        className={`p-2 rounded hover:bg-muted ${
                            editor.isActive('heading', { level })
                                ? 'bg-muted'
                                : ''
                        }`}
                    >
                        <HeadingIcon className='text-xl' />
                    </button>
                );
            })}

            <div className='h-4 w-px bg-gray-300 dark:bg-gray-700' />

            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive('bold') ? 'bg-muted' : ''
                }`}
            >
                <FaBold className='text-sm' />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive('italic') ? 'bg-muted' : ''
                }`}
            >
                <FaItalic className='text-sm' />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive('underline') ? 'bg-muted' : ''
                }`}
            >
                <FaUnderline className='text-sm' />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive('highlight') ? 'bg-muted' : ''
                }`}
            >
                <FaHighlighter className='text-sm' />
            </button>

            <div className='relative'>
                <input
                    type='color'
                    onChange={(e) =>
                        editor.chain().focus().setColor(e.target.value).run()
                    }
                    className={cn(
                        'w-8 h-8 opacity-0 absolute inset-0 cursor-pointer',
                        'dark:opacity-0'
                    )}
                />
                <div
                    className={cn(
                        'p-2 rounded hover:bg-muted flex items-center justify-center',
                        'ring-1 ring-border dark:ring-border',
                        'bg-background dark:bg-background'
                    )}
                >
                    <BsCircleFill
                        className='text-sm'
                        style={{
                            color:
                                editor.getAttributes('textStyle').color ||
                                'currentColor',
                            filter: 'none',
                        }}
                    />
                </div>
            </div>

            <div className='h-4 w-px bg-gray-300 dark:bg-gray-700' />

            <select
                className='h-8 rounded border border-gray-300 dark:border-gray-700 bg-background'
                onChange={(e) =>
                    editor.chain().focus().setFontFamily(e.target.value).run()
                }
                defaultValue=''
            >
                <option value='' disabled>
                    Police
                </option>
                {FONT_FAMILIES.map((font) => (
                    <option key={font.value} value={font.value}>
                        {font.label}
                    </option>
                ))}
            </select>

            <div className='h-4 w-px bg-gray-300 dark:bg-gray-700' />

            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                }
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''
                }`}
            >
                <FaAlignLeft className='text-sm' />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                }
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''
                }`}
            >
                <FaAlignCenter className='text-sm' />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                }
                className={`p-2 rounded hover:bg-muted ${
                    editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''
                }`}
            >
                <FaAlignRight className='text-sm' />
            </button>

            <div className='h-4 w-px bg-gray-300 dark:bg-gray-700' />

            <button onClick={addImage} className='p-2 rounded hover:bg-muted'>
                <FaImage className='text-sm' />
            </button>
            <VariableSelector
                onSelect={(variable) => {
                    editor.chain().focus().insertContent(variable).run();
                }}
            />
        </div>
    );
};
