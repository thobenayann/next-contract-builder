import { EditClauseClient } from './EditClauseClient';

const EditClausePage = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const resolvedParams = await Promise.resolve(params);
    return <EditClauseClient id={resolvedParams.id} />;
};

export default EditClausePage;
