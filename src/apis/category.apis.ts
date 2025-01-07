import https from "../utils/https.ts";
import {ResponseAPI} from "../types/utils.type.ts";
import {Category} from "../types/category.type.ts";

const URL = 'categories'
const categoriesApi = {
    getListCategories: () => {
        return https.get<ResponseAPI<Category[]>>(URL)
    },
}
export default categoriesApi