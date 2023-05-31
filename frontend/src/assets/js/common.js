export const formatDate = (value) => {
    const date = new Date(value);
    const day = date.getDay(), month = date.getMonth(), year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
}