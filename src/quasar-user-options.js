import './styles/quasar.scss'
import iconSet from 'quasar/icon-set/mdi-v4.js'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/mdi-v4/mdi-v4.css'
import {Notify} from "quasar";
import {Dialog} from "quasar";
// To be used on app.use(Quasar, { ... })
export default {
    config: {},
    plugins: {
        Notify,
        Dialog
    },
    iconSet: iconSet
}