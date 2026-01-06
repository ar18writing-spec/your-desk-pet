<script lang="ts">
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  const focusDuration = writable(25 * 60); // seconds default
  const remaining = writable(25 * 60);
  const running = writable(false);
  let intervalId: number | null = null;

  function start() {
    running.set(true);
    if (intervalId) window.clearInterval(intervalId);
    intervalId = window.setInterval(() => {
      remaining.update(r => {
        if (r <= 1) {
          window.clearInterval(intervalId!);
          running.set(false);
          // send focus-complete event
          const ev = new CustomEvent('focus-complete', {});
          window.dispatchEvent(ev);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  function pause() {
    running.set(false);
    if (intervalId) { window.clearInterval(intervalId); intervalId = null; }
  }

  function reset() {
    remaining.set($focusDuration);
    pause();
  }

  onDestroy(() => {
    if (intervalId) window.clearInterval(intervalId);
  });
</script>

<style>
  .timer {
    margin-top: 12px;
    pointer-events: auto;
    background: rgba(255,255,255,0.06);
    padding: 8px;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
  }
  button { margin: 6px 4px; }
</style>

<div class="timer">
  <div>Remaining: {$remaining}</div>
  <button on:click={start}>Start</button>
  <button on:click={pause}>Pause</button>
  <button on:click={reset}>Reset</button>
</div>
