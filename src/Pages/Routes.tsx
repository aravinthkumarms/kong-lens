import React, { useCallback, useMemo, useRef, useState } from 'react';
import MaterialReactTable, {
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
import { useNavigate, useParams } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE, GET } from '../Helpers/ApiHelpers';
import PageHeader from '../Components/Features/PageHeader';
import DialogModal from '../Components/Features/DialogModal';
import { BASE_API_URL } from '../Shared/constants';
import { snackMessageProp, RouteDetails, PageTypeProps } from '../interfaces';
import { RawView } from '../Components/Features/RawView';
import { SnackBarAlert } from '../Components/Features/SnackBarAlert';
import { TagComponent } from '../Components/Features/TagComponent';
import { CreateRoute } from '../Components/Features/CreateRoute';
import { updateValue } from '../Reducer/StoreReducer';

const Routes = ({ type }: PageTypeProps): JSX.Element => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const routeOpen = useSelector(
    (state: { reducer: { routeOpen: boolean } }) => state.reducer.routeOpen
  );
  const refreshRouteTable = useSelector(
    (state: { reducer: { refreshRouteTable: boolean } }) =>
      state.reducer.refreshRouteTable
  );
  const deleteRow = useRef(false);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = React.useState<snackMessageProp>({
    message: '',
    severity: 'success',
  });
  const [promise, setPromise] = useState<unknown>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, execute, resolve, reject, reset] = useAwaitableComponent();
  const [showRaw, setShowRaw] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  const [tableData, setTableData] = useState<RouteDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRoutes = async (): Promise<any> => {
    await GET({
      url:
        type === 'nested'
          ? `${BASE_API_URL}/services/${id}/routes`
          : `${BASE_API_URL}/routes/`,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then(async (response) => {
        if (response.status === 200) {
          // eslint-disable-next-line prefer-destructuring
          const data = response.data.data;
          const listKeys = ['protocols', 'paths'];
          await Promise.all(
            data.map(async (route: RouteDetails) => {
              const curRouteDetails: RouteDetails = route;
              await GET({
                url: `${BASE_API_URL}/services/${curRouteDetails.service.id}`,
                headers: { 'Access-Control-Allow-Origin': '*' },
              }).then((res) => {
                curRouteDetails.service = res.data;
                curRouteDetails.service_name = curRouteDetails.service.name;
              });
              listKeys.forEach(() => {
                if (typeof curRouteDetails.created_at === 'number') {
                  curRouteDetails.created_at = new Date(
                    curRouteDetails.created_at
                  ).toLocaleDateString();
                }
              });
            })
          );
          setTableData(data);
          for (let i = 0; i < data.length; i += 1) {
            showRaw.set(data[i].id, false);
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
      });
    setOpen(true);
  };
  React.useEffect(() => {
    setLoading(true);
    if (!routeOpen) getRoutes();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, routeOpen, refreshRouteTable]);

  const handleRawView = (key: string, value: boolean): void => {
    setShowRaw((map) => new Map(map.set(key, value)));
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
          url: `${BASE_API_URL}/routes/${row.original.id}`,
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
            navigate(`/routes/${cell.row.original.id}/`);
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
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {row.original.tags.map((tag: string) => (
              <TagComponent key={tag} tag={tag} isList={false} />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'service_name',
        header: 'Service',
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        size: 80,
      },
      {
        accessorKey: 'hosts',
        header: 'Host',
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {row.original.hosts.map((host: string, index: number) => (
              <div key={host}>
                <TagComponent
                  tag={
                    index !== row.original.hosts.length - 1 ? `${host},` : host
                  }
                  isList
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'paths',
        header: 'Paths',
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {row.original.paths.map((path: string, index: number) => (
              <div key={path}>
                <TagComponent
                  tag={
                    index !== row.original.paths.length - 1 ? `${path},` : path
                  }
                  isList
                />
              </div>
            ))}
          </div>
        ),
      },

      {
        accessorKey: 'protocols',
        header: 'Protocols',
        enableHiding: true,
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ row }) => (
          <div style={{ display: 'flex' }}>
            {row.original.protocols.map((protocol: string, index: number) => (
              <TagComponent
                key={protocol}
                tag={
                  index !== row.original.protocols.length - 1
                    ? `${protocol},`
                    : protocol
                }
                isList
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'regex_priority',
        header: 'Regex Priority',
        size: 80,
        enableHiding: true,
      },
    ],
    [navigate]
  );

  return (
    <>
      <Box>
        <CssBaseline />
        {type === 'separate' && (
          <PageHeader
            header="Routes"
            description="The Route entities defines rules to match client requests. Each Route is associated with a Service, and a Service may have multiple Routes associated to it. Every request matching a given Route will be proxied to its associated Service."
          />
        )}
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
              backgroundColor: '',
              color: '#1AAA9C',
              '&:hover': {
                backgroundColor: '#f8f8f8',
              },
            }}
            onClick={() => {
              type === 'separate'
                ? navigate(`/services`)
                : dispatch(updateValue({ type: 'modal', value: true }));
            }}
            variant="text"
          >
            {type === 'separate'
              ? 'YOU CAN ONLY CREATE ROUTES FROM A SERVICE PAGE'
              : 'ADD ROUTE'}
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
      <CreateRoute
        open={routeOpen}
        onClose={() => {
          dispatch(updateValue({ type: 'modal', value: false }));
          dispatch(updateValue({ type: 'refresh', value: true }));
        }}
      />
    </>
  );
};

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
  columns: MRT_ColumnDef<RouteDetails>[];
  onClose: () => void;
  onSubmit: (values: RouteDetails) => void;
  open: boolean;
}

export default Routes;
