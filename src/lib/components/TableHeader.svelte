<script>
  import { fieldSelection } from "$lib/stores/fieldSelection";
  import { fields } from "$lib/stores/fields";
  import { annotations } from "$lib/stores/annotations";

  export let activeMenu;
  export let onToggleMenu;
  export let onSelectField;
  export let onRemoveField;

  function handleClickOutside(event) {
    if (!event.target.closest(".menu-container")) {
      onToggleMenu(null);
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="table-header" role="rowgroup">
  {#each $fields.tableFields as field}
    <div
      class="table-column"
      class:selected={$fieldSelection.selectedField === field}
      on:click={() => onSelectField(field)}
      on:keydown={(e) => e.key === "Enter" && onSelectField(field)}
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
          on:click={(e) => onToggleMenu(field, e)}
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
                onToggleMenu(null);
              }
            }}
            role="menu"
            id={`menu-${field}`}
            aria-label={`Actions for ${field} column`}
            tabindex="0"
          >
            <button
              class="menu-item delete"
              on:click|stopPropagation={() => onRemoveField(field)}
              on:keydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onRemoveField(field);
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

<style>
  .table-header {
    display: flex;
    width: max-content;
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }

  .table-column {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    min-width: 100px;
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