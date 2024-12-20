'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import TipTapEditor from '@/components/TipTapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/ui/transition';
import { useToast } from '@/hooks/use-toast';

const CreateClausePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/clauses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content: editorContent }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création');
            }

            toast({
                title: 'Succès',
                description: 'Clause créée avec succès',
                variant: 'success',
            });

            router.push('/dashboard/clauses');
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Une erreur est survenue'
            );
            console.error('Erreur lors de la création:', error);
        } finally {
            setIsLoading(false);
        }
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
                            disabled={isLoading}
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
                            disabled={isLoading || !title.trim()}
                        >
                            {isLoading && (
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
