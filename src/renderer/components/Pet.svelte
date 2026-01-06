<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const mood = writable('calm'); // calm, focused, distracted, annoyed, happy
  let dialogue = '';

  // simple mood transitions for demo
  onMount(() => {
    window.addEventListener('active-window', (e: any) => {
      const info = e.detail;
      if (!info) return;
      const title = info.title || '';
      const app = info.owner?.name || '';
      // naive distractor detection
      const distractors = ['YouTube', 'Twitter', 'Reddit', 'Facebook', 'Instagram'];
      const isDistractor = distractors.some(d => title.includes(d) || app.includes(d));
      if (isDistractor) {
        mood.set('annoyed');
        dialogue = "Really? That again?";
      } else {
        mood.set('focused');
        dialogue = "Nice! Keep going.";
      }
    });

    window.addEventListener('focus-complete', () => {
      mood.set('happy');
      dialogue = 'Great job! Time for a break.';
    });
  });
</script>

<style>
  .pet {
    width: 160px;
    height: 160px;
    background: url('/assets/cat_idle.png') no-repeat center/contain;
    pointer-events: auto; /* pet can receive clicks for interaction */
  }
  .dialogue {
    margin-top: 8px;
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 12px;
  }
</style>

<div>
  <div class="pet" on:click={() => (dialogue = 'Meow! Play?')}></div>
  {#if dialogue}
    <div class="dialogue">{dialogue}</div>
  {/if}
</div>
