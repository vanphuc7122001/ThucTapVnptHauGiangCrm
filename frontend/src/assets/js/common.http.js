export const getAll = async (objService) => {
    try {
        const documents = await objService.getAll();
        return documents;
    } catch (error) {
        console.log(error);
    }
}

export const getOne = async (objService) => {
    try {
        const document = await objService.get();
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const deleteOne = async (objService, id) => {
    try {
        const document = await objService.delete(id);
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const create = async (objService, data) => {
    try {
        const document = await objService.create(data);
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const update = async (objService, id, data) => {
    try {
        const document = await objService.update(id, data);
        return document;
    } catch (error) {
        console.log(error);
    }
}

