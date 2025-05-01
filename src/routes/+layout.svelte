<script>
  import '../app.css';
</script>

<div class="app">
  <slot />
</div>

<style>
  .app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style> 