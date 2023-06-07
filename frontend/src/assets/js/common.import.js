import Table from "../../components/table/table_duy.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "../../components/form/delete-all.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
import { reactive, computed, watch, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { formatDateTime } from "../../assets/js/common.js";
import { toString, _filter } from "../../assets/js/pagination.js";

// services

import Event from "../../services/event.service";
import {
    http_getAll,
    http_create,
    http_getOne,
    http_deleteOne,
    http_update,
} from "../../assets/js/common.http";
import {
    alert_success,
    alert_error,
    alert_delete,
} from "../../assets/js/common.alert";