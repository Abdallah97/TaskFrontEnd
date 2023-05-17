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
            <v-text-field v-if="prop.value === 'other'" label="Other Option" ></v-text-field>
          </template>
          </v-col> 
          <v-col cols="12" v-if="propOptions?.length > 0"  >
            <v-autocomplete v-for="opt of subPropOptions" :key="opt.slug" 
              v-model="opt.value"
              :items="opt.options"
              item-text="name"
              item-value="id"
              :label="opt.name"
            ></v-autocomplete>
          </v-col>
          
          <v-col cols="12">
            <v-btn type="submit" color="primary">Submit</v-btn>
          </v-col>
          
        </v-row>
      </v-form>
      <template>
  <div>
    <v-data-table
    v-if="myData"
        :headers="headers"
        :items="myData"
        hide-default-footer
        class="elevation-2 mt-2"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.catName }}</td>
            <td>{{ item.catId }}</td>
            <td>{{ item.subCatId }}</td>
            <td>
              <ul>
                <li v-for="prop of item.properties" :key="prop.id">
                  {{ prop.name }} - {{ prop.value }}
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="prop of item.subProperties" :key="prop.id">
                  {{ prop.name }} - {{ prop.value }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
      </v-data-table>
  </div>
</template>
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
        myData: null,
        headers: [
          {
            text: 'Category Name',
            align: 'start',
            sortable: false,
            value: 'catName',
          },
          { text: 'Category Id', value: 'catId' },
          { text: 'Sub Category Id', value: 'subCatId' },
          { text: 'Properties', value: 'properties' },
        ],

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
        this.subCategories = this.cats.find((cat) => cat.id === e).children;
        this.selectedSubCat = null;
        this.selectedProps = [];
        this.subPropOptions = [];
        
      },
      async changeSub(e){
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
              value: null
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
      this.subPropOptions = this.propOptions.map(prop => {
        return {
          name: prop.name,
          slug: prop.slug,
          options: prop.options,
          id: prop.id,
          value: null
        }
      })
      },
      

  submit(){
    this.myData = [{
      catId: this.selectedCat,
      catName: this.cats.find(cat => cat.id === this.selectedCat).name,
      subCatId: this.selectedSubCat,
      properties: this.selectedProps.map(prop => {
        return {
          id: prop.id,
          name: prop.name,
          value: prop.value
        }
      }),
    }
  ]
  
  }     
      
    },
    


  };
  </script>
  