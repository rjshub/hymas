<template>
    <el-input style="width:330px" 
        v-model="data.value" 
        clearable
        @blur="handle_blur" 
        @clearable="clear_relation"></el-input>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    components: {},
    props: ['data'],
    data() {
        return {

        };
    },
    watch: {},
    computed: {
        ...mapState('dataSource/formatSetting',[
            'form_fields_list'
        ]),
    },
    methods: {
        handle_blur() {
            if (this.validate()) {
                let tmpRelation = this.data.value.split('>')
                let result = []
                tmpRelation.forEach(item => {
                    this.form_fields_list.forEach(field => {
                        if (field.location === item) {
                            result.push(field.label)
                        }
                    })
                })
                
                this.data.result = result
                this.$emit('update_relation', this.data)
            } else {
                this.$message.error('Linkage relation is error!')
            }
            
        },
        clear_relation() {

        },
        validate() {
            const reg = /^[A-Z]+[A-Z\>]+[A-Z]+$/
            return reg.test(this.data.value)
        }
    },
    mounted() {},
    }
</script>
<style lang='scss' scoped>
    
</style>