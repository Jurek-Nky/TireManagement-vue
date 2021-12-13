<template>
<header>
  <h1>{{title}}</h1>
</header>
</template>

<script>
export default {
  name: "Header",
  props:{
    title:{
      type: String,
      default: "Title missing!!"
    }
  }
}
</script>

<style scoped>

</style>

<style scoped>
  header{
    display: grid;
    align-content: center;
    margin: auto;
    max-width: min-content;
    color: white;
  }
</style>