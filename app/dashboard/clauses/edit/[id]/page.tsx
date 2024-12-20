'use client';

import { use, useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import TipTapEditor from '@/components/TipTapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/ui/transition';

interface PageProps {
    params: Promise<{ id: string }>;
}

const EditClausePage = (props: PageProps) => {
    const params = use(props.params);
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/clauses/${params.id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Clause non trouvée');
                return res.json();
            })
            .then((data) => {
                setTitle(data.title);
                setEditorContent(data.content);
            })
            .catch((err) => {
                setError(err.message);
                console.error('Erreur lors du chargement:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [params.id]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/clauses/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content: editorContent }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde');
            }

            router.push('/dashboard/clauses');
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Une erreur est survenue'
            );
            console.error('Erreur lors de la sauvegarde:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className='container mx-auto p-4 max-w-4xl'>
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
                    {error}
                </div>
                <Button
                    variant='outline'
                    onClick={() => router.push('/dashboard/clauses')}
                    className='mt-4'
                >
                    Retour
                </Button>
            </div>
        );
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
                            Mettre à jour
                        </Button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EditClausePage;
