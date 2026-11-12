import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import OfferForm from '@/components/OfferForm.vue';

const mountForm = () => mount(OfferForm, {
  global: { plugins: [createPinia()], stubs: { RouterLink: { template: '<a><slot /></a>' } } },
});

describe('Форма заявки', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('не отправляет пустую форму и показывает ошибки', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const wrapper = mountForm();
    await wrapper.find('form').trigger('submit');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Укажите имя');
    expect(wrapper.text()).toContain('Нужен номер из 11 цифр');
  });

  it('форматирует телефон по маске', async () => {
    const wrapper = mountForm();
    const phone = wrapper.find('input[type="tel"]');
    await phone.setValue('89991234567');
    expect(phone.element.value).toBe('+7 (999) 123-45-67');
  });

  it('отправляет корректную заявку и очищает форму', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'ok' }), { status: 200 }));
    const wrapper = mountForm();
    await wrapper.find('input[type="text"]').setValue('Анна');
    await wrapper.find('input[type="tel"]').setValue('79991234567');
    await wrapper.find('form').trigger('submit');
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchMock).toHaveBeenCalledOnce();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({ name: 'Анна', phone: '+7 (999) 123-45-67' });
    expect(wrapper.find('input[type="text"]').element.value).toBe('');
  });
});
