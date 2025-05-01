<script>
  import { writable } from 'svelte/store';
  import { fieldSelection } from '$lib/stores/fieldSelection';
  import { annotations } from '$lib/stores/annotations';
  import Fa from 'svelte-fa';
  import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

  const fields = writable([]);
  let newField = '';

  function addField() {
    if (newField.trim()) {
      const fieldName = newField.trim();
      fields.update(f => [...f, fieldName]);
      newField = '';
      // Automatically select the new field and set annotation type to label
      fieldSelection.setField(fieldName);
      fieldSelection.setType('label');
    }
  }

  function removeField(field) {
    // First remove all annotations associated with this field
    const annotationsToRemove = $annotations.filter(annotation => annotation.fieldName === field);
    annotationsToRemove.forEach(annotation => {
      annotations.remove(annotation.id);
    });
    
    // Then update the fields list
    fields.update(f => f.filter(f => f !== field));
    
    // Finally clear selection if this was the selected field
    if ($fieldSelection.selectedField === field) {
      fieldSelection.clear();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      addField();
    }
  }

  function selectField(field) {
    fieldSelection.setField(field);
  }

  function setAnnotationType(type) {
    fieldSelection.setType(type);
  }
</script>

<div class="field-list">
  <h2>Fields of Interest</h2>
  
  <div class="add-field">
    <input
      type="text"
      bind:value={newField}
      on:keydown={handleKeydown}
      placeholder="Enter field name"
    />
    <button on:click={addField} class="icon-button">
      <Fa icon={faPlus} />
    </button>
  </div>

  <div class="fields">
    {#each $fields as field}
      <div class="field-item">
        <button
          class:selected={$fieldSelection.selectedField === field}
          on:click={() => selectField(field)}
        >
          {field}
        </button>
        <button class="remove icon-button" on:click={() => removeField(field)}>
          <Fa icon={faTrash} />
        </button>
      </div>
    {/each}
  </div>

  {#if $fieldSelection.selectedField}
    <div class="annotation-type">
      <h3>Annotation Type</h3>
      <div class="type-buttons">
        <button
          class:selected={$fieldSelection.annotationType === 'label'}
          on:click={() => setAnnotationType('label')}
        >
          Label
        </button>
        <button
          class:selected={$fieldSelection.annotationType === 'extract_data'}
          on:click={() => setAnnotationType('extract_data')}
        >
          Extract Data
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .field-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .add-field {
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  button:hover {
    background: #f0f0f0;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .field-item button {
    flex: 1;
    text-align: left;
  }

  .remove {
    padding: 0.5rem;
    color: #ff0000;
  }

  .selected {
    background: #007bff;
    color: white;
    border-color: #0056b3;
  }

  .annotation-type {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ccc;
  }

  .type-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    min-width: 2.5rem;
  }

  .remove:hover {
    background: #ffebee;
  }
</style> 