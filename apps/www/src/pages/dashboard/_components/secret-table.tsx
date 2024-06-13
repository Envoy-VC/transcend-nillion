/* eslint-disable react-hooks/rules-of-hooks -- safe */
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

import { useNillion, useOrbitDB } from '~/lib/hooks';
import { errorHandler } from '~/lib/utils';

import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { ArrowUpDown, Eye, EyeOff } from 'lucide-react';

interface Secret {
  name: string;
  value: string | number | null;
  hidden: boolean;
}

const columns: ColumnDef<Secret>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Secret Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'value',
    header: 'Secret Value',
    cell: ({ row }) => {
      const secret = row.original;
      const { client, retrieveSecret } = useNillion();
      const [searchParams] = useSearchParams();
      const [value, setValue] = React.useState<string | null>(null);

      const onReveal = async () => {
        try {
          if (!value) {
            const type = typeof secret.value === 'string' ? 'string' : 'number';
            const storeID = searchParams.get('storeID');
            if (!storeID) {
              throw new Error('Store ID not found.');
            }
            if (!client) {
              throw new Error('Nillion client not found.');
            }
            const retrieved = await retrieveSecret(
              client,
              storeID,
              secret.name,
              type
            );
            setValue(retrieved);
            console.log(retrieved);
          } else {
            setValue(null);
          }
        } catch (error) {
          toast.error(errorHandler(error));
        }
      };
      return (
        <div className='flex w-full flex-row items-center gap-2'>
          {!value ? <div>{'*'.repeat(24)}</div> : <div>{value}</div>}
          <Button className='h-8 w-8 p-0' variant='ghost' onClick={onReveal}>
            {!value ? <Eye /> : <EyeOff size={18} />}
          </Button>
        </div>
      );
    },
  },
];

export const SecretsTable = ({ id }: { id: string }) => {
  const { getOne } = useOrbitDB();
  const { client } = useNillion();
  const { data } = useQuery({
    queryKey: ['secret', id],
    initialData: [],
    queryFn: async () => {
      const res = await getOne(id);
      const secrets: Secret[] = [];
      res.value.names.forEach((name) => {
        secrets.push({
          name,
          value: null,
          hidden: true,
        });
      });
      return secrets;
    },
    enabled: Boolean(client),
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          className='max-w-sm'
          placeholder='Filter by Name...'
          value={table.getColumn('name')?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className='h-24 text-center'
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='space-x-2'>
          <Button
            disabled={!table.getCanPreviousPage()}
            size='sm'
            variant='outline'
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            size='sm'
            variant='outline'
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
