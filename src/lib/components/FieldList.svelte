<script>
  import { writable } from 'svelte/store';
  import { fieldSelection } from '$lib/stores/fieldSelection';
  import { annotations } from '$lib/stores/annotations';
  import Fa from 'svelte-fa';
  import { faPlus, faTrash, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
  import { faEdit, faCopy, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

  const fields = writable([]);
  let newField = '';
  let showActionMenu = false;
  let actionMenuPosition = { x: 0, y: 0 };
  let selectedFieldForAction = null;

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

  function selectField(field, type) {
    fieldSelection.setField(field);
    fieldSelection.setType(type);
  }

  function showActions(event, field) {
    event.stopPropagation();
    selectedFieldForAction = field;
    const buttonRect = event.target.getBoundingClientRect();
    const menuWidth = 150; // Width of the menu
    const menuHeight = 144; // Height of menu with 3 items (48px each)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate horizontal position to ensure menu is visible
    let left = buttonRect.left;
    if (left + menuWidth > windowWidth) {
      // If menu would go off right edge, position it to the left of the button
      left = buttonRect.right - menuWidth;
    }

    // Calculate vertical position to ensure menu is visible
    let top = buttonRect.bottom;
    if (top + menuHeight > windowHeight) {
      // If menu would go off bottom edge, position it above the button
      top = buttonRect.top - menuHeight;
    }
    
    actionMenuPosition = {
      x: left,
      y: top
    };
    showActionMenu = true;
  }

  function handleActionClick(action) {
    if (action === 'edit') {
      // Implement edit functionality
      console.log('Edit field:', selectedFieldForAction);
    } else if (action === 'copy') {
      // Implement copy functionality
      console.log('Copy field:', selectedFieldForAction);
    } else if (action === 'delete') {
      removeField(selectedFieldForAction);
    }
    showActionMenu = false;
  }

  // Close action menu when clicking outside
  function handleClickOutside(event) {
    if (!event.target.closest('.action-menu') && !event.target.closest('.action-button')) {
      showActionMenu = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

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
      <div class="field-container">
        <button
          class="field-item"
          class:selected={$fieldSelection.selectedField === field && $fieldSelection.annotationType === 'label'}
          on:click={() => selectField(field, 'label')}
        >
          {field}
        </button>
        <input
          type="text"
          readonly
          class="text-box"
          class:selected={$fieldSelection.selectedField === field && $fieldSelection.annotationType === 'extract_data'}
          on:click={() => selectField(field, 'extract_data')}
        />
        <button class="action-button" on:click={(e) => showActions(e, field)}>
          <Fa icon={faEllipsisV} />
        </button>
      </div>
    {/each}
  </div>

  {#if showActionMenu}
    <div
      class="action-menu"
      style="left: {actionMenuPosition.x}px; top: {actionMenuPosition.y}px"
    >
      <button on:click={() => handleActionClick('edit')}>
        <Fa icon={faEdit} />
        Edit
      </button>
      <button on:click={() => handleActionClick('copy')}>
        <Fa icon={faCopy} />
        Copy
      </button>
      <button on:click={() => handleActionClick('delete')}>
        <Fa icon={faTrashAlt} />
        Delete
      </button>
    </div>
  {/if}
</div>

<style>
  .field-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button:hover {
    background: #f0f0f0;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .field-item {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .text-box {
    flex: 2;
    cursor: pointer;
  }

  .action-button {
    padding: 0.5rem;
    min-width: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .selected {
    background: #007bff;
    color: white;
    border-color: #0056b3;
  }

  .action-menu {
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    width: 150px;
  }

  .action-menu button {
    border: none;
    border-radius: 0;
    padding: 0.75rem 1rem;
    text-align: left;
    width: 100%;
    justify-content: flex-start;
  }

  .action-menu button:hover {
    background: #f0f0f0;
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    min-width: 2.5rem;
  }
</style> 