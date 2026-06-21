import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import RegisterForm from '../pages/Register.vue'; 

describe('Компонент регистрации', () => {
  it('должен отображать форму', () => {
    const wrapper = mount(RegisterForm);
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('должен показывать ошибку при пустом email', async () => {
    const wrapper = mount(RegisterForm);
    await wrapper.find('form').trigger('submit');
    expect(wrapper.text()).toContain('Введите email');
  });
});