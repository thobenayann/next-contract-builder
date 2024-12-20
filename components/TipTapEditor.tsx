/* eslint-disable import/no-named-as-default */
import { useEffect } from 'react';

import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    FaBold,
    FaCode,
    FaHighlighter,
    FaItalic,
    FaStrikethrough,
    FaUnderline,
} from 'react-icons/fa';

interface TipTapEditorProps {
    setContent: (content: string) => void;
    initialContent?: string;
}

const TipTapEditor = ({ setContent, initialContent }: TipTapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'my-2',
                    },
                },
            }),
            Bold,
            Italic,
            Underline,
            Strike,
            Code,
            Highlight,
            Placeholder.configure({
                placeholder: 'Commencez à écrire ici...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            setContent(JSON.stringify(editor.getJSON()));
        },
    });

    useEffect(() => {
        if (editor && initialContent) {
            try {
                const parsedContent = JSON.parse(initialContent);
                editor.commands.setContent(parsedContent);
            } catch {
                editor.commands.setContent(initialContent);
            }
        }
    }, [editor, initialContent]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive,
        icon,
        label,
    }: {
        onClick: () => void;
        isActive: boolean;
        icon: React.ReactNode;
        label: string;
    }) => (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`p-2 rounded-md transition-colors ${
                isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
            }`}
            title={label}
        >
            {icon}
        </button>
    );

    return (
        <div className='border rounded-lg overflow-hidden'>
            <div className='bg-gray-100 p-2 flex space-x-2 border-b'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={<FaBold />}
                    label='Gras'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={<FaItalic />}
                    label='Italique'
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    isActive={editor.isActive('underline')}
                    icon={<FaUnderline />}
                    label='Souligné'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    icon={<FaStrikethrough />}
                    label='Barré'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    icon={<FaCode />}
                    label='Code'
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                    }
                    isActive={editor.isActive('highlight')}
                    icon={<FaHighlighter />}
                    label='Surligner'
                />
            </div>
            <EditorContent editor={editor} className='p-4 min-h-[200px]' />
        </div>
    );
};

export default TipTapEditor;
