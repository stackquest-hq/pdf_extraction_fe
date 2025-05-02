<script>
  export let newFieldName;
  export let onAddField;
</script>

<div class="field-input">
  <input
    type="text"
    bind:value={newFieldName}
    placeholder="Enter table column name"
    on:keydown={(e) => e.key === "Enter" && onAddField()}
  />
  <button on:click={onAddField}>Add Column</button>
</div>

<style>
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
</style> 