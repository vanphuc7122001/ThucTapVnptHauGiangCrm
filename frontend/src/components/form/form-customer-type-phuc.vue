<template>
    <div class="container">
        <h3 class="font-weight-bold">{{ title }}</h3>
        <form class="">
            <div class="form-group">
                <label for="name">Name (<span style="color: red;">*</span>)</label> 
                <input type="text" class="form-control" id="name" placeholder="" :value="viewData.name">
            </div>
            <button type="submit" class="btn btn-primary">{{ btnName }}</button>
        </form>
    </div>
</template>

<script>
import { reactive } from 'vue';
export default {
    props: {
        title: {
            type: String
        },
        btnName: {
            type: String
        },
        item: {
            type: Object
        }
    },
    setup(props){
        const viewData = reactive({
            ...props.item
        })

        const customerTypes = reactive({
            name: ''
        })

        return {
            viewData,

        }
    }
}
</script>

<style>

</style>