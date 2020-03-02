import Vue from 'vue';
import {mount} from '@vue/test-utils';
import matrixEffect from "pages/randomSelect/matrixEffect";
import {expect} from 'chai';

describe('matrixEffect.vue', () => {
  it('props is valid', () => {
    let wrapper = mount(matrixEffect);
    wrapper.find('button').trigger('click');
  })
});
