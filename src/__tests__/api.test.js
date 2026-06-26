import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchData, loginUser, registerUser, forgotPassword, resetPassword, createEvent, updateEvent, deleteEvent, createPain, updatePain, deletePain, createMood, updateMood, deleteMood } from '../services/api';

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn();
});

describe('fetchData', () => {
  it('calls fetch with correct URL and headers', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'ok' }),
      headers: new Map([['content-type', 'application/json']]),
    });

    const result = await fetchData('/test');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(result).toEqual({ data: 'ok' });
  });

  it('attaches bearer token when present in localStorage', async () => {
    localStorage.setItem('authToken', 'fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
      headers: new Map([['content-type', 'application/json']]),
    });

    await fetchData('/test');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token',
        }),
      }),
    );
  });

  it('throws on non-ok response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Bad request' }),
    });

    await expect(fetchData('/test')).rejects.toThrow('Bad request');
  });

  it('returns null for non-json responses', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('not json'); },
      headers: new Map(),
    });

    const result = await fetchData('/test');
    expect(result).toBeNull();
  });
});

describe('API helpers', () => {
  const mockOk = () =>
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'token' }),
      headers: new Map([['content-type', 'application/json']]),
    });

  it('loginUser calls /users/login', async () => {
    mockOk();
    await loginUser({ email: 'a@b.com', password: '123' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/users/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('registerUser calls /users/signup', async () => {
    mockOk();
    await registerUser({ username: 'u', email: 'a@b.com', password: '123' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/users/signup',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('forgotPassword calls /users/forgot-password', async () => {
    mockOk();
    await forgotPassword('a@b.com');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/users/forgot-password',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('resetPassword calls /users/reset-password', async () => {
    mockOk();
    await resetPassword({ token: 't', password: '123' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/users/reset-password',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('createEvent calls POST /events', async () => {
    mockOk();
    await createEvent({ title: 'e', category: 'other', occurred_at: '2024-01-01' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/events',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('updateEvent calls PATCH /events/:id', async () => {
    mockOk();
    await updateEvent('abc', { title: 'e' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/events/abc',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('deleteEvent calls DELETE /events/:id', async () => {
    mockOk();
    await deleteEvent('abc');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/events/abc',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('createPain calls POST /pains', async () => {
    mockOk();
    await createPain({ value: 5, location: 'head', occurred_at: '2024-01-01' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/pains',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('updatePain calls PATCH /pains/:id', async () => {
    mockOk();
    await updatePain('abc', { value: 5 });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/pains/abc',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('deletePain calls DELETE /pains/:id', async () => {
    mockOk();
    await deletePain('abc');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/pains/abc',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('createMood calls POST /moods', async () => {
    mockOk();
    await createMood({ value: 7, occurred_at: '2024-01-01' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/moods',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('updateMood calls PATCH /moods/:id', async () => {
    mockOk();
    await updateMood('abc', { value: 7 });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/moods/abc',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('deleteMood calls DELETE /moods/:id', async () => {
    mockOk();
    await deleteMood('abc');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/moods/abc',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
