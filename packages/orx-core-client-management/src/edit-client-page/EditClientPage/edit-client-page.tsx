import React, {FC, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';

import StepperFormSkeleton from '../../components/stepper-form-skeleton';
import {clientApiService} from '../../services/client-api.service';
import {AddClientCombinedFormData} from '../../stepper/schemas';
import {toUIFormSchema} from '../../libs/mapper';

import {EditClientForm} from './edit-client-form';

const EditClientPage: FC = () => {
  // const {clientId} = useParams() as {clientId: string};
  const [searchParams] = useSearchParams();
  const step = searchParams.get('step') ? Number(searchParams.get('step')) : 0;
  const mode = searchParams.get('mode');
  const draftId = searchParams.get('draftId');
  const clientId = searchParams.get('clientId');

  const [client, setClient] = React.useState<AddClientCombinedFormData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (mode === 'draft' && draftId) {
      clientApiService
        .getDraftById(draftId)
        .then((data) => {
          setClient(toUIFormSchema(data));
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load draft client data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (clientId) {
      clientApiService
        .getClientByClientId(clientId)
        .then((data) => {
          setClient(data);
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load client data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [mode, draftId, clientId]);

  if (loading) {
    return <StepperFormSkeleton />;
  }

  if (!loading && !client) {
    return <div>Client not found.</div>;
  }

  if (!client) {
    return <div>Client not found.</div>;
  }

  return (
    <EditClientForm
      initialData={client}
      step={step}
      mode={mode === 'draft' ? 'draft' : 'edit'}
      draftId={draftId || undefined}
    />
  );
};

export default EditClientPage;
