<template>
    
    <form @submit.prevent="save">
        <div class="form-group isvalid">
          <label for="uni_id">ID</label>
          <input type="text" 
          class="form-control"
          id = "uni_id" aria-describedby = "uni_id"
          placeholder="ID Unit"
          v-model="unit.uni_id"
        >
        <p v-if="errors.uni_id" class="isvalidfeedback" >{{errors.uni_id}}</p>
        </div>
        <div class="form-group">
            <label for="uni_name">Name</label>
            <input type="text" 
            class="form-control"
            id="uni_name" aria-describedby="uni_name"
            placeholder="Name unit"
            v-model="unit.uni_name"
            >
            <p v-if="errors.uni_name" class="isvalidfeedback" >{{errors.uni_name}}</p>
          </div>
       
        <button type="submit" class="btn btn-primary"  >Submit</button>
    </form>
</template>
<script>
import {reactive} from 'vue';
export default{
    name:"form",
    props:{unit:{type:Object}},
    setup({unit},{emit}){
        const errors=reactive({uni_id:'',uni_name:''});
        
        const validdate=()=>{
            errors.uni_id='';
            errors.uni_name='';
            
            var valid=true;
            if(!unit.uni_id){
                errors.uni_id='ID is not empty';
                valid=false;
            }
            if(!unit.uni_name){
                errors.uni_name='Name is not empty';
                valid=false;
            }
            return valid;
        }
        const save=()=>{
            if(validdate()){
                
                emit ("AddOrUpdate", unit);
                return;
            }}
        return {errors,save};
    }
}
</script>
<style>
.isvalid{
    border-color:#cc0000 !important;
}
.isvalidfeedback{
    color:#cc0000 !important;
}
</style>