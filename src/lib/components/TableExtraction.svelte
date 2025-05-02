<script>
  import { annotations } from "$lib/stores/annotations";
  import { fieldSelection } from "$lib/stores/fieldSelection";
  import { fields } from "$lib/stores/fields";

  let newFieldName = "";
  let activeMenu = null;

  function addTableField() {
    if (newFieldName.trim()) {
      const fieldName = newFieldName.trim();
      fields.addTableField(fieldName);
      // Automatically select the new field for annotation
      fieldSelection.setField(fieldName);
      fieldSelection.setType("table_header");
      newFieldName = "";
    }
  }

  function removeTableField(field) {
    // Remove all annotations associated with this field
    annotations.removeByField(field, "table_header");

    // Then update the fields list
    fields.removeTableField(field);

    // Finally clear selection if this was the selected field
    if ($fieldSelection.selectedField === field) {
      fieldSelection.setField("");
    }
    activeMenu = null;
  }

  function selectFieldForAnnotation(field) {
    fieldSelection.setField(field);
    fieldSelection.setType("table_header");
    activeMenu = null;
  }

  function toggleMenu(field, event) {
    event.stopPropagation(); // Prevent triggering the column click
    activeMenu = activeMenu === field ? null : field;
  }

  // Close menu when clicking outside
  function handleClickOutside(event) {
    if (!event.target.closest(".menu-container")) {
      activeMenu = null;
    }
  }

  // Initialize fields from existing annotations
  $: {
    const existingFields = $annotations
      .filter((annotation) => annotation.type === "table_header")
      .map((annotation) => annotation.fieldName);
    const uniqueFields = [...new Set(existingFields)];

    // Only add new fields from annotations
    uniqueFields.forEach((field) => {
      if (!$fields.tableFields.includes(field)) {
        fields.addTableField(field);
      }
    });
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="table-extraction" role="region" aria-label="Table Extraction">
  <div class="field-input">
    <input
      type="text"
      bind:value={newFieldName}
      placeholder="Enter table column name"
      on:keydown={(e) => e.key === "Enter" && addTableField()}
    />
    <button on:click={addTableField}>Add Column</button>
  </div>

  <div class="table-container">
    <div class="table-header" role="rowgroup">
      {#each $fields.tableFields as field}
        <div
          class="table-column"
          class:selected={$fieldSelection.selectedField === field}
          on:click={() => selectFieldForAnnotation(field)}
          on:keydown={(e) =>
            e.key === "Enter" && selectFieldForAnnotation(field)}
          role="columnheader"
          tabindex="0"
          aria-label={`Select ${field} column`}
        >
          <span class="column-name">{field}</span>
          <div
            class="menu-container"
            on:click|stopPropagation
            role="presentation"
          >
            <button
              class="menu-trigger"
              on:click={(e) => toggleMenu(field, e)}
              aria-label={`Open menu for ${field} column`}
              aria-expanded={activeMenu === field}
              aria-controls={`menu-${field}`}
            >
              ⋮
            </button>
            {#if activeMenu === field}
              <div
                class="menu-popup"
                on:click|stopPropagation
                on:keydown={(e) => {
                  if (e.key === "Escape") {
                    activeMenu = null;
                  }
                }}
                role="menu"
                id={`menu-${field}`}
                aria-label={`Actions for ${field} column`}
                tabindex="0"
              >
                <button
                  class="menu-item delete"
                  on:click|stopPropagation={() => removeTableField(field)}
                  on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      removeTableField(field);
                    }
                  }}
                  role="menuitem"
                >
                  Delete Column
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
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
    margin-bottom: 1rem;
  }

  .field-input input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .field-input button {
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border: 1px solid #e0e0e0;
    min-height: 65vh;
    border-radius: 4px;
  }

  .table-header {
    display: flex;
    width: max-content; /* <-- Change from min-width: 100% to width: max-content */
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }

  .table-column {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem; /* Reduced from 1rem */
    min-width: 100px; /* Reduced from 200px */
    border-right: 1px solid #dee2e6;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .table-column:last-child {
    border-right: none;
  }

  .table-column:hover {
    background-color: #e9ecef;
  }

  .table-column.selected {
    background-color: #e3f2fd;
    border-bottom: 2px solid #2196f3;
  }

  .column-name {
    flex: 1;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }

  .menu-container {
    position: relative;
    margin-left: 0.5rem;
  }

  .menu-trigger {
    padding: 0.25rem 0.5rem;
    background: none;
    color: #6c757d;
    font-size: 1.2rem;
    line-height: 1;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }

  .menu-trigger:hover {
    background-color: #e9ecef;
    color: #495057;
  }

  .menu-popup {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 150px;
  }

  .menu-item {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    color: #333;
    font-size: 0.9rem;
  }

  .menu-item:hover {
    background-color: #f8f9fa;
  }

  .menu-item.delete {
    color: #dc3545;
  }

  .menu-item.delete:hover {
    background-color: #dc3545;
    color: white;
  }
</style>
