# fullstack-day1
## useFetch Hook

A React hook that fetches and caches GET requests for 5 minutes using `sessionStorage`.

### Usage

```jsx
import useFetch from './hooks/useFetch';

const { data, error, loading, refetch } = useFetch('https://api.test.com/info');

TTL Explanation
The cache is valid for 5 * 60 * 1000 milliseconds (5 minutes). If called again within this period, the response is returned from cache without a network request. After 5 minutes, a fresh request is triggered automatically.