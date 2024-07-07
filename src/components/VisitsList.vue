<script setup>
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    CTable,
    CTableBody,
    CTableHeaderCell,
    CTableDataCell,
    CTableHead,
    CTableRow,
    CButton
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
                    <CTableDataCell v-if="visit.visitStatus == '-' && $store.state.role.type != 'T'">
                        <VisitPaymentDialog :tutor="visit.tutor" :visitId="visit.docId"
                            :visitDate="visit.originalVisitDate.toDate()" />
                    </CTableDataCell>
                    <CTableDataCell v-else>{{ visit.visitStatus }}</CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>
    </div>

</template>

<script>
import store from "../store/index";
import router from '../router/index'
import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db, dbPromiseVisits, getIdbData, putIdbData, isUpdated, saveErrorInDb } from "../firebaseInitializer";
import VisitPaymentDialog from '@/components/VisitPaymentDialog.vue'
import Loader from '../../public/loader'

import { pl } from 'date-fns/locale'
import { format } from 'date-fns';


export default {
    name: "VisitsList",
    data() {
        return {
            //
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
    methods: {
        async getVisits() {
            Loader.open();
            try {
                var UID = this.$store.state.user.id;
                var TID = this.$store.state.tutor.userId;
                var role = this.$store.state.role.type;

                if (role == 'T') {
                    const visitdsIdb = await getIdbData(dbPromiseVisits);
                    let tmpList = [];

                    if (visitdsIdb.length > 0 && !isUpdated(dbPromiseVisits, visitdsIdb)) {
                        visitdsIdb.sort((a, b) => b.visitDate - a.visitDate);
                        store.commit('setUserVisits', visitdsIdb);
                    } else {

                        const q = query(collection(db, "visit"), where("details.userId", "==", TID));
                        const querySnapshotVisit = await getDocs(q);

                        for (const docIn of querySnapshotVisit.docs) {
                            let data = docIn.data();
                            data.docId = docIn.id; // chyba tylko u C

                            console.log('visit', data);
                            const p = query(collection(db, "payment"), where("visitId", "==", docIn.id));
                            const querySnapshotPayment = await getDocs(p);
                            console.log('payment', querySnapshotPayment.docs[0]?.data());
                            data.visitStatus = querySnapshotPayment.docs[0]?.data()?.transactionStatus || '-';

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

                    if (visitdsIdb.length > 0 && !isUpdated(dbPromiseVisits, visitdsIdb)) {
                        visitdsIdb.sort((a, b) => b.visitDate - a.visitDate);
                        store.commit('setUserVisits', visitdsIdb);
                    } else {
                        const q = query(collection(db, "visit"), where("clientId", "==", UID));
                        // const q = query(collection(db, "visit"), where("clientId", "==", TID));

                        const querySnapshotVisit = await getDocs(q);

                        for (const docIn of querySnapshotVisit.docs) {
                            let data = docIn.data();
                            data.docId = docIn.id;

                            const p = query(collection(db, "payment"), where("visitId", "==", docIn.id));
                            const querySnapshotPayment = await getDocs(p);
                            data.visitStatus = querySnapshotPayment.docs[0]?.data()?.transactionStatus || '-';

                            if (data.visitStatus == '-') {
                                const docRef = doc(db, "tutor", data.tutorId); // różnica z warunkiem T
                                const docSnap = await getDoc(docRef);
                                data.tutor = {};
                                data.tutor.id = docSnap.id;
                                data.tutor.data = docSnap.data();
                            }

                            tmpList.push(data);
                        }

                        tmpList.sort((a, b) => b.visitDate - a.visitDate);
                        tmpList.forEach((el) => {
                            el.originalVisitDate = el.visitDate;
                            el.visitDate = this.formatDate(el.visitDate)
                        })

                        putIdbData(dbPromiseVisits, tmpList);
                        store.commit('setUserVisits', tmpList);

                    }
                }
            } catch (e) {
                saveErrorInDb(e, router.currentRoute.value.fullPath, this.$options.name, 'getVisits');
            }

            Loader.close();
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
