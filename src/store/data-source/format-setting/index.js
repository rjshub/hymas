import fetch from "@/services/fetch";

const state = {
    field_type_list: [
        {
            type: 'Text',
            icon: 'mas-text'
        },
        {
            type: 'Date&Time',
            icon: 'mas-date-and-time'
        },
        {
            type: 'Year',
            icon: 'mas-year'
        },
        {
            type: 'Month',
            icon: 'mas-month'
        },
        {
            type: 'Date',
            icon: 'mas-date'
        },
        {
            type: 'Time',
            icon: 'mas-time'
        },
        {
            type: 'Float',
            icon: 'mas-decimal'
        },
        {
            type: 'Int',
            icon: 'mas-integer'
        },
        {
            type: 'Percent',
            icon: 'mas-percent'
        },
        {
            type: 'Y/N',
            icon: 'mas-yes-or-no'
        }
    ],
    form_fields_list: [],
    format_create: false
}

const mutations = {
    UPDATE_FORM_FIELDS_LIST(state, value) {
        state.form_fields_list = value
    },
    UPDATE_FORMAT_CREATE(state, value) {
        state.format_create = value
    }
}

const actions = {
    update_form_fields_list({commit}, list) {
        commit('UPDATE_FORM_FIELDS_LIST', list)
    },
    update_format_create({commit}, value) {
        commit('UPDATE_FORMAT_CREATE', value)
    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };