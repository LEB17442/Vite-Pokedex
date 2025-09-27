interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  const pageNumbers = [];
  const pagesToShow = 2; 

  let startPage = Math.max(1, currentPage - pagesToShow);
  let endPage = Math.min(totalPages, currentPage + pagesToShow);

  if (currentPage <= pagesToShow) {
    endPage = Math.min(totalPages, pagesToShow * 2 + 1);
  }
  if (currentPage + pagesToShow >= totalPages) {
    startPage = Math.max(1, totalPages - pagesToShow * 2);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (page: number) => {
    if (page === currentPage || isLoading) return;
    onPageChange(page);
  };

  return (
    <nav className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1 || isLoading}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        &laquo; Primeira
      </button>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Anterior
      </button>

      {startPage > 1 && <span className="px-4 py-2">...</span>}

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => handlePageClick(number)}
          disabled={isLoading}
          className={`px-4 py-2 rounded ${
            currentPage === number
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && <span className="px-4 py-2">...</span>}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Próxima
      </button>
      <button
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Última &raquo;
      </button>
    </nav>
  );
}