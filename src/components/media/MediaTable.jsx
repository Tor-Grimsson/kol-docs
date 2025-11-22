import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

const statusTone = {
  Approved: 'text-fg-64',
  'In review': 'text-accent-primary',
  Draft: 'text-fg-48'
}

const MediaTable = ({ data }) => {
  const [sorting, setSorting] = useState([{ id: 'updatedAt', desc: true }])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Asset',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="wiki-media-thumb" aria-hidden="true">
              <img src={row.original.src} alt="" loading="lazy" />
            </div>
            <div>
              <p className="text-sm font-medium text-fg-96">{row.original.name}</p>
              <p className="text-xs text-fg-56">{row.original.tags.join(', ')}</p>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => <span className="text-sm text-fg-72">{info.getValue()}</span>
      },
      {
        accessorKey: 'size',
        header: 'Size',
        cell: (info) => <span className="text-sm text-fg-72">{info.getValue()}</span>
      },
      {
        accessorKey: 'dimensions',
        header: 'Dimensions',
        cell: (info) => <span className="text-sm text-fg-72">{info.getValue()}</span>
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: (info) => <span className="text-sm text-fg-72">{info.getValue()}</span>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => (
          <span className={`text-xs uppercase tracking-[0.18em] ${statusTone[info.getValue()] || 'text-fg-56'}`}>
            {info.getValue()}
          </span>
        )
      },
      {
        accessorKey: 'author',
        header: 'Owner',
        cell: (info) => <span className="text-sm text-fg-72">{info.getValue()}</span>
      }
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <div className="wiki-media-table">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className="wiki-table-header"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '↑',
                        desc: '↓'
                      }[header.column.getIsSorted()] || <span className="opacity-30">↕</span>}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MediaTable
