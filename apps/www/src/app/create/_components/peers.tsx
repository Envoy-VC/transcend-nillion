'use client';

import * as React from 'react';

import { useCreateVaultStore } from '~/lib/stores';
import { truncate } from '~/lib/utils';

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

import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDown,
  MoreHorizontal,
} from 'lucide-react';

const data: PeerInfo[] = [
  {
    peerId: '12D3KooWFp53UrDJQSyiLT3imBEVhk6sq27RfLpDHa7UJm86GGCS',
    multiaddr: [],
  },
  {
    peerId: '12D3KooWPp3AuAB2nMXKHWqNxV48D5EezmL8Z1hwswy6bs8dwnPu',
    multiaddr: [],
  },
  {
    peerId: '12D3KooWRZ87ui1vwb4K13qhbKu7R6LPkgpUKaAqURQtp8vz8EjD',
    multiaddr: [],
  },
];

export interface PeerInfo {
  peerId: string;
  multiaddr: string[];
}

export const columns: ColumnDef<PeerInfo>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label='Select all'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label='Select row'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'peerId',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          PeerId
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{truncate(row.getValue('peerId'), 30)}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const peer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='h-8 w-8 p-0' variant='ghost'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(peer.peerId)}
            >
              Copy Peer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(peer.multiaddr.join(','))
              }
            >
              Copy Multiaddrs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const SelectPeers = () => {
  'use no memo';
  const { goToNextStep, goToPreviousStep } = useCreateVaultStore();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, onPaginationChange] = React.useState({
    pageIndex: 0,
    pageSize: 4,
  });

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
    onPaginationChange,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex flex-col'>
        <div className='mx-auto pt-4 text-center text-xl font-semibold text-neutral-700'>
          Select Peers for Threshold Configuration
        </div>

        <div className='flex items-center py-4'>
          <Input
            className='max-w-sm'
            placeholder='Filter peers...'
            value={
              (table.getColumn('peerId')?.getFilterValue() as
                | string
                | undefined) ?? ''
            }
            onChange={(event) =>
              table.getColumn('peerId')?.setFilterValue(event.target.value)
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
          <div className='flex-1 text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} peer(s) selected.
          </div>
          <div className='space-x-2'>
            <Button
              disabled={!table.getCanPreviousPage()}
              size='sm'
              variant='outline'
              onClick={() => table.previousPage()}
            >
              Previous Page
            </Button>
            <Button
              disabled={!table.getCanNextPage()}
              size='sm'
              variant='outline'
              onClick={() => table.nextPage()}
            >
              Next Page
            </Button>
          </div>
        </div>
      </div>
      <div className='flex w-full flex-row items-center gap-4'>
        <Button className='w-full' variant='outline' onClick={goToPreviousStep}>
          <ArrowLeftIcon className='mr-2 h-4 w-4' />
          Back
        </Button>
        <Button className='w-full' onClick={goToNextStep}>
          Next
          <ArrowRightIcon className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
