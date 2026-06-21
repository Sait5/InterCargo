import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginForm from '../pages/Login.vue';

describe('Логин', () => {
  it('после успешного логина должен быть редирект', async () => {
    const mockRouter = { push: vi.fn() };
    const wrapper = mount(LoginForm, {
      global: { mocks: { $router: mockRouter } }
    });
    
    await wrapper.find('input[type="email"]').setValue('test@test.com');
    await wrapper.find('input[type="password"]').setValue('123456');
    await wrapper.find('form').trigger('submit');
    
    expect(mockRouter.push).toHaveBeenCalled();
  });

  it('должен показать ошибку при неверных данных', async () => {
    const wrapper = mount(LoginForm);
    
    await wrapper.find('input[type="email"]').setValue('wrong@test.com');
    await wrapper.find('input[type="password"]').setValue('wrongpass');
    await wrapper.find('form').trigger('submit');
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.text()).toContain('Неверный email или пароль');
  });
});