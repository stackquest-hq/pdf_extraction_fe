<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function handleClickOutside(event) {
    if (!event.target.closest('.action-menu')) {
      showMenu = false;
    }
  }

  function handleReupload() {
    dispatch('reupload');
    showMenu = false;
  }

  function handleExport() {
    dispatch('export');
    showMenu = false;
  }

  import { onMount } from 'svelte';
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</svelte:head>

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

<style>
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