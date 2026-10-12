import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginatedListProps<T> = {
  items: T[];
  children: (pageItems: T[], firstItemIndex: number) => ReactNode;
  initialPageSize?: number;
};

export function PaginatedList<T>({ items, children, initialPageSize = 10 }: PaginatedListProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const visiblePage = Math.min(page, pageCount);
  const firstItemIndex = (visiblePage - 1) * pageSize;

  useEffect(() => {
    if (page !== visiblePage) setPage(visiblePage);
  }, [page, visiblePage]);

  return <>
    {children(items.slice(firstItemIndex, firstItemIndex + pageSize), firstItemIndex)}
    {items.length > initialPageSize && <nav className="data-pagination" aria-label="Paginación de resultados">
      <span className="data-pagination-summary">{firstItemIndex + 1}-{Math.min(firstItemIndex + pageSize, items.length)} de {items.length}</span>
      <label className="data-pagination-size">Filas
        <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} aria-label="Filas por página">
          {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
      <button type="button" className="data-pagination-button" onClick={() => setPage(visiblePage - 1)} disabled={visiblePage <= 1} aria-label="Página anterior" title="Página anterior"><ChevronLeft size={17} /></button>
      <span className="data-pagination-page">{visiblePage} / {pageCount}</span>
      <button type="button" className="data-pagination-button" onClick={() => setPage(visiblePage + 1)} disabled={visiblePage >= pageCount} aria-label="Página siguiente" title="Página siguiente"><ChevronRight size={17} /></button>
    </nav>}
  </>;
}