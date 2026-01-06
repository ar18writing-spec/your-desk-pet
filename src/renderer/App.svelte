<script lang="ts">
  import { onMount } from 'svelte';
  import Pet from './components/Pet.svelte';
  import Timer from './components/Timer.svelte';
  let activeWindowInfo = null;

  onMount(async () => {
    // get settings
    // @ts-ignore
    const settings = await window.deskPetAPI.getSettings();
    // listen for active window events
    // @ts-ignore
    window.deskPetAPI.onActiveWindow(info => {
      activeWindowInfo = info;
      // forward to stores or components via custom events / stores
      const ev = new CustomEvent('active-window', { detail: info });
      window.dispatchEvent(ev);
    });
  });
</script>

<style>
  body {
    margin: 0;
    pointer-events: none; /* allow clicks to pass through unless UI needs them */
  }
  .overlay {
    width: 420px;
    height: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="overlay">
  <Pet />
  <Timer />
</div>
