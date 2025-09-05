'use client';

import { useState } from 'react';
import NoteList from '@/components/NoteList/NoteList';
import css from './page.module.css';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';

const Notes = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', debouncedQuery, page],
    queryFn: () => fetchNotes(page, debouncedQuery),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            currentPage={setPage}
          />
        )}
        <button onClick={() => setIsOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Notes;