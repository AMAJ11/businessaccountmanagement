<template>
    <div class="py-16 px-8">
        <v-row dir="rtl">
            <v-col md="4" sm="10" cols="12" class="py-10">
                <v-img width="100px" class="mb-6" src="../assets/cab_history_archive_archives_7220.png"></v-img>
                <h2 class="text-success mb-3" style="">المجموع في هذه الفترة <v-chip
                        class="mr-4 elevation-2 text-primary">{{
                            Total }} $ </v-chip></h2>
                <v-date-input @update:model-value="validateDates" :disabled="ok" placeholder="First Date"
                    v-model="Firstdate" prepend-icon="" append-inner-icon="mdi-calendar-range">
                </v-date-input>
                <v-date-input @update:model-value="validateDates" :disabled="ok" placeholder="Last Date"
                    v-model="Lastdate" prepend-icon="" append-inner-icon="mdi-calendar-range">
                </v-date-input>
                <p class="text-red"> {{ errorMessage }} </p>
                <v-btn :disabled="ok" color="success" @click="submit" :loading="submitLoad">عرض النتائج</v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col md="6" cols="12" sm="12">
                <v-container>
                    <v-text-field :disabled="!ok" v-model="searchQuery" label="Search" outlined @input="onSearchInput"
                        @keyup.enter="searchUsers" :loading="isLoading" prepend-inner-icon="mdi-magnify"></v-text-field>

                    <v-list v-if="searchResults.length > 0">

                    </v-list>

                    <v-alert v-else-if="searchQuery && !isLoading" type="info">
                        لا توجد نتائج لـ "{{ searchQuery }}"
                    </v-alert>
                </v-container>
                <v-btn :disabled="!ok" @click="empty"> إالغاء تحميل البيانات</v-btn>
                <v-data-table style="max-height: 70vh;" class="elevation-2" dir="rtl" :headers="HeaderItems"
                    :items="TableItems">
                    <template v-slot:header.des>
                        <span class="text-primary font-weight-bold" style="font-size: 20px;">الوصف</span>
                    </template>
                    <template v-slot:header.amount>
                        <span class="text-orange font-weight-bold" style="font-size: 20px;">الثمن</span>
                    </template>
                    <template v-slot:header.index>
                        <span class=" font-weight-bold" style="font-size: 20px;">#</span>
                    </template>
                    <template v-slot:item.index="{ index }">
                        {{ index + 1 }}
                    </template>
                    <template v-slot:item.des="{ item }">
                        <span class="" style="font-size: 18px;">{{ item.des }}</span>
                    </template>
                    <template v-slot:item.amount="{ item }">
                        <span :class="item.type == '1' ? 'text-green' : 'text-red'" style="font-size: 18px;">{{
                            item.type == '1' ? `${item.amount}+` : `${item.amount}-`
                        }}</span>
                    </template>
                    <template v-slot:item.time="{ item }">
                        <v-tooltip class="hidden-sm-and-down" text="Tooltip content">
                            {{ formattedDate(item.date) + " ," }} {{ item.time }}
                            <template class="hidden-sm-and-down" #activator="{ props }">
                                <v-icon v-bind="props" class="hidden-sm-and-down">mdi-clock</v-icon>
                            </template>
                        </v-tooltip>
                        <v-chip class="hidden-md-and-up" style="font-size: 15px"> {{ formattedDate(item.date) + " ," }} {{
                            item.time }}</v-chip>
                    </template>
                </v-data-table>

            </v-col>
        </v-row>
    </div>
</template>

<style></style>
<script>
import axios from 'axios'
import _ from 'lodash';
import { VDateInput } from 'vuetify/labs/VDateInput'
export default {
    components: { VDateInput },
    data() {
        return {
            ok: false,
            searchQuery: '',
            searchResults: [],
            isLoading: false,
            debouncedSearch: null,
            apiurl: process.env.VUE_APP_API_URL,
            submitLoad: false,
            Firstdate: null,
            Lastdate: null,
            errorMessage: "",
            error: "",
            HeaderItems: [
                { text: '#', value: 'index' },
                { title: 'الوصف', value: 'description' },
                { title: 'الثمن', value: 'amount' },
                { title: 'الوقت', value: 'time' }
            ],
            TableItems: [
            ],
        }

    },
    created: function () {
        this.debouncedSearch = _.debounce(this.searchUsers, 500);
    },
    methods: {
        validateDates() {
            if (this.Firstdate && this.Lastdate) {
                const fromDate = new Date(this.Firstdate)
                const toDate = new Date(this.Lastdate)
                this.error = fromDate > toDate
            } else {
                this.error = false
            }
        },
        empty: function () {
            this.TableItems = [];
            this.ok = false
            this.searchQuery = ""
        },
        formattedDate(date) {
            if (!date) return ''
            const d = new Date(date)
            const day = d.getDate()
            const month = d.getMonth() + 1
            const year = d.getFullYear()
            return `${year}-${month}-${day}`
        },
        submit: async function () {
            if (this.Firstdate == null || this.Lastdate == null) {
                this.errorMessage = "يجب عليك ملءالحقول"
            }
            else {
                if (!this.error) {
                    this.submitLoad = true

                    let response = await axios.get(`${this.apiurl}/records?from=${this.formattedDate(this.Firstdate)}&to=${this.formattedDate(this.Lastdate)}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': `${localStorage.getItem("token")}`
                            }
                        }

                    )
                    this.TableItems = response.data
                    if (response.data != null) {
                        this.ok = true
                    }

                    this.submitLoad = false
                    this.errorMessage = ""

                } else {
                    this.errorMessage = "  لا يمكن أن يكون تاريخ البداية بعد تاريخ النهاية"
                }
            }
        },
        onSearchInput() {
            if (this.searchQuery.trim() === '') {
                this.searchResults = [];
                return;
            }
            this.debouncedSearch();
        },
        async searchUsers() {
            if (this.searchQuery.trim() === '') {
                let response = await axios.get(`${this.apiurl}/records?from=${this.formattedDate(this.Firstdate)}&to=${this.formattedDate(this.Lastdate)}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `${localStorage.getItem("token")}`
                        }
                    }

                )
                this.TableItems = response.data
                return;
            }

            this.isLoading = true;
            try {
                const response = await axios.get(`${this.apiurl}/records/?from=${this.formattedDate(this.Firstdate)}&to=${this.formattedDate(this.Lastdate)}&search=${this.searchQuery}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${localStorage.getItem("token")}`
                    }
                });

                // تحقق من وجود البيانات في الاستجابة
                if (response.data && Array.isArray(response.data)) {
                    this.searchResults = response.data;
                    this.TableItems = response.data


                } else {
                    throw new Error('Invalid response format');
                    let response = await axios.get(`${this.apiurl}/records?from=${this.formattedDate(this.Firstdate)}&to=${this.formattedDate(this.Lastdate)}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': `${localStorage.getItem("token")}`
                            }
                        }

                    )

                    // for (let i = 0; i < response.data.length; i++) {
                    //     this.TableItems.push({ description: response.data[i].description, amount: Number(response.data[i].amount), type: response.data[i].type, time: response.data[i].time, date: response.data[i].date })
                    // }
                    this.TableItems = response.data
                }

            } catch (error) {
                console.error('Search error:', error);

                // عرض رسالة الخطأ بشكل آمن
                this.$toast.error(error.response?.data?.message ||
                    error.message ||
                    'حدث خطأ أثناء البحث');

                this.searchResults = [];
                let response = await axios.get(`${this.apiurl}/records?from=${this.formattedDate(this.Firstdate)}&to=${this.formattedDate(this.Lastdate)}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `${localStorage.getItem("token")}`
                        }
                    }

                )

                // for (let i = 0; i < response.data.length; i++) {
                //     this.TableItems.push({ description: response.data[i].description, amount: Number(response.data[i].amount), type: response.data[i].type, time: response.data[i].time, date: response.data[i].date })
                // }
                this.TableItems = response.data
            } finally {
                this.isLoading = false;
            }
        },
    },
    computed: {
        Total() {
            let total = 0;
            for (let i = 0; i < this.TableItems.length; i++) {

                if (this.TableItems[i].type == 1) {
                    total = total + this.TableItems[i].amount;
                } else {
                    total = total - this.TableItems[i].amount
                }
            }
            return total;
        }
    }

}
</script>