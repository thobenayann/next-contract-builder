'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useClauses } from '@/app/_lib/hooks/use-clauses';
import { ClauseFormData } from '@/app/_lib/validations/schemas/clause.schema';
import TipTapEditor from '@/components/TipTapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/ui/transition';

const CreateClausePage = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const { createClause, isCreating } = useClauses();

    const handleSubmit = () => {
        const formData: ClauseFormData = {
            title,
            content: editorContent,
            category: 'default',
        };

        createClause(formData, {
            onSuccess: () => {
                router.push('/dashboard/clauses');
            },
        });
    };

    return (
        <PageTransition>
            <div className='container mx-auto p-4 max-w-4xl'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold'>
                        Créer une nouvelle clause
                    </h1>
                    <Button
                        variant='outline'
                        onClick={() => router.push('/dashboard/clauses')}
                    >
                        Retour
                    </Button>
                </div>
                <div className='space-y-6'>
                    <div>
                        <label
                            htmlFor='title'
                            className='block text-sm font-medium mb-2'
                        >
                            Titre de la clause
                        </label>
                        <Input
                            id='title'
                            placeholder='Titre de la clause'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-full'
                            disabled={isCreating}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Contenu de la clause
                        </label>
                        <div className='prose-container w-full'>
                            <TipTapEditor
                                setContent={setEditorContent}
                                initialContent={editorContent}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end space-x-4'>
                        <Button
                            variant='outline'
                            onClick={() => router.push('/dashboard/clauses')}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isCreating || !title.trim()}
                        >
                            {isCreating && (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            )}
                            Créer
                        </Button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default CreateClausePage;
