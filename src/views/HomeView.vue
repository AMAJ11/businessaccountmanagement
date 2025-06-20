<template>
    <div class="px-2 px-md-5 pb-2">
        <v-row dir="rtl">
            <v-col dir="rtl" class="pa-6 pa-sm-12 pt-5" md="4" sm="10" cols="12" style="">
                <v-img width="100px" class="mb-6" src="../assets/rack-server-plus_icon-icons.com_52824.png"></v-img>
                <h2 class="text-success mb-3" style="">المجموع حتى الآن <v-chip class="mr-4 elevation-2 text-primary">{{
                    Total }} $ </v-chip></h2>
                <v-form ref="form" @submit.prevent="Submit">
                    <!-- <v-select :rules="FormRule" color="primary" v-model="OperationSubmit" rounded dir="rtl"
                        label="أدخل نوع العملية" :items="items"></v-select> -->
                    <v-radio-group :rules="FormRule"
                        style="display: flex;flex-direction: row;justify-content: flex-end;flex-wrap: wrap;"
                        class="radioType mb-5" inline v-model="OperationSubmit">
                        <v-radio style="font-size: 20px;" color="success" class="mr-16" value="1"> دخل <v-icon
                                color="success">mdi-plus</v-icon> </v-radio>
                        <v-radio style="font-size: 20px;" color="red" class="ml-16" value="2">خرج <v-icon
                                color="red">mdi-minus</v-icon> </v-radio>
                    </v-radio-group>
                    <v-text-field :rules="FormRule" color="primary" rounded dir="rtl" variant="outlined"
                        placeholder="أدخل ملاحظاتك هنا" v-model="descriptionSubmit"></v-text-field>
                    <v-text-field :rules="FormRule" color="primary" rounded dir="rtl" type="number"
                        placeholder="أدخل الثمن" variant="outlined" v-model="price"></v-text-field>
                    <div style="display: flex;justify-content: space-between;">
                        <v-btn color="success" type="submit">اضافة</v-btn>
                        <div style="display: flex;">
                            <v-checkbox v-model="checkBox" :disabled="OperationSubmit != '2'"
                                label="هل الدفع لتاجر؟"></v-checkbox>
                            <div style="width: 200px;"><v-select @update:menu="" :disabled="!checkBox"
                                    :items="selectMerchant" item-title="name" item-value="_id"
                                    v-model="selectedMerchant"></v-select></div>
                        </div>
                    </div>
                </v-form>
            </v-col>
            <v-spacer></v-spacer>
            <v-col md="6" sm="12" cols="12" class="pa-4 pa-sm-8">
                <v-data-table style="max-height: 70vh;" class="elevation-2" dir="rtl" :headers="HeaderItems"
                    :items="TableItems">
                    <template v-slot:header.des>
                        <span class="text-primary font-weight-bold" style="font-size: 25px;">الوصف</span>
                    </template>
                    <template v-slot:header.amount>
                        <span class="text-orange font-weight-bold" style="font-size: 25px;">الثمن</span>
                    </template>
                    <template v-slot:header.index>
                        <span class=" font-weight-bold" style="font-size: 25px;">#</span>
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
                        <v-tooltip text="Tooltip content" class="hidden-sm-and-down">
                            {{ item.time }}
                            <template #activator="{ props }" class="hidden-sm-and-down">
                                <v-icon v-bind="props" class="hidden-sm-and-down">mdi-clock</v-icon>
                            </template>
                        </v-tooltip>
                       <span class="hidden-sm-and-up">{{ item.time }}</span> 
                    </template>

                    <!-- <template v-slot:body.append>
                        <tr class="mt-4">
                            <td>Total</td>
                            <td></td>

                            <td :colspan="2"><v-chip>{{ Total }} $ </v-chip> </td>
                        </tr>
                    </template> -->
                </v-data-table>

            </v-col>

        </v-row>

        <v-snackbar v-model="snackbarShow" :timeout="2000" color="success" bottom right>
            <v-icon left>mdi-check</v-icon>
            تم الدفع بنجاح
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    created: async function () {
        let checkDate = new Date();
        let date = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`

        setInterval(() => {
            let t = new Date();
            this.time = t.toLocaleTimeString();
            this.date = t.toLocaleDateString();
        }, 1000);
        this.dateccc = date
        let response = await axios.get(`${this.apiurl}/records?from=${date}&to=${date}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("token")}`
                }
            }

        )

        for (let i = 0; i < response.data.length; i++) {
            this.TableItems.push({ des: response.data[i].description, amount: Number(response.data[i].amount), type: response.data[i].type, time: response.data[i].time })
        }
        let response2 = await axios.get(`${this.apiurl}/account`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("token")}`
                }
            }

        )

        this.selectMerchant = response2.data
    },
    data() {
        return {
            apiurl: process.env.VUE_APP_API_URL,
            date: "",
            time: "",
            username: "",
            dateccc: "",
            checkBox: false,
            HeaderItems: [
                { text: '#', value: 'index' },
                { title: 'الوصف', value: 'des' },
                { title: 'الثمن', value: 'amount' },
                { title: 'الوقت', value: 'time' }
            ],
            TableItems: [
            ],
            operations: [],
            selectMerchant: [],
            selectedMerchant: "",
            snackbarShow: false,
            items: [
                { value: 1, title: "دخل" },
                { value: 2, title: "خرج" }
            ],
            descriptionSubmit: "",
            price: '',
            OperationSubmit: "",
            FormRule: [(data) => {
                if (data) return true
                return "you must Fill this field"
            }]
        }
    },
    methods: {
        Submit: function () {
            this.$refs.form.validate()
                .then(async valid => {
                    if (valid.valid == true) {
                        this.TableItems.push({ des: this.descriptionSubmit, amount: Number(this.price), type: this.OperationSubmit, time: this.time })

                        let checkDate = new Date();
                        let date = checkDate.toISOString().split('T')[0];


                        let response = await axios.post(`${this.apiurl}/records`,
                            {
                                amount: this.price,
                                type: this.OperationSubmit,
                                description: this.descriptionSubmit,
                                date: date,
                                time: this.time
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'authorization': `${localStorage.getItem("token")}`
                                }
                            }

                        )
                        if (this.checkBox && this.selectedMerchant) {
                            let response2 = await axios.patch(`${this.apiurl}/account/pay`,
                                {
                                    MerchantId: this.selectedMerchant,
                                    date: date,
                                    value: this.price
                                },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'authorization': `${localStorage.getItem("token")}`
                                    }
                                }
                            )

                            this.snackbarShow = true
                        }



                        this.OperationSubmit = null;
                        this.descriptionSubmit = null
                        this.price = null
                    }
                })
        }
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

<style>
@media (max-width:350px) {
    .radioType {
        display: inline-block !important;
    }
}
</style>