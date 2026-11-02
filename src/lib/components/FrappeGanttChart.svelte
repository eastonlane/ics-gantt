<script lang="ts">
  import Gantt, { type GanttTask } from 'frappe-gantt';
  import 'frappe-gantt/dist/frappe-gantt.css';
  import { onMount } from 'svelte';

  let ganttContainer: HTMLDivElement;

  const tasks: GanttTask[] = $state([
    {
      id: '1',
      name: 'Redesign website',
      start: '2016-12-28',
      end: '2016-12-31',
      progress: 20,
    },
    {
      id: '2',
      name: 'Redesign website',
      start: '2017-01-28',
      end: '2017-01-31',
      progress: 20,
    },
    {
      id: '3',
      name: 'Redesign website',
      start: '2017-01-05',
      end: '2017-01-17',
      progress: 50,
    },
  ]);

  onMount(() => {
    if (!ganttContainer) return;

    new Gantt(ganttContainer, tasks, {
      view_mode: 'Day',
      readonly: true,
      scroll_to: 'start',
      infinite_padding: false,
    });
  });
</script>

<div class="gantt-host" bind:this={ganttContainer}></div>

<style>
  .gantt-host {
    position: relative;
    width: 100%;
    text-align: left;
  }
</style>
