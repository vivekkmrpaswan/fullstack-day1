/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { renderHook,act} from '@testing-library/react';
import useFetch from '../hooks/useFetch.js';


global.fetch = vi.fn();

beforeEach(() => {
  sessionStorage.clear();
  fetch.mockReset();
});

test('uses cache within TTL', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ msg: 'hello' }),
  });

  const { result, waitForNextUpdate } = renderHook(() =>
    useFetch('https://api.example.com/test')
  );

  await waitForNextUpdate();
  expect(result.current.data).toEqual({ msg: 'hello' });

  fetch.mockClear();

  const { result: secondResult, waitForNextUpdate: secondUpdate } = renderHook(() =>
    useFetch('https://api.example.com/test')
  );

  await secondUpdate();
  expect(fetch).not.toHaveBeenCalled();
  expect(secondResult.current.data).toEqual({ msg: 'hello' });
});
