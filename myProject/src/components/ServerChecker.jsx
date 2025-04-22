
import useFetch from '../hooks/useFetch';

export default function ServerChecker() {
  const { data, error, loading, refetch } = useFetch(
    'https://api.test.com/status'
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data available</p>

  return (
    <div>
      <p>Server Status: {data.status}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
