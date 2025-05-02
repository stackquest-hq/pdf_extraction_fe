<script>
  export let extractionMode;
  export let onModeChange;
</script>

<div class="extraction-modes">
  <button 
    class="mode-button" 
    class:active={extractionMode === "auto"}
    on:click={() => onModeChange("auto")}
  >
    Auto Detect
  </button>
  <button 
    class="mode-button" 
    class:active={extractionMode === "heuristic"}
    on:click={() => onModeChange("heuristic")}
  >
    Heuristic Approach
  </button>
  <button 
    class="mode-button" 
    class:active={extractionMode === "manual"}
    on:click={() => onModeChange("manual")}
  >
    Mark Table Manually
  </button>
</div>

<style>
  .extraction-modes {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .mode-button {
    flex: 1;
    padding: 0.25rem 0.5rem;
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    border-radius: 3px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    font-size: 0.8rem;
    line-height: 1.2;
  }

  .mode-button:hover {
    background-color: #e9ecef;
  }

  .mode-button.active {
    background-color: #2196f3;
    color: white;
    border-color: #2196f3;
  }
</style> 