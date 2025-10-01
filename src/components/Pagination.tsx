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
            {/* Botões ajustados para tema escuro */}
            <button
                onClick={() => handlePageClick(1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
                &laquo;
            </button>
            
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => handlePageClick(number)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded font-bold ${
                        currentPage === number
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={() => handlePageClick(totalPages)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
                &raquo;
            </button>
        </nav>
    );
}