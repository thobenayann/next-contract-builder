'use client';

import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import { TipTapEditorToolbar } from './TipTapEditorToolbar';

interface TipTapEditorProps {
    setContent: (content: string) => void;
    initialContent?: string;
}

const TipTapEditor = ({
    setContent,
    initialContent = '',
}: TipTapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: 'font-bold',
                    },
                },
            }),
            TextStyle,
            Color,
            FontFamily,
            Highlight,
            Underline,
            ImageResize.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'resize-image',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className='relative border rounded-lg overflow-hidden dark:border-gray-800'>
            <div className='bg-background sticky top-0 z-10'>
                <TipTapEditorToolbar editor={editor} />
            </div>
            <EditorContent editor={editor} className='p-4 min-h-[200px]' />
        </div>
    );
};

export default TipTapEditor;
