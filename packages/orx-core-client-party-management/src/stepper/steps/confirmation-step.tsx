import React from 'react';
import {Stack} from '@mui/material';

import {InfoBanner} from '../../components/info-banner';
import {ReviewAccordion} from '../../components/review-accordion';
import type {AddClientCombinedFormData} from '../schemas';
import {ClientDetailsReview} from '../review/client-details-review';
import {ContractDetailsReview} from '../review/contract-details-review';
import {ContactsReview} from '../review/contacts-review';
import {OperationalUnitReview} from '../review/operational-unit-review';

interface ConfirmationStepProps {
  formData: AddClientCombinedFormData;
  onEditStep: (stepIndex: number) => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({formData, onEditStep}) => {
  return (
    <div>
      {/* Info Banner */}
      <InfoBanner
        title="Review and Confirm Details"
        message={
          <>
            You cannot edit information on this screen. To make changes, click the{' '}
            <span style={{fontWeight: 750}}>edit</span> icon next to the section you want to update.
          </>
        }
      />

      {/* Accordion Sections */}
      <Stack spacing={3} sx={{mt: 3}}>
        {/* Client Details Accordion */}
        <ReviewAccordion
          title="Client Details"
          subtitle="Please review all fields you have filled out and make sure they are correct before clicking on confirm."
          defaultExpanded
          onEdit={() => {
            onEditStep(0);
          }}
        >
          <ClientDetailsReview formData={formData} />
        </ReviewAccordion>

        {/* Contract Details Accordion */}
        <ReviewAccordion
          title="Contract Details"
          subtitle="Please review all fields you have filled out and make sure they are correct before clicking on confirm."
          onEdit={() => {
            onEditStep(1);
          }}
        >
          <ContractDetailsReview formData={formData} />
        </ReviewAccordion>

        {/* Contacts & Access Accordion */}
        <ReviewAccordion
          title="Contacts & Access"
          subtitle="Complete the fields below."
          onEdit={() => {
            onEditStep(2);
          }}
        >
          <ContactsReview formData={formData} />
        </ReviewAccordion>

        {/* Operational Units Accordions */}
        {formData.operationalUnits?.map((unit) => (
          <ReviewAccordion
            key={unit.id || unit.name}
            title={`Operational Units - ${unit.name || 'Operational Unit Name'}`}
            subtitle="Please review all fields you have filled out and make sure they are correct before clicking on confirm."
            onEdit={() => {
              onEditStep(3);
            }}
          >
            <OperationalUnitReview operationalUnit={unit} />
          </ReviewAccordion>
        ))}
      </Stack>
    </div>
  );
};

export default ConfirmationStep;
