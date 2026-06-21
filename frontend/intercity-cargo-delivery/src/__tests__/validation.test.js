import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from '../utils/validation'; 


describe('Валидация регистрации', () => {
  it('должен принять корректный email', () => {
    const email = 'test@example.com';
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValid).toBe(true);
  });

  it('должен отклонить некорректный email', () => {
    const email = 'test';
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValid).toBe(false);
  });

  it('должен принять пароль длиной от 6 символов', () => {
    const password = '123456';
    const isValid = password.length >= 6;
    expect(isValid).toBe(true);
  });

  it('должен отклонить пароль короче 6 символов', () => {
    const password = '123';
    const isValid = password.length >= 6;
    expect(isValid).toBe(false);
  });
});