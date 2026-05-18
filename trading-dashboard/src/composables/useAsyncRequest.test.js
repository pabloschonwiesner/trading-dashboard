import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAsyncRequest } from './useAsyncRequest';

describe("useAsyncRequest composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    //ARRANGE & ACT
    const { data, error, loading } = useAsyncRequest(() => {});

    //ASSERT
    expect(data.value).toBeNull();
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it('should set loading to true during execution', async () => {
    //ARRANGE
    let loadingDuringExecution = null;
    
    const mockFn = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'result';
    });

    const { loading, execute } = useAsyncRequest(mockFn);

    //ACT
    const promise = execute();
    loadingDuringExecution = loading.value;
    await promise;

    //ASSERT
    expect(loadingDuringExecution).toBe(true);
    expect(loading.value).toBe(false);
  });

  it('should set data on successful execution', async () => {
    //ARRANGE
    const mockData = { id: 1, name: 'Test' };
    const mockFn = vi.fn(async () => mockData);

    const { data, error, loading, execute } = useAsyncRequest(mockFn);

    //ACT
    await execute();

    //ASSERT
    expect(data.value).toEqual(mockData);
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should set error on failed execution', async () => {
    //ARRANGE
    const mockError = new Error('Request failed');
    const mockFn = vi.fn(async () => {
      throw mockError;
    });

    const { data, error, loading, execute } = useAsyncRequest(mockFn);

    //ACT & ASSERT
    await expect(execute()).rejects.toThrow('Request failed');
    
    expect(data.value).toBeNull();
    expect(error.value).toBe(mockError);
    expect(loading.value).toBe(false);
  });

  it('should clear previous error on new execution', async () => {
    //ARRANGE
    const mockError = new Error('First error');
    const mockFn = vi.fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce('success');

    const { error, execute } = useAsyncRequest(mockFn);

    //ACT
    try {
      await execute();
    } catch (e) {}
    
    expect(error.value).toBe(mockError);

    await execute();

    //ASSERT
    expect(error.value).toBeNull();
  });

  it('should pass arguments to request function', async () => {
    //ARRANGE
    const mockFn = vi.fn(async (a, b, c) => `${a}-${b}-${c}`);
    const { execute } = useAsyncRequest(mockFn);

    //ACT
    const result = await execute('arg1', 'arg2', 'arg3');

    //ASSERT
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    expect(result).toBe('arg1-arg2-arg3');
  });

  it('should return result from execute', async () => {
    //ARRANGE
    const mockData = { success: true };
    const mockFn = vi.fn(async () => mockData);
    const { execute } = useAsyncRequest(mockFn);

    //ACT
    const result = await execute();

    //ASSERT
    expect(result).toEqual(mockData);
  });

  it('should handle multiple sequential executions', async () => {
    //ARRANGE
    const mockFn = vi.fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')
      .mockResolvedValueOnce('third');

    const { data, execute } = useAsyncRequest(mockFn);

    //ACT & ASSERT
    await execute();
    expect(data.value).toBe('first');

    await execute();
    expect(data.value).toBe('second');

    await execute();
    expect(data.value).toBe('third');

    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});