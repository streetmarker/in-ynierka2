<script setup>
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    CTable,
    CTableBody,
    CTableHeaderCell,
    CTableDataCell,
    CTableHead,
    CTableRow
} from "@coreui/vue";
</script>

<template>

    <div class="home">
        <h2>Umówione wizyty</h2>
        <CTable>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Korepetytor</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Przedmiot</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Stawka</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ilość godz.</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status płatności</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody v-if="userVisits.length">
                <CTableRow active v-for="(visit, index) in userVisits" :key="visit.id">
                    <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                    <CTableDataCell>{{ visit.details.first + " " + visit.details.last }}</CTableDataCell>
                    <CTableDataCell>{{ visit.details.subject }}</CTableDataCell>
                    <CTableDataCell>{{ visit.visitDate }}</CTableDataCell>
                    <CTableDataCell>{{ visit.details.hourRate }}</CTableDataCell>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>{{ visit.visitStatus }}</CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>
    </div>

</template>

<script>
import store from "../store/index";
import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db, dbPromiseVisits, getIdbData, putIdbData } from "../firebaseInitializer";

import { pl } from 'date-fns/locale'
import { format } from 'date-fns';


export default {
    name: "VisitsList",
    data() {
        return {
            // visitsDb: []
        };
    },
    mounted() {
        this.getVisits();
    },
    computed: {
        userData() {
            return this.$store.state.user;
        },
        userVisits() {
            return this.$store.state.userVisits;
        }
    },
    // watch: {
    //     userData: {
    //         immediate: true,
    //         handler(newValue) {
    //             this.editableData = { ...newValue };
    //         }
    //     }
    // },
    // watch: {
    //     userData(newValue, oldValue) {
    //         // Kod, który ma się wykonać przy zmianie userData
    //         console.log('userData zmieniło się z', oldValue, 'na', newValue);
    //     },
    //     userVisits(newValue, oldValue) {
    //         // Kod, który ma się wykonać przy zmianie userVisits
    //         console.log('userVisits zmieniło się z', oldValue, 'na', newValue);
    //     }
    // },
    methods: {
        async getVisits() {
            var UID = this.$store.state.user.id;
            var TID = this.$store.state.tutor.userId;
            var role = this.$store.state.role.type;

            if (role == 'T') {
                const visitdsIdb = await getIdbData(dbPromiseVisits);
                let tmpList = [];

                if (visitdsIdb.length > 0) {
                    visitdsIdb.sort((a, b) => b.visitDate - a.visitDate);
                    store.commit('setUserVisits', visitdsIdb);
                } else {

                    const q = query(collection(db, "visit"), where("details.userId", "==", TID));
                    const querySnapshotVisit = await getDocs(q);

                    for (const doc of querySnapshotVisit.docs) {
                        let data = doc.data();
                        console.log(doc.id);
                        try {
                            console.log('visit', data);
                            const p = query(collection(db, "payment"), where("visitId", "==", doc.id));
                            const querySnapshotPayment = await getDocs(p);
                            console.log('payment', querySnapshotPayment.docs[0]?.data());
                            data.visitStatus = querySnapshotPayment.docs[0]?.data()?.transactionStatus || '-';
                        } catch (error) {
                            data.visitStatus = '-';
                        }
                        tmpList.push(data);
                    }
                    tmpList.sort((a, b) => b.visitDate - a.visitDate);
                    tmpList.forEach((el) => {
                        el.visitDate = this.formatDate(el.visitDate)
                    })
                    store.commit('setUserVisits', tmpList);

                }
            } else {
                const visitdsIdb = await getIdbData(dbPromiseVisits);
                let tmpList = [];

                if (visitdsIdb.length > 0) {
                    visitdsIdb.sort((a, b) => b.visitDate - a.visitDate);
                    store.commit('setUserVisits', visitdsIdb);
                } else {
                    const q = query(collection(db, "visit"), where("clientId", "==", UID));
                    const querySnapshotVisit = await getDocs(q);

                    for (const doc of querySnapshotVisit.docs) {
                        let data = doc.data();
                        try {
                            const p = query(collection(db, "payment"), where("visitId", "==", doc.id));
                            const querySnapshotPayment = await getDocs(p);
                            data.visitStatus = querySnapshotPayment.docs[0]?.data()?.transactionStatus || '-';
                        } catch (error) {
                            data.visitStatus = '-';
                        }
                        tmpList.push(data);
                    }

                    tmpList.sort((a, b) => b.visitDate - a.visitDate);
                    tmpList.forEach((el) => {
                        el.visitDate = this.formatDate(el.visitDate)
                    })

                    putIdbData(dbPromiseVisits, tmpList);
                    store.commit('setUserVisits', tmpList);

                }
            }


        },
        formatDate(date) {
            const timestamp = new Timestamp(date.seconds, date.nanoseconds);
            var tmp = format(timestamp.toDate(), 'Pp', { locale: pl });
            return tmp
        }
    }
};
</script>
<style src="../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.edit-buttons {
    display: flex;
    gap: 10px;
}

.appointments {
    margin-top: 30px;
    width: 100%;
}

.appointments h2 {
    font-size: 1.5em;
    margin-bottom: 15px;
}

.appointments ul {
    list-style-type: none;
    padding: 0;
}

.appointments li {
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.appointments li p {
    margin: 5px 0;
}
</style>
