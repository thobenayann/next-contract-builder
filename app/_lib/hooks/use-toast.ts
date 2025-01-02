'use client';

import * as React from 'react';

import type {
    ToastActionElement,
    ToastProps as ToastPrimitiveProps,
} from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

interface ToasterToast
    extends Omit<ToastPrimitiveProps, 'title' | 'description'> {
    id: string;
    title?: string;
    description?: string | React.ReactNode;
    action?: ToastActionElement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const ACTION_TYPES = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

type ActionType = typeof ACTION_TYPES;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}

type Action =
    | {
          type: ActionType['ADD_TOAST'];
          toast: ToasterToast;
      }
    | {
          type: ActionType['UPDATE_TOAST'];
          toast: Partial<ToasterToast>;
      }
    | {
          type: ActionType['DISMISS_TOAST'];
          toastId?: ToasterToast['id'];
      }
    | {
          type: ActionType['REMOVE_TOAST'];
          toastId?: ToasterToast['id'];
      };

interface State {
    toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ACTION_TYPES.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case ACTION_TYPES.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case ACTION_TYPES.DISMISS_TOAST: {
            const { toastId } = action;

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id);
                });
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                              ...t,
                              open: false,
                          }
                        : t
                ),
            };
        }
        case ACTION_TYPES.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
    }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

interface CustomToastProps {
    title?: string;
    description?: string | React.ReactNode;
    variant?: 'default' | 'success' | 'error';
    action?: ToastActionElement;
    duration?: number;
}

function toast({ variant = 'default', ...props }: CustomToastProps) {
    const id = genId();

    const update = (props: ToasterToast) =>
        dispatch({
            type: ACTION_TYPES.UPDATE_TOAST,
            toast: { ...props, id },
        });
    const dismiss = () =>
        dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId: id });

    dispatch({
        type: ACTION_TYPES.ADD_TOAST,
        toast: {
            ...props,
            variant,
            id,
            open: true,
            onOpenChange: (open: boolean) => {
                if (!open) dismiss();
            },
        },
    });

    return {
        id: id,
        dismiss,
        update,
    };
}

export function useToast() {
    const [state, setState] = React.useState<State>(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) =>
            dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId }),
    };
}
