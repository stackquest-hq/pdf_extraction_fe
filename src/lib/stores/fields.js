import { writable } from 'svelte/store';

function createFieldsStore() {
    const { subscribe, set, update } = writable({
        regularFields: [],
        tableFields: []
    });

    return {
        subscribe,
        addRegularField: (field) => update(state => ({
            ...state,
            regularFields: [...state.regularFields, field]
        })),
        addTableField: (field) => update(state => ({
            ...state,
            tableFields: [...state.tableFields, field]
        })),
        removeRegularField: (field) => update(state => ({
            ...state,
            regularFields: state.regularFields.filter(f => f !== field)
        })),
        removeTableField: (field) => update(state => ({
            ...state,
            tableFields: state.tableFields.filter(f => f !== field)
        })),
        clear: () => set({ regularFields: [], tableFields: [] })
    };
}

export const fields = createFieldsStore(); 