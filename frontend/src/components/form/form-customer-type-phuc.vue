<template>
    <div class="container">
        <h3 class="font-weight-bold">{{ title }}</h3>
        <form @submit.prevent>
            <div class="form-group">
                <label for="name">Name (<span style="color: red;">*</span>)</label> 
                <input type="text" class="form-control" id="name" placeholder="" v-model="name" required>
            </div>
            <button type="submit" class="btn btn-primary" @click="handleClick(name)">{{ btnName }}</button>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
export default {
    props: {
        title: {
            type: String
        },
        btnName: {
            type: String
        },
        data: {
        type: Object
      }
    },
    setup(props, context){
        const name = ref('')


        const handleClick = async (value) => {
            context.emit('add', value)
        };

        return {
            handleClick,
            name
        }
    }
}
</script>

<style>

</style>
