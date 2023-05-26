<template>
  <v-card>
      <v-container fluid v0="">
        <h1 class="text-center">Categories Form</h1>
        <v-form ref="form" @submit.prevent="submit" id="form" >
        <v-row>
      
          <v-col cols="12">
            <v-autocomplete
              v-model="selectedCat"
              id="category-select"
              :items="cats"
              item-text="name"
              item-value="id"
              label="Categories"
              @change="changeCat($event)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
             id="subcategory-select"
              v-model="selectedSubCat"
              :items="subCategories"
              item-text="name"
              item-value="id"
              label="Sub Categories"
              @change="changeSub($event)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" v-if="properties?.length > 0"  >
            <template v-for="prop of selectedProps"  >
            <v-autocomplete :key="prop.slug" 
              v-model="prop.value"
              :items="prop.options"
              item-text="name"
              item-value="id"
              :label="prop.name"
              @change="changeProp($event)"
            ></v-autocomplete>
            <v-text-field :key="prop.value" v-if="prop.value === 'other'" label="Other Option" ></v-text-field>
           
            <template v-for="subProp of subPropOptions"  >
              <template v-if="propOptions?.length >0 && prop.value == subProp.optionId">
            <v-autocomplete :key="subProp.id" 
              v-model="subProp.value"
              :items="subProp.options"
              item-text="name"
              item-value="id"
              :label="subProp.name"
            ></v-autocomplete>
            </template>
          </template>
        </template>
          </v-col> 
          <v-col cols="12">
            <v-btn type="submit" color="primary">Submit</v-btn>
          </v-col>

          <v-col cols="12">
            <v-data-table
    :headers="headers"
    :items="items"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.category }}</td>
        <td>{{ item.subCategory }}</td>
        <td>
          <template v-for="prop of item.properties" >
            <div :key="prop">{{ prop }}</div>
          </template>
        </td>
        <td>
          <template v-for="subProp of item.subProperty" >
            <div :key="subProp">{{ subProp }}</div>
          </template>
        </td>
      </tr>
    </template>
  </v-data-table>

          </v-col>
          
        </v-row>
      </v-form>
      <loadingSpinner  v-if="loading" />
      </v-container>
      
    </v-card>
  </template>
     
  
  
  <script>
  import loadingSpinner from '@/components/LoadingSpinner.vue';
  
  
  export default {
    components: {
      loadingSpinner,
    },
    computed: {
      cats: {
        get() {
          return this.$store.state.cats.data?.categories;
        },
      },
      properties: {
        get() {
          return this.$store.state.properties?.data;
        },
        set(value) {
          this.properties = value;
        },
      },
      propOptions: {
        get() {
          return this.$store.state.childOptions?.data
        },
        set(value) {
          this.subPropOptions = value;
        },
      },
      mappedProps() {
       //loop over the selectedProps options get the option that match the value and return it
        return this.selectedProps.map(prop => {
          return {
            ...prop,
            options: prop.options.find(option => option.id === prop.value)?.name
          }
        })
      },
      mappedSubProps() {
        return this.subPropOptions.map(prop => {
          return {
            ...prop,
            options: prop.options.find(option => option.id === prop.value)?.name
          }
        })
      }
    },
    methods: {
     
    },
    data() {
      return {
        selectedCat: null,
        selectedSubCat: null,
        subCategories: [],
        selectedProps: [],
        subPropOptions: [],
        loading: false,
        currentSubProperty: [],
        headers: [
          {
            text: 'Category',
            align: 'start',
            sortable: false,
            value: 'category',
          },
          { text: 'Sub Category', value: 'subCategory' },
          { text: 'Property', value: 'property' },
          { text: 'Sub Property', value: 'subProperty' },
        ],
        items:[]

      };
    },
    mounted() {
      this.loading = true;
      this.$store.dispatch('fetchCats').then(() => {
        this.loading = false;
      });
    },
    methods: {
      changeCat(e) {
        this.selectedSubCat = null;
        this.selectedProps = [];
        this.subPropOptions = [];
        this.subCategories = this.cats.find((cat) => cat.id === e).children;
        
      },
      async changeSub(e){
        this.selectedProps = [];
        this.subPropOptions = [];
        this.loading = true
       await  this.$store.dispatch('fetchPropertiesByCatId',e)
          this.loading = false

         //create data to v-model it in properties
          let allProps = this.properties.map(prop => {
            return {
              name: prop.name,
              slug: prop.slug,
              options: prop.options,
              id: prop.id,
              value: null,
              
            }
          })
         
         //add other option to all proprties.options without mutate or change the original data
          let allPropsWithOther = allProps.map(prop => {
            return {
              ...prop,
              options: [...prop.options, { name: 'Other', id: 'other' }]
            }
          })
          this.selectedProps = allPropsWithOther
          

      },
   async   changeProp(e){
     if(e === 'other'){
       return
     }

     this.loading = true
     await this.$store.dispatch('fetchChildOptionsById',e)
      this.loading = false
       //push sub properties to subPropOptions

       if(this.propOptions.length === 0){
         return
        }

        let subProps = this.propOptions.map(prop => {
          return {
            optionId: e,
            name: prop.name,
            slug: prop.slug,
            options: prop.options,
            id: prop.id,
            value: null
          }
        })

        let subPropsWithOther = subProps.map(prop => {
          return {
            ...prop,
            options: [...prop.options, { name: 'Other', id: 'other' }]
          }
        })
        this.subPropOptions = subPropsWithOther

      },

  submit(){
    let data = {
      category: this.cats.find(cat => cat.id === this.selectedCat).name,
      subCategory: this.subCategories.find(subCat => subCat.id === this.selectedSubCat).name,
      properties: this.mappedProps,
      subProperties: this.mappedSubProps
    }

    this.items = [
      {
        category: data.category,
        subCategory: data.subCategory,
        properties: data.properties.map(prop => `${prop.name} : ${prop.options ? prop.options : '---'}`),
        subProperty: data.subProperties.map(prop => prop.options)
      }
    ]
    console.log(data)
  }     
      
    },
    


  };
  </script>
  