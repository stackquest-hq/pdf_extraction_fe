<script>
    import { annotations } from '$lib/stores/annotations';
    import { writable } from 'svelte/store';

    let newFieldName = '';
    let tableFields = writable([]);

    function addTableField() {
        if (newFieldName.trim()) {
            $tableFields = [...$tableFields, {
                id: crypto.randomUUID(),
                name: newFieldName.trim(),
                type: 'table_header'
            }];
            newFieldName = '';
        }
    }

    function removeTableField(id) {
        $tableFields = $tableFields.filter(field => field.id !== id);
    }
</script>

<div class="table-extraction">
    <div class="field-input">
        <input
            type="text"
            bind:value={newFieldName}
            placeholder="Enter table field name"
            on:keydown={(e) => e.key === 'Enter' && addTableField()}
        />
        <button on:click={addTableField}>Add Field</button>
    </div>

    <div class="table-fields">
        {#each $tableFields as field (field.id)}
            <div class="table-field">
                <span>{field.name}</span>
                <button on:click={() => removeTableField(field.id)}>Remove</button>
            </div>
        {/each}
    </div>
</div>

<style>
    .table-extraction {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .field-input {
        display: flex;
        gap: 0.5rem;
    }

    .field-input input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .field-input button {
        padding: 0.5rem 1rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .table-fields {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .table-field {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: #f5f5f5;
        border-radius: 4px;
    }

    .table-field button {
        padding: 0.25rem 0.5rem;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style> 