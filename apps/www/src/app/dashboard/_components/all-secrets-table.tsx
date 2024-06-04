'use client';

import Link from 'next/link';

import * as React from 'react';

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
import { TextCopy } from '~/components';

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

import { ArrowUpDown, ExternalLink } from 'lucide-react';

const data: Secret[] = [
  {
    path: 'redis-env',
    storeId: '225d367b-b2f7-4694-bbed-4482da47b21c',
  },
  {
    path: 'openai-keys',
    storeId: '06c90244-c6a0-4c16-9d8e-5e0ba3cdae7f',
  },
];

export interface Secret {
  path: string;
  storeId: string;
}

export const columns: ColumnDef<Secret>[] = [
  {
    accessorKey: 'path',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Path
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('path')}</div>,
  },
  {
    accessorKey: 'storeId',
    header: 'Store ID',
    cell: ({ row }) => {
      'use no memo';
      const secret = row.original;
      return <TextCopy enableToast={false} text={secret.storeId} />;
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const secret = row.original;
      return (
        <Button asChild className='h-8 w-8 p-0' variant='ghost'>
          <Link href={`/dashboard/engine/secret/${secret.path}`}>
            <ExternalLink className='h-4 w-4' />
          </Link>
        </Button>
      );
    },
  },
];

export const AllSecretsTable = () => {
  'use no memo';
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
          placeholder='Filter by Path...'
          value={table.getColumn('path')?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn('path')?.setFilterValue(event.target.value)
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
