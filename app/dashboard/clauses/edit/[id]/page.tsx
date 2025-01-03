'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useClause, useClauses } from '@/app/_lib/hooks/use-clauses';
import { ClauseFormData } from '@/app/_lib/validations/schemas/clause.schema';
import TipTapEditor from '@/components/TipTapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';

interface PageProps {
    params: { id: string };
}

const EditClausePage = ({ params }: PageProps) => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');

    const { data: clause, isLoading: isLoadingClause } = useClause(params.id);
    const { updateClause, isUpdating } = useClauses();

    useEffect(() => {
        if (clause) {
            setTitle(clause.title);
            setEditorContent(clause.content);
        }
    }, [clause]);

    const handleSubmit = () => {
        const formData: ClauseFormData = {
            title,
            content: editorContent,
            category: 'default',
        };

        updateClause(
            { id: params.id, data: formData },
            {
                onSuccess: () => {
                    router.push('/dashboard/clauses');
                },
            }
        );
    };

    if (isLoadingClause) {
        return <LoadingSpinner />;
    }

    return (
        <PageTransition>
            <div className='container mx-auto p-4 max-w-4xl'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold'>Modifier la clause</h1>
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-full'
                            disabled={isUpdating}
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
                            disabled={isUpdating}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isUpdating || !title.trim()}
                        >
                            {isUpdating && (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            )}
                            Mettre à jour
                        </Button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EditClausePage;
