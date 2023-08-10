import { countries } from "country-data-list";

export default {
    async countriesGetter(req: any, res: any) {
        res.send(countries.all.map(e=>e.name))
    },
    async nationGetter(req: any, res: any) {
        res.send(countries.all)
    },
}