'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ClauseFormData } from '@/app/_lib/validations/schemas/clause.schema';
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
        const formData: ClauseFormData = {
            title,
            content: editorContent,
            category: 'default',
        };

        setIsLoading(true);

        try {
            const response = await fetch('/api/clauses/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.issues) {
                    const errorMessage = result.issues
                        .map((issue: any) => issue.message)
                        .join(', ');
                    throw new Error(errorMessage);
                }
                throw new Error(result.error || 'Une erreur est survenue');
            }

            toast({
                title: 'Succès! 🎉',
                description: 'Clause créée avec succès',
                variant: 'success',
            });

            router.push('/dashboard/clauses');
            router.refresh();
        } catch (error) {
            console.error('Erreur:', error);
            toast({
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Une erreur est survenue',
                variant: 'error',
            });
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
