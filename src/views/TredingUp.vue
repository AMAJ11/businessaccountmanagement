<template>
    <v-row dir="rtl" style="max-width:100%">
        <v-col dir="rtl" md="4" sm="8">
            <v-img width="100px" class="mb-6" src="../assets/SideImage.png"></v-img>
            <h2 class="mb-3 text-success " style="">اجمالي الديون<v-chip class="mr-4 elevation-2 text-red ">{{
                Total }} $ </v-chip></h2>
            <v-form class="pa-3" dir="rtl" ref="form" @submit.prevent="Submit">
                <v-text-field :rules="FormRule" color="primary" rounded dir="rtl" variant="outlined"
                    placeholder="أدخل اسم التاجر" v-model="name"></v-text-field>
                <v-text-field :rules="FormRule" color="primary" rounded dir="rtl" type="number"
                    placeholder="أدخل حسابه الحالي" variant="outlined" v-model="price"></v-text-field>
                <v-text-field color="primary" rounded dir="rtl" placeholder="وصف (إختياري)" variant="outlined"
                    v-model="des"></v-text-field>
                <v-btn type="submit" color="success" :loading="SubmitLoad"> إضافة التاجر</v-btn> </v-form>
        </v-col>
        <v-col md="8" sm="12" cols="12" class="pa-2 pa-sm-8">
            <v-data-table style="max-height: 70vh;" class="elevation-2" dir="rtl" :headers="HeaderItems"
                :items="TableItems">
                <template v-slot:header.des>
                    <span class="text-primary font-weight-bold" style="font-size: 20px;">الاسم</span>
                </template>
                <template v-slot:header.amount>
                    <span class="text-orange font-weight-bold" style="font-size: 20px;">الحساب</span>
                </template>
                <template v-slot:header.index>
                    <span class=" font-weight-bold" style="font-size: 20px;">#</span>
                </template>
                <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                </template>
                <template v-slot:item.name="{ item }">
                    <span class="" style="font-size: 15px;">{{ item.name }}
                        <v-tooltip activator="parent">
                            {{ item.des }}
                        </v-tooltip>
                    </span>
                </template>
                <template v-slot:item.amount="{ item }">
                    <span style="font-size: 15px;" class="text-primary">{{
                        item.amount
                    }}</span>
                </template>
                <template v-slot:item.buy="{ item }">
                    <v-btn icon @click="getMerchant(item._id)" class="text-red"
                        variant="outlined"><v-icon>mdi-plus</v-icon></v-btn>
                </template>
                <template v-slot:item.show="{ item }">
                    <v-btn @click="historyShow(item._id)" icon class="text-success"
                        variant="outlined"><v-icon>mdi-eye</v-icon></v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
    <v-dialog style="max-width: 500px;" v-model="AddAccount">
        <v-card style="padding: 10%;" dir="rtl">
            <v-icon style="cursor: pointer;" @click="AddAccount = false" color="red">mdi-close</v-icon>
            <v-form style="display: flex;justify-content: center;flex-direction: column;align-items: center;">
                <v-chip size=large color="primary" style="text-align: center;">{{ merchant.name }}</v-chip>
                <v-text-field v-model="BuyValue" type="number" placeholder="اضافة القيمة التي استدنتها" class="mt-3"
                    style="width: 100%;"></v-text-field>
                <p class="text-red">{{ errorAdd }}</p>
                <v-btn :loading="loadBuy" @click="addBuy" color="success">إضافة</v-btn>
            </v-form>
        </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbarShow" :timeout="2000" color="success" bottom right>
        <v-icon left>mdi-check</v-icon>
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
    <v-dialog v-model="historyDiaShow" style="max-width: 500px;" dir="rtl">
        <v-icon class="text-red" @click="historyDiaShow = false">mdi-close</v-icon>
        <v-data-table style="max-height: 70vh;" class="elevation-2" dir="rtl" :headers="HeaderHistoryItems"
            :items="TableHistoryItems">
            <template v-slot:item.index="{ index }">
                {{ index + 1 }}
            </template>
            <template v-slot:item.value="{ item }">
                <span :class="item.type == '2' ? 'text-green' : 'text-red'" style="font-size: 18px;">{{
                    item.type == '2' ? `${item.value}+` : `${item.value}-`
                }}</span>
            </template>
            <template v-slot:item.date="{ item }">
                {{ formattedDate(item.date) }}
            </template>
        </v-data-table>
    </v-dialog>
</template>
<script>
import axios from 'axios'

export default {
    methods: {
        getData: async function () {
            let response = await axios.get(`${this.apiurl}/account`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("token")}`
                }
            })
            this.TableItems = response.data
        },
        historyShow: async function (id) {
            let response = await axios.get(`${this.apiurl}/records/merchant?MerchantId=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${localStorage.getItem("token")}`
                    }
                }
            )
            this.TableHistoryItems = response.data
            this.historyDiaShow = true

        },
        addBuy: async function () {
            if (this.BuyValue != null && this.BuyValue != 0) {
                let checkDate = new Date();
                let date = checkDate.toISOString().split('T')[0];

                this.errorAdd = "";
                this.loadBuy = true;
                let response = await axios.patch(`${this.apiurl}/account/buy`,
                    {
                        date: date,
                        MerchantId: this.merchant._id,
                        value: Number(this.BuyValue),
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `${localStorage.getItem("token")}`
                        }
                    }
                )
                this.getData();
                this.AddAccount = false
                this.snackbarText = "تمت الاضافة بنجاح"
                this.snackbarShow = true

            } else {
                this.errorAdd = "يجب عليك ادخال قيمة"
            }
        },
        formattedDate(date) {
            if (!date) return ''
            const d = new Date(date)
            const day = d.getDate()
            const month = d.getMonth() + 1
            const year = d.getFullYear()
            return `${year}-${month}-${day}`
        },
        Submit: function () {
            this.$refs.form.validate()
                .then(async valid => {
                    if (valid.valid == true) {
                 this.SubmitLoad= true
                        let response = await axios.post(`${this.apiurl}/account`,
                            {
                                name: this.name,
                                amount: Number(this.price),
                                des: this.des
                            },{
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': `${localStorage.getItem("token")}`
                            }
                        }
                        )
                        this.getData();

                    }
                })
        },
        getMerchant: async function (id) {

            let response = await axios.get(`${this.apiurl}/account/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("token")}`
                }
            })
            this.merchant = response.data

            this.AddAccount = true;

        }
    },
    created: async function () {
        this.getData()

    },
    data() {
        return {
            SubmitLoad:false,
            historyMerchant: {},
            snackbarText: "",
            snackbarShow: false,
            historyDiaShow: false,
            merchant: {},
            apiurl: process.env.VUE_APP_API_URL,
            FormRule: [(data) => {
                if (data) return true
                return "you must Fill this field"
            }],
            loadBuy: false,
            HeaderItems: [
                { text: '#', value: 'index' },
                { title: 'الاسم', value: 'name' },
                { title: 'الثمن', value: 'amount' },
                { title: 'اضافة حساب', value: 'buy' },
                { title: 'سجل العمليات', value: 'show' }

            ],
            HeaderHistoryItems: [
                { text: '#', value: 'index' },
                { title: 'القيمة', value: 'value' },
                { title: 'التاريخ', value: 'date' }
            ],
            TableHistoryItems: [],
            BuyValue: null,
            TableItems: [

            ],
            AddAccount: false,
            errorAdd: "",
            name: "",
            price: null,
            des: ""
        }
    },
    computed: {
        Total() {
            let total = 0;
            for (let i = 0; i < this.TableItems.length; i++) {
                total = total + this.TableItems[i].amount;
            }
            return total;
        }
    }
}
</script>