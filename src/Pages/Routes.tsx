import React, { useCallback, useMemo, useRef, useState } from 'react';
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { ActionIcon, TextInput } from '@mantine/core';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import useAwaitableComponent from 'use-awaitable-component';
import { useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import { DELETE, GET } from '../Helpers/ApiHelpers';
import { Service } from '../Mocks/Service.mock';
import PageHeader from '../Components/Features/PageHeader';
import DialogModal from '../Components/Features/DialogModal';
import { BASE_API_URL } from '../Shared/constants';
import { snackMessageProp, RouteDetails } from '../interfaces';
import { RawView } from '../Components/Features/RawView';
import { SnackBarAlert } from '../Components/Features/SnackBarAlert';

const Routes = (): JSX.Element => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const deleteRow = useRef(false);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = React.useState<snackMessageProp>({
    message: '',
    severity: 'success',
  });
  const [promise, setPromise] = useState<unknown>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, execute, resolve, reject, reset] = useAwaitableComponent();
  const [showRaw, setShowRaw] = useState(false);

  const getService = async (id: string) => {
    let service = {};
    await GET({
      url: `${BASE_API_URL}/services/${id}`,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((response) => {
        service = response.data;
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
    return service;
  };

  const [tableData, setTableData] = useState<RouteDetails[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getRoutes = async () => {
      await Promise.allSettled([
        GET({
          url: `${BASE_API_URL}/routes/`,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            if (response.status === 200) {
              // eslint-disable-next-line prefer-destructuring
              const data = response.data.data;
              const listKeys = ['protocols', 'tags', 'paths'];
              for (let i = 0; i < data.length; i += 1) {
                const curRouteDetails: RouteDetails | any = data[i];
                GET({
                  url: `${BASE_API_URL}/services/${curRouteDetails.service.id}`,
                  headers: { 'Access-Control-Allow-Origin': '*' },
                }).then((res) => {
                  curRouteDetails.service = res.data;
                  curRouteDetails.service_name = curRouteDetails.service.name;
                });
                listKeys.forEach((key) => {
                  const list =
                    curRouteDetails[key as keyof typeof curRouteDetails];
                  if (list !== null && list !== undefined) {
                    curRouteDetails[key as keyof typeof curRouteDetails] =
                      list.toString();
                    if (typeof curRouteDetails.created_at === 'number') {
                      curRouteDetails.created_at = new Date(
                        curRouteDetails.created_at
                      ).toLocaleDateString();
                    }
                  }
                });
              }
              setTableData(data);
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
          }),
      ]);
      setOpen(true);
    };
    getRoutes();
    setLoading(false);
  }, [loading]);

  const handleRawView = () => {
    setShowRaw((prev) => !prev);
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row<RouteDetails>) => {
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

  const handleAwaitModal = async (
    row: MRT_Row<RouteDetails>
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

  const handleCreateNewRow = (values: RouteDetails): void => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<RouteDetails>['onEditingRowSave'] =
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
  console.log(tableData);
  const columns = useMemo<MRT_ColumnDef<RouteDetails>[]>(
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
        header: 'Name',
        size: 140,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            navigate(`/routes/${cell.row.original.id}/read`);
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
      },
      {
        accessorKey: 'service.name',
        header: 'Service Name',
      },
      {
        accessorKey: 'hosts',
        header: 'Host',
        size: 140,
      },
      {
        accessorKey: 'paths',
        header: 'Paths',
        size: 80,
      },

      // {
      //   accessorKey: 'headers',
      //   header: 'Headers',
      //   size: 80,
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextInputProps(handleListToString(cell)),
      //     type: 'text',
      //   }),
      // },
      {
        accessorKey: 'protocols',
        header: 'Protocols',
        size: 80,
        enableHiding: true,
      },
      {
        accessorKey: 'regex_priority',
        header: 'Regex Priority',
        size: 80,
        enableHiding: true,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        size: 80,
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
          header="Routes"
          description="The Route entities defines rules to match client requests. Each Route is associated with a Service, and a Service may have multiple Routes associated to it. Every request matching a given Route will be proxied to its associated Service."
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
          <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Tooltip arrow placement="left" title="Raw">
              <>
                <VisibilityIcon
                  key={0}
                  sx={{ cursor: 'pointer' }}
                  onClick={handleRawView}
                />
                {/* <RawView
                  id={row.original.id}
                  open={showRaw}
                  onClose={handleRawView}
                  useCase="routes"
                /> */}
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
              backgroundColor: '',
              color: '#1AAA9C',
              '&:hover': {
                backgroundColor: '#f8f8f8',
              },
            }}
            onClick={() => {
              navigate(`/services`);
            }}
            variant="text"
          >
            YOU CAN ONLY CREATE ROUTES FROM A SERVICE PAGE
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

interface Props {
  columns: MRT_ColumnDef<Service>[];
  onClose: () => void;
  onSubmit: (values: Service) => void;
  open: boolean;
}

export default Routes;
