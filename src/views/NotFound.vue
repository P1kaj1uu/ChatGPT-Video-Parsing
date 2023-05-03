<template>
  <div class="not-found">
    <h1>404</h1>
    <h1>Not Found</h1>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style>
.not-found {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
h1 {
  font-size: 0.5rem;
  text-align: center;
}
</style>
