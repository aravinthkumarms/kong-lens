import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { ActionIcon } from '@mantine/core';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CssBaseline, Button, Box, Tooltip } from '@mui/material';
import useAwaitableComponent from 'use-awaitable-component';
import { useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { DELETE, GET } from '../Helpers/ApiHelpers';
import PageHeader from '../Components/Features/PageHeader';
import DialogModal from '../Components/Features/DialogModal';
import {
  BASE_API_URL,
  API_RESPONSE_SNACK_MESSAGE,
  ACTION_TYPES,
} from '../Shared/constants';
import { snackMessageProp, ServiceDetails } from '../interfaces';
import { SnackBarAlert } from '../Components/Features/SnackBarAlert';
import { RawView } from '../Components/Features/RawView';
import { TagComponent } from '../Components/Features/TagComponent';
import { updateValue } from '../Reducer/StoreReducer';

const Services = (): JSX.Element => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const deleteRow = useRef(false);
  const openSnackBar = useSelector(
    (state: { reducer: { openSnackBar: boolean } }) =>
      state.reducer.openSnackBar
  );
  const snack = useSelector(
    (state: { reducer: { snackBar: snackMessageProp } }) =>
      state.reducer.snackBar
  );

  const updateFlagReducer = (type: string, value: boolean): void => {
    dispatch(updateValue({ type, value }));
  };

  const updateSnackMessage = (message: string, severity: string): void => {
    dispatch(
      updateValue({
        type: ACTION_TYPES.SET_SNACK_BAR_MESSAGE,
        message,
        severity,
      })
    );
  };

  const [promise, setPromise] = useState<unknown>();
  const [showRaw, setShowRaw] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, execute, resolve, reject, reset] = useAwaitableComponent();
  const [tableData, setTableData] = useState<ServiceDetails[]>([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getServices = async () => {
      await GET({
        url: `${BASE_API_URL}/services/`,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
        .then((response) => {
          if (response.status === 200) {
            const { data } = response.data;
            for (let i = 0; i < data.length; i += 1) {
              const curServiceDetails: ServiceDetails = data[i];
              Object.keys(curServiceDetails).forEach(() => {
                if (typeof curServiceDetails.created_at === 'number') {
                  curServiceDetails.created_at = new Date(
                    curServiceDetails.created_at
                  ).toLocaleDateString();
                }
              });
            }
            setTableData(data);
            for (let i = 0; i < data.length; i += 1) {
              showRaw.set(data[i].id, false);
            }
          }
          updateSnackMessage(API_RESPONSE_SNACK_MESSAGE.fetchedData, 'success');
        })
        .catch((err) => {
          updateSnackMessage(
            err.response && err.response.data
              ? err.response.data.message
              : API_RESPONSE_SNACK_MESSAGE.unableToFetchData,
            'error'
          );
        });
    };
    getServices();
    updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteRow = useCallback(
    (row: MRT_Row<ServiceDetails>) => {
      if (
        // !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
        !deleteRow
      ) {
        return;
      }
      // send api delete request here, then refetch or update local table data for re-render
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const deleteData = async () => {
        await DELETE({
          url: `${BASE_API_URL}/services/${row.original.id}`,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            if (response.status === 204) {
              updateSnackMessage(
                API_RESPONSE_SNACK_MESSAGE.deletedService,
                'info'
              );
              tableData.splice(row.index, 1);
              setTableData([...tableData]);
            }
          })
          .catch((err) => {
            updateSnackMessage(
              err.response
                ? err.response.data.message
                : API_RESPONSE_SNACK_MESSAGE.unableToDelete,
              'error'
            );
          });
      };
      deleteData();
      updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, tableData]
  );

  const handleRawView = (id: string, value: boolean): void => {
    setShowRaw((map) => new Map(map.set(id, value)));
  };

  const handleAwaitModal = async (
    row: MRT_Row<ServiceDetails>
  ): Promise<void> => {
    setConfirmDialogOpen(true);
    const val: unknown = await execute();
    setPromise(val);
    handleDeleteRow(row);
  };

  const handleConfirmDelete = (): void => {
    deleteRow.current = true;
    resolve(promise);
    setConfirmDialogOpen(!confirmDialogOpen);
  };

  const columns = useMemo<MRT_ColumnDef<ServiceDetails>[]>(
    () => [
      {
        enableHiding: true,
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, // disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        enableHiding: true,
        header: 'Service Name',
        size: 140,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            navigate(`/services/${cell.row.original.id}/?newId=false`);
          },
          sx: {
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#438BCA',
          },
        }),
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        enableHiding: true,
        size: 150,
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }) => (
          <div style={{ display: 'flex' }}>
            {row.original.tags.map((tag: string) => (
              <div key={tag}>
                <TagComponent tag={tag} isList={false} />
              </div>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'protocol',
        header: 'Protocol',
      },
      {
        accessorKey: 'host',
        header: 'Host',
        size: 140,
      },
      {
        accessorKey: 'port',
        header: 'Port',
        size: 80,
      },
      {
        accessorKey: 'path',
        header: 'Path',
        size: 80,
      },
      {
        accessorKey: 'retries',
        header: 'Retries',
        size: 80,
      },
      {
        accessorKey: 'read_timeout',
        header: 'Read Timeout',
        size: 80,
        enableHiding: true,
      },
      {
        accessorKey: 'write_timeout',
        header: 'Write Timeout',
        size: 80,
        enableHiding: true,
      },
      {
        accessorKey: 'connect_timeout',
        header: 'Connect Timeout',
        size: 80,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
      },
      {
        accessorKey: 'client_certificate',
        header: 'Client certificate',
        enableHiding: true,
      },
      {
        accessorKey: 'ca_certificates',
        header: 'CA certificates',
        enableHiding: true,
      },
    ],
    [navigate]
  );

  return (
    <>
      <Box>
        <CssBaseline />
        <PageHeader
          header="Services"
          description="Service entities, as the name implies, are abstractions of each of your own upstream services. Examples of Services would be a data transformation microservice, a billing API, etc."
        />
      </Box>
      <SnackBarAlert
        open={openSnackBar}
        message={snack.message}
        severity={snack.severity}
        handleClose={() => {
          updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, false);
        }}
      />
      <br />
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" // default
        enableColumnOrdering
        enableEditing
        initialState={{
          columnVisibility: {
            id: false,
            connect_timeout: false,
            write_timeout: false,
            read_timeout: false,
            retries: false,
            protocol: false,
            port: false,
          },
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Tooltip arrow placement="left" title="Raw">
              <>
                <VisibilityIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRawView(row.original.id, true)}
                />
                <RawView
                  json={row.original}
                  open={showRaw.get(row.original.id) as boolean}
                  onClose={() => handleRawView(row.original.id, false)}
                />
              </>
            </Tooltip>
            <Tooltip arrow placement="right-end" title="Delete">
              <ActionIcon
                color="red"
                onClick={() => {
                  handleAwaitModal(row);
                }}
              >
                <Delete />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            sx={{
              backgroundColor: '#1ABB9C',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1AAA9C',
              },
            }}
            onClick={() => {
              navigate(`/services/createService/?newId=true`);
            }}
            variant="contained"
          >
            Create New Service
          </Button>
        )}
      />
      <DialogModal
        description="Really want to delete the selected item?"
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          reject(promise);
        }}
        onConfirm={() => {
          handleConfirmDelete();
        }}
      />
    </>
  );
};

export default Services;
