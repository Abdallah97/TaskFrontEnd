// pages/index.spec.js

import { mount } from '@vue/test-utils'
import Index from '@/pages/index.vue'

describe('Index', () => {
  test('emits the selected category and subcategory when the form is submitted', async () => {
    const wrapper = mount(Index)
    const categorySelect = wrapper.find('#category-select')
    const subcategorySelect = wrapper.find('#subcategory-select')

    await categorySelect.setValue(1)
    await subcategorySelect.setValue(13)

   
    await wrapper.find('form').trigger('submit')

    // make sure that the data was submitted correctly
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      catId: 1,
      subCatId: 13,
      properties: [
        { id: 1, name: 'Process Type', value: null },
        { id: 2, name: 'Brand', value: '73' },
        { id: 6, name: 'Transmission Type', value: null },
        { id: 7, name: 'Fuel Type', value: null },
        { id: 8, name: 'Condition', value: null },
        { id: 9, name: 'Color', value: null },
        { id: 10, name: 'Odometer', value: null },
        { id: 11, name: 'Odometer Unit', value: null },
        { id: 12, name: 'Cylinders', value: null },
        { id: 13, name: 'Drive', value: null },
        { id: 14, name: 'VIN #', value: null },
        { id: 16, name: 'Year', value: null },
        { id: 505, name: 'Country Made', value: null }
      ],
      subProperties: [
        {
          name: 'Model',
          slug: 'model',
          options: [
            { id: 38587, name: 'A1', slug: 'a1', parent: 665, child: false },
            { id: 38588, name: 'A2', slug: 'a2', parent: 665, child: false },
            { id: 38589, name: 'A2SL', slug: 'a2sl', parent: 665, child: false },
            { id: 38590, name: 'A8', slug: 'a8', parent: 665, child: false },
            { id: 59257, name: 'STC-16', slug: 'stc-16', parent: 665, child: false },
            { id: 59258, name: 'SV-1600', slug: 'sv-1600', parent: 665, child: false },
            { id: 59259, name: 'Böcek', slug: 'bocek', parent: 665, child: false },
            { id: 59260, name: 'P2 Otosan 500 pick-up', slug: 'p2-otosan-500-pick-up', parent: 665, child: false }
          ],
          id: 665,
          value: null
        }
      ]
    })
  })

  })
