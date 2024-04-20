<template>
    <div class="flex">
        <h1>Dark Mode toggle</h1>
        <div class="mode-toggle" @click="modeToggle" :class="darkDark">
            <div class="toggle">
                <div id="dark-mode" type="checkbox"></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: "Dashboard",
  data() {
        return {
            darkMode: false
        }
    },
    
    methods: {
        dark() {
            document.querySelector('body').classList.add('dark-mode')
            this.darkMode = true
            this.$emit('dark')
        },

        light() {
            document.querySelector('body').classList.remove('dark-mode')
            this.darkMode = false
            this.$emit('light')
        },

        modeToggle() {
            if(this.darkMode || document.querySelector('body').classList.contains('dark-mode')) {
                this.light()
            } else {
                this.dark()
            }
        },
    },
    
    computed: {
        darkDark() {
            return this.darkMode && 'darkmode-toggled'
        }
    }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
  position: relative; /* Dodane dla przycisku usuwania */
}
form {
  margin-top: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input,
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
