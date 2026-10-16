
export default function SearchBar({ search, setSearch, searchRef }) {
  return (
    <input
      ref={searchRef}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search courses..."
    />
  );
}
