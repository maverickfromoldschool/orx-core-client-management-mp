/* eslint-disable no-nested-ternary */
import React from 'react';
import {Box, Typography} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export type StepStatus = 'completed' | 'current' | 'incomplete';

export interface StepConfig {
  label: string;
  status: StepStatus;
}

export interface AddClientStepperProps {
  currentStep: number;
  steps?: StepConfig[];
  onStepClick?: (stepIndex: number) => void;
}

const DEFAULT_STEP_LABELS = [
  'Client Details',
  'Contract Details',
  'Contacts & Access',
  'Operational Units',
  'Confirmation'
];

/**
 * Generates step configurations based on the current step index.
 * Steps before currentStep are 'completed', currentStep is 'current',
 * and steps after are 'incomplete'.
 */
const generateStepConfigs = (currentStep: number, stepLabels: string[] = DEFAULT_STEP_LABELS): StepConfig[] => {
  return stepLabels.map((label, index) => {
    let status: StepStatus;
    if (index < currentStep) {
      status = 'completed';
    } else if (index === currentStep) {
      status = 'current';
    } else {
      status = 'incomplete';
    }
    return {label, status};
  });
};

const StepIndicator: React.FC<{
  stepNumber: number;
  status: StepStatus;
}> = ({stepNumber, status}) => {
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  // Completed: dark grey bg (#4B4D4F) with white check icon, 20x20px
  if (isCompleted) {
    return (
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4B4D4F'
        }}
      >
        <CheckIcon sx={{fontSize: 14, color: '#FFFFFF'}} />
      </Box>
    );
  }

  // Current: dark blue bg (#002677) with number, 24x24px inner circle with 3px ring effect
  if (isCurrent) {
    return (
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#002677',
          boxShadow: '0 0 0 3px #FFFFFF, 0 0 0 4px #4B4D4F'
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1
          }}
        >
          {stepNumber}
        </Typography>
      </Box>
    );
  }

  // Incomplete: white bg with 1px grey border (#323334), 20x20px, 12px medium text
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid #323334'
      }}
    >
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#323334',
          lineHeight: 1
        }}
      >
        {stepNumber}
      </Typography>
    </Box>
  );
};

export const AddClientStepper: React.FC<AddClientStepperProps> = ({currentStep, steps, onStepClick}) => {
  const stepConfigs = steps || generateStepConfigs(currentStep);

  const getStatusLabel = (status: StepStatus): string => {
    switch (status) {
      case 'completed':
        return 'Complete';
      case 'current':
        return 'In Progress';
      case 'incomplete':
        return 'Incomplete';
      default:
        return 'Incomplete';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        py: 2
      }}
    >
      {stepConfigs.map((step, index) => {
        // Only completed steps are clickable
        const isClickable = step.status === 'completed' && !!onStepClick;

        const handleStepClick = () => {
          if (isClickable) {
            onStepClick(index);
          }
        };

        return (
          <React.Fragment key={step.label}>
            {/* Step item container */}
            <Box
              onClick={handleStepClick}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 130,
                flexShrink: 0,
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'opacity 0.2s ease-in-out',
                '&:hover': isClickable ? {opacity: 0.7} : {}
              }}
            >
              {/* Status label */}
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#4B4D4F',
                  mb: 0.5,
                  lineHeight: 1.2,
                  height: '14px' // Fixed height for consistent alignment
                }}
              >
                {getStatusLabel(step.status)}
              </Typography>

              {/* Step indicator circle */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 30 // Fixed height container for vertical centering of connector
                }}
              >
                <StepIndicator stepNumber={index + 1} status={step.status} />
              </Box>

              {/* Step label */}
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: step.status === 'current' ? 700 : 400,
                  color: step.status === 'current' ? '#002677' : '#323334',
                  mt: 0.5,
                  textAlign: 'center',
                  lineHeight: 1.4
                }}
              >
                {step.label}
              </Typography>
            </Box>

            {/* Connector line between steps */}
            {index < stepConfigs.length - 1 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  minWidth: 20,
                  // Position connector at the same vertical level as step indicators
                  // Status label height (14px) + margin (4px) + half of indicator container (15px)
                  mt: '33px'
                }}
              >
                {/* Completed: solid line, Current: 1/4 solid + 3/4 dotted, Incomplete: dotted */}
                {step.status === 'completed' ? (
                  // Fully solid line for completed steps
                  <Box
                    sx={{
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#323334'
                    }}
                  />
                ) : step.status === 'current' ? (
                  // 1/4 solid + 3/4 dotted for in-progress step
                  <Box sx={{display: 'flex', width: '100%', alignItems: 'center'}}>
                    <Box
                      sx={{
                        width: '25%',
                        height: '2px',
                        backgroundColor: '#323334'
                      }}
                    />
                    <Box
                      sx={{
                        width: '75%',
                        height: 0,
                        borderTop: '2px dashed #323334'
                      }}
                    />
                  </Box>
                ) : (
                  // Fully dotted line for incomplete steps
                  <Box
                    sx={{
                      width: '100%',
                      height: 0,
                      borderTop: '2px dashed #B0B0B0'
                    }}
                  />
                )}
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default AddClientStepper;
