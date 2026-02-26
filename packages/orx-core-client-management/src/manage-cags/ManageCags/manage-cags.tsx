import React, {useEffect} from 'react';
import {Box, Button, Typography, Divider, Grid} from '@mui/material';
import ArrowBackIosOutlined from '@mui/icons-material/ArrowBackIosOutlined';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useBreadcrumbs} from '@optum-rx-core/orx-core-client-shared';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {useManageCags} from '../useManageCags/use-manage-cags';
import {FormSelectField} from '../../components/form-select-field';
import {cagsApiService} from '../../services/cags-api.service';
import {AssignedCags, AssignedCAG} from '../../components/assigned-cags';
import {AssignCags} from '../../components/assign-cags';
import {AssignedCagsFilterValues} from '../../components/assigned-cags-filter-drawer';

import {ManageCagsProps} from './manage-cags.types';

// Interface for API response
interface CAGListItem {
  ouCagId?: string;
  cagId?: string;
  carrierName?: string;
  carrierId?: string;
  accountName?: string;
  accountId?: string;
  groupName?: string;
  groupId?: string;
  assigmentStatus?: string;
  assignmentStatus?: string;
  effectiveStartDate?: string;
  effectiveEndDate?: string;
}

interface CAGListResponse {
  ouCagList: CAGListItem[];
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ManageCagsPage(_props: ManageCagsProps) {
  useManageCags();
  const {setBreadcrumbs} = useBreadcrumbs();
  const navigate = useNavigate();
  const {showSuccess} = useNotification();

  // State for dropdown options
  const [clientOptions, setClientOptions] = React.useState<{value: string; label: string}[]>([]);
  const [contractOptions, setContractOptions] = React.useState<{value: string; label: string}[]>([]);
  const [operationalUnitOptions, setOperationalUnitOptions] = React.useState<{value: string; label: string}[]>([]);
  const [operationalUnitsRawData, setOperationalUnitsRawData] = React.useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = React.useState(false);
  const [isLoadingContracts, setIsLoadingContracts] = React.useState(false);
  const [isLoadingOperationalUnits, setIsLoadingOperationalUnits] = React.useState(false);

  // State for assigned CAGs
  const [selectedCAGIds, setSelectedCAGIds] = React.useState<string[]>([]);
  const [assignedCAGs, setAssignedCAGs] = React.useState<AssignedCAG[]>([]);
  const [isLoadingAssignedCAGs, setIsLoadingAssignedCAGs] = React.useState(false);

  // State to control AssignCags accordion expansion
  const [isAssignCagsExpanded, setIsAssignCagsExpanded] = React.useState(false);

  // State for selected operational unit details
  const [selectedOperationalUnit, setSelectedOperationalUnit] = React.useState<{
    operationUnitInternalId: string;
    operationUnitId: string;
    operationUnitName: string;
  } | null>(null);

  // Setup react-hook-form
  const {control, watch, setValue} = useForm({
    defaultValues: {
      client: '',
      contract: '',
      operationalUnit: ''
    }
  });

  // Watch field values to enable/disable dependent fields
  const clientValue = watch('client');
  const contractValue = watch('contract');
  const operationalUnitValue = watch('operationalUnit');

  // Track previous client value to detect changes
  const prevClientValue = React.useRef<string>('');
  const prevContractValue = React.useRef<string>('');

  // Fetch client options on page load
  React.useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const response = await cagsApiService.getClients();

        if (response) {
          // Map API response to dropdown options format
          const options = response.map(
            (client: {clientId?: string; id?: string; clientName?: string; name?: string}) => ({
              value: client.clientId ?? client.id ?? '',
              label: client.clientName ?? client.name ?? ''
            })
          );
          setClientOptions(options);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Optionally show error message to user
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients().catch(() => {
      // Error already handled in try-catch
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setBreadcrumbs([
      {name: 'Home', link: '/'},
      {name: 'Clients', link: '/clients'},
      {name: 'Manage CAGs', link: '/clients#/manage-cags'}
    ]);
  }, [setBreadcrumbs]);

  // Reset dependent fields when client changes
  React.useEffect(() => {
    // Clear fields if client is empty OR if client changed to a different value
    if (!clientValue || (prevClientValue.current && prevClientValue.current !== clientValue)) {
      setValue('contract', '');
      setValue('operationalUnit', '');
      setContractOptions([]);
      setOperationalUnitOptions([]);
    }
    prevClientValue.current = clientValue;
  }, [clientValue, setValue]);

  // Fetch contracts when client changes
  React.useEffect(() => {
    const fetchContracts = async () => {
      if (!clientValue) {
        setContractOptions([]);
        return;
      }

      setIsLoadingContracts(true);
      try {
        const response = await cagsApiService.getContractsByClientId(clientValue);

        if (response && Array.isArray(response) && response.length > 0) {
          // Map API response to dropdown options format
          const options = (
            response as {
              contractInternalId?: string;
              id?: string;
              contractId?: string;
              effectiveDate?: string;
              terminateDate?: string | null;
            }[]
          )
            .map((contract) => {
              const contractId = contract.contractId ?? '';
              const effectiveDate = contract.effectiveDate ?? '';
              const terminateDate = contract.terminateDate ?? 'Present';
              const label = contractId ? `${contractId} (${effectiveDate} - ${terminateDate})` : '';

              return {
                value: contract.contractInternalId ?? contract.id ?? '',
                label
              };
            })
            .filter((option) => option.value && option.label); // Filter out empty values
          setContractOptions(options);
          // eslint-disable-next-line no-console
        } else {
          // Reset contract value when no options available
          setContractOptions([]);
          setValue('contract', '');
          setValue('operationalUnit', '');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setContractOptions([]);
        setValue('contract', '');
        setValue('operationalUnit', '');
      } finally {
        setIsLoadingContracts(false);
      }
    };

    fetchContracts().catch(() => {
      // Error already handled in try-catch
    });
  }, [clientValue]);

  // Reset operational unit when contract changes
  React.useEffect(() => {
    // Clear operational unit if contract is empty OR if contract changed to a different value
    if (!contractValue || (prevContractValue.current && prevContractValue.current !== contractValue)) {
      setValue('operationalUnit', '');
      setOperationalUnitOptions([]);
    }
    prevContractValue.current = contractValue;
  }, [contractValue, setValue]);

  // Fetch operational units when contract changes
  React.useEffect(() => {
    const fetchOperationalUnits = async () => {
      if (!contractValue) {
        setOperationalUnitOptions([]);
        return;
      }

      setIsLoadingOperationalUnits(true);
      try {
        const response = await cagsApiService.getOperationalUnitsByClientAndContract(contractValue);

        if (response && Array.isArray(response) && response.length > 0) {
          // Store raw data for later lookup
          setOperationalUnitsRawData(response);

          // Map API response to dropdown options format
          const options = (
            response as {
              operationUnitInternalId?: string;
              operationUnitId?: string;
              operationUnitName?: string;
            }[]
          )
            .map((unit) => {
              const unitId = unit.operationUnitId ?? '';
              const unitName = unit.operationUnitName ?? '';
              const label = unitId && unitName ? `${unitId} - ${unitName}` : unitName || unitId;

              return {
                value: unit.operationUnitInternalId ?? '',
                label
              };
            })
            .filter((option) => option.value && option.label); // Filter out empty values
          setOperationalUnitOptions(options);

          // Store the response for later lookup
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (setOperationalUnitOptions as any).rawData = response;
        } else {
          // Reset operational unit value when no options available
          setOperationalUnitOptions([]);
          setValue('operationalUnit', '');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setOperationalUnitOptions([]);
        setValue('operationalUnit', '');
      } finally {
        setIsLoadingOperationalUnits(false);
      }
    };

    fetchOperationalUnits().catch(() => {
      // Error already handled in try-catch
    });
  }, [contractValue]);

  // Update selected operational unit when operationalUnitValue changes
  React.useEffect(() => {
    if (operationalUnitValue && operationalUnitsRawData.length > 0) {
      const selectedUnit = operationalUnitsRawData.find(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (unit: any) => unit.operationUnitInternalId === operationalUnitValue
      );
      setSelectedOperationalUnit(selectedUnit || null);
    } else {
      setSelectedOperationalUnit(null);
    }
  }, [operationalUnitValue, operationalUnitsRawData]);

  // Shared function to fetch and map assigned CAGs
  const fetchAndMapAssignedCAGs = async (showLoading = true, filters?: AssignedCagsFilterValues) => {
    if (!operationalUnitValue) {
      setAssignedCAGs([]);
      return;
    }

    if (showLoading) {
      setIsLoadingAssignedCAGs(true);
    }

    try {
      const response = (await cagsApiService.getAssignedCagList({
        operationUnitInternalId: operationalUnitValue,
        page: 0,
        size: 10,
        ...(filters?.carrierName && {carrierName: filters.carrierName}),
        ...(filters?.carrierId && {carrierId: filters.carrierId}),
        ...(filters?.accountName && {accountName: filters.accountName}),
        ...(filters?.accountId && {accountId: filters.accountId}),
        ...(filters?.groupName && {groupName: filters.groupName}),
        ...(filters?.groupId && {groupId: filters.groupId}),
        ...(filters?.assignmentStatus && {assignmentStatus: filters.assignmentStatus}),
        ...(filters?.startDate && {startDate: filters.startDate}),
        ...(filters?.endDate && {endDate: filters.endDate})
      })) as CAGListResponse;

      // eslint-disable-next-line no-console

      if (response?.ouCagList && Array.isArray(response.ouCagList)) {
        // Get selected client name from dropdown
        const selectedClientName = clientOptions.find((option) => option.value === clientValue)?.label || '';
        // Get selected operation unit name from selected operational unit

        // Map API response to AssignedCAG format
        const mappedCAGs: AssignedCAG[] = response.ouCagList.map((item) => ({
          id: item.ouCagId || '',
          carrierName: item.carrierName || '',
          carrierId: item.carrierId || '',
          accountName: item.accountName || '',
          accountId: item.accountId || '',
          groupName: item.groupName || '',
          groupId: item.groupId || '',
          assignmentStatus: item.assigmentStatus || item.assignmentStatus || '', // Note: API has typo "assigmentStatus"
          startDate: item.effectiveStartDate || '',
          endDate: item.effectiveEndDate || undefined,
          clientName: selectedClientName,
          operationUnitName: selectedOperationalUnit?.operationUnitName || ''
        }));

        // eslint-disable-next-line no-console

        setAssignedCAGs(mappedCAGs);
      } else {
        setAssignedCAGs([]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setAssignedCAGs([]);
    } finally {
      if (showLoading) {
        setIsLoadingAssignedCAGs(false);
      }
    }
  };

  // Fetch assigned CAGs when operational unit is selected
  React.useEffect(() => {
    fetchAndMapAssignedCAGs().catch(() => {
      // Error already handled in try-catch
    });
  }, [operationalUnitValue]);

  // TODO: Add these variables from your actual implementation
  const pageTitle = 'Manage CAGs';

  const handleCancel = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  // Handlers for AssignedCags component
  const handleCAGSelectionChange = (selectedIds: string[]) => {
    setSelectedCAGIds(selectedIds);
  };

  const handleAssignCAG = () => {
    // Open the AssignCags accordion
    setIsAssignCagsExpanded(true);
    // Optionally scroll to the AssignCags component
    setTimeout(() => {
      const assignCagsElement = document.getElementById('assign-cags-accordion');
      if (assignCagsElement) {
        assignCagsElement.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }, 100);
  };

  const handleEditCAG = () => {
    // TODO: Implement edit CAG logic
  };

  const handleSaveEdit = async (ouCagAssignmentId: string, endDate: string) => {
    try {
      if (!selectedOperationalUnit?.operationUnitInternalId) {
        return;
      }
      await cagsApiService.editAssignedCAG({
        operationUnitInternalId: selectedOperationalUnit.operationUnitInternalId,
        ouCagAssignmentId,
        endDate
      });

      // Refresh the assigned CAGs list
      await fetchAndMapAssignedCAGs(false);
    } catch {
      // error intentionally ignored
    }
  };

  const handleDeactivateCAG = async (cagId: string) => {
    try {
      const cag = assignedCAGs.find((c) => c.id === cagId);
      if (cag?.assignmentStatus.toUpperCase() === 'INACTIVE') {
        return;
      }
      await cagsApiService.updateCAGStatus({
        ouCagIds: [cagId],
        status: 'INACTIVE'
      });
      await fetchAndMapAssignedCAGs(false);
    } catch {
      // error intentionally ignored
    }
  };

  const handleDeleteCAG = async (cagIds: string[]) => {
    try {
      await cagsApiService.deleteCAG(cagIds);
      await fetchAndMapAssignedCAGs(false);
    } catch {
      // error intentionally ignored
    }
  };

  const handleFiltersClick = () => {
    // Filter drawer will be opened by the AssignedCags component
  };

  const handleFiltersApply = async (filters: AssignedCagsFilterValues) => {
    await fetchAndMapAssignedCAGs(true, filters);
  };

  const handleAssignCAGs = async (payload: {
    operationUnitInternalId: string;
    cagIds: string[];
    assignmentType: string;
    startDate: string;
    endDate?: string;
  }) => {
    try {
      await cagsApiService.assignCAGs(payload);

      // Show success notification
      showSuccess(
        <>
          Successfully assigned <strong>{payload.cagIds.length}</strong> CAG(s) to{' '}
          <strong>{selectedOperationalUnit?.operationUnitName || ''}</strong>.
        </>
      );

      // Refresh the assigned CAGs list after successful assignment
      await fetchAndMapAssignedCAGs(false);
    } catch {
      // error intentionally ignored
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedCAGIds.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No CAGs selected for bulk action');
      return;
    }

    try {
      // eslint-disable-next-line no-console
      console.log('Bulk action:', action, 'on CAGs:', selectedCAGIds);

      if (action === 'delete') {
        // Call delete API for bulk delete
        await cagsApiService.deleteCAG(selectedCAGIds);
      } else {
        // Determine the status based on the action
        let status: 'ACTIVE' | 'INACTIVE';
        if (action === 'activate') {
          status = 'ACTIVE';
        } else if (action === 'deactivate' || action === 'inactivate') {
          status = 'INACTIVE';
        } else {
          // eslint-disable-next-line no-console
          console.error('Unknown bulk action:', action);
          return;
        }

        // Call the API with all selected CAG IDs
        await cagsApiService.updateCAGStatus({
          ouCagIds: selectedCAGIds,
          status
        });
      }

      // Clear selection after successful bulk action
      setSelectedCAGIds([]);

      // Refresh the assigned CAGs list
      await fetchAndMapAssignedCAGs(false);

      // eslint-disable-next-line no-console
      console.log(`Successfully ${action}d ${selectedCAGIds.length} CAGs`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to perform bulk action:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{px: '84px', py: 3, flex: 1}}>
        {/* Title Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            mt: 1
          }}
        >
          {/* Title and Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ArrowBackIosOutlined
              onClick={() => {
                navigate(-1);
              }}
              sx={{
                fontSize: 22,
                color: '#0C55B8',
                cursor: 'pointer'
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: '29px',
                fontWeight: 700,
                color: '#002677',
                lineHeight: 1.2
              }}
            >
              {pageTitle}
            </Typography>
          </Box>

          {/* Button Group */}
          <Box
            sx={{
              display: 'flex',
              gap: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#4B4D4F',
                borderColor: '#4B4D4F',
                borderRadius: '46px',
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: 700,
                height: '40px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#F5F5F5',
                  borderColor: '#4B4D4F'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <Divider
          sx={{
            my: 3,
            borderColor: '#E5E5E6'
          }}
        />
        {/* Main Content Area */}
        <Box sx={{mt: 3}}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormSelectField
                name="client"
                control={control}
                label="Client"
                options={clientOptions}
                placeholder={isLoadingClients ? 'Loading clients...' : 'Select a client'}
                disabled={isLoadingClients}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormSelectField
                name="contract"
                control={control}
                label="Contract"
                options={contractOptions}
                placeholder={isLoadingContracts ? 'Loading contracts...' : 'Select a contract'}
                disabled={!clientValue || isLoadingContracts}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormSelectField
                name="operationalUnit"
                control={control}
                label="Operational Unit"
                options={operationalUnitOptions}
                placeholder={isLoadingOperationalUnits ? 'Loading operational units...' : 'Select an operational unit'}
                disabled={!clientValue || !contractValue || isLoadingOperationalUnits}
                required
              />
            </Grid>
          </Grid>
        </Box>
        <Divider
          sx={{
            my: 3,
            borderColor: '#E5E5E6'
          }}
        />
        <Box sx={{mb: 3}}>
          <AssignedCags
            cags={assignedCAGs}
            selectedIds={selectedCAGIds}
            onSelectionChange={handleCAGSelectionChange}
            onAssignCAG={handleAssignCAG}
            onEditCAG={handleEditCAG}
            onSaveEdit={handleSaveEdit}
            onDeactivateCAG={handleDeactivateCAG}
            onFiltersClick={handleFiltersClick}
            onFiltersApply={handleFiltersApply}
            onBulkAction={handleBulkAction}
            title="List of Assigned CAGs"
            isLoading={isLoadingAssignedCAGs}
            operationUnit={selectedOperationalUnit || {}}
            onDeleteCAG={handleDeleteCAG}
          />
        </Box>

        <AssignCags
          title="Assign CAGs"
          operationUnit={selectedOperationalUnit || {}}
          expanded={isAssignCagsExpanded}
          onExpandedChange={setIsAssignCagsExpanded}
          onAssignCAGs={handleAssignCAGs}
        />
      </Box>
    </Box>
  );
}

export default ManageCagsPage;
