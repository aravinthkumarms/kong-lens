import React, { useCallback, useMemo, useRef, useState } from 'react';
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { ActionIcon, TextInput } from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons-react';
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
import { DELETE, GET } from '../Helpers/ApiHelpers';
import { Service } from '../Mocks/Service.mock';
import PageHeader from '../Components/Features/PageHeader';
import DialogModal from '../Components/Features/DialogModal';
import { BASE_API_URL } from '../Shared/constants';
import { snackProp } from '../Components/Features/ServiceEditor';
import { SnackBarAlert } from '../Components/Features/SnackBarAlert';
// export type Service = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   age: number;
//   state: string;
// };

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
  const [snack, setSnack] = React.useState<snackProp>({
    message: '',
    severity: 'success',
  });
  const [promise, setPromise] = useState<unknown>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, execute, resolve, reject, reset] = useAwaitableComponent();
  const [tableData, setTableData] = useState<Service[]>([]);
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
            setTableData(response.data.data);
          }
          setSnack({
            message: 'Successfully fetched records',
            severity: 'success',
          });
        })
        .catch((err) => {
          setSnack({
            message: 'Unable to fetch records, Please try again!',
            severity: 'error',
          });
        });
      setOpen(true);
    };
    getServices();
  }, []);

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Service>) => {
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
            if (response.status === 202) {
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
              message: err.response.data.message,
              severity: 'info',
            });
          });
        setOpen(true);
      };
      deleteData();
    },
    [tableData]
  );

  const handleAwaitModal = async (row: MRT_Row<Service>): Promise<void> => {
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

  const handleCreateNewRow = (values: Service): void => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<Service>['onEditingRowSave'] =
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

  const validateRequired = (value: string): boolean => !!value.length;
  const validateEmail = (email: string): boolean | unknown =>
    !!email.length &&
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  const validateAge = (age: number): boolean => age >= 18 && age <= 50;

  const getCommonEditTextInputProps = useCallback(
    (
      cell: MRT_Cell<Service>
    ): MRT_ColumnDef<Service>['muiTableBodyCellEditTextFieldProps'] => ({
      onBlur: (event) => {
        const isValid =
          // eslint-disable-next-line no-nested-ternary
          cell.column.id === 'email'
            ? validateEmail(event.target.value)
            : cell.column.id === 'age'
            ? validateAge(+event.target.value)
            : validateRequired(event.target.value);
        if (!isValid) {
          // set validation error for cell if invalid
          setValidationErrors({
            ...validationErrors,
            [cell.id]: `${cell.column.columnDef.header} is required`,
          });
        } else {
          // remove validation error for cell if valid
          delete validationErrors[cell.id];
          setValidationErrors({
            ...validationErrors,
          });
        }
      },
    }),
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<Service>[]>(
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
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'protocol',
        header: 'Protocol',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'host',
        header: 'Host',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'port',
        header: 'Port',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'path',
        header: 'Path',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: 'retries',
        header: 'Retries',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'read_timeout',
        header: 'Read Timeout',
        size: 80,
        enableHiding: true,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'write_timeout',
        header: 'Write Timeout',
        size: 80,
        enableHiding: true,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'connect_timeout',
        header: 'Connect Timeout',
        size: 80,
        enableHiding: true,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
          type: 'number',
        }),
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
    [getCommonEditTextInputProps, navigate]
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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Tooltip arrow placement="left" title="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <ActionIcon
                color="red"
                onClick={() => {
                  handleAwaitModal(row);
                }}
              >
                <IconTrash />
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
  columns: MRT_ColumnDef<Service>[];
  onClose: () => void;
  onSubmit: (values: Service) => void;
  open: boolean;
}

export default Services;
