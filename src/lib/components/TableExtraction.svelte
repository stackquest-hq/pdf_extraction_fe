<script>
  import { annotations } from "$lib/stores/annotations";
  import { fieldSelection } from "$lib/stores/fieldSelection";
  import { fields } from "$lib/stores/fields";
  import ExtractionModes from "./ExtractionModes.svelte";
  import FieldInput from "./FieldInput.svelte";
  import TableHeader from "./TableHeader.svelte";

  let newFieldName = "";
  let activeMenu = null;
  let extractionMode = "manual"; // Default to manual mode

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
      case "manual":
        console.log("Manual marking mode selected");
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
    <FieldInput 
      bind:newFieldName 
      onAddField={addTableField} 
    />
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
    gap: 1rem;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border: 1px solid #e0e0e0;
    min-height: 65vh;
    border-radius: 4px;
  }
</style>
