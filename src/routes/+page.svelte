<script>
  import CanvasContainer from "$lib/components/CanvasContainer.svelte";
  import FieldList from "$lib/components/FieldList.svelte";
  import TableExtraction from "$lib/components/TableExtraction.svelte";
  import { fieldSelection } from "$lib/stores/fieldSelection";

  let activeTab = "fields"; // 'fields' or 'table'
  let imageUrl = null;

  function handleTabChange(tab) {
    activeTab = tab;
    fieldSelection.setMode(tab);
  }
</script>

<div class="container">
  <div class="main-content">
    <CanvasContainer bind:imageUrl />

    <div class="sidebar">
      <div class="tabs">
        <button
          class:active={activeTab === "fields"}
          on:click={() => handleTabChange("fields")}
        >
          Field Extraction
        </button>
        <button
          class:active={activeTab === "table"}
          on:click={() => handleTabChange("table")}
        >
          Table Extraction
        </button>
      </div>

      <div class="tab-content">
        {#if activeTab === "fields"}
          <FieldList />
        {:else}
          <TableExtraction />
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
  }

  .main-content {
    display: flex;
    gap: 1rem;
    flex: 1;
    min-height: 0;
  }

  .sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-width: 400px;
    min-width: 280px;
    overflow-x: hidden;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid #ccc;
  }

  .tabs button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 500;
  }

  .tabs button.active {
    background-color: #f0f0f0;
    border-bottom: 2px solid #4caf50;
  }

  .tab-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }
</style>
