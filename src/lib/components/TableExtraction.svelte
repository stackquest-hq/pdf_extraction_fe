<script>
  import { annotations } from "$lib/stores/annotations";
  import { fieldSelection } from "$lib/stores/fieldSelection";
  import { fields } from "$lib/stores/fields";
  import ExtractionModes from "./ExtractionModes.svelte";
  import FieldInput from "./FieldInput.svelte";
  import TableHeader from "./TableHeader.svelte";

  let newFieldName = "";
  let activeMenu = null;
  let extractionMode = "auto"; // Default to auto mode

  function handleExtractionMode(mode) {
    extractionMode = mode;
    // TODO: Implement the actual extraction logic for each mode
    switch(mode) {
      case "auto":
        console.log("Auto detection mode selected");
        break;
      case "heuristic":
        console.log("Heuristic approach selected");
        break;
    }
  }

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
  <ExtractionModes 
    {extractionMode} 
    onModeChange={handleExtractionMode} 
  />

  {#if extractionMode !== "auto"}
    <div class="manual-controls">
      <FieldInput 
        bind:newFieldName 
        onAddField={addTableField} 
      />
    </div>
  {/if}

  <div class="table-container">
    <TableHeader 
      {activeMenu}
      onToggleMenu={toggleMenu}
      onSelectField={selectFieldForAnnotation}
      onRemoveField={removeTableField}
    />
  </div>
</div>

<style>
  .table-extraction {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: #fafbfc;
    border-radius: 8px;
    padding: 0.5rem 0.5rem 0 0.5rem;
  }

  .manual-controls {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .slick-btn {
    padding: 0.35rem 0.9rem;
    background: #f5f7fa;
    color: #222;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(60,60,60,0.03);
    transition: background 0.18s, border 0.18s, color 0.18s;
    height: 2.2rem;
    min-width: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slick-btn:hover {
    background: #e6f0fa;
    border-color: #4a90e2;
    color: #2563eb;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border: 1px solid #e0e0e0;
    min-height: 55vh;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(60,60,60,0.04);
    margin-top: 0.25rem;
  }

  /* FieldInput tweaks for compactness */
  :global(.field-input-container) {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  :global(.field-input-container input) {
    height: 2.2rem;
    font-size: 0.95rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    padding: 0 0.75rem;
    background: #fff;
    transition: border 0.18s;
  }
  :global(.field-input-container input:focus) {
    border: 1.5px solid #4a90e2;
    outline: none;
  }
  :global(.field-input-container button) {
    height: 2.2rem;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 0.35rem 1.1rem;
    background: #22c55e;
    color: #fff;
    border: none;
    box-shadow: 0 1px 2px rgba(60,60,60,0.03);
    transition: background 0.18s;
  }
  :global(.field-input-container button:hover) {
    background: #16a34a;
  }
</style>
