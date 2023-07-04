export const formatDate = (value) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `ngày ${day}-${month}-${year}`;
}

// export const formatDateReverse = (value) => {
//     const date = new Date(value);
//     let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
//     if (month < 10) month = `0${month}`;
//     if (day < 10) day = `0${day}`;
//     return `${year}-${month}-${day}`;
// }

export const formatDateTime = (value) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(), hours = date.getHours(), minutes = date.getMinutes();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    return `${hours} giờ ${minutes} phút, ngày ${day}-${month}-${year}`;
}

// export const formatDateTimeReverse = (value) => {
//     const date = new Date(value);
//     let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(), hours = date.getHours(), minutes = date.getMinutes();
//     if (month < 10) month = `0${month}`;
//     if (day < 10) day = `0${day}`;
//     if (hours < 10) hours = `0${hours}`;
//     if (minutes < 10) minutes = `0${minutes}`;
//     return `${hours} giờ ${minutes} phút, ngày ${day}-${month}-${year}`;
// }

export const formatDateTime_2 = (value) => {
    const start_time = value.split(" to ")[0];
    const end_time = value.split(" to ")[1];
    return [formatDateTime(start_time), formatDateTime(end_time)].join(" đến ");
}

// console.log(formatDateTime_2('2023-07-04t15:01 to 2023-07-06t15:01'))