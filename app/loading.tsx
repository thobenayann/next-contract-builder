const Loading = () => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent' />
        </div>
    );
};

export default Loading;
