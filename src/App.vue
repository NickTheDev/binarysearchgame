<template>
  <div>
    <div class="flex">
      <p class="logo">
        Binary Search Game
      </p>
    </div>

    <div class="flex">
      <p class="header break">
        Find this number:
        <span class="bold">
          {{ target }}
        </span>
      </p>

      <p class="header">
        Moves left:
        <span class="bold">
          {{ moves }}
        </span>
      </p>
    </div>

    <div class="boxes flex">
      <div
        v-for="(number, index) in numbers"
        :key="number"
        class="box"
      >
        <p class="index">
          {{ index }}
        </p>

        <div
          v-if="!shown.includes(index)"
          class="cover"
          @click="shown.push(index)"
        />

        <p
          v-else
          class="number"
        >
          {{ number }}
        </p>
      </div>
    </div>
  </div>

  <div
    v-if="state !== 'playing'"
    class="overlay"
    :class="state === 'loss' && 'loss'"
  >
    <p class="over">
      {{ state === 'loss' ? 'Game over' : 'Search successful' }}
    </p>

    <p class="over-small">
      {{ state === 'loss' ? 'Inefficient search'
        : `You found the number in ${goal - moves} moves` }}
    </p>

    <svg
      class="play-again"
      :class="state === 'loss' && 'loss'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      @click="resetPuzzle"
    ><path
      fill="none"
      d="M0 0h24v24H0z"
    /><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm4.82-4.924a7 7 0 1 0-1.852 1.266l-.975-1.755A5 5 0 1 1 17 12h-3l2.82 5.076z" /></svg>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, watch,
} from 'vue';
import { random, randomSortedNumbers } from '@/util/random';

export default defineComponent({
  setup() {
    const size = 32;
    const min = 1;
    const max = 999;
    const range = 500;
    const goal = Math.ceil(Math.log2(size));
    const numbers = ref<number[]>(randomSortedNumbers(size, min, max, range));
    const target = ref(numbers.value[random(0, size - 1)]);
    const shown = ref<number[]>([]);
    const moves = computed(() => Math.ceil(goal - shown.value.length));
    const state = ref<'playing' | 'win' | 'loss'>('playing');

    watch(moves, () => {
      if (shown.value.find((i) => numbers.value[i] === target.value)) {
        state.value = 'win';
      } else if (moves.value === 0) {
        state.value = 'loss';
      }
    });

    function resetPuzzle() {
      numbers.value = randomSortedNumbers(size, min, max, range);
      shown.value = [];
      target.value = numbers.value[random(0, size - 1)];
      state.value = 'playing';
    }

    return {
      numbers,
      shown,
      goal,
      target,
      moves,
      state,
      resetPuzzle,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1vw;
}

.boxes {
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 2.75vw;
  margin-right: .3125vw;
}

.cover {
  background-color: #2c3e50;
  width: 2.75vw;
  height: 2.75vw;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: dodgerblue;
  }
}

.header {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 26px;
}

.bold {
  font-weight: 600;
}

.break {
  margin-right: 2rem;
}

.number {
  width: 2.75vw;
  height: 2.75vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 16px;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.logo {
  font-size: 42px;
  font-weight: 600;
  margin-top: 5rem;
  margin-bottom: 0;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.index {
  font-size: 13px;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: lightslategray;
  margin: 0 0 .5rem 0;
}

.overlay {
  position: fixed;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(limegreen, .2);
  color: mediumseagreen;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &.loss {
    background-color: rgba(firebrick, .2);
    color: firebrick;
  }
}

.over {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 60px;
  font-weight: 600;
  margin-bottom: 0;
  margin-top: -0.5rem;
}

.over-small {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 25px;
  margin-bottom: 2rem;
  margin-top: .5rem;
}

.play-again {
  fill: mediumseagreen;
  width: 5rem;
  height: 5rem;
  cursor: pointer;
  transition: fill ease 150ms;

  &:hover {
    fill: darkgreen;
  }

  &.loss {
    fill: firebrick;

    &:hover {
      fill: darkred;
    }
  }
}
</style>
