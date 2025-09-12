import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from '../../src/components/core/BaseButton.vue'

describe('BaseButton.vue', () => {
    it('emits click event when clicked', async () => {
        const wrapper = mount(BaseButton)

        await wrapper.trigger('click')

        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('click')).toBeTruthy()
    })
})
