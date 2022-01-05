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

        <transition
          name="fade"
          mode="out-in"
        >
          <div
            v-if="!shown.includes(index)"
            class="cover"
            @click="show(index)"
          />

          <p
            v-else
            class="number"
          >
            {{ number }}
          </p>
        </transition>
      </div>
    </div>
  </div>

  <transition name="show">
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
  </transition>
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
      if (shown.value.find((i) => numbers.value[i] === target.value) !== undefined) {
        state.value = 'win';
      } else if (moves.value === 0) {
        state.value = 'loss';
      }
    });

    function show(index: number) {
      if (moves.value > 0) {
        shown.value.push(index);
      }
    }

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
      show,
      resetPuzzle,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Inconsolata, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
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
  font-size: 26px;
}

.bold {
  font-weight: 700;
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
  cursor: pointer;
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.logo {
  font-size: 46px;
  font-weight: 900;
  margin-top: 5rem;
  margin-bottom: 0;
}

.index {
  font-size: 13px;
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
  font-size: 70px;
  font-weight: 600;
  margin-bottom: 0;
  margin-top: -0.5rem;
}

.over-small {
  font-size: 30px;
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

.fade-enter-active {
  animation: fade-in 125ms;
}

.fade-leave-active {
  animation: fade-out 125ms;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.show-enter-active {
  animation: show-in 280ms cubic-bezier(0.465, 0.183, 0.153, 0.946);
}

.show-leave-active {
  animation: show-out 140ms;
}

@keyframes show-in {
  0%, 50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes show-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
