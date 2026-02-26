import React, {useState} from 'react';
import {Accordion, AccordionSummary, AccordionDetails, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type {Control, FieldErrors, UseFormSetValue, UseFormWatch} from 'react-hook-form';

import type {AddClientCombinedFormData} from '../schemas';

import {ContractInfoSection} from './contract-info-section';
import {BillingAttributesSection} from './billing-attributes-section';

interface ContractDetailsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  watch: UseFormWatch<AddClientCombinedFormData>;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
}

export const ContractDetailsStep: React.FC<ContractDetailsStepProps> = ({control, errors, watch, setValue}) => {
  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        border: '1px solid #CBCCCD',
        borderRadius: '12px !important',
        boxShadow: 'none',
        '&:before': {
          display: 'none'
        },
        '&.Mui-expanded': {
          margin: 0
        }
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: '#002677',
              fontSize: '24px'
            }}
          />
        }
        sx={{
          padding: '16px 24px',
          '& .MuiAccordionSummary-content': {
            margin: 0,
            flexDirection: 'column',
            gap: '4px'
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0
          }
        }}
      >
        <Typography
          sx={{
            fontSize: '23px',
            fontWeight: 700,
            color: '#323334',
            lineHeight: 1.2
          }}
        >
          Contract Details
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4,
            my: 2
          }}
        >
          Complete the fields below.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '0 24px 24px 24px'
        }}
      >
        {/* Contract Information Fields - Three Column Layout */}
        <ContractInfoSection control={control} errors={errors} />

        {/* Billing Attributes Section (includes ACH fields and Suppressions) */}
        <BillingAttributesSection control={control} errors={errors} watch={watch} setValue={setValue} />
      </AccordionDetails>
    </Accordion>
  );
};

export default ContractDetailsStep;
