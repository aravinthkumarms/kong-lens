import React, { useCallback, useMemo, useRef, useState } from 'react';
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { ActionIcon, TextInput } from '@mantine/core';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  CssBaseline,
  Divider,
  Button,
  Dialog,
  Box,
  Stack,
  Tooltip,
  DialogTitle,
} from '@mui/material';

import useAwaitableComponent from 'use-awaitable-component';
import { useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import { DELETE, GET } from '../Helpers/ApiHelpers';
import PageHeader from '../Components/Features/PageHeader';
import DialogModal from '../Components/Features/DialogModal';
import { BASE_API_URL } from '../Shared/constants';
import { snackMessageProp, ServiceDetails } from '../interfaces';
import { SnackBarAlert } from '../Components/Features/SnackBarAlert';
import { RawView } from '../Components/Features/RawView';
import { TagComponent } from '../Components/Features/TagComponent';

// example of creating a mantine dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: Props): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values, setValues] = useState<any>();
  const fullWidth = true;
  const handleSubmit = (): void => {
    // put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Divider>
      <Dialog open={open} maxWidth="sm" fullWidth={fullWidth}>
        <DialogTitle sx={{ margin: 'auto' }}>Create New Service</DialogTitle>
        <Box
          sx={{
            width: '100%',
            gap: '24px',
            margin: 'auto',
          }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '80%',
                gap: '24px',
                margin: 'auto',
              }}
            >
              {columns.map((column) => (
                <TextInput
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}
            </Stack>
          </form>
        </Box>
        <Box
          sx={{
            padding: '20px',
            width: '100%',
            justifyContent: 'center',
            gap: '16px',
            margin: 'auto',
            display: 'flex',
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: 'teal',
              color: 'white',
            }}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: 'teal',
              color: 'white',
            }}
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </Dialog>
    </Divider>
  );
};

const Services = (): JSX.Element => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const deleteRow = useRef(false);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = React.useState<snackMessageProp>({
    message: '',
    severity: 'success',
  });
  const [promise, setPromise] = useState<unknown>();
  const [showRaw, setShowRaw] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, execute, resolve, reject, reset] = useAwaitableComponent();
  const [tableData, setTableData] = useState<ServiceDetails[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
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
          setSnack({
            message: 'Successfully fetched records',
            severity: 'success',
          });
        })
        .catch((err) => {
          setSnack({
            message:
              err.response.data.message ||
              'Unable to fetch records, Please try again!',
            severity: 'error',
          });
        });
      setOpen(true);
    };
    getServices();
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
              setSnack({
                message: 'Successfully deleted the service',
                severity: 'info',
              });
              tableData.splice(row.index, 1);
              setTableData([...tableData]);
            }
          })
          .catch((err) => {
            setSnack({
              message:
                err.response.data.message ||
                'Unable to delete the record, Please try again!',
              severity: 'error',
            });
          });
        setOpen(true);
      };
      deleteData();
    },
    [tableData]
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

  const handleCreateNewRow = (values: ServiceDetails): void => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<ServiceDetails>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        // send/receive api updates here, then refetch or update local table data for re-render
        setTableData([...tableData]);
        exitEditingMode(); // required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = (): void => {
    setValidationErrors({});
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
        accessorKey: 'clientCertificate',
        header: 'Client certificate',
        enableHiding: true,
      },
      {
        accessorKey: 'ca_certificates',
        header: 'CA certificates',
        enableHiding: true,
      },
      // {
      //   accessorKey: 'path',
      //   header: 'Path',
      //   // mantineEditTextInputProps: {
      //   //   select: true, //change to select for a dropdown
      //   //   children: states.map((state) => (
      //   //     <Menu.Item key={state} value={state}>
      //   //       {state}
      //   //     </Menu.Item>
      //   //   )),
      //   // },
      // },
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
        open={open}
        message={snack.message}
        severity={snack.severity}
        handleClose={() => {
          setOpen(false);
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
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
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
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
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

interface Props {
  columns: MRT_ColumnDef<ServiceDetails>[];
  onClose: () => void;
  onSubmit: (values: ServiceDetails) => void;
  open: boolean;
}

export default Services;
