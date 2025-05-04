<script>
  import { onMount } from "svelte";
  import Canvas from "$lib/components/Canvas.svelte";
  import FieldList from "$lib/components/FieldList.svelte";
  import TableExtraction from "$lib/components/TableExtraction.svelte";
  import { annotations } from "$lib/stores/annotations";
  import { fieldSelection } from "$lib/stores/fieldSelection";

  let imageFile = null;
  let imageUrl = null;
  let activeTab = "fields"; // 'fields' or 'table'
  let isDragging = false;
  let showMenu = false;

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragging = false;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(event) {
    event.preventDefault();
    isDragging = false;
  }

  function processFile(file) {
    if (file.type.startsWith('image/')) {
      imageFile = file;
      imageUrl = URL.createObjectURL(file);
    }
  }

  function handleReupload() {
    // Clear the current image and annotations
    imageFile = null;
    imageUrl = null;
    annotations.set([]);
    showMenu = false;
    // Trigger file input click
    document.getElementById('fileInput').click();
  }

  function handleExport() {
    exportAnnotations();
    showMenu = false;
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function handleClickOutside(event) {
    if (!event.target.closest('.action-menu')) {
      showMenu = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function exportAnnotations() {
    // Transform annotations into the required format
    const fieldOfInterests = $annotations
      .filter(annotation => annotation.type === 'label')
      .map(annotation => ({
        label: annotation.fieldName,
        label_name: null,
        label_rect: {
          x0: annotation.coordinates.x,
          y0: annotation.coordinates.y,
          x1: annotation.coordinates.x + annotation.coordinates.width,
          y1: annotation.coordinates.y + annotation.coordinates.height
        }
      }));

    // Find the single end of table annotation
    const endOfTableAnnotation = $annotations.find(a => a.type === 'end_of_table');

    const tableAnnotations = {
      columns_list: $annotations
        .filter(annotation => annotation.type === 'table_header')
        .map(annotation => ({
          column: annotation.fieldName,
          column_name: null,
          colummn_rect: {
            x0: annotation.coordinates.x,
            y0: annotation.coordinates.y,
            x1: annotation.coordinates.x + annotation.coordinates.width,
            y1: annotation.coordinates.y + annotation.coordinates.height
          }
        })),
      end_of_table_name: null,
      end_of_table_rect: endOfTableAnnotation ? {
        x0: endOfTableAnnotation.coordinates.x,
        y0: endOfTableAnnotation.coordinates.y,
        x1: endOfTableAnnotation.coordinates.x + endOfTableAnnotation.coordinates.width,
        y1: endOfTableAnnotation.coordinates.y + endOfTableAnnotation.coordinates.height
      } : null
    };

    const exportData = {
      field_of_interests: fieldOfInterests,
      table_annotations: tableAnnotations
    };

    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleTabChange(tab) {
    activeTab = tab;
    fieldSelection.setMode(tab);
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</svelte:head>

<div class="container">
  <div class="main-content">
    <div class="canvas-container">
      {#if imageUrl}
        <Canvas {imageUrl} />
      {:else}
        <div 
          class="dropzone" 
          class:dragging={isDragging}
          on:drop={handleDrop}
          on:dragover={handleDragOver}
          on:dragleave={handleDragLeave}
          role="button"
          tabindex="0"
          aria-label="File upload dropzone"
        >
          <input 
            type="file" 
            accept="image/*" 
            on:change={handleImageUpload} 
            id="fileInput"
            class="file-input"
          />
          <label for="fileInput" class="dropzone-label">
            {#if isDragging}
              Drop your image here
            {:else}
              Drag and drop an image here or click to upload
            {/if}
          </label>
        </div>
      {/if}
    </div>

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

  {#if imageUrl}
    <div class="action-menu">
      <button 
        class="action-button" 
        on:click={toggleMenu}
        aria-label="More options"
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
      </button>
      {#if showMenu}
        <div class="menu-popup" role="menu">
          <button 
            class="menu-item" 
            on:click={handleReupload}
            role="menuitem"
          >
            <i class="fas fa-upload" aria-hidden="true"></i>
            <span>Reupload</span>
          </button>
          <button 
            class="menu-item" 
            on:click={handleExport}
            role="menuitem"
          >
            <i class="fas fa-file-export" aria-hidden="true"></i>
            <span>Export</span>
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
    position: relative;
  }

  .main-content {
    display: flex;
    gap: 1rem;
    flex: 1;
    min-height: 0;
  }

  .canvas-container {
    flex: 2;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-width: 400px; /* Add this line */
    min-width: 280px; /* Optional: set a minimum width */
    overflow-x: hidden; /* Prevent sidebar from scrolling horizontally */
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

  .dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border: 2px dashed #ccc;
    border-radius: 4px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fafafa;
    margin: 1rem;
  }

  .dropzone.dragging {
    border-color: #4caf50;
    background-color: #f0f8f0;
  }

  .dropzone-label {
    display: block;
    cursor: pointer;
    color: #666;
    font-size: 1.2rem;
  }

  .file-input {
    display: none;
  }

  .action-menu {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 100;
  }

  .action-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(204, 204, 204, 0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    color: rgba(51, 51, 51, 0.3);
  }

  .action-button:hover,
  .action-button:focus {
    background-color: rgba(255, 255, 255, 0.95);
    border-color: rgba(204, 204, 204, 0.95);
    color: rgba(51, 51, 51, 0.95);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    outline: none;
  }

  .action-button:focus-visible {
    outline: 2px solid #4caf50;
    outline-offset: 2px;
  }

  .menu-popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 150px;
    overflow: hidden;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    width: 100%;
    border: none;
    background: none;
    cursor: pointer;
    color: #333;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
  }

  .menu-item:hover,
  .menu-item:focus {
    background-color: #f5f5f5;
    outline: none;
  }

  .menu-item:focus-visible {
    outline: 2px solid #4caf50;
    outline-offset: -2px;
  }

  .menu-item i {
    width: 16px;
    text-align: center;
  }
</style>
