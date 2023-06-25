import { nanoid } from "nanoid";
import dayjs from "dayjs";
import config from "../../config"
let time_zone = config.TIMEZONE;

export const generatePublicId = () => {
    return nanoid() + nanoid() + Date.now();
};

export const setPagination = (options) => {
    const sort = {};
    if (options.sort_column) {
        const sortColumn = options.sort_column;
        const order =
            options && options.sort_order === "1" || options && options.sort_order == "asc" ? 1 : -1;
        sort[sortColumn] = order;
    } else {
        sort.created_at = -1;
    }

    const limit = +options.limit ? +options.limit < 100 ? +options.limit : 10 : 10;
    const offset =
        ((+options.offset ? +options.offset : 1) - 1) * (+limit ? +limit : 10);
    return { sort, offset, limit };
};

export const getCurrentUnix = () => {
    return dayjs().tz(time_zone).unix().toString(); //generate the unix
};

export const getCurrentUnixNumber = () => {
    return dayjs().tz("UTC").unix(); //generate the unix
};