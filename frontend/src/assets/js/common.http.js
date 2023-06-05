export const getAll = async (objService) => {
    try {
        const documents = await objService.getAll();
        return documents;
    } catch (error) {
        console.log(error);
    }
}

export const getOne = async () => {
    try {
        const document = await objService.get();
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const deleteOne = async () => {
    try {
        const document = await objService.delete();
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const create = async () => {

}

export const update = async () => {

}

